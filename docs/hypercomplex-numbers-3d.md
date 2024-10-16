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
import {NdArrayInput, jsonToNdArray} from "./components/NdArrayInput.js"
import {Surface2DView, SurfaceSlice1DView} from "./components/SurfaceView.js"
import {BilinearTableView} from "./components/BilinearTableView.js"

function AadbLink(link) {
  return html`<a href="https://filonik.github.io/aadb/#/${link}" target="_blank">AADB</a>`
}
```

# Hypercomplex Numbers 3D

<!--
$$
\A{x} = \xs{0}\es{0} + \xs{1}\es{1} + \xs{2}\es{2}
$$

## Examples
-->

```js
const examples = [
  {name: "3-Plex", link:"3/861254944615",  C: {data:[ 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0 ], shape:[3,3,3]}},
  {name: "Real + Complex", link: "3/1788851132200",  C: {data:[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, -1, 0 ], shape:[3,3,3]}},
  {name: "Real + Split-Complex", link:"", C: {data:[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0 ], shape:[3,3,3]}},
  {name: "3/1719018256168", link: "3/1719018256168", C: {data:[ 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, -1, 0, 0, 0, 0, 1, -1, 0, 0, 0, -1, 0 ], shape:[3,3,3]}},
  {name: "3/1708548337027", link: "3/1708548337027", C: {data:[ 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, -1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, -1, 0 ], shape:[3,3,3]}},
  {name: "3/285916918015", link: "3/285916918015", C: {data:[ 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0 ], shape:[3,3,3]}},
  //{name: "3/7085181575071", C: {data:[ 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, -1, 0, 0, 0, 0, 1, -1, 0, 0, 1, -1, -1 ], shape:[3,3,3]}},
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
const surfaceView = Surface2DView(C, {width: 300, height: 300, invalidation})
const surfaceSliceView = SurfaceSlice1DView(C, {width: 300, height: 300, invalidation})
const tableView = BilinearTableView(C, {width: 50*3, height: 50*3})
```

${ndArrayInput}

### Unit Surfaces

<div class="card">
  ${surfaceView}
</div>

<div class="card">
  ${surfaceSliceView}
</div>

### Multiplication Table

<div class="card" style="text-align: center">
  ${tableView}
</div>
