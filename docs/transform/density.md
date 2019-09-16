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

Performs density estimation for the `"measure"` field, with separate estimations performed for each group of records with a distinct `"key"` field value. The output data is of the form:

```js
[
  {"key": "a", "value": 1, "density": 0.02},
  ...
]
```

### Example: Faceted Density Estimates

Density estimates of measurements for each iris flower feature:

<div class="vl-example" data-name="area_density"></div>

### Example: Stacked Density Estimates

To plot a stacked graph of estimates, use a shared `extent` and a fixed number of subdivision `steps` to ensure that the points for each area align well. In addition, setting `counts` to true multiplies the densities by the number of data points in each group, preserving proportional differences:

<div class="vl-example" data-name="area_density_stacked"></div>
