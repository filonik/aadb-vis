import {html} from "htl"

import {length} from './common.js'

const surface1dSource = {
  vs: `#version 300 es

in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`,
  fs: `#version 300 es

#define GRADIENT_NUMERICAL_GPU
//#define GRADIENT_NUMERICAL

precision highp float;

uniform vec2 u_resolution;
uniform mat3 u_view;

out vec4 outColor;

float eps;

uniform float u_C[2*2*2];

const int strides[3] = int[](4,2,1);

float C(int i, int j, int k) {
  return u_C[i*strides[0]+j*strides[1]+k*strides[2]];
}

float f(in vec2 p) {
  mat2 m = mat2(
    C(0,0,0)*p[0]+C(1,0,0)*p[1], C(0,1,0)*p[0] + C(1,1,0)*p[1],
    C(0,0,1)*p[0]+C(1,0,1)*p[1], C(0,1,1)*p[0] + C(1,1,1)*p[1]
  );
  return determinant(m);
}

#if defined GRADIENT_NUMERICAL_GPU
// f(x,y) divided by numerical GPU gradient
float sdSurface(in vec2 p, in float r) {
  float d = f(p) - r;
  //float g = length(vec2(dFdx(d), dFdy(d))/eps);
  float g = fwidth(d)/eps;
	return d/g;
}
#elif defined GRADIENT_NUMERICAL
// f(x,y) divided by numerical gradient
const vec2 h = vec2(0.001, 0);
float sdSurface(in vec2 p, in float r) {
  float d = f(p) - r;
  float g = length(vec2(f(p+h.xy) - f(p-h.xy), f(p+h.yx) - f(p-h.yx))/(2.*h.xx));
  return d/g;
}
#else
// f(x,y)
float sdSurface(in vec2 p, in float r) {
  float d = f(p) - r;
  return d;
}
#endif

const vec4 rsCol = vec4(48./255.,204./255.,90./255.,1.);
const vec4 isCol = vec4(246./255.,52./255.,56./255.,1.);
const vec4 zsCol = vec4(63./255.,63./255.,63./255.,1.);

void main() {
  eps = 0.02; // 2./u_resolution.y;

  vec2 uv = (2.0*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;

  vec3 p = u_view * vec3(1, uv);
  
  float rd = sdSurface(p.yz, +1.0);
  float zd = sdSurface(p.yz, 0.0);
  float id = sdSurface(p.yz, -1.0);

  //vec3 col = (d>0.0) ? vec3(0.9,0.6,0.3) : vec3(0.65,0.85,1.0);
  //col *= 1.0 - exp(-6.0*abs(d));
	//col *= 0.8 + 0.2*cos(150.0*d);
	//col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.05,abs(d)) );

  //outColor = vec4(col, 1);

  vec4 col = vec4(0.0);

  col = mix( col, rsCol, 1.0-smoothstep(0.0, 0.04, abs(rd)) );
  col = mix( col, zsCol, 1.0-smoothstep(0.0, 0.04, abs(zd)) );
  col = mix( col, isCol, 1.0-smoothstep(0.0, 0.04, abs(id)) );

  outColor = col;
}
`};


