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
import {Surface1DView} from "./components/SurfaceView.js"
```

# Hypercomplex Numbers 2D

$$
\A{x} = \xs{0}\es{0} + \xs{1}\es{1}
$$

## Examples

```js
const examples = [
  {name: "Complex", C: {data:[1,0,0,1,0,1,-1,0], shape:[2,2,2]}},
  {name: "Dual", C: {data:[1,0,0,1,0,1,0,0], shape:[2,2,2]}},
  {name: "Split-Complex", C: {data:[1,0,0,1,0,1,+1,0], shape:[2,2,2]}},
]

const selectionInput = Inputs.select(examples, {format: (example) => example.name, label: "Select Example"})
const selection = view(selectionInput)
//display(selectionInput)
```

```js
const C = jsonToNdArray(selection.C)
```

### Structure Constants

```js
const ndArrayInput = NdArrayInput(C, {step: 0.01})
display(ndArrayInput)
```

### Unit Surfaces

```js
const surfaceView = Surface1DView(C, {width: 400, height: 400})
display(surfaceView)
```
