---
layout: docs
menu: docs
title: Error Bar
permalink: /docs/errorbar.html
---

{: .suppress-error}
```json
// Single View Specification
{
  "data": ... ,
  "mark": "errorbar",
  "encoding": ... ,
  ...
}
```

An error bar summarizes an error range of quantitative values using a set of summary statistics, representing by whiskers. Depending on the [type of error bar](#errorbar-types), the ends of whiskers can represent different types of error.

To create a error bar, set `mark` to `"errorbar"`.

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

{:#properties}
## Error Bar Mark Properties

A errorbar's mark definition contain the following properties:

{% include table.html props="type,center,extent,orient,size,color,opacity" source="ErrorBarDef" %}

Besides the properties listed above, `"rule"` and `"ticks"` can be used to specify the underlying [mark properties](mark.html#mark-def) for different [parts of the error bar](#parts) as well.

## Types of Error Bar
{:#errorbar-types}

In Vega-Lite, the types of error bar are defined by the `extent` property in the mark definition object.

1) __Standard Error Error Bar__ is the default error bar in Vega-Lite, or cen be specified by setting `extent` to `stderr`. The size of lower and upper whiskers are standard error. As a default, the whiskers expand from the mean; however, `center` can be set to `median`, so that the whiskers expand from the median instead. **Note:** if the `center`is `median`, and the `extent` is not specified, the default `extent` is `iqr` instead of `stderr`

<div class="vl-example" data-name="errorbar_2d_horizontal"></div>

Explicitly setting `extent` to `stderr` with `center` set to `median`.

<div class="vl-example" data-name="errorbar_2d_horizontal_median_stderr"></div>

Only set the `center` to `median`, resaulting the default of `extent` becomes `iqr`.

<div class="vl-example" data-name="errorbar_2d_horizontal_median"></div>

2) __Standard Deviation Error Bar__ can be spacified by setting `extent` to `stdev`. For this type of error bar, the size of lower and upper whiskers are standard deviation. Like Standard Error Error Bar, the whiskers expand from the mean, by default. And, the whiskers can be set to expand from the median with the same method.

<div class="vl-example" data-name="errorbar_2d_horizontal_stdev"></div>

Explicitly setting `extent` to `stderr` with `center` set to `median`.

<div class="vl-example" data-name="errorbar_2d_horizontal_median_stdev"></div>

3) __Confidence Interval Error Bar__ can be specified by setting `extent` to `ci`. For this type of error bar, whiskers expands from the `ci0` value to `ci1` value, as defined in [Aggregate](aggregate.html#ops). **Note:** When `extent` is `ci`, the `center` property is meaningless.

<div class="vl-example" data-name="errorbar_2d_horizontal_ci"></div>

4) __Interquartile Error Bar__ can be specified by setting `extent` to `iqr`. For this type of error bar, whiskers expands from the first quartile to the third quartile. **Note:** When `extent` is `iqr`, the `center` property is meaningless.

<div class="vl-example" data-name="errorbar_2d_horizontal_iqr"></div>

## Dimension & Orientation
There are two `error bar` dimensions:

{:#1D_horizontal}
1) A 1D `errorbar` shows the error range of a continuous field.
<div class="vl-example" data-name="errorbar_1d_horizontal"></div>

2) A 2D `errorbar` shows the error range of a continuous field, broken down by categories.
<div class="vl-example" data-name="errorbar_2d_horizontal"></div>

A errorbar's orientation is automatically determined by the continuous field axis.
For example, you can create a vertical 1D error bar by encoding a continuous field on the y axis.

<div class="vl-example" data-name="errorbar_1d_vertical"></div>

{:#2d}

For 2D error bars with one continuous field and one discrete field,
the error bars will be horizontal if the continuous field is on the x axis.

<div class="vl-example" data-name="errorbar_2d_horizontal"></div>

Alternatively, if the continuous field is on the y axis, the error bar will be vertical.

<div class="vl-example" data-name="errorbar_2d_vertical"></div>

{:#parts}
## The Parts of Error Bars

Under the hood, the `"errorbar"` mark is a [composite mark](mark.html#composite-marks) that expands into a layered plot.  For example, [a basic 1D errorbar shown above](#1D_horizontal) is expanded to:

<div class="vl-example" data-name="normalized/errorbar_1d_horizontal_normalized"></div>

We can customize different parts of the error bar [mark definition](#properties) or [config](#config).

For example, we can customize the error bar's `"tick"` by setting `"color"` to `"red"` and set `"ticks"` to true to make the error bar includes end ticks:

<div class="vl-example" data-name="errorbar_2d_horizontal_custom_mark"></div>

## Color, and Opacity Encoding Channels

You can customize the color, size, and opacity of the bar in the `errorbar` by using the `color`, and `opacity` [encoding channels](encoding.html#channels), which applied to the whole `errorbar`.

An example of a `errorbar` where the `color` encoding channel is specified.
<div class="vl-example" data-name="errorbar_2d_vertical"></div>

<div class="vl-example" data-name="errorbar_2d_horizontal_color"></div>


{:#config}
## Mark Config
{: .suppress-error}
```json
{
  "errorbar": {
    "size": ...,
    "center": ...,
    "extent": ...,
    "rule": ...,
    "ticks": ...
  }
}
```

The `errorbar` config object sets the default properties for `errorbar` marks.

The errorbar config can contain all [errorbar mark properties](#properties) except `"orient"`.