const surfaceSlice1dSource = {
  vs: `#version 300 es

in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`,
  fs: `#version 300 es

#define GRADIENT_NUMERICAL_GPU
//#define GRADIENT_NUMERICAL

precision highp float;

uniform vec2 u_resolution;
uniform mat3 u_view;

out vec4 outColor;

float eps;

uniform mat3x4 u_P;

uniform float u_C[3*3*3];

const int strides[3] = int[](9,3,1);

float C(int i, int j, int k) {
  return u_C[i*strides[0]+j*strides[1]+k*strides[2]];
}

float f(in vec3 p) {
  mat3 m = mat3(
    C(0,0,0)*p[0] + C(1,0,0)*p[1] + C(2,0,0)*p[2], C(0,1,0)*p[0] + C(1,1,0)*p[1] + C(2,1,0)*p[2], C(0,2,0)*p[0] + C(1,2,0)*p[1] + C(2,2,0)*p[2],
    C(0,0,1)*p[0] + C(1,0,1)*p[1] + C(2,0,1)*p[2], C(0,1,1)*p[0] + C(1,1,1)*p[1] + C(2,1,1)*p[2], C(0,2,1)*p[0] + C(1,2,1)*p[1] + C(2,2,1)*p[2],
    C(0,0,2)*p[0] + C(1,0,2)*p[1] + C(2,0,2)*p[2], C(0,1,2)*p[0] + C(1,1,2)*p[1] + C(2,1,2)*p[2], C(0,2,2)*p[0] + C(1,2,2)*p[1] + C(2,2,2)*p[2]
  );
  return determinant(m);
}

vec3 transformIn(in vec2 p) {
  return (u_P*vec3(1.0, p)).yzw;
}

#if defined GRADIENT_NUMERICAL_GPU
// f(x,y) divided by numerical GPU gradient
float sdSurface(in vec2 p, in float r) {
  float d = f(transformIn(p)) - r;
  //float g = length(vec2(dFdx(d), dFdy(d))/eps);
  float g = fwidth(d)/eps;
	return d/g;
}
#elif defined GRADIENT_NUMERICAL
// f(x,y) divided by numerical gradient
const vec2 h = vec2(0.001, 0);
float sdSurface(in vec2 p, in float r) {
  float d = f(transformIn(p)) - r;
  float g = length(vec2(f(p+h.xy) - f(p-h.xy), f(p+h.yx) - f(p-h.yx))/(2.*h.xx));
  return d/g;
}
#else
// f(x,y)
float sdSurface(in vec2 p, in float r) {
  float d = f(transformIn(p)) - r;
  return d;
}
#endif

const vec4 rsCol = vec4(48./255.,204./255.,90./255.,1.);
const vec4 isCol = vec4(246./255.,52./255.,56./255.,1.);
const vec4 zsCol = vec4(63./255.,63./255.,63./255.,1.);

void main() {
  eps = 0.02; // 2./u_resolution.y;

  vec2 uv = (2.0*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;

  vec3 p = u_view * vec3(1, uv);
  
  float rd = sdSurface(p.yz, +1.0);
  float zd = sdSurface(p.yz, 0.0);
  float id = sdSurface(p.yz, -1.0);

  //vec3 col = (d>0.0) ? vec3(0.9,0.6,0.3) : vec3(0.65,0.85,1.0);
  //col *= 1.0 - exp(-6.0*abs(d));
	//col *= 0.8 + 0.2*cos(150.0*d);
	//col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.05,abs(d)) );

  //outColor = vec4(col, 1);

  vec4 col = vec4(0.0);

  col = mix( col, rsCol, 1.0-smoothstep(0.0, 0.04, abs(rd)) );
  col = mix( col, zsCol, 1.0-smoothstep(0.0, 0.04, abs(zd)) );
  col = mix( col, isCol, 1.0-smoothstep(0.0, 0.04, abs(id)) );

  outColor = col;
}
`};


