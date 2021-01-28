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

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

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

<span class="vl-example" data-name="bar_params_bound" figure-only=true></span>

A bar mark definition can contain any [standard mark properties](mark.html#mark-def) and the following special properties:

{% include table.html props="width,height,orient,align,baseline,binSpacing,cornerRadius,cornerRadiusEnd,cornerRadiusTopLeft,cornerRadiusTopRight,cornerRadiusBottomRight,cornerRadiusBottomLeft" source="MarkDef" %}

## Examples

### Single Bar Chart

Mapping a quantitative field to either `x` or `y` of the `bar` mark produces a single bar chart.

<span class="vl-example" data-name="bar_1d"></span>

### Bar Chart

If we map a different discrete field to the `y` channel, we can produce a horizontal bar chart. Specifying `"height": {"step": 17}` will adjust the bar's height per discrete step.

<span class="vl-example" data-name="bar_aggregate"></span>

### Bar Chart with a Temporal Axis

While the `bar` mark typically uses the x and y channels to encode a pair of discrete and continuous fields, it can also be used with continuous fields on both channels. For example, given a bar chart with a temporal field on x, we can see that the x-scale is a continuous scale. By default, the size of bars on continuous scales will be set based on the [`continuousBandSize` config](#config).

<span class="vl-example" data-name="bar_month_temporal"></span>

{.#bar-width}

### Relative Bar Width

To adjust the bar to be smaller than the time unit step, you can adjust the bar's width to be a proportion of band. For example, the following chart sets the width to be 70% of the x band width.

<span class="vl-example" data-name="bar_month_band"></span>

### Bar Chart with a Discrete Temporal Axis

If you want to use a discrete scale instead, you can cast the field to have an `"ordinal"` type. This casting strategy can be useful for time units with low cardinality such as `"month"`.

<span class="vl-example" data-name="bar_month"></span>

### Bar Chart with Rounded Corners

We can also adjust corner radius of the bar with various corner radius properties. For example, we can use `cornerRadiusEnd` to create a bar chart with rounded corners at the end of the bars.

<span class="vl-example" data-name="bar_corner_radius_end"></span>

### Bar Chart with Negative Values and Zero Baseline

When there are negative values, you may want to hide domain the axis domain line, and instead use a conditional grid color to draw a zero baseline.

<span class="vl-example" data-name="bar_negative"></span>

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
