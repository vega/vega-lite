---
layout: docs
menu: docs
title: Loess
permalink: /docs/loess.html
---

The loess transform (for locally-estimated scatterplot smoothing) uses [locally-estimated regression](https://en.wikipedia.org/wiki/Local_regression) to produce a trend line. Loess performs a sequence of local weighted regressions over a sliding window of nearest-neighbor points. For standard parametric regression options, see the [regression](regression.html) transform.

```js
// Any View Specification
{
  ...
  "transform": [
    {"loess": ...} // Loess Transform
     ...
  ],
  ...
}
```

## Loess Transform Definition

{% include table.html props="loess,on,groupby,bandwidth,as" source="LoessTransform" %}

## Usage

```json
{"loess": "y", "on": "x", "bandwidth": 0.5}
```

Generate a loess trend line that models field `"y"` as a function of `"x"`, using a bandwidth parameter of `0.5`. The output data stream can then be visualized with a line mark, and takes the form:

```js
[
  {"x": 1, "y": 2.3},
  {"x": 2, "y": 2.9},
  {"x": 3, "y": 2.7},
  ...
]
```

If the `groupby` parameter is provided, separate trend lines will be fit per-group, and the output records will additionally include all groupby field values.

## Example

<div class="vl-example" data-name="layer_point_line_loess"></div>
