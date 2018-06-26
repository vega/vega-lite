---
layout: docs
menu: docs
title: Error Band
permalink: /docs/errorband.html
---

{: .suppress-error}
```json
// Single View Specification
{
  "data": ... ,
  "mark": "errorband",
  "encoding": ... ,
  ...
}
```

An error band summarizes an error range of quantitative values using a set of summary statistics, representing by area.
Error band in Vega-Lite can either be used to aggregate raw data or directly visualize aggregated data.

To create an error band, set `mark` to `"errorband"`.

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

{:#properties}
## Error Band Mark Properties

An error band's mark definition contain the following properties:

{% include table.html props="type,extent,orient,color,opacity" source="ErrorBandDef" %}

Besides the properties listed above, `band` and `borders` can be used to specify the underlying [mark properties](mark.html#mark-def) for different [parts of the error band](#parts) as well.

{:#compare-to-errorbar}
## Comparing the usage of Error Band to the usage of Error Bar

All the properties and usage of error band are identical to error bar's, except the `band` and `borders` that replace the error bar's `rule` and `ticks`.

#### Error Band
<div class="vl-example" data-name="errorband_2d_vertical_borders"></div>

#### Error Bar
<div class="vl-example" data-name="errorbar_2d_vertical_ticks"></div>


{:#raw-usage}
## Using Error Band to Aggregate Raw Data

If the data is not aggregated yet, Vega-Lite will aggregate the data based on the `extent` properties in the mark definition, like in [Error Bar](errorbar.html#raw-usage).


{:#pre-aggregated-usage}
## Using Error Band to Visualize Aggregated Data

If the data is already pre-aggregated with low and high values of the error band, you can directly specify `x` and `x2` (or `y` and `y2`), like in [Error Bar](errorbar.html#pre-aggregated-usage).


## Dimension
Vega-Lite supports both 1D and 2D error bands:

{:#1d}
A __1D error band__ shows the error range of a continuous field; it can be used with a scatter plot to show the error range of the whole plot.
<div class="vl-example" data-name="layer_scatter_errorband_1d_stdev"></div>

{:#2d}
A __2D error band__ shows the error range of a continuous field, broken down by categories.
<div class="vl-example" data-name="layer_line_errorband_ci"></div>


{:#parts}
## The Parts of Error Band

Under the hood, the `errorband` mark is a [composite mark](mark.html#composite-marks) that expands into a layered plot.  For example, [a basic 2D error band shown above](#2d) is expanded to:

<div class="vl-example" data-name="normalized/layer_line_errorband_ci_normalized"></div>

We can customize different parts of the error band [mark definition](#properties) or [config](#config).

For example, we can add the error band's borders and customize it by setting `borders` to `true` or adding a mark property to `borders`, such as setting `color` to `"black"`:

<div class="vl-example" data-name="layer_line_errorband_2d_horizontal_borders_strokedash"></div>

## Color, and Opacity Encoding Channels

You can customize the color, size, and opacity of the band in the `errorband` by using the `color`, and `opacity` [encoding channels](encoding.html#channels), which applied to the whole `errorband`.

Here is an example of a `errorband` with the `color` encoding channel set to `{"value": "black"}`.

<div class="vl-example" data-name="errorband_2d_horizontal_color_encoding"></div>


{:#config}
## Mark Config
{: .suppress-error}
```json
{
  "errorband": {
    "size": ...,
    "extent": ...,
    "rule": ...,
    "ticks": ...
  }
}
```

The `errorband` config object sets the default properties for `errorband` marks.

The error band config can contain all [error band mark properties](#properties) except `orient`.

