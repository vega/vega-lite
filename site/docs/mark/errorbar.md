---
layout: docs
menu: docs
title: Error Bar
permalink: /docs/errorbar.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "errorbar",
  "encoding": ... ,
  ...
}
```

An error bar summarizes an error range of quantitative values using a set of summary statistics, representing by rules (and optional end ticks). Error bars in Vega-Lite can either be used to aggregate raw data or directly visualize aggregated data.

To create an error bar, set `mark` to `"errorbar"`.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#properties}

## Error Bar Mark Properties

An error bar's mark definition contain the following properties:

{% include table.html props="type,extent,orient,color,opacity" source="ErrorBarDef" %}

Besides the properties listed above, `rule` and `ticks` can be used to specify the underlying [mark properties](mark.html#mark-def) for different [parts of the error bar](#parts) as well.

{:#raw-usage}

## Using Error Bars to Aggregate Raw Data

If the data is not aggregated yet, Vega-Lite will aggregate the data based on the `extent` properties in the mark definition.

1. **Error bars showing standard error** is the default error bar in Vega-Lite. It can also be explicitly specified by setting `extent` to `"stderr"`. The length of lower and upper rules represent standard error. By default, the rule marks expand from the mean.

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal"></div>

2. **Error bar showing standard deviation** can be specified by setting `extent` to `"stdev"`. For this type of error bar, the length of lower and upper rules represent standard deviation. Like an error bar that shows Standard Error, the rule marks expand from the mean by default.

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal_stdev"></div>

3. **Error bars showing confidence interval** can be specified by setting `extent` to `"ci"`. For this type of error bar, the rule marks expand from the `"ci0"` value to `"ci1"` value, as defined in [aggregate](aggregate.html#ops).

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal_ci"></div>

4. **Error bars showing interquartile range** can be specified by setting `extent` to `"iqr"`. For this type of error bar, the rule marks expand from the first quartile to the third quartile.

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal_iqr"></div>

{:#pre-aggregated-usage}

## Using Error Bars to Visualize Aggregated Data

1. **Data is aggregated with low and high values of the error bars**

If the data is already pre-aggregated with low and high values of the error bars, you can directly specify `x` and `x2` (or `y` and `y2`) to use error bar as a ranged mark.

<div class="vl-example" data-name="layer_point_errorbar_pre_aggregated_upper_lower"></div>

2. **Data is aggregated with center and error value(s)**

If the data is already pre-aggregated with center and error values of the error bars, you can directly specity `x` as center, `xError` and `xError2` as error values extended from center (or `y`, `yError`, and `yError2`). If `x/yError2` is omitted, error bars have symmetric error values.

Error bar with symmetric error values:

<div class="vl-example" data-name="layer_point_errorbar_pre_aggregated_symmetric_error"></div>

Error bar with asymmetric error values:

<div class="vl-example" data-name="layer_point_errorbar_pre_aggregated_asymmetric_error"></div>

**Note** if error is pre-aggregated with asymmetric error values one of `x/yError` and `x/yError2` has to be positive value and other has to be negative value

## Dimension & Orientation

Vega-Lite supports both 1D and 2D error bars:

{:#1d} A **1D error bar** shows the error range of a continuous field.

<div class="vl-example" data-name="layer_point_errorbar_1d_horizontal"></div>

The orientation of an error bar is automatically determined by the continuous field axis. For example, you can create a vertical 1D error bar by encoding a continuous field on the y axis.

<div class="vl-example" data-name="layer_point_errorbar_1d_vertical"></div>

{:#2d} A **2D error bar** shows the error range of a continuous field, broken down by categories.

For 2D error bars with one continuous field and one discrete field, the error bars will be horizontal if the continuous field is on the x axis.

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal"></div>

Alternatively, if the continuous field is on the y axis, the error bar will be vertical.

<div class="vl-example" data-name="layer_point_errorbar_2d_vertical"></div>

{:#parts}

## The Parts of Error Bars

Under the hood, the `errorbar` mark is a [composite mark](mark.html#composite-marks) that expands into a layered plot. For example, [a basic 1D error bar shown above](#1d) is expanded to:

<div class="vl-example" data-name="normalized/layer_point_errorbar_1d_horizontal_normalized"></div>

We can customize different parts of the error bar [mark definition](#properties) or [config](#config).

For example, we can add the error bar's end ticks and customize it by setting `ticks` to `true` or adding a mark property to `ticks`, such as setting `color` to `"teal"`:

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal_custom_ticks"></div>

## Color, and Opacity Encoding Channels

You can customize the color, size, and opacity of the bar in the `errorbar` by using the `color`, and `opacity` [encoding channels](encoding.html#channels), which applied to the whole `errorbar`.

Here is an example of a `errorbar` with the `color` encoding channel set to `{"value": "#4682b4"}`.

<div class="vl-example" data-name="layer_point_errorbar_2d_horizontal_color_encoding"></div>

## Tooltip Encoding Channels

You can add custom tooltips to error bars. The custom tooltip will override the default error bar's tooltips.

<div class="vl-example" data-name="errorbar_tooltip"></div>

{:#config}

## Mark Config

```js
{
  "errorbar": {
    "extent": ...,
    "rule": ...,
    "ticks": ...
  }
}
```

The `errorbar` config object sets the default properties for `errorbar` marks.

The error bar config can contain all [error bar mark properties](#properties) but currently does not support `color`, `opacity`, and `orient`. Please see issue [#3934](https://github.com/vega/vega-lite/issues/3934) for details.
