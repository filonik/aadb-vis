import {html} from "htl";
import chroma from 'chroma-js';

import {length} from './common.js'

//const DEFAULT_PALETTE = chroma.brewer.RdBu.slice(1,-1)
const DEFAULT_PALETTE = [
  "rgb(246, 53, 56)", 
  "rgb(191, 64, 69)", 
  "rgb(139, 68, 78)", 
  "rgb(65, 69, 84)",
  "rgb(53, 118, 78)",
  "rgb(47, 158, 79)",
  "rgb(48, 204, 90)",
]

export function NumberInput({
  width = 20,
  height = 20, 
  value = 0.0, 
  min = NaN,
  max = NaN,
  step = 1.0
} = {}) {
  const div = html`<div class="tooltip tooltip-left" style=${{width: length(width), height: length(height)}}></div>`

  const tooltipText = html`<span class="tooltiptext"></span>`
  div.appendChild(tooltipText)

  let initial = {}
  let down = false
  div.onpointerdown = (event) => {
    const position = [event.x, event.y]
    initial = {position, value}
    down = true
    document.body.classList.add("dragging");
    div.setPointerCapture(event.pointerId)
    div.onpointermove(event)
  }
  div.onpointerup = (event) => {
    if (down) {
      event.preventDefault()
      event.stopPropagation()
      initial = {}
      down = false
      document.body.classList.remove("dragging");
    }
  }
  div.onpointermove = (event) => {
    if (down) {
      event.preventDefault()
      event.stopPropagation()
      //set([event.offsetX / width, event.offsetY / height])
      const position = [event.x, event.y]
      const delta = position[1] - initial.position[1]
      const newValue = initial.value - delta*step
      set(newValue)
      div.dispatchEvent(new Event("input", {bubbles: true}));
    }
  }

  //const colorScale = chroma.scale(chroma.brewer.RdBu).domain([-1,+1])
  const colorScale = chroma.scale(DEFAULT_PALETTE).domain([-1,+1])

  function set(newValue) {
    value = newValue
    div.style.backgroundColor = colorScale(value)
    tooltipText.textContent = value.toFixed(2)
  }

  set(value);

  return Object.defineProperty(div, "value", {get: () => value, set});
}