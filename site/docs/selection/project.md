---
layout: docs
menu: docs
title: Project a Selection
permalink: /docs/project.html
---

A [selection's type](selection.html#selection-types) determines which data values fall within it by default:

- For `single` and `multi` selections, only values that have been directly interacted with (i.e., those that have been clicked on) are considered to be "selected."
- For `interval` selections, values that fall within _both_ the horizontal (`x`) and vertical (`y`) extents are considered to be "selected."

These default inclusion criteria can be modified with the **project** selection transformation, which offers the following two properties:

{% include table.html props="encodings,fields" source="SingleSelection" %}

## Examples

In the scatterplot example below, use the project transformation to highlight <select name="point" onchange="buildProjection('point')"><option value="single">a single</option><option value="multi">multiple</option></select>: <label onclick="buildProjection('point')"><input type="checkbox" name="point" value="cylinders" />Number(s) of Cylinders</label> <label onclick="buildProjection('point')"><input type="checkbox" name="point" value="origin" />Origin(s)</label>.

<div id="point" class="vl-example" data-name="selection_project_single"></div>

With interval selections, the project transformation can be used to restrict the region to just the <label onclick="buildProjection('interval')"><input type="checkbox" name="interval" value="x" />horizontal (`x`)</label> and/or <label onclick="buildProjection('interval')"><input type="checkbox" name="interval" value="y" />vertical (`y`)</label> dimensions.

<div id="interval" class="vl-example" data-name="selection_project_interval"></div>

## Current Limitations

- Selections projected over aggregated `fields`/`encodings` can only be used within the same view they are defined in.
- Interval selections can only be projected using `encodings`.
- Interval selections projected over binned or `timeUnit` fields remain continuous selections. Thus, if the visual encoding discretizes them, conditional encodings will no longer work. Instead, use a layered view as shown in the example below. The bar mark discretizes the binned `Acceleration` field. As a result, to highlight selected bars, we use a second layered view rather than a conditional color encoding within the same view.

<div class="vl-example" data-name="selection_project_binned_interval"></div>

<script type="text/javascript">
function buildProjection(id) { buildSpecOpts(id, 'selection_project_'); }
</script>
