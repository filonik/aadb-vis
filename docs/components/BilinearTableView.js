import {svg} from "htl"

import ndarray from 'ndarray'
import ndarrayGemv from 'ndarray-blas-gemv'

const projection = (n) => {
  const shape = [n,2]
  const data = Array.from({length: n}, (_, i)=> [
    Math.sin(Math.PI*i/n),
    Math.cos(Math.PI*i/n)
  ]).flat(1)
  return ndarray(data, shape).transpose(1, 0)
}

const matmul = (A, x, y) => ndarrayGemv(1, A, x, 1, y)

export function BilinearTableView(value = undefined, {width = 20, height = 20} = {}) {
  const root = svg`<svg class="bilinear" width="${width}" height="${height}"></svg>`

  function render() {
    if(value) {
      const n = value.shape[0]
      const P = projection(n)
      const g = svg`<g transform="scale(${width/n}, ${height/n})"></g>`
      for (let i=0; i<n; i++) {
        const col = svg`<g transform="translate(${i}, 0)"></g>`
        for (let j=0; j<n; j++) {
          const x = value.pick(i,j)
          const y = ndarray([0, 0], [2])
          matmul(P, x, y)
          const item = svg`<g transform="translate(${0+0.5}, ${j+0.5}) scale(0.5,-0.5)">
            <rect x="-1" y="-1" width="2" height="2" fill="none" />
            <circle cx="0" cy="0" r="0.1" stroke="none" />
            <line x1="0" y1="0" x2="${y.get(0)}" y2="${y.get(1)}" />
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