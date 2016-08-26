---
layout: docs
menu: docs
title: Customizing Size
permalink: /docs/size.html
---

At its core, a Vega-Lite specification describes a single plot. When a [facet channel](encoding.html#facet) is added, the visualization is faceted into a trellis plot, which contains multiple sub-plots or _cells_.

## Width and Height of a Single Plot

This includes the width of a single plot or each cell of a trellis plot.

### Explicitly Specified Width and Height

When the top-level `width` property is specified, the width of the single plot is the specified value for all scale types of the x-axis.  Similarly, when the top-level `height` property is specified, the height of the single plot is the specified value for all scale types of the y-axis.

<span class="vl-example" data-name="bar_size_explicit"></span>

**Note**: If numeric `bandSize` for an ordinal x/y-scale is specified when `width` / `height` is specified, the `bandSize` will be overridden with `"fit"`.

**Warning**: If the cardinality of the x/y-field's domain is too high, the `bandSize` might become less than one pixel and the mark might not appear correctly.

<span class="vl-example" data-name="bar_size_explicit_bad"></span>

### Default Width and Height

If the top-level `width` / `height` property is not specified, the width / height of a single plot or each cell of a trellis plot is determined by the properties of the `x` / `y` channel:

- If `x` / `y` axis has a continuous scale (either quantitative or time), the width is drawn directly from the [`config.cell.width`](config.html#cell-config) / [`config.cell.height`](config.html#cell-config) property.

- If the `x` / `y` channel has an ordinal scale with a numeric `bandSize` value (default), the width / height is a product of the scale's [`bandSize`]((scale.html#ordinal)) and the field's cardinality, or number of possible distinct values of the field mapped to the `x` / `y` channel, plus the scale's padding. (_bandWidth * (cardinality + padding)_).

This example shows continuous y-scale and ordinal x-scale:

<span class="vl-example" data-name="bar_size_default"></span>

- If the `x` / `y` channel has an ordinal scale with `bandSize` = `"fit"`, the width / height is drawn directly from the [`config.cell.width`](config.html#cell-config) / [`config.cell.height`](config.html#cell-config) property and the band of the scale will be adjusted to fit to the width.

<span class="vl-example" data-name="bar_size_fit"></span>

- If `x` / `y` is not mapped to a field, the width / height is derived from [config.scale.bandSize](#scale-config) except when the mark is `text`.  In that case, the width will be drawn from [config.scale.textBandWidth](#scale-config).

<span class="vl-example" data-name="bar_1d_bandsize_config"></span>

## Total Width and Height of a Trellis Plots

 The total width of the visualization is the product of the cell's width plus the `column` scale's `padding` and the cardinality of the `column` (_(cellWidth + columnPadding) * columnCardinality_).

 Similarly, the total height of the visualization is the product of the cell's height plus the `row` scale's `padding` and the cardinality of the `row` (_(cellHeight + rowPadding) * rowCardinality_).

<span class="vl-example" data-name="trellis_bar"></span>
