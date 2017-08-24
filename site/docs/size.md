---
layout: docs
menu: docs
title: Customizing Size
permalink: /docs/size.html
---


This page describe how to adjust width and height of visualizations in Vega-lite.

## Documentation Overview

* TOC
{:toc}

## Width and Height of Single and Layered Plots

[Single view](spec.html#single) and [layer](layer.html) specifications can contain `width` and `height` properties for customizing the view size.

### Explicitly Specified Width and Height

When the top-level `width` property is specified, the width of the single plot is the specified value for all scale types of the x-axis.  Similarly, when the top-level `height` property is specified, the height of the single plot is the specified value for all scale types of the y-axis.

<span class="vl-example" data-name="bar_size_explicit"></span>

**Note**: If numeric `rangeStep` for an ordinal x/y-scale is specified when `width` / `height` is specified, the `rangeStep` will be ignored (overridden with `null`).

**Warning**: If the cardinality of the x/y-field's domain is too high, the `rangeStep` might become less than one pixel and the mark might not appear correctly.

<span class="vl-example" data-name="bar_size_explicit_bad"></span>

### Default Width and Height

If the top-level `width` / `height` property is not specified, the width / height of a single view is determined by the properties of the `x` / `y` channel:

- If `x` / `y` axis has a continuous scale (either quantitative or time), the width/height is drawn directly from the [`config.cell.width`](config.html#cell-config) / [`config.cell.height`](config.html#cell-config) property.

- If the `x` / `y` channel has a [discrete scale](scale.html#discrete) (`point` or `band`) with a numeric `rangeStep` value (default), the width / height is is determined based on the scale's `rangeStep`, `paddingInner`, `paddingOuter` and the cardinality of the encoded field (the number of possible distinct values of the field).

<!-- TODO Explain more about the formula-->

This example shows a plot with a continuous y-scale and a discrete x-scale:

<span class="vl-example" data-name="bar_size_default"></span>

- If the `x` / `y` channel has a discrete scale with `rangeStep` = `null`, the width / height is drawn directly from the [`config.cell.width`](config.html#cell-config) / [`config.cell.height`](config.html#cell-config) property and the band of the scale will be adjusted to fit to the width.

<span class="vl-example" data-name="bar_size_fit"></span>

- If `x` / `y` is not mapped to a field, the width / height is derived from [config.scale.rangeStep](#scale-config) except for the width when the mark is `text`.  In that case, the width will be drawn from [config.scale.textXRangeStep](#scale-config).

For example, the following plot use `21` as a default height.

<span class="vl-example" data-name="bar_1d_rangestep_config"></span>

## Width and Height of Multi-View Displays

Currently, width and height of multi-view displays including [concatanated](concat.html), [faceted](facet.html), and [repeated](repeat.html) are determined based on the size of the composed unit and layered views.  To adjust the size of multi-view displays, you can `width` and `height` of the inner unit and layered views.

For example, you can adjust `width` and `height` of the inner single view specification to adjust the size of a faceted plot.

<span class="vl-example" data-name="normalized/trellis_scatter_small_normalized"></span>

__Note:__ If you use the `row` or `column` channel to create a faceted plot, `width` and `height` will be applied to the inner single-view plot.
For example, this specification is equilvalent to the specification above.

<span class="vl-example" data-name="trellis_scatter_small"></span>
