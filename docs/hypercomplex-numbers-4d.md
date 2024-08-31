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
```

# Hypercomplex Numbers 4D

$$
\A{x} = \xs{0}\es{0} + \xs{1}\es{1} + \xs{2}\es{2} + \xs{3}\es{3}
$$

## Examples

```js
const examples = [
  {name: "Quaternion (+1,+1)", C: {data:[ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, 0 ], shape:[4,4,4]}},
  {name: "Split-Quaternion (+1,-1)", C: {data:[ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0 ], shape:[4,4,4]}},
  {name: "Split-Quaternion (-1,+1)", C: {data:[ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 0 ], shape:[4,4,4]}},
  {name: "Split-Quaternion (-1,-1)", C: {data:[ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 1, 0, 0, -1, 0, 0, 0 ], shape:[4,4,4]}},
  {name: "Semi-Quaternion (+1,0)", C: {data:[ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], shape:[4,4,4]}},
  {name: "Semi-Quaternion (0,+1)", C: {data:[ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0 ], shape:[4,4,4]}},
  {name: "Semi-Split-Quaternion (-1,0)", C: {data:[ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], shape:[4,4,4]}},
  {name: "Semi-Split-Quaternion (0,-1)", C: {data:[ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 ], shape:[4,4,4]}},
  {name: "Quarter-Quaternion (0,0)", C: {data:[ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], shape:[4,4,4]}},
  {name: "Bi-Complex", C: {data:[ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 0 ], shape:[4,4,4]}},
  {name: "4-Plex", C: {data:[ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0 ], shape:[4,4,4]}}, 
]

const selectionInput = Inputs.select(examples, {format: (example) => example.name, label: "Select Example"})
const selection = view(selectionInput)
//display(selectionInput)
```

### Structure Constants

```js
const C = jsonToNdArray(selection.C)
```

```js
const ndArrayInput = NdArrayInput(C, {step: 0.01})
display(ndArrayInput)
```

### Unit Surfaces
