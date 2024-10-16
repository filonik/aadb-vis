export function length(x) {
  return x == null ? null : typeof x === "number" ? `${x}px` : `${x}`;
}

export function link(xInput, yInput) {
  xInput.oninput = (event) => {
    if (!event.bubbles) return;
    yInput.value = xInput.value;
    yInput.dispatchEvent(new Event("input"));
  }
  yInput.oninput = (event) => {
    if (!event.bubbles) return;
    xInput.value = yInput.value;
    xInput.dispatchEvent(new Event("input"));
  };
}
