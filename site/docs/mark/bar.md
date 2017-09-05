---
layout: docs
menu: docs
title: Bar
permalink: /docs/bar.html
---

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": "bar",
  "encoding": ... ,
  ...
}
```

The `bar` mark encodes x and y channels with a pair of discrete and continuous fields. Bar marks are useful in a wide variety of visualizations, including bar charts and timelines.


## Documentation Overview
{:.no_toc}

* TOC
{:toc}


## Single Bar Chart

Mapping a quantitative field to either `x` or `y` of the `bar` mark produces a single bar. In the following example, note that the `x` channel encodes the sum of the populations.

<span class="vl-example" data-name="bar_1d"></span>


## Bar Chart

If we map a different ordinal field to the `y` channel, we can produce a horizontal bar chart. Specifying `scale.rangeStep` of an ordinal field will adjust the [ordinal scale's range step](https://github.com/mbostock/d3/wiki/Ordinal-Scales#ordinal_rangeBands). By default, there will be a 1 pixel offset between bars. (See [an example that customizes the size of the bars](encoding.html#ex-bar-size).)

<!-- TODO: Need to update docs our and Vega's scale.rangeStep property and link there instead -->

<span class="vl-example" data-name="bar_aggregate"></span>

## Histogram
If the data is not pre-aggregated (i.e. each record in the data field represents one item),
mapping a [binned](bin.html) quantitative field to `x` and aggregate `count` to `y` produces a histogram.

<span class="vl-example" data-name="histogram"></span>

If you prefer to have histogram without gaps between bars, you can set the [`barBinSpacing` mark config](config.html#bar-config) to `0`.

{:#stack}
## Stacked Bar Chart

Adding color to the bar chart (by using the `color` attribute) creates a stacked bar chart by default. Here we also customize the color's scale range to make the color a little nicer.
(See [`stack`](stack.html) for more details about customizing stack.)


<span class="vl-example" data-name="stacked_bar_population"></span>


## Layered Bar Chart

To disable stacking, you can alternatively set [`stack`](stack.html) to `"none"`.
This produces a layered bar chart.
To make it clear that bars are layered, we can make marks semi-transparent by setting the `opacity` to 0.6.

<span class="vl-example" data-name="bar_layered_transparent"></span>


## Normalized Stacked Bar Chart

<!-- TODO: better explain this -->
You can also create a normalized stacked bar chart by setting [`stack`](stack.html) to `"normalize"`. Here we can easily see the percentage of male and female population at different ages.

<span class="vl-example" data-name="stacked_bar_normalize"></span>


## Grouped Bar Chart

<!-- TODO: better explain this -->
[Faceting](facet.html) a bar chart produces a grouped bar chart.

<span class="vl-example" data-name="bar_grouped"></span>
