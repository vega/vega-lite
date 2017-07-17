---
layout: docs
menu: docs
title: Interactive Plots with Selections
permalink: /docs/selection.html
---

Selections are the basic building block in Vega-Lite's _grammar of interaction._ They map user input (e.g., mouse moves and clicks, touch presses, etc.) into data queries, which can subsequently be used to drive conditional encoding rules, filter data points, or determine scale domains.

| Property                 | Type                | Description    |
| :----------------------- | :-----------------: | :------------- |
| [type](#selection-types) | String | _**Required.**_ Determines the default event processing and data query for the selection. |
| [on](#selection-on)      | [Vega Event Stream](https://vega.github.io/vega/docs/event-streams/) | Alternate user input events that should trigger the selection. For interval selections, the event stream must specify a [start and end](https://vega.github.io/vega/docs/event-streams/#between-filters). |
| [resolve](#resolving-selections-in-data-driven-views) | String | A strategy for how the selection's data query should be constructed, when used within a multiview or layered display. |

* TOC
{:toc}


## Selection Types

Selections are defined within single views, and their simplest definition consists of a **name** and a **type**. The selection type determines the default events that trigger a selection and the resultant data query. Vega-Lite currently supports three selection types:

  * `single` -- to select a single discrete data value on `click`.
  * `multi` -- to select multiple discrete data value; the first value is selected on `click` and additional values toggled on shift-`click`.
  * `interval` -- to select a continuous range of data values on `drag`.

For example, try the different types against the example selection (named `pts`) below: <select onchange="changeSpec('selection_type', 'selection_type_' + this.value)">
  <option>single</option>
  <option>multi</option>
  <option>interval</option>
</select>.

<div id="selection_type" class="vl-example" data-name="selection_type_single"></div>

<a id="selection-on"></a>
While selection types provide useful defaults, it can often be useful to override these properties to customize the interaction design. The `on` property can be used to specify alternate events to trigger a selection. For instance, a single rectangle in the heatmap below can now be selected on double-click instead.

<div class="vl-example" data-name="selection_type_single_dblclick"></div>

Every interval selection also adds a rectangle mark to the visualization, to depict the extents of the selected region. The appearance of this mark can be customized with the following properties, specified under `mark`.

{% include table.html props="fill,fillOpacity,stroke,strokeOpacity,strokeWidth,strokeDash,strokeDashOffset" source="BrushConfig" %}

For example, the spec below imagines two users, Alex and Morgan, who can each drag out an interval selection. To prevent collision between the two selections, Morgan must press the shift key while dragging out their interval (while Alex must not). Morgan's interval is depicted with the default grey rectangle, and Morgan's with a customized red rectangle.

_Note:_ the two intervals do not have any effect on the visualization yet (we'll cover that next!).

<div class="vl-example" data-name="interval_mark_style"></div>

Vega-Lite provides a number of selection _transformations_ to further customize the behaviour of a selection. These include: [bind](#), [nearest](#), [project](#), [toggle](#), [translate](#), and [zoom](#).

## Using Selections

### Conditional Encodings

Selections can be used to conditionally specify visual encodings -- encode data values one way if they fall within the selection, and another if they do not. For instance, in the first two examples on this page, rectangles are colored based on whether or not their data values fall within the `pts` selection. If they do, they are colored by the number of records; and, if they do not, they are left grey.

In this example, a selection (named `paintbrush`) is used to resize the points in the scatterplot on hover.

<div class="vl-example" data-name="paintbrush_simple"></div>

### Filtering Data

Selections in one view can also be used to filter input data to another view. In the example below, two scatterplots are concatenated vertically. An interval selection (named `brush`) is defined in the first plot and is used to filter the points in the second. Thus, the `Acceleration x Displacement` scatterplot only visualizes points that fall within the brushed region.

<div class="vl-example" data-name="selection_filter"></div>

### Scale Domains

With multiview displays, selections can also be used to determine the domains of scales in other views. For example, in the specification below, the bottom plot contains an interval selection named `brush`, and the top plot shows only these selected points. This technique is called an overview+detail display.

<div class="vl-example" data-name="overview_detail"></div>

An alternate way to construct this technique would be to filter out the input data to the top (detail) view like so:

{: .suppress-error}
```json
{
  "vconcat": [{
    "transform": [{"filter": {"selection": "brush"}}],
    ...
  }]
}
```

However, setting the scale domains (rather than filtering data out) yields superior interactive performance. Rather than testing whether each data value falls within the selection or not, the scale domains are changed directly to the brush extents.

If the selection is [projected](#) over _multiple_ fields or encodings, one must be given as part of the scale domain definition. Vega-Lite automatically infers this property if the selection is only projected over a single field or encoding. Thus, with the above example, the scale domain can be specified more explicitly as:

  * `"scale": {"domain": {"selection": "brush", "encoding": "x"}}` or
  * `"scale": {"domain": {"selection": "brush", "field": "date"}}`

_Note:_ For a selection to manipulate the scales of its own view, use the [bind](#) operator instead.

### Composing Multiple Selections

So far, we have only considered how to use one selection at a time. Vega-Lite also supports combining multiple selections using the `not`, `or`, and `and` logical composition operators.

For example, we had previously seen how we could setup two interval selections for our users Alex and Morgan. Now, we color the rectangles when they fall within Alex's <select onchange="changeSpec('selection_composition', 'selection_composition_' + this.value)">
  <option>and</option>
  <option>or</option>
</select> Morgan's selections.

<div id="selection_composition" class="vl-example" data-name="selection_composition_and"></div>

With these operators, selections can be combined in arbitrary ways:

  * `"selection": {"not": {"and": ["alex", "morgan"]}}`
  * `"selection": {"or": ["alex", {"not": "morgan"}]}`

When using selections with filter operators, logical composition can be used to mix selections with other filter operators. For example, as shown below, the `Displacement x Acceleration` scatterplot now visualizes points that lie within the brushed region **and** have a `Weight_in_lbs > 3000`.

<div class="vl-example" data-name="selection_filter_composition"></div>

_Note:_ Logical composition is **not** supported when selections are used to drive scale domains.

## Resolving Selections in Data-Driven Views

When a selection is defined within a data-driven view (i.e., a view that is part of a [facet](facet.html) or [repeat](repeat.html)), the desired behaviour can be ambiguous. Consider the scatterplot matrix (SPLOM) example below, which has an interval selection named `brush`. Should there be only one brush across all cells, or should each cell have its own brush? In the latter case, how should points be highlighted in all the other cells?

The aptly named `resolve` property addresses this ambiguity, and can be set to one of the following values (click to apply it to the SPLOM example, and drag out an interval in different cells):

  * <a href="javascript:changeSpec('selection_resolution', 'selection_resolution_global')">`global`</a> (**default**) -- only one brush exists for the entire SPLOM. When the user begins to drag, any previous brushes are cleared, and a new one is constructed.

  * <a href="javascript:changeSpec('selection_resolution', 'selection_resolution_union')">`union`</a> -- each cell contains its own brush, and points are highlighted if they lie within _any_ of these individual brushes.

  * <a href="javascript:changeSpec('selection_resolution', 'selection_resolution_intersect')">`intersect`</a> -- each cell contains its own brush, and points are highlighted only if they fall within _all_ of these individual brushes.


  * <a href="javascript:changeSpec('selection_resolution', 'selection_resolution_union_others')">`union_others`</a> -- each cell contains its own brush, and points are highlighted if they lie within _any_ of the brushes of _other_ cells (i.e., a cell's brush is not considered when highlighting its own points).

  * <a href="javascript:changeSpec('selection_resolution', 'selection_resolution_intersect_others')">`intersect_others`</a> -- each cell contains its own brush, and points are highlighted only if they fall within _all_ of the brushes of _other_ cells (i.e., a cell's brush is not considered when highlighting its own points).

<div id="selection_resolution" class="vl-example" data-name="selection_resolution_global"></div>
