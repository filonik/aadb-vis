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

export function monitorEvents(element) {
  var log = function(e) { console.log(e);};
  var events = [];

  for(var i in element) {
    if(i.startsWith("on")) events.push(i.substr(2));
  }
  events.forEach(function(eventName) {
    element.addEventListener(eventName, log);
  });
}
