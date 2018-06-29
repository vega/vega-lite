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

An error bar summarizes an error range of quantitative values using a set of summary statistics, representing by rules (and optional end ticks).
Error bars in Vega-Lite can either be used to aggregate raw data or directly visualize aggregated data.

To create an error bar, set `mark` to `"errorbar"`.

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

{:#properties}
## Error Bar Mark Properties

An error bar's mark definition contain the following properties:

{% include table.html props="type,extent,orient,color,opacity" source="ErrorBarDef" %}

Besides the properties listed above, `rule` and `ticks` can be used to specify the underlying [mark properties](mark.html#mark-def) for different [parts of the error bar](#parts) as well.


{:#raw-usage}
## Using Error Bars to Aggregate Raw Data

If the data is not aggregated yet, Vega-Lite will aggregate the data based on the `extent` properties in the mark definition.


1) __Error bars showing standard error__ is the default error bar in Vega-Lite. It can also be explicitly specified by setting `extent` to `"stderr"`. The length of lower and upper rules represent standard error. By default, the rule marks expand from the mean.

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal"></div>


2) __Error bar showing standard deviation__ can be specified by setting `extent` to `"stdev"`. For this type of error bar, the length of lower and upper rules represent standard deviation. Like an error bar that shows Standard Error, the rule marks expand from the mean by default.

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal_stdev"></div>


3) __Error bars showing confidence interval__ can be specified by setting `extent` to `"ci"`. For this type of error bar, the rule marks expand from the `"ci0"` value to `"ci1"` value, as defined in [aggregate](aggregate.html#ops).

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal_ci"></div>


4) __Error bars showing interquartile range__ can be specified by setting `extent` to `"iqr"`. For this type of error bar, the rule marks expand from the first quartile to the third quartile.

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal_iqr"></div>


{:#pre-aggregated-usage}
## Using Error Bars to Visualize Aggregated Data

If the data is already pre-aggregated with low and high values of the error bars, you can directly specify `x` and `x2` (or `y` and `y2`) to use error bar as a ranged mark.

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal_pre_aggregated"></div>

**Note** in this case, `extent` will be ignored.

## Dimension & Orientation
Vega-Lite supports both 1D and 2D error bars:

{:#1d}
A __1D error bar__ shows the error range of a continuous field.
<div class="vl-example" data-name="layer_point_errorbar_1d_horizontal"></div>

The orientation of an error bar is automatically determined by the continuous field axis.
For example, you can create a vertical 1D error bar by encoding a continuous field on the y axis.

<div class="vl-example" data-name="layer_point_errorbar_1d_vertical"></div>

{:#2d}
A __2D error bar__ shows the error range of a continuous field, broken down by categories.

For 2D error bars with one continuous field and one discrete field,
the error bars will be horizontal if the continuous field is on the x axis.

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal"></div>

Alternatively, if the continuous field is on the y axis, the error bar will be vertical.

<div class="vl-example" data-name="layer_point_errorbar_2d_vertical"></div>

{:#parts}
## The Parts of Error Bars

Under the hood, the `errorbar` mark is a [composite mark](mark.html#composite-marks) that expands into a layered plot.  For example, [a basic 1D error bar shown above](#1d) is expanded to:

<div class="vl-example" data-name="normalized/layer_point_errorbar_1d_horizontal_normalized"></div>

We can customize different parts of the error bar [mark definition](#properties) or [config](#config).

For example, we can add the error bar's end ticks and customize it by setting `ticks` to `true` or adding a mark property to `ticks`, such as setting `color` to `"blue"`:

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal_custom_ticks"></div>

## Color, and Opacity Encoding Channels

You can customize the color, size, and opacity of the bar in the `errorbar` by using the `color`, and `opacity` [encoding channels](encoding.html#channels), which applied to the whole `errorbar`.

Here is an example of a `errorbar` with the `color` encoding channel set to `{"value": "#4682b4"}`.

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal_color_encoding"></div>


{:#config}
## Mark Config
{: .suppress-error}
```json
{
  "errorbar": {
    "extent": ...,
    "rule": ...,
    "ticks": ...
  }
}
```

The `errorbar` config object sets the default properties for `errorbar` marks.

The error bar config can contain all [error bar mark properties](#properties) but currently not supporting `color`, `opacity`, and `orient`. Please see issue [#3934](https://github.com/vega/vega-lite/issues/3934).

