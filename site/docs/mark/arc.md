---
layout: docs
menu: docs
title: Arc
permalink: /docs/arc.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "arc",
  "encoding": ... ,
  ...
}
```

Arc marks are circular arcs defined by a center point plus angular and radial extents. Arc marks are typically used for radial plots such as pie and donut charts.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#properties}

## Arc Mark Properties

```js
// Single View Specification
{
  ...
  "mark": {
    "type": "arc",
    ...
  },
  "encoding": ... ,
  ...
}
```

<span class="vl-example" data-name="arc_params" figure-only=true></span>

An `arc` mark definition can contain any [standard mark properties](mark.html#mark-def) and the following special properties:

{% include table.html props="radius,radius2,innerRadius,outerRadius,theta,theta2,cornerRadius,padAngle,radiusOffset,radius2Offset,thetaOffset,theta2Offset" source="MarkDef" %}

## Examples

### Pie and Donut Charts

We can create a pie chart by encoding `theta` and `color` or arc marks.

<span class="vl-example" data-name="arc_pie"></span>

Setting `innerRadius` to non-zero values will create a donut chart.

<span class="vl-example" data-name="arc_donut"></span>

You can also add a text layer to add labels to a pie chart.

<span class="vl-example" data-name="layer_arc_label"></span>

**Note:** For now, [you need to add `stack: true`](https://github.com/vega/vega-lite/issues/5078) to theta to force the text to apply the same polar stacking layout.

## Arc Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "arc": ...,
    ...
  }
}
```

The `arc` property of the top-level [`config`](config.html) object sets the default properties for all arc marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

The arc config can contain any [arc mark properties](#properties) (except `type`, `style`, and `clip`).