const surface2dSource = {
  vs: `#version 300 es

  in vec4 a_position;
  
  void main() {
    gl_Position = a_position;
  }
  `,
  fs: `#version 300 es

precision highp float;

uniform vec2 iResolution;
uniform float iTime;

out vec4 outColor;

const float precis = 0.01;
const vec3 eps = vec3(precis, 0.0, 0.0);

const vec4 rsCol = vec4(48./255.,204./255.,90./255.,1.);
const vec4 isCol = vec4(246./255.,52./255.,56./255.,1.);
const vec4 zsCol = vec4(63./255.,63./255.,63./255.,1.);

uniform float u_C[3*3*3];

const int strides[3] = int[](9,3,1);

float C(int i, int j, int k) {
  return u_C[i*strides[0]+j*strides[1]+k*strides[2]];
}

/*
float func( vec3 p )
{
    // f(x,y,z) = z² - (y²-3x²)·(3y²-x²)·(1-x)
	return p.z*p.z - (p.y*p.y-3.0*p.x*p.x)*(3.0*p.y*p.y - p.x*p.x)*(1.0-p.x);
}
*/

float f(in vec3 p) {
  mat3 m = mat3(
    C(0,0,0)*p[0] + C(1,0,0)*p[1] + C(2,0,0)*p[2], C(0,1,0)*p[0] + C(1,1,0)*p[1] + C(2,1,0)*p[2], C(0,2,0)*p[0] + C(1,2,0)*p[1] + C(2,2,0)*p[2],
    C(0,0,1)*p[0] + C(1,0,1)*p[1] + C(2,0,1)*p[2], C(0,1,1)*p[0] + C(1,1,1)*p[1] + C(2,1,1)*p[2], C(0,2,1)*p[0] + C(1,2,1)*p[1] + C(2,2,1)*p[2],
    C(0,0,2)*p[0] + C(1,0,2)*p[1] + C(2,0,2)*p[2], C(0,1,2)*p[0] + C(1,1,2)*p[1] + C(2,1,2)*p[2], C(0,2,2)*p[0] + C(1,2,2)*p[1] + C(2,2,2)*p[2]
  );
  return determinant(m);
}

vec3 grad( in vec3 pos )
{   
	return vec3(
    f(pos+eps.xyz) - f(pos-eps.xyz),
    f(pos+eps.zxy) - f(pos-eps.zxy),
    f(pos+eps.yzx) - f(pos-eps.yzx)
  ) / (2.0*precis);
}

float dist( vec3 p, float r )
{
  p *= 2.;
	return (f(p) - r) / length(grad(p));
}

vec2 intersect( in vec3 ro, in vec3 rd )
{
	float mind = 2.0*precis;
	float maxd = 15.0;
	
	{
    float b = dot(ro,rd);
    float c = dot(ro,ro) - 1.5*1.5;
    float h = b*b - c;
    if( h<0.0 ) return vec2(-1.0,0.0);
    h = sqrt(h);
    mind = max( mind, -b - h );
    maxd = min( maxd, -b + h );
  }

  float h = 1.0;
	float t = mind;
  for( int i=0; i<150; i++ ) {
    if( abs(h)<precis||t>maxd ) continue;
	  h = dist( ro+rd*t, 1. );
    t += 0.25*abs(h);
  }

  if( t>maxd ) t=-1.0;

  return vec2(t,sign(h));
}

vec3 calcNormal( in vec3 p )
{
  p *= 2.;
	return normalize( grad(p) );
}

const int N = 2;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 q = fragCoord.xy / iResolution.xy;

  // animation	
	float time = iTime;
	
	vec4 tot = vec4(0.0);
	for( int a=0; a<N; a++ )
	{
    vec2 p = -1.0 + 2.0 * fragCoord.xy/iResolution.xy;
    p.x *= iResolution.x/iResolution.y;
		
    // camera
    float an = 0.2*time;
    float cr = 0.15*sin(0.2*time);
    vec3 ro = 2.5*vec3(sin(an),0.0,cos(an));
    vec3 ta = vec3( 0.0, 0.0, 0.0 );
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(sin(cr),cos(cr),0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

	  // raymarch
    vec2 t = intersect(ro,rd);
	
	  // shade
    vec4 col = vec4(0.0);
    if( t.x>0.0 )
    {
      // geometry
      vec3 pos = ro + t.x*rd;
      vec3 nor = calcNormal(pos);

      // diffuse
      col = vec4(0.0);
      //float off = 1.0*texture( iChannel1, fragCoord.xy/iChannelResolution[1].xy, -100.0 ).x;
      vec3  uu  = normalize( cross( nor, vec3(0.0,1.0,1.0) ) );
      vec3  vv  = normalize( cross( uu, nor ) );

      // shading/lighting	

      float dif = clamp( dot(nor,vec3(0.7,0.6,0.4)), 0.0, 1.0 );
      float amb = 0.5 + 0.5*dot(nor,vec3(0.0,0.8,0.6));
      //col = vec4(vec3(1), 1.0);
      col = vec4(vec3(0.2,0.3,0.4)*amb + vec3(0.8,0.7,0.5)*dif,1.0);
      

      float ii = 0.5+0.5*t.y;

      // specular		
      float fre = pow( clamp(1.0+dot(rd,nor),0.0,1.0), 5.0 );
      vec3 ref = reflect( rd, nor );
      float rs = 1.0;//softshadow( pos, ref, 32.0 );
      col += ii * 1.0* (0.04 + 1.0*fre) * rs;
      //col += ii * 1.0* (0.04 + 1.0*fre) * pow( texture( iChannel2, ref ).xyz, vec3(2.0) ) * rs;

      // color
      col.xyz *= mix( rsCol.xyz*0.25, rsCol.xyz, ii );
    }
	
		tot += col;
	}

	tot /= float(N);
	
	// gamma
	tot.xyz = pow( clamp( tot.xyz, 0.0, 1.0 ), vec3(0.45) );
	
  fragColor = tot;
}
    
void main() {
  mainImage(outColor, gl_FragCoord.xy);
}`
}

