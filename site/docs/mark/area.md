---
layout: docs
menu: docs
title: Area
permalink: /docs/area.html
---

{: .suppress-error}
```json
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

* TOC
{:toc}


## Area Chart

Using `area` mark with one ordinal field (typically on `x`) and one quantitative field (typically on `y`) produces an area chart. For example, the following area chart shows a number of unemployment people in the US over time.

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
