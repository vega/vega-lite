---
layout: docs
menu: docs
title: Customizing Size
permalink: /docs/size.html
---

## Unit Width and Height

At its core, a Vega-Lite specification describes a single plot, or a _unit visualization_.  

The width of a unit visualization are determined based on the following rules:
- If `x` channel has an ordinal scale, the width is a product of the scale's [`bandWidth`]((scale.html#ordinal)) and the field's cardinality, or number of possible distinct values of the field mapped to `x` channel, plus padding.  
- If `x` has a continuous scale (either quantitative or time), the width is drawn directly from `width` property of the [unit configuration](config.html#unit-config).   
- If `x` is not mapped to a field, the width is derived from [scale config](#scale-config)'s  `bandWidth`.

The unit visualization's height is determined by properties of the `y` channel in a similar fashion.  

## Width and Height of a Trellis Plots

When a [facet channel](encoding.html#facet) (`row` or `column`) is added, the visualization is faceted into a trellis plot, which contains multiple repeated sub-units.

Vega-Lite currently uses bottom-up approach for generating visualization layout.

- The total width of the visualization is the product of the unit visualization's width plus the `column` scale's `padding` and the cardinality of the `column` (_(unitWidth + columnPadding) * columnCardinality_).

- Similarly, the total height of the visualization is the product of the unit visualization's height plus the `row` scale's `padding` and the cardinality of the `row` (_(unitHeight + rowPadding) * rowCardinality_).
