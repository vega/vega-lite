---
layout: docs
menu: docs
title: Customizing Size
permalink: /docs/size.html
---

At its core, a Vega-Lite specification describes a single plot. When a [facet channel](encoding.html#facet) is added, the visualization is faceted into a trellis plot, which contains multiple sub-plots or _cells_.

## Width and Height of a Single Plot

The width of a single plot or each cell of a trellis plot is determined by the properties of the `x` channel:

- If the `x` channel has an ordinal scale, the width is a product of the scale's [`bandSize`]((scale.html#ordinal)) and the field's cardinality, or number of possible distinct values of the field mapped to the `x` channel, plus the scale's padding. (_bandWidth * (xCardinality + xPadding)_).
- If `x` has a continuous scale (either quantitative or time), the width is drawn directly from the `width` property of the [cell configuration](config.html#cell-config).
- If `x` is not mapped to a field, the width is derived from [scale config](#scale-config)'s `bandSize` for all marks except `text` and from [scale config](#scale-config)'s `textBandWidth` for `text` mark.

Similarly, the height of a single plot or each cell of a trellis plot is determined by the properties of the `y` channel:

- If the `y` channel has an ordinal scale, the height is a product of the scale's [`bandSize`]((scale.html#ordinal)) and the field's cardinality, or number of possible distinct values of the field mapped to the `y` channel, plus the scale's padding. (_bandHeight * (yCardinality + yPadding)_).
- If `y` has a continuous scale (either quantitative or time), the height is drawn directly from the `height` property of the [cell configuration](config.html#cell-config).
- If `y` is not mapped to a field, the height is derived from [scale config](#scale-config)'s `bandSize`.

## Total Width and Height of a Trellis Plots

 The total width of the visualization is the product of the cell's width plus the `column` scale's `padding` and the cardinality of the `column` (_(cellWidth + columnPadding) * columnCardinality_).

 Similarly, the total height of the visualization is the product of the cell's height plus the `row` scale's `padding` and the cardinality of the `row` (_(cellHeight + rowPadding) * rowCardinality_).
