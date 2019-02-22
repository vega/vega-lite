---
layout: docs
menu: docs
title: Customizing Size
permalink: /docs/size.html
---

This page describe how to adjust width and height of visualizations in Vega-lite.

## Documentation Overview

{:.no_toc}

<!-- prettier-ignore -->
- TOC
{:toc}

## Width and Height of Single and Layered Plots

[Single view](spec.html#single) and [layer](layer.html) specifications can contain `width` and `height` properties for customizing the view size. By default, `width` and `height` set the size of the data rectangle (plotting) dimensions. To set the overall size of the visualization, the [`autosize`](#autosize) property can be specified.

### Explicitly Specified Width and Height

When the top-level `width` property is specified, the width of the single plot is the specified value for all scale types of the x-axis. Similarly, when the top-level `height` property is specified, the height of the single plot is the specified value for all scale types of the y-axis.

<span class="vl-example" data-name="bar_size_explicit"></span>

**Note**: If numeric `rangeStep` for a discrete x/y-scale is specified when `width` / `height` is specified, the `rangeStep` will be ignored (overridden with `null`).

**Warning**: If the cardinality of the x/y-field's domain is too high, the `rangeStep` might become less than one pixel and the mark might not appear correctly.

<span class="vl-example" data-name="bar_size_explicit_bad"></span>

### Default Width and Height

If the top-level `width` / `height` property is not specified, the width / height of a single view is determined by the properties of the `x` / `y` channel:

- If (1) the view's [`autosize`](#autosize) type is `"fit"` or (2) the `x` / `y` axis has a continuous scale (either quantitative or time) or a discrete scale with `rangeStep` = `null`, the width/height is drawn directly from the [`config.view.width`](spec.html#config) / [`config.view.height`](spec.html#config) property.

- If the [`autosize`](#autosize) type is not `"fit"` and the `x` / `y` channel has a [band or point scale](scale.html#band) in which `rangeStep` is a number or unspecified, the width / height is [determined based on the scale's range step, paddings, and the cardinality of the encoded field (the number of possible distinct values of the field)](scale.html#band).

This example shows a plot with a continuous y-scale and a discrete x-scale:

<span class="vl-example" data-name="bar_size_default"></span>

- If the `x` / `y` channel has a discrete scale with `rangeStep` = `null`, the width / height is drawn directly from the [`config.view.width`](spec.html#config) / [`config.view.height`](spec.html#config) property and the band of the scale will be adjusted to fit to the width.

<span class="vl-example" data-name="bar_size_fit"></span>

- If `x` / `y` is not mapped to a field, the width / height is derived from [config.scale.rangeStep](#scale-config) except for the width when the mark is `text`. In that case, the width will be drawn from [config.scale.textXRangeStep](#scale-config).

For example, the following plot use `21` as a default height.

<span class="vl-example" data-name="bar_1d_rangestep_config"></span>

### Autosize

The specified dimensions of a chart as explained above set the size of the data rectangle (plotting) dimensions. You can override this behavior by setting the autosize property in [the top level specification](spec.html#top-level). Please note the [limitations below](#limitations).

The autosize property can be a string or an object with the following properties:

{% include table.html props="type,resize,contains" source="AutoSizeParams" %}

The total size of a Vega-Lite visualization may be determined by multiple factors: specified _width_, _height_, and _padding_ values, as well as content such as axes, legends, and titles. To support different use cases, there are three different _autosize_ types for determining the final size of a visualization view:

- `none`: No automatic sizing is performed. The total visualization size is determined solely by the provided width, height and padding values. For example, by default the total width is calculated as `width + padding.left + padding.right`. Any content lying outside this region will be clipped. If _autosize.contains_ is set to `"padding"`, the total width is instead simply _width_.
- `pad`: Automatically increase the size of the view such that all visualization content is visible. This is the default _autosize_ setting, and ensures that axes, legends and other items outside the normal width and height are included. The total size will often exceed the specified width, height, and padding.
- `fit`: Automatically adjust the layout in an attempt to force the total visualization size to fit within the given width, height and padding values. This setting causes the plotting region to be made smaller in order to accommodate axes, legends and titles. As a result, the value of the _width_ and _height_ signals may be changed to modify the layout. Though effective for many plots, the `fit` method can not always ensure that all content remains visible. For example, if the axes and legends alone require more space than the specified width and height, some of the content will be clipped. Similar to `none`, by default the total width will be `width + padding.left + padding.right`, relative to the original, unmodified _width_ value. If _autosize.contains_ is set to `"padding"`, the total width will instead be the original _width_.

#### Limitations

In order to `fit` a chart into specified dimensions, it has to satisfy two requirements:

- The view must be either a [single](spec.html#single) view or a [layered](layer.html) view. Fit does not work with other kinds of composed views (`facet`/`hconcat`/`vconcat`/`repeat`).
- The width and height of the chart cannot depend on an explicitly specified `rangeStep` of a discrete scale. Any specified `rangeStep` will be ignored.

#### Example

Below is an example of a bar chart that fits exactly into 300px width.

<span class="vl-example" data-name="bar_fit"></span>

## Width and Height of Multi-View Displays

Currently, width and height of multi-view displays including [concatenated](concat.html), [faceted](facet.html), and [repeated](repeat.html) are determined based on the size of the composed unit and layered views. To adjust the size of multi-view displays, you can `width` and `height` of the inner unit and layered views.

For example, you can adjust `width` and `height` of the inner single view specification to adjust the size of a faceted plot.

<span class="vl-example" data-name="normalized/trellis_point_small_normalized"></span>

**Note:** If you use the `row` or `column` channel to create a faceted plot, `width` and `height` will be applied to the inner single-view plot. For example, this specification is equivalent to the specification above.

<span class="vl-example" data-name="trellis_point_small"></span>
