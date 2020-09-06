---
layout: docs
menu: docs
title: Point
permalink: /docs/point.html
---

```js
{
  "data": ... ,
  "mark": "point",
  "encoding": ... ,
  ...
}
```

`point` mark represents each data point with a symbol. Point marks are commonly used in visualizations like scatterplots.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#properties}

## Point Mark Properties

```js
// Single View Specification
{
  ...
  "mark": {
    "type": "point",
    ...
  },
  "encoding": ... ,
  ...
}
```

<span class="vl-example" data-name="point_params" figure-only=true></span>

A point mark definition can contain any [standard mark properties](mark.html#mark-def) and the following special properties:

{% include table.html props="shape,size" source="MarkDef" %}

## Examples

### Dot Plot

Mapping a field to either only `x` or only `y` of `point` marks creates a **dot plot**.

<span class="vl-example" data-name="point_1d"></span>

### Scatter Plot

Mapping fields to both the `x` and `y` channels creates a scatter plot.

<span class="vl-example" data-name="point_2d"></span>

By default, `point` marks only have borders and are transparent inside. You can create a filled point by setting `filled` to `true`.

<span class="vl-example" data-name="point_filled"></span>

### Bubble Plot

By mapping a third field to the `size` channel in the [scatter plot](#scatter), we can create a bubble plot instead.

<span class="vl-example" data-name="point_bubble"></span>

{:#color}

### Scatter Plot with Color and/or Shape

Fields can also be encoded in the [scatter plot](#scatter) using the `color` or `shape` channels. For example, this specification encodes the field `Origin` with both `color` and `shape`.

<span class="vl-example" data-name="point_color_with_shape"></span>

### Wind Vector Map

We can also use point mark with angle encoding to create a wind vector map.

<span class="vl-example" data-name="point_angle_windvector"></span>

### Geo Point

By mapping geographic coordinate data to `longitude` and `latitude` channels of a corresponding [projection](projection.html), we can visualize geographic points. The example below shows major airports in the US.

<span class="vl-example" data-name="geo_point"></span>

{:#config}

## Point Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "point": ...,
    ...
  }
}
```

The `point` property of the top-level [`config`](config.html) object sets the default properties for all point marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

The point config can contain any [point mark properties](#properties) (except `type`, `style`, and `clip`).
