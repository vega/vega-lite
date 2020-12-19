---
layout: docs
menu: docs
title: Customizing Size
permalink: /docs/size.html
---

This page describe how to adjust width and height of visualizations in Vega-Lite.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Width and Height of Single and Layered Plots

[Single view](spec.html#single) and [layer](layer.html) specifications can contain the `width` and `height` properties for customizing the view size. By default, `width` and `height` set the size of the data rectangle (plotting) dimensions. To set the overall size of the visualization, the [`autosize`](#autosize) property can be specified.

### Default Width and Height

If the top-level `width` / `height` property is not specified, the width / height of a single view is determined based on the view config.

The width will be based on `config.view.continuousWidth` for a plot with a continuous x-field (`200` by default). For a plot with either a discrete x-field or no x-field, the width is based on `config.view.discreteWidth`, which is set to have step width based on the default step size (`config.view.step` -- `20` by default).

Similarly, the height will be based on `config.view.continuousHeight` for a plot with a continuous y-field and `config.view.discreteHeight` for a plot with either a discrete y-field or no y-field.

For example, the following bar chart has a fixed 200px height and a 20px width per x-field's discrete step.

<span class="vl-example" data-name="bar_size_default"></span>

### Specifying Fixed Width and Height

The view `width` and `height` property can be set to numbers indicating fixed width and height of the plot.

For a discrete axis, specifying a fixed size (e.g., width in the following plot) would automatically scale the discrete step to fit the size.

<span class="vl-example" data-name="bar_size_fit"></span>

**Warning**: If the cardinality of a discrete x- or y-field is too high, the plot might become too packed.

<span class="vl-example" data-name="bar_size_explicit_bad"></span>

### Specifying Responsive Width and Height

You can set the top-level `width` or `height` properties to `"container"` to indicate that the width or height of the plot should be the same as its surrounding container. The `width` and `height` can be set independently, for example, you can have a responsive `width` and a fixed `height` by setting `width` to `"container"` and `height` to a number.

After setting `width` or `height` to `"container"`, you need to ensure that the container's width or height is determined outside the plot. For example, the container can be a `<div>` element that has style `width: 100%; height: 300px`. When the container is not available or its size is not defined (e.g., in server-side rendering), the default width and height are `config.view.continuousWidth` and `config.view.continuousHeight`, respectively.

<span class="vl-example vl-example-responsive" data-name="bar_size_responsive"></span>

**Limitations:**

- This responsive mode is available only for single view or layer specifications.
- Vega listens to the `window.resize` event to update plot size from container size. This should cover many use cases. However, if you change the container size programmatically (e.g., you build a custom divider view), you'll need to trigger `window.resize` manually. In a modern browser, you can do: `window.dispatchEvent(new Event('resize'));`.

### Specifying Width and Height per Discrete Step

For a discrete x-field or discrete y-field, we can also set `width` (or `height`) to be an object indicating the width (or height) per discrete `step`.

<span class="vl-example" data-name="bar_size_step_small"></span>

**Note:** By default, Vega-Lite sets padding for [band and point scales](scale.html#band) such that _width/height = number of unique values \* step_. See [the scale documentation](scale.html#band) to read more about the relationship among width/height, step, and other scale properties.

### Autosize

The specified dimensions of a chart as explained above set the size of the data rectangle (plotting) dimensions. You can override this behavior by setting the autosize property in [the top level specification](spec.html#top-level). Please note the [limitations below](#limitations).

Note that for performance reasons Vega-Lite doesn't re-calculate layouts on every view change by default. If your view is cut off after the view updates, you can either set `resize` to `true` or manually call `view.resize()` through the [Vega view API](https://vega.github.io/vega/docs/api/view/#view_resize).

The autosize property can be a string or an object with the following properties:

{% include table.html props="type,resize,contains" source="AutoSizeParams" %}

The total size of a Vega-Lite visualization may be determined by multiple factors: specified _width_, _height_, and _padding_ values, as well as content such as axes, legends, and titles. To support different use cases, there are three different _autosize_ types for determining the final size of a visualization view:

- `none`: No automatic sizing is performed. The total visualization size is determined solely by the provided width, height and padding values. For example, by default the total width is calculated as `width + padding.left + padding.right`. Any content lying outside this region will be clipped. If _autosize.contains_ is set to `"padding"`, the total width is instead simply _width_.
- `pad`: Automatically increase the size of the view such that all visualization content is visible. This is the default _autosize_ setting, and ensures that axes, legends and other items outside the normal width and height are included. The total size will often exceed the specified width, height, and padding.
- `fit`: Automatically adjust the layout in an attempt to force the total visualization size to fit within the given width, height and padding values. This setting causes the plotting region to be made smaller in order to accommodate axes, legends and titles. As a result, the value of the _width_ and _height_ signals may be changed to modify the layout. Though effective for many plots, the `fit` method can not always ensure that all content remains visible. For example, if the axes and legends alone require more space than the specified width and height, some of the content will be clipped. Similar to `none`, by default the total width will be `width + padding.left + padding.right`, relative to the original, unmodified _width_ value. If _autosize.contains_ is set to `"padding"`, the total width will instead be the original _width_.
- `fit-x`: Automatically adjust the layout in an attempt to force the total visualization size to fit within the given width and left and right padding values.
- `fit-y`: Automatically adjust the layout in an attempt to force the total visualization size to fit within the given height and top and bottom padding values.

#### Limitations

In order to `fit` a chart into specified dimensions, it has to satisfy two requirements:

- The view must be either a [single](spec.html#single) view or a [layered](layer.html) view. Fit does not work with other kinds of composed views (`facet`/`hconcat`/`vconcat`/`repeat`).
- The width and height of the chart cannot depend on an explicitly specified `step` of a discrete scale. Discrete scale `step` has higher precendence than `fit`, and the respective channel of fit will be dropped. E.g., an explicit `step` on a `width` will drop `x` from `fit` and make it `fit-y`.

#### Example

Below is an example of a bar chart that fits exactly into 300px width and the default 200px height.

<span class="vl-example" data-name="bar_fit"></span>

## Width and Height of Multi-View Displays

The width and height of multi-view displays including [concatenated](concat.html), [faceted](facet.html), and [repeated](repeat.html) are determined based on the size of the composed unit and layered views. To adjust the size of multi-view displays, you can set the `width` and `height` properties of the inner unit and layered views.

For example, you can adjust `width` and `height` of the inner single view specification to adjust the size of a faceted plot.

<span class="vl-example" data-name="normalized/trellis_scatter_small_normalized"></span>

**Note:** If you use the `row` or `column` channel to create a faceted plot, `width` and `height` will be applied to the inner single-view plot. For example, this specification is equivalent to the specification above.

<span class="vl-example" data-name="trellis_scatter_small"></span>
