---
layout: docs
menu: docs
title: Selection Parameters
permalink: /docs/selection.html
---

```js
// A Single View Specification
{
  ...,
  "params": [  // An array of named parameters.
    {
      "name": ...,
      "select": { // Selection
        "type": ...,
        ...
      }
    }
  ],
  "mark": ...,
  "encoding": ...,
  ...
}
```

Selection parameters define _data queries_ that are driven by direct manipulation user input (e.g., mouse clicks or drags). A parameter becomes a selection when the `select` property is specified. This page discusses different properties of a selection.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#selection-props}

## Common Selection Properties

{:#selection-on}

For both selection types, the `select` object can take the following properties:

{% include table.html props="type,encodings,fields,on,clear,resolve" source="PointSelectionConfig" %}

### `type`

A [selection's type](parameter.html#select) determines which data values fall within it by default:

- For `point` selections, only values that have been directly interacted with (e.g., those that have been clicked on) are considered to be "selected."
- For `interval` selections, values that fall within _both_ the horizontal (`x`) and vertical (`y`) extents are considered to be "selected."

{:#project}

### Selection Projection with `encodings` and `fields`

In the scatterplot example below, highlight <select name="point" onchange="buildProjection('point')"><option value="multi">multiple</option><option value="single">a single</option></select>: <label onclick="buildProjection('point')"><input type="checkbox" name="point" value="cylinders" />Cylinder(s)</label> <label onclick="buildProjection('point')"><input type="checkbox" name="point" value="origin" />Origin(s)</label>.

<div id="point" class="vl-example" data-name="selection_project_multi"></div>

With interval selections, we can use the projection to restrict the region to just the <label onclick="buildProjection('interval')"><input type="checkbox" name="interval" value="x" />horizontal (`x`)</label> and/or <label onclick="buildProjection('interval')"><input type="checkbox" name="interval" value="y" />vertical (`y`)</label> dimensions.

<div id="interval" class="vl-example" data-name="selection_project_interval"></div>

#### Current Limitations

- Selections projected over aggregated `fields`/`encodings` can only be used within the same view they are defined in.
- Interval selections can only be projected using `encodings`.
- Interval selections projected over binned or `timeUnit` fields remain continuous selections. Thus, if the visual encoding discretizes them, conditional encodings will no longer work. Instead, use a layered view as shown in the example below. The bar mark discretizes the binned `Acceleration` field. As a result, to highlight selected bars, we use a second layered view rather than a conditional color encoding within the same view.

<div class="vl-example" data-name="selection_project_binned_interval"></div>

<script type="text/javascript">
function buildProjection(id) { buildSpecOpts(id, 'selection_project_'); }
</script>

### `on`

The `on` property modifies the event that triggers the selection.

For instance, a single rectangle in the heatmap below can now be selected on mouse hover instead.

<div class="vl-example" data-name="selection_type_single_mouseover"></div>

### `clear`

The `clear` property identifies which events must fire to empty a selection of all selected values (the [`empty`](selection.html#selection-properties) property can be used to further determine the behavior of empty selections).

The following visualization demonstrates the default clearing behavior: select a square on click and clear out the selection on double click.

<div class="vl-example" data-name="selection_heatmap"></div>

The following example clears the brush when the mouse button is released.

<div class="vl-example" data-name="selection_clear_brush"></div>

Note, in the above example, clearing out the selection does _not_ reset it to its initial value. Instead, when the mouse button is released, the selection is emptied of all values. This behavior is subtly different to when the selection is [bound to scales](bind.html#scale-binding) -- clearing the selection out now resets the view to use the initial scale domains. Try it out below: pan and zoom the plot, and then double click.

<div class="vl-example" data-name="selection_translate_scatterplot_drag"></div>

### `resolve`

When a selection is defined within a data-driven view (i.e., a view that is part of a [facet](facet.html) or [repeat](repeat.html)), the desired behaviour can be ambiguous. Consider the scatterplot matrix (SPLOM) example below, which has an interval selection named `brush`. Should there be only one brush across all cells, or should each cell have its own brush? In the latter case, how should points be highlighted in all the other cells?

The aptly named `resolve` property addresses this ambiguity, and can be set to one of the following values (click to apply it to the SPLOM example, and drag out an interval in different cells):

- <a href="javascript:changeSpec('selection_resolution', 'selection_resolution_global')">`global`</a> (**default**) -- only one brush exists for the entire SPLOM. When the user begins to drag, any previous brushes are cleared, and a new one is constructed.

- <a href="javascript:changeSpec('selection_resolution', 'selection_resolution_union')">`union`</a> -- each cell contains its own brush, and points are highlighted if they lie within _any_ of these individual brushes.

- <a href="javascript:changeSpec('selection_resolution', 'selection_resolution_intersect')">`intersect`</a> -- each cell contains its own brush, and points are highlighted only if they fall within _all_ of these individual brushes.

<div id="selection_resolution" class="vl-example" data-name="selection_resolution_global"></div>

{:#point}

## Point Selection Properties

In addition to all [common selection properties](#selection-props), point selections support the following properties:

{% include table.html props="toggle,nearest" source="PointSelectionConfig" %}

### `toggle`

The `toggle` property customizes how user interaction can insert or remove data values from a point selection if they are or are not already members of the selection, respectively.

For example, you can highlight points in the scatterplot below by <select name="toggle" onchange="buildToggle(true)"><option value="toggle">toggling</option><option value="insert">inserting</option></select> into the `paintbrush` selection when clicking<span id="toggle-expl"> with: <br> <label onclick="buildToggle()"><input type="checkbox" name="toggle" value="shiftKey" checked="checked" />`event.shiftKey`</label> <label onclick="buildToggle()"><input type="checkbox" name="toggle" value="altKey" />`event.altKey`</label></span>.

<div id="toggle" class="vl-example" data-name="selection_toggle_shiftKey"></div>

<script type="text/javascript">
function buildToggle(changeType) {
  const type = document.querySelector('select[name=toggle]');
  const expl = document.getElementById('toggle-expl');
  const inputs = document.querySelectorAll('input[name=toggle]');

  if (!changeType && !inputs[0].checked && !inputs[1].checked) {
    type.value = 'insert';
    changeType = true;
  }

  if (changeType) {
    if (type.value === 'toggle') {
      expl.style.display = 'inline';
      inputs[0].checked = true;
      inputs[1].checked = false;
    } else {
      expl.style.display = 'none';
      inputs[0].checked = inputs[1].checked = false;
    }
  }

  buildSpecOpts('toggle', 'selection_');
}
</script>

### Nearest

The `nearest` propery accelerates user selection with an invisible voronoi diagram.

For example, in the scatterplot below, points <select onchange="changeSpec('paintbrush_nearest', 'interactive_paintbrush_color' + this.value)"><option value="_nearest">nearest</option><option value="">directly underneath</option></select> the mouse cursor are highlighted as it moves.

<div id="paintbrush_nearest" class="vl-example" data-name="interactive_paintbrush_color_nearest"></div>

The `nearest` transform also respects any [position encoding projections](project.html) applied to the selection. For instance, in the example below, moving the mouse cursor back-and-forth snaps the vertical rule and label to the nearest `date` value.

<div id="paintbrush_nearest" class="vl-example" data-name="interactive_stocks_nearest_index"></div>

#### Current Limitations

- The `nearest` property is not supported for multi-element mark types (i.e., `line` and `area`). For these mark types, consider layering a discrete mark type (e.g., `point`) with a 0-value `opacity` as in the last example above.

{:#interval}

## Interval Selection Properties

In addition to all [common selection properties](#selection-props), interval selections support the following properties:

{% include table.html props="mark,translate,zoom" source="IntervalSelectionConfig" %}

### `mark`

Every interval selection also adds a rectangle mark to the visualization, to depict the extents of the selected region.

The selection's `mark` property can include the folloiwing properties to customize the appearance of this rectangle mark.

{% include table.html props="cursor,fill,fillOpacity,stroke,strokeOpacity,strokeWidth,strokeDash,strokeDashOffset" source="BrushConfig" %}

For example, the spec below imagines two users, Alex and Morgan, who can each drag out an interval selection. To prevent collision between the two selections, Morgan must press the shift key while dragging out their interval (while Alex must not). Morgan's interval is depicted with the default grey rectangle, and Morgan's with a customized red rectangle.

<div class="vl-example" data-name="selection_interval_mark_style"></div>

### `translate`

The `translate` property allows a user to interactively move an interval selection back-and-forth.

For example, try to pan the <select id="type_translate" onchange="buildTranslate()"><option>brush</option><option>scatterplot</option></select> on <select id="event_translate" onchange="buildTranslate()"><option>drag</option><option>shift-drag</option></select>.

<div id="translate" class="vl-example" data-name="selection_translate_brush_drag"></div>

<script type="text/javascript">
function buildTranslate() {
  const type = document.getElementById('type_translate').value;
  const event = document.getElementById('event_translate').value;
  changeSpec('translate', 'selection_translate_' + type + '_' + event);
}
</script>

### `zoom`

The `zoom` property allows a user to interactively resize an interval selection.

For example, you can zoom the <select id="type_zoom" onchange="buildTranslate()"><option>brush</option><option>scatterplot</option></select> on <select id="event_zoom" onchange="buildTranslate()"><option>wheel</option><option>shift-wheel</option></select>.

<div id="zoom" class="vl-example" data-name="selection_zoom_brush_wheel"></div>

<script type="text/javascript">
function buildTranslate() {
  const type = document.getElementById('type_zoom').value;
  const event = document.getElementById('event_zoom').value;
  changeSpec('zoom', 'selection_zoom_' + type + '_' + event);
}
</script>