const surfaceSlice2dSource = {
  vs: `#version 300 es

  in vec4 a_position;
  
  void main() {
    gl_Position = a_position;
  }
  `,
  fs: `#version 300 es

precision highp float;

uniform vec2 iResolution;
uniform float iTime;

out vec4 outColor;

const float precis = 0.01;
const vec3 eps = vec3(precis, 0.0, 0.0);

const vec4 rsCol = vec4(48./255.,204./255.,90./255.,1.);
const vec4 isCol = vec4(246./255.,52./255.,56./255.,1.);
const vec4 zsCol = vec4(63./255.,63./255.,63./255.,1.);

uniform mat3x4 u_P;

uniform float u_C[4*4*4];

const int strides[3] = int[](16,4,1);

float C(int i, int j, int k) {
  return u_C[i*strides[0]+j*strides[1]+k*strides[2]];
}

vec4 transformIn(in vec3 p) {
  return u_P*p;
}

float f(in vec4 p) {
  mat4 m = mat4(
    C(0,0,0)*p[0] + C(1,0,0)*p[1] + C(2,0,0)*p[2] + C(3,0,0)*p[3], C(0,1,0)*p[0] + C(1,1,0)*p[1] + C(2,1,0)*p[2] + C(3,1,0)*p[3], C(0,2,0)*p[0] + C(1,2,0)*p[1] + C(2,2,0)*p[2] + C(3,2,0)*p[3], C(0,3,0)*p[0] + C(1,3,0)*p[1] + C(2,3,0)*p[2] + C(3,3,0)*p[3],
    C(0,0,1)*p[0] + C(1,0,1)*p[1] + C(2,0,1)*p[2] + C(3,0,1)*p[3], C(0,1,1)*p[0] + C(1,1,1)*p[1] + C(2,1,1)*p[2] + C(3,1,1)*p[3], C(0,2,1)*p[0] + C(1,2,1)*p[1] + C(2,2,1)*p[2] + C(3,2,1)*p[3], C(0,3,1)*p[0] + C(1,3,1)*p[1] + C(2,3,1)*p[2] + C(3,3,1)*p[3],
    C(0,0,2)*p[0] + C(1,0,2)*p[1] + C(2,0,2)*p[2] + C(3,0,2)*p[3], C(0,1,2)*p[0] + C(1,1,2)*p[1] + C(2,1,2)*p[2] + C(3,1,2)*p[3], C(0,2,2)*p[0] + C(1,2,2)*p[1] + C(2,2,2)*p[2] + C(3,2,2)*p[3], C(0,3,2)*p[0] + C(1,3,2)*p[1] + C(2,3,2)*p[2] + C(3,3,2)*p[3],
    C(0,0,3)*p[0] + C(1,0,3)*p[1] + C(2,0,3)*p[2] + C(3,0,3)*p[3], C(0,1,3)*p[0] + C(1,1,3)*p[1] + C(2,1,3)*p[2] + C(3,1,3)*p[3], C(0,2,3)*p[0] + C(1,2,3)*p[1] + C(2,2,3)*p[2] + C(3,2,3)*p[3], C(0,3,3)*p[0] + C(1,3,3)*p[1] + C(2,3,3)*p[2] + C(3,3,3)*p[3]
  );
  return determinant(m);
}

vec3 grad( in vec3 pos )
{   
	return vec3(
    f(transformIn(pos+eps.xyz)) - f(transformIn(pos-eps.xyz)),
    f(transformIn(pos+eps.zxy)) - f(transformIn(pos-eps.zxy)),
    f(transformIn(pos+eps.yzx)) - f(transformIn(pos-eps.yzx))
  ) / (2.0*precis);
}

float dist( vec3 p, float r )
{
  p *= 2.;
	return (f(transformIn(p)) - r) / length(grad(p));
}

vec2 intersect( in vec3 ro, in vec3 rd )
{
	float mind = 2.0*precis;
	float maxd = 15.0;
	
	{
    float b = dot(ro,rd);
    float c = dot(ro,ro) - 1.5*1.5;
    float h = b*b - c;
    if( h<0.0 ) return vec2(-1.0,0.0);
    h = sqrt(h);
    mind = max( mind, -b - h );
    maxd = min( maxd, -b + h );
  }

  float h = 1.0;
	float t = mind;
  for( int i=0; i<150; i++ ) {
    if( abs(h)<precis||t>maxd ) continue;
	  h = dist( ro+rd*t, 1. );
    t += 0.25*abs(h);
  }

  if( t>maxd ) t=-1.0;

  return vec2(t,sign(h));
}

vec3 calcNormal( in vec3 p )
{
  p *= 2.;
	return normalize( grad(p) );
}

const int N = 1;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 q = fragCoord.xy / iResolution.xy;

  // animation	
	float time = iTime;
	
	vec4 tot = vec4(0.0);
	for( int a=0; a<N; a++ )
	{
    vec2 p = -1.0 + 2.0 * fragCoord.xy/iResolution.xy;
    p.x *= iResolution.x/iResolution.y;
		
    // camera
    float an = 0.2*time;
    float cr = 0.15*sin(0.2*time);
    vec3 ro = 2.5*vec3(sin(an),0.0,cos(an));
    vec3 ta = vec3( 0.0, 0.0, 0.0 );
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(sin(cr),cos(cr),0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

	  // raymarch
    vec2 t = intersect(ro,rd);
	
	  // shade
    vec4 col = vec4(0.0);
    if( t.x>0.0 )
    {
      // geometry
      vec3 pos = ro + t.x*rd;
      vec3 nor = calcNormal(pos);

      // diffuse
      col = vec4(0.0);
      //float off = 1.0*texture( iChannel1, fragCoord.xy/iChannelResolution[1].xy, -100.0 ).x;
      vec3  uu  = normalize( cross( nor, vec3(0.0,1.0,1.0) ) );
      vec3  vv  = normalize( cross( uu, nor ) );

      // shading/lighting	

      float dif = clamp( dot(nor,vec3(0.7,0.6,0.4)), 0.0, 1.0 );
      float amb = 0.5 + 0.5*dot(nor,vec3(0.0,0.8,0.6));
      //col = vec4(vec3(1), 1.0);
      col = vec4(vec3(0.2,0.3,0.4)*amb + vec3(0.8,0.7,0.5)*dif,1.0);
      

      float ii = 0.5+0.5*t.y;

      // specular		
      float fre = pow( clamp(1.0+dot(rd,nor),0.0,1.0), 5.0 );
      vec3 ref = reflect( rd, nor );
      float rs = 1.0;//softshadow( pos, ref, 32.0 );
      col += ii * 1.0* (0.04 + 1.0*fre) * rs;
      //col += ii * 1.0* (0.04 + 1.0*fre) * pow( texture( iChannel2, ref ).xyz, vec3(2.0) ) * rs;

      // color
      col.xyz *= mix( rsCol.xyz*0.25, rsCol.xyz, ii );
    }
	
		tot += col;
	}

	tot /= float(N);
	
	// gamma
	tot.xyz = pow( clamp( tot.xyz, 0.0, 1.0 ), vec3(0.45) );
	
  fragColor = tot;
}
    
void main() {
  mainImage(outColor, gl_FragCoord.xy);
}`
}

