---
layout: docs
menu: docs
title: Error Band
permalink: /docs/errorband.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "errorband",
  "encoding": ... ,
  ...
}
```

An error band summarizes an error range of quantitative values using a set of summary statistics, representing by area. Error band in Vega-Lite can either be used to aggregate raw data or directly visualize aggregated data.

To create an error band, set `mark` to `"errorband"`.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#properties}

## Error Band Mark Properties

An error band's mark definition can contain the following properties:

{% include table.html props="type,extent,orient,color,opacity,interpolate,tension" source="ErrorBandDef" %}

Besides the properties listed above, `band` and `borders` can be used to specify the underlying [mark properties](mark.html#mark-def) for different [parts of the error band](#parts) as well.

{:#compare-to-errorbar}

## Comparing the usage of Error Band to the usage of Error Bar

All the properties and usage of error band are identical to error bar's, except the `band` and `borders` that replace the error bar's `rule` and `ticks`.

{:#errorband-ex}

#### Error Band

<div class="vl-example" data-name="errorband_2d_vertical_borders"></div>

#### Error Bar

<div class="vl-example" data-name="errorbar_2d_vertical_ticks"></div>

{:#raw-usage}

## Using Error Band to Aggregate Raw Data

If the data is not aggregated yet, Vega-Lite will aggregate the data based on the `extent` properties in the mark definition as done in the [error band showing confidence interval](#errorband-ex) above. All other `extent` values are defined in [Error Bar](errorbar.html#raw-usage).

{:#pre-aggregated-usage}

## Using Error Band to Visualize Aggregated Data

1. **Data is aggregated with low and high values of the error band**

If the data is already pre-aggregated with low and high values of the error band, you can directly specify `x` and `x2` (or `y` and `y2`) to use error band as a ranged mark.

<div class="vl-example" data-name="layer_line_errorband_pre_aggregated"></div>

2. **Data is aggregated with center and error value(s)**

If the data is already pre-aggregated with center and error values of the error band, you can use `x/y`, `x/yError`, and `x/yError2` as defined in [Error Bar](errorbar.html#pre-aggregated-usage)

## Dimension

Vega-Lite supports both 1D and 2D error bands:

{:#1d} A **1D error band** shows the error range of a continuous field; it can be used to show the global error range of the whole plot.

<div class="vl-example" data-name="layer_scatter_errorband_1d_stdev"></div>

{:#2d} A **2D error band** shows the error range of a continuous field for each dimension value such as year.

<div class="vl-example" data-name="layer_line_errorband_ci"></div>

{:#parts}

## The Parts of Error Band

Under the hood, the `errorband` mark is a [composite mark](mark.html#composite-marks) that expands into a layered plot. For example, [the basic 2D error band shown above](#2d) is equivalent to:

<div class="vl-example" data-name="normalized/layer_line_errorband_ci_normalized"></div>

We can customize different parts of the error band [mark definition](#properties) or [config](#config).

For example, we can add the error band's borders and customize it by setting `borders` to `true` or adding a mark property to `borders`, such as `strokeDash` and `opacity`:

<div class="vl-example" data-name="layer_line_errorband_2d_horizontal_borders_strokedash"></div>

## Color, and Opacity Encoding Channels

You can customize the color, size, and opacity of the band in the `errorband` by using the `color`, and `opacity` [encoding channels](encoding.html#channels), which applied to the whole `errorband`.

Here is an example of a `errorband` with the `color` encoding channel set to `{"value": "black"}`.

<div class="vl-example" data-name="errorband_2d_horizontal_color_encoding"></div>

{:#config}

## Tooltip Encoding Channels

You can add custom tooltips to error bands. The custom tooltip will override the default error band's tooltips.

<div class="vl-example" data-name="errorband_tooltip"></div>

## Mark Config

```js
{
  "errorband": {
    "extent": ...,
    "band": ...,
    "borders": ...
  }
}
```

The `errorband` config object sets the default properties for `errorband` marks.

The error band config can contain all [error band mark properties](#properties) but currently not supporting `color`, `opacity`, and `orient`. Please see issue [#3934](https://github.com/vega/vega-lite/issues/3934).
