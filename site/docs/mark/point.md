---
layout: docs
menu: docs
title: Point
permalink: /docs/point.html
---

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": "point",
  "encoding": ... ,
  ...
}
```

`point` mark represents each data point with a symbol. Point marks are commonly used in visualizations like scatterplots.


## Dot Plot

Mapping a field to either only `x` (or only `y`) of `point` mark creates a **dot plot**.

<span class="vl-example" data-name="point_1d"></span>

## Scatter Plot

Mapping fields to both the `x` and `y` channels creates a scatter plot.

<span class="vl-example" data-name="scatter"></span>

## Bubble Plot

By mapping a third field to the `size` channel in the [scatter plot](#scatter), we can create a bubble plot instead.

<span class="vl-example" data-name="scatter_bubble"></span>

{:#color}

## Scatter Plot with Color and/or Shape

Fields can also be encoded in the [scatter plot](#scatter) using the `color` or `shape` channels.
For example, this specification encodes the field `Origin` with both `color` and `shape`.

<span class="vl-example" data-name="scatter_colored_with_shape"></span>

Note that `point` marks have a border but no fill by default.
See [this section for an example with filled `point` marks](config.html#config.mark.filled).