/*
const surface2dSource = {
  vs: `#version 300 es

  in vec4 a_position;
  
  void main() {
    gl_Position = a_position;
  }
  `,
  fs: `#version 300 es

precision highp float;

uniform vec2 iResolution;
uniform float iTime;

out vec4 outColor;

// The MIT License
// Copyright © 2019 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// EXACT distance to an octahedron. Most of the distance functions you'll find
// out there are not actually euclidan distances, but just approimxations that
// act as bounds. This implementation, while more involved, returns the true
// distance. This allows to do euclidean operations on the shape, such as 
// rounding (see https://iquilezles.org/articles/distfunctions)
// while other implementations don't. Unfortunately the maths require us to do
// one square root sometimes to get the exact distance to the octahedron.

// List of other 3D SDFs: https://www.shadertoy.com/playlist/43cXRl
//
// and https://iquilezles.org/articles/distfunctions


float sdOctahedron(vec3 p, float s)
{
    p = abs(p);
    float m = p.x + p.y + p.z - s;
    vec3 r = 3.0*p - m;
    
#if 0
    // filbs111's version (see comments)
    vec3 o = min(r, 0.0);
    o = max(r*2.0 - o*3.0 + (o.x+o.y+o.z), 0.0);
    return length(p - s*o/(o.x+o.y+o.z));
#else
    // my original version
	vec3 q;
         if( r.x < 0.0 ) q = p.xyz;
    else if( r.y < 0.0 ) q = p.yzx;
    else if( r.z < 0.0 ) q = p.zxy;
    else return m*0.57735027;
    float k = clamp(0.5*(q.z-q.y+s),0.0,s); 
    return length(vec3(q.x,q.y-s+k,q.z-k)); 
#endif    
}


float map( in vec3 pos )
{
    float rad = 0.1*(0.5+0.5*sin(iTime*2.0));
    return sdOctahedron(pos,0.5-rad) - rad;
}

// https://iquilezles.org/articles/normalsSDF
vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773;
    const float eps = 0.0005;
    return normalize( e.xyy*map( pos + e.xyy*eps ) + 
					  e.yyx*map( pos + e.yyx*eps ) + 
					  e.yxy*map( pos + e.yxy*eps ) + 
					  e.xxx*map( pos + e.xxx*eps ) );
}
    
//#if HW_PERFORMANCE==0
#define AA 1
//#else
//#define AA 3
//#endif

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
     // camera movement	
	float an = 0.5*(iTime-10.0);
	vec3 ro = vec3( 1.0*cos(an), 0.4, 1.0*sin(an) );
    vec3 ta = vec3( 0.0, 0.0, 0.0 );
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));

    
    
    vec4 tot = vec4(0.0);
    
    #if AA>1
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        // pixel coordinates
        vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        vec2 p = (-iResolution.xy + 2.0*(fragCoord+o))/iResolution.y;
        #else    
        vec2 p = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
        #endif

	    // create view ray
        vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

        // raymarch
        const float tmax = 3.0;
        float t = 0.0;
        for( int i=0; i<256; i++ )
        {
            vec3 pos = ro + t*rd;
            float h = map(pos);
            if( h<0.0001 || t>tmax ) break;
            t += h;
        }
        
    
        // shading/lighting	
        vec4 col = vec4(0.0);
        if( t<tmax )
        {
            vec3 pos = ro + t*rd;
            vec3 nor = calcNormal(pos);
            float dif = clamp( dot(nor,vec3(0.7,0.6,0.4)), 0.0, 1.0 );
            float amb = 0.5 + 0.5*dot(nor,vec3(0.0,0.8,0.6));
            col = vec4(vec3(0.2,0.3,0.4)*amb + vec3(0.8,0.7,0.5)*dif, 1.0);
        }

        // gamma        
        col = sqrt( col );
	    tot += col;
    #if AA>1
    }
    tot /= float(AA*AA);
    #endif

	fragColor = tot;
}

void main() {
  mainImage(outColor, gl_FragCoord.xy);
}`
}
*/

