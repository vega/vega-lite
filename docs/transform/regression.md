---
layout: docs
menu: docs
title: Regression
permalink: /docs/regression.html
---

The regression transform fits two-dimensional [regression models](https://en.wikipedia.org/wiki/Regression_analysis) to smooth and predict data. This transform can fit multiple models for input data (one per group) and generates new data objects that represent points for summary trend lines. Alternatively, this transform can be used to generate a set of objects containing regression model parameters, one per group.

This transform supports parametric models for the following functional forms:

- linear (`linear`): _y = a + b \* x_
- logarithmic (`log`): _y = a + b \* log(x)_
- exponential (`exp`): _y = a \* e^(b \* x)_
- power (`pow`): _y = a \* x^b_
- quadratic (`quad`): _y = a + b * x + c * x^2_
- polynomial (`poly`): _y = a + b * x + … + k * x^(order)_

All models are fit using [ordinary least squares](https://en.wikipedia.org/wiki/Ordinary_least_squares). For non-parametric locally weighted regression, see the [loess](loess.html) transform.

```js
// Any View Specification
{
  ...
  "transform": [
    {"regression": ...} // Regression Transform
     ...
  ],
  ...
}
```

## Regression Transform Definition

{% include table.html props="regression,on,groupby,method,order,extent,params,as" source="RegressionTransform" %}

## Usage

```json
{"regression": "y", "on": "x"}
```

Generate a linear regression trend line that models field `"y"` as a function of `"x"`. The output data stream can then be visualized with a line mark, and takes the form:

```js
[
  {"x": 1, "y": 2.3},
  {"x": 2, "y": 2.7},
  {"x": 3, "y": 3.0},
  ...
]
```

If the `groupby` parameter is provided, separate trend lines will be fit per-group, and the output records will additionally include all groupby field values.

## Example

<div class="vl-example" data-name="layer_point_line_regression"></div>
