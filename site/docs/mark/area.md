---
layout: docs
menu: docs
title: Area
permalink: /docs/area.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "area",
  "encoding": ... ,
  ...
}
```

`area` represent multiple data element as a single area shape. Area marks are often used to show change over time, using either a single area or stacked areas.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#properties}

## Area Mark Properties

```js
// Single View Specification
{
  ...
  "mark": {
    "type": "area",
    ...
  },
  "encoding": ... ,
  ...
}
```

<span class="vl-example" data-name="area_params" figure-only=true></span>

An area mark definition can contain any [standard mark properties](mark.html#mark-def) and the following line interpolation as well as line and point overlay properties:

{% include table.html props="align,baseline,orient,interpolate,tension,line,point" source="MarkDef" %}

## Examples

### Area Chart

Using `area` mark with one temporal or ordinal field (typically on `x`) and one quantitative field (typically on `y`) produces an area chart. For example, the following area chart shows a number of unemployment people in the US over time.

<span class="vl-example" data-name="area"></span>

### Area Chart with Overlaying Lines and Point Markers

By setting the `line` and `point` properties of the mark definition to `true` or an object defining a property of the overlaying point marks, we can overlay line and point markers on top of area.

<span class="vl-example" data-name="area_overlay"></span>

Instead of using a single color as the fill color of the area, we can set it to a [gradient]({{site.baseurl}}/docs/types.html#gradient). In this example, we are also customizing the overlay.

<span class="vl-example" data-name="area_gradient"></span>

### Stacked Area Chart

Adding a color field to area chart creates stacked area chart by default. For example, here we split the area chart by industry.

<span class="vl-example" data-name="stacked_area"></span>

### Normalized Stacked Area Chart

You can also create a normalized stacked area chart by setting `"stack"` to `"normalize"` in the encoding channel. Here we can easily see the percentage of unemployment across industries.

<span class="vl-example" data-name="stacked_area_normalize"></span>

### Streamgraph

We can also shift the stacked area chart's baseline to center and produces a [streamgraph](https://datavizcatalogue.com/methods/stream_graph.html) by setting `"stack"` to `"center"` in the encoding channel.

<span class="vl-example" data-name="stacked_area_stream"></span>

{:#ranged}

### Ranged Area

Specifying `x2` or `y2` for the quantitative axis of area marks produce ranged areas. For example, we can use ranged area with the `ci0` and `ci0` [aggregation operators](aggregate.html#ops) to highlight 95% confidence interval of a line chart that shows mean values over time.

<span class="vl-example" data-name="area_temperature_range"></span>

{:#config}

## Area Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "area": ...,
    ...
  }
}
```

The `area` property of the top-level [`config`](config.html) object sets the default properties for all area marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

The area config can contain any [area mark properties](#properties) (except `type`, `style`, `clip`, and `orient`).
