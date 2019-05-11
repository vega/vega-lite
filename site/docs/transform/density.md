---
layout: docs
menu: docs
title: Density
permalink: /docs/density.html
---

The density transform performs one-dimensional [kernel density estimation](https://en.wikipedia.org/wiki/Kernel_density_estimation) over an input data stream and generates a new data stream of samples of the estimated densities.

```js
// Any View Specification
{
  ...
  "transform": [
    {"density": ...} // Density Transform
     ...
  ],
  ...
}
```

## Density Transform Definition

{% include table.html props="density,groupby,cumulative,counts,bandwidth,extent,minsteps,maxsteps,steps,as" source="DensityTransform" %}

## Usage

```json
{"density": "measure", "groupby": ["key"]}
```

This example performs density estimation for the `"measure"` property, with separate estimations performed for each group of records with a distinct `"key"` property value. The output data is of the form:

```js
[
  {"key": "a", "value": 1, "density": 0.02},
  ...
]
```

## Example

<div class="vl-example" data-name="area_density"></div>
