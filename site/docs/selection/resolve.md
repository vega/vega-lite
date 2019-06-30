---
layout: docs
menu: docs
title: Resolve Selections in Data-Driven Views
permalink: /docs/selection-resolve.html
---

When a selection is defined within a data-driven view (i.e., a view that is part of a [facet](facet.html) or [repeat](repeat.html)), the desired behaviour can be ambiguous. Consider the scatterplot matrix (SPLOM) example below, which has an interval selection named `brush`. Should there be only one brush across all cells, or should each cell have its own brush? In the latter case, how should points be highlighted in all the other cells?

The aptly named `resolve` property addresses this ambiguity, and can be set to one of the following values (click to apply it to the SPLOM example, and drag out an interval in different cells):

- <a href="javascript:changeSpec('selection_resolution', 'selection_resolution_global')">`global`</a> (**default**) -- only one brush exists for the entire SPLOM. When the user begins to drag, any previous brushes are cleared, and a new one is constructed.

- <a href="javascript:changeSpec('selection_resolution', 'selection_resolution_union')">`union`</a> -- each cell contains its own brush, and points are highlighted if they lie within _any_ of these individual brushes.

- <a href="javascript:changeSpec('selection_resolution', 'selection_resolution_intersect')">`intersect`</a> -- each cell contains its own brush, and points are highlighted only if they fall within _all_ of these individual brushes.

<div id="selection_resolution" class="vl-example" data-name="selection_resolution_global"></div>
