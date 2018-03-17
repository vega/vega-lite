---
layout: docs
menu: docs
title: Line
permalink: /docs/line.html
---

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": "line",
  "encoding": ... ,
  ...
}
```

The `line` mark represents the data points stored in a field with a line connecting all of these points. Line marks are commonly used to depict trajectories or change over time. Unlike other marks that represent one data element per mark, one line mark represents multiple data element as a single line (same is true for [`area`](area.html)).

__Note:__ For line segments that connect (x,y) positions to (x2,y2) positions, please use [`rule`](rule.html) marks.

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

{:#properties}
## Line Mark Properties

{: .suppress-error}
```json
// Single View Specification
{
  ...
  "mark": {
    "type": "line",
    ...
  },
  "encoding": ... ,
  ...
}
```

An line mark definition can contain any [standard mark properties](mark.html#mark-def) and the following line interpolation properties:

{% include table.html props="orient,interpolate,tension" source="MarkDef" %}


## Examples

### Line Chart

Using `line` with one temporal or ordinal field (typically on `x`) and another quantitative field (typically on `y`) produces a simple line chart with a single line.

<span class="vl-example" data-name="line"></span>

We can add create multiple lines by grouping along different attributes, such as `color` or `detail`.

#### Multi-series Colored Line Chart

Adding a field to a [mark property channel](encoding.html#mark-prop) such as `color` groups data points into different series, producing a multi-series colored line chart.

<span class="vl-example" data-name="line_color"></span>

{:#line-detail}
### Multi-series Line Chart with the Detail Channel

To group lines by a field without mapping the field to any visual properties, we can map the field to the [`detail`](encoding.html#detail) channel to create a multi-series line chart with the same color.

<span class="vl-example" data-name="line_detail"></span>

The same method can be used to group lines for a ranged dot plot.

<span class="vl-example" data-name="layer_ranged_dot"></span>

{:#connected-scatter-plot}
### Connected Scatter Plot (Line Chart with Custom Path)

As shown in previous example, the line's path (order of points in the line) is determined by data values on the temporal/ordinal field by default. However, a field can be mapped to the [`order`](encoding.html#order) channel for determining a custom path.

For example, to show a pattern of data change over time between gasoline price and average miles driven per capita we use `order` channel to sort the points in the line by time field (`year`).  In this example, we also [`layer`](layer.html) point marks over the line marks to highlight each data point.

<span class="vl-example" data-name="layer_connected_scatterplot"></span>

### Line interpolation

The `interpolate` property of a [mark definition](mark.html#mark-def) can be used to change line interpolation method.  For example, we can set `interpolate` to `"monotone"`.

<span class="vl-example" data-name="line_monotone"></span>

We can also set `interpolate` to `"step-after"` to create a step-chart.

<span class="vl-example" data-name="line_step"></span>

For the list of all supported `interpolate` properties, please see the [mark definition](mark.html#mark-def) documentation.

### Geo Line

By mapping geographic coordinate data to `longitude` and `latitude` channels of a corresponding [projection](projection.html), we can draw lines through geographic points.

<span class="vl-example" data-name="geo_line"></span>


{:#config}
## Line Config


{: .suppress-error}
```json
// Top-level View Specification
{
  ...
  "config": {
    "line": ...,
    ...
  }
}
```

The `line` property of the top-level [`config`](config.html) object sets the default properties for all line marks.  If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

The line config can contain any [line mark properties](#properties) (except `type`, `style`, and `clip`).