function createShader(gl, {type, source}) {
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

function createProgram(gl, {shaders}) {
  const program = gl.createProgram();
  for (const shader of shaders) {
    const s = createShader(gl, shader)
    gl.attachShader(program, s);
  }
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

export function Surface1DView(value = undefined, {width = 20, height = 20, invalidation} = {}) {
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

  const program = createProgram(gl, {shaders: [
    {type: gl.VERTEX_SHADER, source: surface1dSource.vs},
    {type: gl.FRAGMENT_SHADER, source: surface1dSource.fs}
  ]})

  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
  const viewUniformLocation = gl.getUniformLocation(program, "u_view")
  const cUniformLocation = gl.getUniformLocation(program, "u_C[0]")
  //console.log(cUniformLocation, value.data)

  const view = new Float32Array([
    1,0,0,
    0,2,0,
    0,0,2
  ])

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

  const render = (time) => {
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height)

    gl.uniformMatrix3fv(viewUniformLocation, false, view)

    gl.uniform1fv(cUniformLocation, value.data);

    gl.bindVertexArray(vao)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  let start
  let frame

  const tick = (timestamp) => {
    const time = (timestamp - start)/1000.0;
    render(time)
    frame = window.requestAnimationFrame(tick)
  }

  const play = () => {
    if (frame === undefined) {
      start = performance.now()
      frame = window.requestAnimationFrame(tick)
    }
  }

  const stop = () => {
    if (frame !== undefined) {
      console.log("cancelAnimationFrame")
      window.cancelAnimationFrame(frame)
      frame = undefined
      start = undefined
    }
  }

  invalidation.then(stop);

  play()

  return root
}

export function SurfaceSlice1DView(value = undefined, {width = 20, height = 20, invalidation} = {}) {
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

  const program = createProgram(gl, {shaders: [
    {type: gl.VERTEX_SHADER, source: surfaceSlice1dSource.vs},
    {type: gl.FRAGMENT_SHADER, source: surfaceSlice1dSource.fs}
  ]})

  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
  const viewUniformLocation = gl.getUniformLocation(program, "u_view")
  const cUniformLocation = gl.getUniformLocation(program, "u_C[0]")
  const pUniformLocation = gl.getUniformLocation(program, "u_P")
  //console.log(cUniformLocation, value.data)

  const view = new Float32Array([
    1,0,0,
    0,2,0,
    0,0,2
  ])

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

  const render = (time) => {
    const t = 0.2*time
    const s = 1.5
    /*
    const P = new Float32Array([
      Math.cos(t),-Math.sin(t),0,
      +Math.sin(t),Math.cos(t),0,
    ])
    */
    /*
    const P = new Float32Array([
      Math.cos(t),0,-Math.sin(t),
      +Math.sin(t),0,Math.cos(t),
    ])
    */
    /*
    const P = new Float32Array([
      0,Math.cos(t),-Math.sin(t),
      0,+Math.sin(t),Math.cos(t),
    ])
    */
    /*
    const P = new Float32Array([
      1,0,0,
      0,0,1,
    ])
    */
    const P = new Float32Array([
      1,0,0,0,
      0,s*Math.cos(t),0,-s*Math.sin(t),
      0,0,s,0,
    ])
    /*
    const P = new Float32Array([
      1,0,0,0,
      0,1,0,0,
      0,0,Math.cos(t),-Math.sin(t)
    ])
    */

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height)

    gl.uniformMatrix3fv(viewUniformLocation, false, view)

    //gl.uniformMatrix2x3fv(pUniformLocation, false, P)
    gl.uniformMatrix3x4fv(pUniformLocation, false, P)

    gl.uniform1fv(cUniformLocation, value.data);

    gl.bindVertexArray(vao)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  let start
  let frame

  const tick = (timestamp) => {
    const time = (timestamp - start)/1000.0;
    render(time)
    frame = window.requestAnimationFrame(tick)
  }

  const play = () => {
    if (frame === undefined) {
      start = performance.now()
      frame = window.requestAnimationFrame(tick)
    }
  }

  const stop = () => {
    if (frame !== undefined) {
      console.log("cancelAnimationFrame")
      window.cancelAnimationFrame(frame)
      frame = undefined
      start = undefined
    }
  }

  invalidation.then(stop);

  play()

  return root
}

export function Surface2DView(value = undefined, {width = 20, height = 20, invalidation} = {}) {
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

  const program = createProgram(gl, {shaders: [
    {type: gl.VERTEX_SHADER, source: surface2dSource.vs},
    {type: gl.FRAGMENT_SHADER, source: surface2dSource.fs}
  ]})

  const resolutionUniformLocation = gl.getUniformLocation(program, "iResolution")
  const timeUniformLocation = gl.getUniformLocation(program, "iTime")

  const cUniformLocation = gl.getUniformLocation(program, "u_C[0]")

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

  const render = (time) => {
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height)
    gl.uniform1f(timeUniformLocation, time)
    //gl.uniform1f(timeUniformLocation, 0.0)

    //gl.uniformMatrix3fv(viewUniformLocation, false, view)
    //gl.uniform1fv(cUniformLocation, value.data);

    gl.uniform1fv(cUniformLocation, value.data)

    gl.bindVertexArray(vao)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  let start
  let frame

  const tick = (timestamp) => {
    const time = (timestamp - start)/1000.0;
    render(time)
    frame = window.requestAnimationFrame(tick)
  }

  const play = () => {
    if (frame === undefined) {
      start = performance.now()
      frame = window.requestAnimationFrame(tick)
    }
  }

  const stop = () => {
    if (frame !== undefined) {
      console.log("cancelAnimationFrame")
      window.cancelAnimationFrame(frame)
      frame = undefined
      start = undefined
    }
  }

  invalidation.then(stop);

  play()

  return root
}

export function SurfaceSlice2DView(value = undefined, {width = 20, height = 20, invalidation} = {}) {
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

  const program = createProgram(gl, {shaders: [
    {type: gl.VERTEX_SHADER, source: surfaceSlice2dSource.vs},
    {type: gl.FRAGMENT_SHADER, source: surfaceSlice2dSource.fs}
  ]})

  const resolutionUniformLocation = gl.getUniformLocation(program, "iResolution")
  const timeUniformLocation = gl.getUniformLocation(program, "iTime")

  const cUniformLocation = gl.getUniformLocation(program, "u_C[0]")
  const pUniformLocation = gl.getUniformLocation(program, "u_P")

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

  const render = (time) => {
    const t0 = 0.2*time
    /*
    const P = new Float32Array([
      1,0,0,0,
      0,1,0,0,
      0,0,Math.cos(t0),-Math.sin(t0)
    ])
    */
    const P = new Float32Array([
      1,0,0,0,
      0,Math.cos(t0),0,-Math.sin(t0),
      0,0,1,0
    ])
    /*
    const P = new Float32Array([
      Math.cos(t0),0,0,-Math.sin(t0),
      0,1,0,0,
      0,0,1,0
    ])
    /*
    const t1 = t0
    const P = new Float32Array([
      Math.cos(t0),-Math.sin(t0),0,0,
      +Math.sin(t0),Math.cos(t0),0,0,
      0,0,Math.cos(t1),-Math.sin(t1)
    ])
    */

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height)
    //gl.uniform1f(timeUniformLocation, time)
    gl.uniform1f(timeUniformLocation, 0.0)

    //gl.uniformMatrix3fv(viewUniformLocation, false, view)
    //gl.uniform1fv(cUniformLocation, value.data);

    gl.uniform1fv(cUniformLocation, value.data)
    gl.uniformMatrix3x4fv(pUniformLocation, false, P)

    gl.bindVertexArray(vao)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  let start
  let frame

  const tick = (timestamp) => {
    const time = (timestamp - start)/1000.0;
    render(time)
    frame = window.requestAnimationFrame(tick)
  }

  const play = () => {
    if (frame === undefined) {
      start = performance.now()
      frame = window.requestAnimationFrame(tick)
    }
  }

  const stop = () => {
    if (frame !== undefined) {
      console.log("cancelAnimationFrame")
      window.cancelAnimationFrame(frame)
      frame = undefined
      start = undefined
    }
  }

  invalidation.then(stop);

  play()

  return root
}
