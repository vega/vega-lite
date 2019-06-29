---
layout: docs
menu: docs
title: Bar
permalink: /docs/bar.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "bar",
  "encoding": ... ,
  ...
}
```

Bar marks are useful in many visualizations, including bar charts, [stacked bar charts](#stack), and [timelines](#ranged).

## Documentation Overview

{:.no_toc}

<!-- prettier-ignore -->
- TOC
{:toc}

{:#properties}

## Bar Mark Properties

```js
// Single View Specification
{
  ...
  "mark": {
    "type": "bar",
    ...
  },
  "encoding": ... ,
  ...
}
```

A bar mark definition can contain any [standard mark properties](mark.html#mark-def) and the following special properties:

{% include table.html props="orient,align,baseline,binSpacing,cornerRadius" source="MarkDef" %}

## Examples

### Single Bar Chart

Mapping a quantitative field to either `x` or `y` of the `bar` mark produces a single bar chart.

<span class="vl-example" data-name="bar_1d"></span>

### Bar Chart

If we map a different discrete field to the `y` channel, we can produce a horizontal bar chart. Specifying `scale.rangeStep` of the discrete field will adjust the [band and point scale's range step](scale.html#band).

<span class="vl-example" data-name="bar_aggregate"></span>

While the `bar` mark typically uses the x and y channels to encode a pair of discrete and continuous fields, it can also be used with continuous fields on both channels. For example, given a bar chart with a temporal field on x, we can see that the x-scale is a continuous scale. By default, the size of bars on continuous scales will be set based on the [`continuousBandSize` config](#config).

<span class="vl-example" data-name="bar_month_temporal"></span>

If you want to use a discrete scale instead, you can cast the field to have an `"ordinal"` type. This casting strategy can be useful for time units with low cardinality such as `"month"`.

<span class="vl-example" data-name="bar_month"></span>

### Histogram

If the data is not pre-aggregated (i.e. each record in the data field represents one item), mapping a [binned](bin.html) quantitative field to `x` and aggregate `count` to `y` produces a histogram.

<span class="vl-example" data-name="histogram"></span>

If you prefer to have histogram without gaps between bars, you can set the [`binSpacing` mark property](#properties) to `0`.

<span class="vl-example" data-name="histogram_no_spacing"></span>

{:#stack}

### Stacked Bar Chart

Adding color to the bar chart (by using the `color` attribute) creates a stacked bar chart by default. Here we also customize the color's scale range to make the color a little nicer. (See [`stack`](stack.html) for more details about customizing stack.)

<span class="vl-example" data-name="stacked_bar_population"></span>

### Layered Bar Chart

To disable stacking, you can alternatively set [`stack`](stack.html) to `null`. This produces a layered bar chart. To make it clear that bars are layered, we can make marks semi-transparent by setting the `opacity` to a value between 0 and 1 (e.g., `0.7`).

<span class="vl-example" data-name="bar_layered_transparent"></span>

### Normalized Stacked Bar Chart

<!-- TODO: better explain this -->

You can also create a normalized stacked bar chart by setting [`stack`](stack.html) to `"normalize"`. Here we can easily see the percentage of male and female population at different ages.

<span class="vl-example" data-name="stacked_bar_normalize"></span>

### Grouped Bar Chart

<!-- TODO: better explain this -->

[Faceting](facet.html) a bar chart produces a grouped bar chart.

<span class="vl-example" data-name="bar_grouped"></span>

{:#ranged}

### Ranged Bars

Specifying `x2` or `y2` for the quantitative axis of bar marks creates ranged bars. For example, we can use ranged bars to create a gantt chart.

<span class="vl-example" data-name="bar_gantt"></span>

{:#config}

## Bar Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "bar": ...,
    ...
  }
}
```

The `bar` property of the top-level [`config`](config.html) object sets the default properties for all bar marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

Besides standard [mark properties](#properties), bar config can contain the following additional properties:

{% include table.html props="binSpacing,continuousBandSize,discreteBandSize" source="BarConfig" %}
