---
layout: docs
menu: docs
title: Line
permalink: /docs/line.html
---

```js
{
  "data": ... ,
  "mark": "line",
  "encoding": ... ,
  ...
}
```

The `line` mark represents the data points stored in a field with a line connecting all of these points. Line marks are commonly used to depict trajectories or change over time. Unlike most other marks that represent one data element per mark, one line mark represents multiple data element as a single line, akin to [`area`](area.html) and [`trail`](trail.html).

**Note:** For line segments that connect (x,y) positions to (x2,y2) positions, please use [`rule`](rule.html) marks. For continuous lines with varying size, please use [`trail`](trail.html) marks.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#properties}

## Line Mark Properties

```js
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

<span class="vl-example" data-name="line_params" figure-only=true></span>

An line mark definition can contain any [standard mark properties](mark.html#mark-def) and the following line interpolation and point overlay properties:

{% include table.html props="orient,interpolate,tension,point" source="MarkDef" %}

## Examples

### Line Chart

Using `line` with one temporal or ordinal field (typically on `x`) and another quantitative field (typically on `y`) produces a simple line chart with a single line.

<span class="vl-example" data-name="line"></span>

We can add create multiple lines by grouping along different attributes, such as `color` or `detail`.

### Multi-series Colored Line Chart

Adding a field to a [mark property channel](encoding.html#mark-prop) such as `color` groups data points into different series, producing a multi-series colored line chart.

<span class="vl-example" data-name="line_color"></span>

We can use text marks and [`argmax`](aggregate.html#argmax) to add labels to each line instead of using legends. Note that here we hide one of the line to avoid collision.

<span class="vl-example" data-name="line_color_label"></span>

We can further apply [`selection`](selection.html) to highlight a certain line on hover.

<span class="vl-example" data-name="interactive_line_hover"></span>

### Multi-series Line Chart with Varying Dashes

Adding a field to `strokeDash` also produces a multi-series line chart.

<span class="vl-example" data-name="line_strokedash"></span>

We can also use line grouping to create a line chart that has multiple parts with varying styles.

<span class="vl-example" data-name="line_dashed_part"></span>

{:#line-detail}

### Multi-series Line Chart with the Detail Channel

To group lines by a field without mapping the field to any visual properties, we can map the field to the [`detail`](encoding.html#detail) channel to create a multi-series line chart with the same color.

<span class="vl-example" data-name="line_detail"></span>

The same method can be used to group lines for a ranged dot plot.

<span class="vl-example" data-name="layer_ranged_dot"></span>

### Line Chart with Point Markers

By setting the `point` property of the mark definition to `true` or an object defining a property of the overlaying point marks, we can overlay point markers on top of line.

<span class="vl-example" data-name="line_overlay"></span>

This is equivalent to adding another layer of filled point marks.

<span class="vl-example" data-name="normalized/line_overlay_normalized"></span>

Note that the overlay point marks have `opacity` = 1 by default (instead of semi-transparent like normal point marks).

Here we create stroked points by setting their `\"filled\"` to `false` and their `fill` to `\"white\"`.

<span class="vl-example" data-name="line_overlay_stroked"></span>

{:#line-invalid}

### Line Chart with Invalid Values

By default, data points with invalid x- or y-values (`null` or `NaN`) will cause break in the lines.

<span class="vl-example" data-name="line_skip_invalid"></span>

Note that individual points without connecting points will still be invisible by default.

<span class="vl-example" data-name="line_skip_invalid_mid"></span>

To show individual points without connecting points, you may set `strokeCap` to `"square"`:

<span class="vl-example" data-name="line_skip_invalid_mid_cap_square"></span>

or overlay it with marker points:

<span class="vl-example" data-name="line_skip_invalid_mid_overlay"></span>

{:#connected-scatter-plot}

### Connected Scatter Plot (Line Chart with Custom Path)

As shown in previous example, the line's path (order of points in the line) is determined by data values on the temporal/ordinal field by default. However, a field can be mapped to the [`order`](encoding.html#order) channel for determining a custom path.

For example, to show a pattern of data change over time between gasoline price and average miles driven per capita we use `order` channel to sort the points in the line by time field (`year`). In this example, we also use the `point` property to overlay point marks over the line marks to highlight each data point.

<span class="vl-example" data-name="connected_scatterplot"></span>

### Line interpolation

The `interpolate` property of a [mark definition](mark.html#mark-def) can be used to change line interpolation method. For example, we can set `interpolate` to `"monotone"`.

<span class="vl-example" data-name="line_monotone"></span>

We can also set `interpolate` to `"step-after"` to create a step-chart.

<span class="vl-example" data-name="line_step"></span>

For the list of all supported `interpolate` properties, please see the [line mark properties](#properties) section.

### Geo Line

By mapping geographic coordinate data to `longitude` and `latitude` channels of a corresponding [projection](projection.html), we can draw lines through geographic points.

<span class="vl-example" data-name="geo_line"></span>

{:#config}

## Line Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "line": ...,
    ...
  }
}
```

The `line` property of the top-level [`config`](config.html) object sets the default properties for all line marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

The line config can contain any [line mark properties](#properties) (except `type`, `style`, and `clip`).
