import {html} from "htl"

import {length} from './common.js'

var vsSource = `#version 300 es

in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`;

var fsSource = `#version 300 es

precision highp float;

uniform vec2 u_resolution;
out vec4 outColor;

uniform float u_C[2*2*2];

const int strides[3] = int[](4,2,1);

float C(int i, int j, int k) {
  return u_C[i*strides[0]+j*strides[1]+k*strides[2]];
}

float sdSurface(in vec2 p, in float r) {
    mat2 m = mat2(
      C(0,0,0)*p[0]+C(1,0,0)*p[1], C(0,1,0)*p[0] + C(1,1,0)*p[1],
      C(0,0,1)*p[0]+C(1,0,1)*p[1], C(0,1,1)*p[0] + C(1,1,1)*p[1]
    );
    return determinant(m) - r;
}

void main() {
  vec2 p = 2.0*(2.0*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;

  float rd = sdSurface(p, +1.0);
  float id = sdSurface(p, -1.0);

  //vec3 col = (d>0.0) ? vec3(0.9,0.6,0.3) : vec3(0.65,0.85,1.0);
  //col *= 1.0 - exp(-6.0*abs(d));
	//col *= 0.8 + 0.2*cos(150.0*d);
	//col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.05,abs(d)) );

  //outColor = vec4(col, 1);

  vec4 rsCol = vec4(0.,1.,0.,1.);
  vec4 isCol = vec4(1.,0.,0.,1.);

  vec4 col = vec4(0.0);

  col = mix( col, rsCol, 1.0-smoothstep(0.0, 0.04, abs(rd)) );
  col = mix( col, isCol, 1.0-smoothstep(0.0, 0.04, abs(id)) );

  outColor = col;
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return undefined;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return undefined;
}

function createBuffer(gl, type, data, usage) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, usage);
    return buffer
}

export function Surface1DView(value = undefined, {width = 20, height = 20} = {}) {
  const root = html`<div class="surface"></div>`
  
  const canvas = html`<canvas width=${width} height=${height} style=${{
    width: length(width), height: length(height)
  }}></canvas>`

  root.appendChild(canvas)

  const gl = canvas.getContext("webgl2");
  if (!gl) {
    root.textContent = "WebGL not supported."
    return root
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource)
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource)

  const program = createProgram(gl, vs, fs)

  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
  const cUniformLocation = gl.getUniformLocation(program, "u_C[0]")
  
  //console.log(cUniformLocation, value.data)

  const positions = new Float32Array([
    -1.0, -1.0, 0, 1,
    -1.0, +1.0, 0, 1,
    +1.0, -1.0, 0, 1,
    +1.0, +1.0, 0, 1,
  ])
  const positionBuffer = createBuffer(gl, gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

  var vao = gl.createVertexArray()

  gl.bindVertexArray(vao)

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  gl.vertexAttribPointer(positionAttributeLocation, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(positionAttributeLocation)

  const render = () => {
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height)

    gl.uniform1fv(cUniformLocation, value.data);

    gl.bindVertexArray(vao)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  let frame
  const play = () => {
    render()
    frame = window.requestAnimationFrame(play)
  }

  play()

  return root
}