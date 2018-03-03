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

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

## Dot Plot

Mapping a field to either only `x` or only `y` of `point` marks creates a **dot plot**.

<span class="vl-example" data-name="point_1d"></span>

## Scatter Plot

Mapping fields to both the `x` and `y` channels creates a scatter plot.

<span class="vl-example" data-name="point_2d"></span>


By default, `point` marks only have borders and are transparent inside.  You can create a filled point by setting `filled` to `true`.

<span class="vl-example" data-name="point_filled"></span>

## Bubble Plot

By mapping a third field to the `size` channel in the [scatter plot](#scatter), we can create a bubble plot instead.

<span class="vl-example" data-name="point_bubble"></span>

{:#color}

## Scatter Plot with Color and/or Shape

Fields can also be encoded in the [scatter plot](#scatter) using the `color` or `shape` channels.
For example, this specification encodes the field `Origin` with both `color` and `shape`.

<span class="vl-example" data-name="point_color_with_shape"></span>

## Geo Point

With the [types](type.html) `longitude` and `latitude` and a corresponding [projection](projection.html), we can visualize geographic points. The example below shows major airports in the US.

<span class="vl-example" data-name="geo_point"></span>

{:#config}
## Point Config


{: .suppress-error}
```json
// Top-level View Specification
{
  ...
  "config": {
    "point": ...,
    ...
  }
}
```

The `point` property of the top-level [`config`](config.html) object sets the default properties for all point marks.  If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

For the list of all supported properties, please see the [mark config documentation](mark.html#config).
