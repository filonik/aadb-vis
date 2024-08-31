import {FileAttachment} from "npm:@observablehq/stdlib";

import {html} from "htl";

// TODO: There ought to be a better way to style components...
export async function Style() {
  return html`<link rel="stylesheet" href="${await FileAttachment('style.css').url()}"></link>`
}