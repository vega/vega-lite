---
layout: docs
menu: docs
title: Area
permalink: /docs/area.html
---

{: .suppress-error}
```json
// Single View Specification
{
  "data": ... ,
  "mark": "area",
  "encoding": ... ,
  ...
}
```

`area` represent multiple data element as a single area shape. Area marks are often used to show change over time, using either a single area or stacked areas.

## Documentation Overview
{:.no_toc}

- TOC
{:toc}


## Area Chart

Using `area` mark with one temporal or ordinal field (typically on `x`) and one quantitative field (typically on `y`) produces an area chart. For example, the following area chart shows a number of unemployment people in the US over time.

<span class="vl-example" data-name="area"></span>

## Stacked Area Chart

Adding a color field to area chart creates stacked area chart by default. For example, here we split the area chart by industry.

<span class="vl-example" data-name="stacked_area"></span>

## Normalized Stacked Area Chart

You can also create a normalized stacked area chart by setting `"stack"` to `"normalize"` in the encoding channel. Here we can easily see the percentage of unemployment across industries.

<span class="vl-example" data-name="stacked_area_normalize"></span>

## Streamgraph

We can also shift the stacked area chart's baseline to center and produces a [streamgraph](http://www.leebyron.com/else/streamgraph/) by setting `"stack"` to `"center"` in the encoding channel.

<span class="vl-example" data-name="stacked_area_stream"></span>

{:#ranged}
## Ranged Area

Specifying `x2` or `y2` for the quantitative axis of area marks produce ranged areas.
For example, we can use ranged area with the `ci0` and `ci0` [aggregation operators](aggregate.html#ops) to highlight 95% confidence interval of a line chart that shows mean values over time.

<span class="vl-example" data-name="layer_area_ci"></span>


{:#config}
## Area Config

{: .suppress-error}
```json
// Top-level View Specification
{
  ...
  "config": {
    "area": ...,
    ...
  }
}
```

The `area` property of the top-level [`config`](config.html) object sets the default properties for all area marks.  If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

For the list of all supported properties, please see the [mark config documentation](mark.html#config).
