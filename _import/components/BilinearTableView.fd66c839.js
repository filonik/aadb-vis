import {svg} from "../../_node/htl@0.3.1/index.0caf36e7.js"

import chroma from "../../_node/chroma-js@3.0.0/index.a5d8304c.js"

import ndarray from "../../_node/ndarray@1.0.19/index.2ea96455.js"
import ndarrayOps from "../../_node/ndarray-ops@1.2.2/index.2ffff69e.js"
import ndarrayGemv from "../../_node/ndarray-blas-gemv@1.0.4/index.b58d2fce.js"

const projection = (n) => {
  const shape = [n,2]
  const data = Array.from({length: n}, (_, i)=> [
    Math.sin(Math.PI*i/n),
    Math.cos(Math.PI*i/n)
  ]).flat(1)
  return ndarray(data, shape).transpose(1, 0)
}

const matmul = (y, A, x) => ndarrayGemv(1, A, x, 1, y)

const component = (i) => (x) => ndarray(Array.from({length: x.shape[0]}, (_, j) => i==j? x.get(j): 0), [x.shape[0]])

const DEFAULT_PALETTE = chroma.brewer.Set1

export function BilinearTableView(value = undefined, {width = 20, height = 20} = {}) {
  const root = svg`<svg class="bilinear" width="${width}" height="${height}"></svg>`

  function renderVector(P, x){
    const y = ndarray([0, 0], [2])
    matmul(y, P, x)
    const item = svg`<g>
      <circle cx="0" cy="0" r="0.1" stroke="none" />
      <line x1="0" y1="0" x2="${y.get(0)}" y2="${y.get(1)}" />
    </g>`
    return item
  }

  function renderVectorPiecewise(P, x){
    const n = value.shape[0]
    const item = svg`<g transform="scale(0.75, 0.75)"></g>`
    const lastY = ndarray([0, 0], [2])
    for (let i=0; i<n; i++) {
      const y = ndarray([0, 0], [2])
      matmul(y, P, component(i)(x))
      ndarrayOps.add(y, lastY, y)
      item.appendChild(svg`<line x1="${lastY.get(0)}" y1="${lastY.get(1)}" x2="${y.get(0)}" y2="${y.get(1)}" stroke="${DEFAULT_PALETTE[i]}" />`)
      ndarrayOps.assign(lastY, y)
    }
    //item.appendChild(svg`<circle cx="0" cy="0" r="0.15" stroke="none" fill="${DEFAULT_PALETTE[DEFAULT_PALETTE.length-1]}" />`)
    item.appendChild(svg`<circle cx="0" cy="0" r="0.15" stroke="none" />`)
    return item
  }

  function render() {
    if(value) {
      const n = value.shape[0]
      const P = projection(n)
      const g = svg`<g transform="scale(${width/n}, ${height/n})"></g>`
      for (let i=0; i<n; i++) {
        const col = svg`<g transform="translate(${i}, 0)"></g>`
        for (let j=0; j<n; j++) {
          const item = svg`<g transform="translate(${0+0.5}, ${j+0.5}) scale(0.5,-0.5)">
            <rect x="-1" y="-1" width="2" height="2" fill="none" />
            ${renderVectorPiecewise(P, value.pick(i,j))}
          </g>`
          col.appendChild(item)
        }
        g.appendChild(col)
      }
      root.replaceChildren(g)
    }
  }

  function get() {
    return value
  }

  function set(newValue) {
    value = newValue
    render()
  }

  set(value);

  return Object.defineProperty(root, "value", {get, set});
}