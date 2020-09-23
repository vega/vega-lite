---
layout: docs
menu: docs
title: Quantile
permalink: /docs/quantile.html
---

The quantile transform calculates empirical [quantile](https://en.wikipedia.org/wiki/Quantile) values for an input data stream. If a _groupby_ parameter is provided, quantiles are estimated separately per group. Among other uses, the _quantile_ transform is useful for creating [quantile-quantile (Q-Q) plots](https://en.wikipedia.org/wiki/Q%E2%80%93Q_plot).

```js
// Any View Specification
{
  ...
  "transform": [
    {"quantile": ...} // Quantile Transform
     ...
  ],
  ...
}
```

## Quantile Transform Definition

{% include table.html props="quantile,groupby,probs,step,as" source="QuantileTransform" %}

## Usage

```json
{"quantile": "measure", "probs": [0.25, 0.5, 0.75]}
```

Computes the [quartile](https://en.wikipedia.org/wiki/Quartile) boundaries for the `"measure"` field. The output data is of the form:

```js
[
  {prob: 0.25, value: 1.34},
  {prob: 0.5, value: 5.82},
  {prob: 0.75, value: 9.31}
];
```

```json
{"quantile": "measure", "step": 0.05}
```

Computes quantiles for the `"measure"` field over equal-sized probability steps. The output data is of the form:

```js
[{prob: 0.025, value: 0.01}, {prob: 0.075, value: 0.02}, ...{prob: 0.975, value: 0.2}];
```

### Example: Quantile-Quantile Plot

A quantile-quantile plot comparing input data to theoretical distributions:

<div class="vl-example" data-name="point_quantile_quantile"></div>
