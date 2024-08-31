import {html} from "htl"

import ndarray from 'ndarray'
import ndarrayShow from "ndarray-show"

import { NumberInput } from "./NumberInput.js"

export const jsonToNdArray = (obj) => ndarray(new Float32Array(obj.data), obj.shape.slice())
export const ndArrayToJson = (array) => ({
  data: array.data.slice(), shape: array.shape.slice()
})

export function NdArrayStringView({value = null}) {
  const root = html`<pre></pre>`

  function set(newValue) {
    value = newValue
    if (value != null) {
      root.textContent = ndarrayShow(value)
    } else {
      root.textContent = 'undefined'
    }
  }

  set(value);

  return Object.defineProperty(root, "value", {get: () => value, set});
}

export function NdArrayInput(value = undefined, options = {}) {
  const root = html`<div class="ndarray"></div>`
  
  const item = (...index) => {
    const input = NumberInput({
      ...options, value: value.get(...index)
    })
    input.oninput = (event) => {
      value.set(...index, input.value) 
    }
    return input
  }

  const createItems = (index, even) => {
    const k = index.length
    if (k < value.shape.length) {
      const items = html`<div class="ndarray-items ${even?"ndarray-items-0":"ndarray-items-1"}"></div>`
      for (let i=0; i<value.shape[k]; i++){
        items.appendChild(createItems([...index,i], !even))
      }
      return items
    } else {
      return item(...index)
    }
  }

  const create = () => {
    const even = value.shape.length%2 == 1
    root.replaceChildren(createItems([], even))
  }

  const update = create
  /*
  let down = false;
  canvas.onpointerup = () => (down = false);
  canvas.onpointerdown = (event) => {
    down = true;
    canvas.setPointerCapture(event.pointerId);
    canvas.onpointermove(event);
  };
  canvas.onpointermove = (event) => {
    if (!down) return;
    event.preventDefault(); // prevent scrolling and text selection
    set([event.offsetX / width, event.offsetY / height]);
    canvas.dispatchEvent(new Event("input", {bubbles: true}));
  };

  const context = canvas.getContext("2d");

  function set([x, y]) {
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "red";
    context.fillRect(Math.floor(x * width), 0, 1, height);
    context.fillRect(0, Math.floor(y * height), width, 1);
    value = [x, y];
  }

  set(value);
  */

  function set(newValue) {
    const apply = newValue !== value? create: update
    value = newValue
    apply()
  }

  set(value);

  return Object.defineProperty(root, "value", {get: () => value, set});
}