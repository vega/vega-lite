---
layout: docs
menu: docs
title: Composite Mark
permalink: /docs/compositemark.html
---

Composite marks are "macros" for more complex layered graphics with multiple primitive marks. Composite marks are "macros" because under the hood they expand to become layered graphics. Currently, we include only one composite mark type: `boxplot`.

{:#boxplot}
## Box Plot

`boxplot` composite mark represents a [box plot](https://en.wikipedia.org/wiki/Box_plot). The middle tick in the box represents the median. The lower and upper part of the box represents the first and third quartile respectively. The ends of the whiskers can represent several possible alternative values, depending on the [`extent`](#boxplot-types) property.

`boxplot` is important because it effectively and quickly shows a summary of data with a five-number summary (lower and upper parts of the box, mid tick in the box, and the lower and upper whiskers). It is a great visualization choice to indicate whether the distribution is skewed.
<!-- TODO: Ideally we should have an annotated figure for this, but let's not do it for now-->

To create a box plot, you can set `mark` to `"boxplot"`:

{: .suppress-error}
```json
{
  ...
  "mark": "boxplot",
  ...
}
```

Alternatively, you can use box plot's mark definition object, which supports the following properties:

{% include table.html props="type,extent,orient" source="BoxPlotDef" %}

### Basic Usage
{:#boxplot-types}

Vega-Lite supports two types of box plots, defined by the `extent` property in the mark definition object.

1) __`min-max` Box Plot__, which is a box plot where lower and upper whiskers are defined as the min and max respectively.

{: .suppress-error}
```json
"mark": {
  "type": "boxplot",
  "extent": "min-max"
}
```
<div class="vl-example" data-name="box-plot_minmax_2D_horizontal"></div>

If `extent` is not specified, this type of box plot will be used. Thus, we can just set the `mark` to `"boxplot"`:

<div class="vl-example" data-name="box-plot_minmax_1D_horizontal"></div>


2) __Tukey Box Plot__, which is a box plot where the whisker spans from _Q1 - k * IQR_ to _Q3 + k * IQR_ where _Q1_ and _Q3_ are the first and third quartiles while _IQR_ is the interquartile range (_Q3-Q1_). In this type of box plot, you can specify the constant  `k` which is typically `1.5`.

```json
"mark": {
  "type": "boxplot",
  "extent": 1.5
}
```

<div class="vl-example" data-name="box-plot_minmax_2D_horizontal_IQR"></div>

### Dimension
There are two `boxplot` dimensions, one dimension (1D) and two dimension (2D).

1D `boxplot` are used to see the distribution of a continuous field.
<div class="vl-example" data-name="box-plot_minmax_1D_horizontal"></div>

2D `boxplot` are used to see the distribution of a continuous field, broken down by categories.
<div class="vl-example" data-name="box-plot_minmax_2D_horizontal"></div>

### Orientation

Box plot's orientation is automatically determined by the continuous field axis.
For example, you can create a vertical 1D box plot by encoding a continuous field on the y axis.

<div class="vl-example" data-name="box-plot_minmax_1D_vertical"></div>

For 2D box plots with one continuous and one discrete fields,
the box plot will be horizontal if the continuous field is on the x axis.

<div class="vl-example" data-name="box-plot_minmax_2D_horizontal"></div>

Similarly, if the continuous field is on the y axis, the box plot will be vertical.

<div class="vl-example" data-name="box-plot_minmax_2D_vertical"></div>

### Customizing Box Plots

#### Color, Size, and Opacity Encoding Channels

You can customize the color, size, and opacity of the box in the `boxplot` by using the `color`, `size`, and `opacity` [encoding channels](encoding.html#channels).

An example of a `boxplot` where the `size` encoding channel is specified.
<div class="vl-example" data-name="box-plot_minmax_2D_vertical"></div>

<div class="vl-example" data-name="box-plot_minmax_2D_horizontal_color_size"></div>

#### Role Config

To customize different parts of the box, we can use roles config to customize different parts of the box plot (`box`, `boxWhisker`, `boxMid`).

{: .suppress-error}
```json
{
  "config": {
    "box": ...,
    "boxWhiskers": ...,
    "boxMid": ...
  }
}
```
<div class="vl-example" data-name="box_plot_minmax_2D_horizontal_custom_midtick_color"></div>

These are possible because under the hood, the `"boxplot"` mark is a macro that expands into a layered plot.  For example, [a basic 1D boxplot shown above](#boxplot-type) is expanded to:

<div class="vl-example" data-name="normalized/box-plot_minmax_1D_horizontal"></div>

### `aggregate` Property for Box Plots

Note that `aggregate` property of the continuous field is implicitly `boxplot`.
For example, [a basic 1D boxplot shown above](#boxplot-type) is equivalent to:
<div class="vl-example" data-name="box-plot_minmax_2D_vertical_explicit_aggregate"></div>
