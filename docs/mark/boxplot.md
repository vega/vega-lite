---
layout: docs
menu: docs
title: Box Plot
permalink: /docs/boxplot.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "boxplot",
  "encoding": ... ,
  ...
}
```

A box plot summarizes a distribution of quantitative values using a set of summary statistics. The median tick in the box represents the median. The lower and upper parts of the box represent the first and third quartile respectively. Depending on the [type of box plot](#boxplot-types), the ends of the whiskers can represent multiple things.

To create a box plot, set `mark` to `"boxplot"`.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#properties}

## Box Plot Mark Properties

A boxplot's mark definition contain the following properties:

{% include table.html props="type,extent,orient,size,color,opacity" source="BoxPlotDef" %}

Besides the properties listed above, `"box"`, `"median"`, `"rule"`, `"outliers"`, and `"ticks"` can be used to specify the underlying [mark properties](mark.html#mark-def) for different [parts of the box plots](#parts) as well.

{:#boxplot-types}

## Types of Box Plot

Vega-Lite supports two types of box plots, defined by the `extent` property in the mark definition object.

1. **Tukey Box Plot** is the default box plot in Vega-Lite. For a Tukey box plot, the whisker spans from the smallest data to the largest data within the range _[Q1 - k * IQR, Q3 + k * IQR]_ where _Q1_ and _Q3_ are the first and third quartiles while _IQR_ is the interquartile range (_Q3-Q1_). In this type of box plot, you can specify the constant _k_ by setting the `extent`. If [there are outlier points beyond the whisker](#dims-orient), they will be displayed using point marks.

By default, the extent is `1.5`.

<div class="vl-example" data-name="boxplot_1D_horizontal"></div>

Explicitly setting `extent` to `1.5` produces the following identical plot.

<div class="vl-example" data-name="boxplot_1D_horizontal_explicit"></div>

2. **`min-max` Box Plot** is a box plot where the lower and upper whiskers are defined as the min and max respectively. No points will be considered as outliers for this type of box plots.

<div class="vl-example" data-name="boxplot_minmax_2D_horizontal"></div>

{:#dims-orient}

## Dimension & Orientation

Vega-Lite supports both 1D and 2D box plots:

**1D box plot** shows the distribution of a continuous field.

<div class="vl-example" data-name="boxplot_1D_horizontal"></div>

A boxplot's orientation is automatically determined by the continuous field axis. For example, you can create a vertical 1D box plot by encoding a continuous field on the y axis.

<div class="vl-example" data-name="boxplot_1D_vertical"></div>

**2D box plot** shows the distribution of a continuous field, broken down by categories.

For 2D box plots with one continuous field and one discrete field, the box plot will be horizontal if the continuous field is on the x axis.

<div class="vl-example" data-name="boxplot_2D_horizontal"></div>

Alternatively, if the continuous field is on the y axis, the box plot will be vertical.

<div class="vl-example" data-name="boxplot_2D_vertical"></div>

{:#parts}

## The Parts of Box Plots

Under the hood, the `"boxplot"` mark is a [composite mark](mark.html#composite-marks) that expands into a layered plot. For example, [a basic 1D boxplot shown above](#dims-orient) is expanded to:

<div class="vl-example" data-name="normalized/boxplot_1D_horizontal_normalized"></div>

To customize different parts of the box, we can customize different parts of the box plot [mark definition](#properties) or [config](#config).

For example, we can customize the box plot's `"median"` tick by setting `"color"` to `"red"` and set `"ticks"` to true to make the box plot includes end ticks:

<div class="vl-example" data-name="boxplot_1D_horizontal_custom_mark"></div>

## Color, Size, and Opacity Encoding Channels

You can customize the color, size, and opacity of the box in the `boxplot` by using the `color`, `size`, and `opacity` [encoding channels](encoding.html#channels). The `size` is applied to only the box and median tick. The `color` is applied to only the box and the outlier points. Meanwhile, the `opacity` is applied to the whole `boxplot`.

An example of a `boxplot` where the `size` encoding channel is specified.

<div class="vl-example" data-name="boxplot_2D_vertical"></div>

<div class="vl-example" data-name="boxplot_2D_horizontal_color_size"></div>

## Tooltip Encoding Channels

You can add custom tooltips to box plots. The custom tooltip will override the default boxplot's tooltips.

If the field in the tooltip encoding is unaggregated, it replaces the tooltips of the outlier marks.

<div class="vl-example" data-name="boxplot_tooltip_not_aggregate"></div>

On the other hand, if the field in the tooltip encoding is aggregated, it replaces the tooltips of the box and whisker marks.

<div class="vl-example" data-name="boxplot_tooltip_aggregate"></div>

{:#config}

## Mark Config

```js
{
  "boxplot": {
    "size": ...,
    "extent": ...,
    "box": ...,
    "median": ...,
    "whisker": ...,
    "outliers": ...
  }
}
```

The `boxplot` config object sets the default properties for `boxplot` marks.

The boxplot config can contain all [boxplot mark properties](#properties) but currently not supporting `color`, `opacity`, and `orient`. Please see issue [#3934](https://github.com/vega/vega-lite/issues/3934).

## Box Plot with Pre-Calculated Summaries

If you have data summaries pre-calculated for a box plot, you can use `layer` to build a box plot like this:

<div class="vl-example" data-name="boxplot_preaggregated"></div>
