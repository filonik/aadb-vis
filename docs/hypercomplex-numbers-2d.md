<div style="display:none">
$$
\newcommand{\I}[1]{#1}
\newcommand{\K}[1]{#1}
\newcommand{\A}[1]{\mathbf{#1}}
\newcommand{\scalars}[2][]{\K{#2}\I{#1}}
\newcommand{\versors}[2][]{\A{#2}\I{#1}}
\newcommand{\xs}[1]{\scalars[^{#1}]{x}}
\newcommand{\ys}[1]{\scalars[^{#1}]{y}}
\newcommand{\zs}[1]{\scalars[^{#1}]{z}}
\newcommand{\es}[1]{\versors[_{#1}]{e}}
\newcommand{\fs}[1]{\versors[_{#1}]{f}}
\newcommand{\Xs}[2]{\scalars[_{#1}^{#2}]{X}}
\newcommand{\Ys}[2]{\scalars[_{#1}^{#2}]{Y}}
\newcommand{\Zs}[2]{\scalars[_{#1}^{#2}]{Z}}
\newcommand{\Cs}[3]{\scalars[_{#1#2}^{#3}]{C}}
$$
</div>

```js
import ndarray from 'ndarray'
import {link} from "./components/common.js"
import {NdArrayInput, jsonToNdArray} from "./components/NdArrayInput.js"
import {Surface1DView} from "./components/SurfaceView.js"
import {BilinearTableView} from "./components/BilinearTableView.js"

function AadbLink(link) {
  return html`<a href="https://filonik.github.io/aadb/#/${link}" target="_blank">AADB</a>`
}
```

# Hypercomplex Numbers 2D

<!--
$$
\A{x} = \xs{0}\es{0} + \xs{1}\es{1}
$$

## Examples
-->

```js
const examples = [
  {name: "Complex", link: "2/1729", C: {data:[1,0,0,1,0,1,-1,0], shape:[2,2,2]}},
  {name: "Dual", link: "2/271", C: {data:[1,0,0,1,0,1,0,0], shape:[2,2,2]}},
  {name: "Split-Complex", link: "2/1000", C: {data:[1,0,0,1,0,1,+1,0], shape:[2,2,2]}},
  {name: "Real + Real", link: "2/2188", C: {data:[ 1, 0, 0, 0, 0, 0, 0, 1 ], shape:[2,2,2]}},
]

const selectionInput = Inputs.select(examples, {format: (example) => example.name})
const selection = view(selectionInput)
//display(selectionInput)
```
<p>
<div class="flex flex-row gap-2">
<div class="text-sm">Select Example:</div>
${selectionInput}
<div>
${AadbLink(selection.link)}
</div>
</div>
</p>

### Structure Constants

```js
const C = jsonToNdArray(selection.C)
const ndArrayInput = NdArrayInput(C, {step: 0.01})
const surfaceView = Surface1DView(C, {width: 300, height: 300, invalidation})
const tableView = BilinearTableView(C, {width: 50*2, height: 50*2})
link(ndArrayInput, tableView)
```

<!--
<div class="flex flex-row gap-1">
<div>
$$
\Cs{\alpha}{\beta}{\gamma}
$$
</div>
${ndArrayInput}
</div>
-->
${ndArrayInput}

<details open>
  <summary>Unit Surfaces</summary>
  <div class="card">
    ${surfaceView}
  </div>
</details>

<details>
  <summary>Multiplication Table</summary>
  <div class="card" style="text-align: center">
    ${tableView}
  </div>
</details>
