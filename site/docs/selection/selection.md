---
layout: docs
menu: docs
title: Interactive Plots with Selections
permalink: /docs/selection.html
---

```js
// A Single View Specification
{
  ...,
  "selection": {  // Key-value mappings between selection names and definitions.
    ...: {"type": "single/multi/interval",  ...},
    ...
  },
  "mark": ...,
  "encoding": ...,
  ...
}
```

Selections are the basic building block in Vega-Lite's _grammar of interaction._ They map user input (e.g., mouse moves and clicks, touch presses, etc.) into data queries, which can subsequently be used to drive conditional encoding rules, filter data points, or determine scale domains.

## Documentation Overview

{:.no_toc}

<!-- prettier-ignore -->
- TOC
{:toc}

{:#type}

## Selection Types

Selections are defined within single views, and their simplest definition consists of a **name** and a **type**. The selection type determines the default events that trigger a selection and the resultant data query.

{% include table.html props="type" source="IntervalSelection" %}

For example, try the different types against the example selection (named `pts`) below:

<select onchange="changeSpec('selection_type', 'selection_type_' + this.value)">
  <option>single</option>
  <option>multi</option>
  <option>interval</option>
</select>.

<div id="selection_type" class="vl-example" data-name="selection_type_single"></div>

{:#selection-props}

## Selection Properties

While selection types provide useful defaults, it can often be useful to override these properties to customize the interaction design.

### Common Selection Properties

{:#selection-on}

All selection types support the following properties:

{% include table.html props="clear,empty,on,resolve,encodings,fields" source="IntervalSelection" %}

For instance, with the `on` property, a single rectangle in the heatmap below can now be selected on mouse hover instead.

<div class="vl-example" data-name="selection_type_single_mouseover"></div>

{:#single}

### Single Selection Properties

In addition to all [common selection properties](#selection-props), single selections support the following properties:

{% include table.html props="init,bind,nearest" source="SingleSelection" %}

{:#multi}

### Multi Selection Properties

In addition to all [common selection properties](#selection-props), multi selections support the following properties:

{% include table.html props="init,nearest,toggle" source="MultiSelection" %}

{:#interval}

### Interval Selection Properties

In addition to all [common selection properties](#selection-props), interval selections support the following properties:

{% include table.html props="bind,init,mark,translate,zoom" source="IntervalSelection" %}

## Using Selections

### Conditional Encodings

Selections can be used to conditionally specify visual encodings -- encode data values one way if they fall within the selection, and another if they do not. For instance, in the first two examples on this page, rectangles are colored based on whether or not their data values fall within the `pts` selection. If they do, they are colored by the number of records; and, if they do not, they are left grey.

In this example, a selection (named `paintbrush`) is used to resize the points in the scatterplot on hover. This example is also useful for understanding the difference when empty selections are set to contain <select onchange="changeSpec('interactive_paintbrush_simple', 'interactive_paintbrush_simple_' + this.value)"><option>all</option><option>none</option></select> of the data values.

<div class="vl-example" id="interactive_paintbrush_simple" data-name="interactive_paintbrush_simple_all"></div>

See the [`condition`](condition.html) documentation for more information.

### Filtering Data

Selections in one view can also be used to filter input data to another view. In the example below, two scatterplots are concatenated vertically. An interval selection (named `brush`) is defined in the first plot and is used to filter the points in the second. Thus, the `Acceleration x Displacement` scatterplot only visualizes points that fall within the brushed region.

<div class="vl-example" data-name="selection_filter"></div>

### Scale Domains

With multiview displays, selections can also be used to determine the domains of scales in other views. For example, in the specification below, the bottom plot contains an interval selection named `brush`. We use this `brush` selection to parameterize the `domain` of the top plot's x-scale to make it show only the selected interval. This technique is called an overview+detail display.

<div class="vl-example" data-name="interactive_overview_detail"></div>

An alternate way to construct this technique would be to filter out the input data to the top (detail) view like so:

```js
{
  "vconcat": [{
    "transform": [{"filter": {"selection": "brush"}}],
    ...
  }]
}
```

However, setting the scale domains (rather than filtering data out) yields superior interactive performance. Rather than testing whether each data value falls within the selection or not, the scale domains are changed directly to the brush extents.

If the selection is [projected](project.html) over _multiple_ fields or encodings, one must be given as part of the scale domain definition. Vega-Lite automatically infers this property if the selection is only projected over a single field or encoding. Thus, with the above example, the scale domain can be specified more explicitly as:

- `"scale": {"domain": {"selection": "brush", "encoding": "x"}}` or
- `"scale": {"domain": {"selection": "brush", "field": "date"}}`

_Note:_ For a selection to manipulate the scales of its own view, use the [bind](bind.html#scale-binding) operator instead.

{:#compose}

### Composing Multiple Selections

So far, we have only considered how to use one selection at a time. Vega-Lite also supports combining multiple selections using the `not`, `or`, and `and` logical composition operators.

For example, we had previously seen how we could setup two interval selections for our users Alex and Morgan. Now, we color the rectangles when they fall within Alex's <select onchange="changeSpec('selection_composition', 'selection_composition_' + this.value)"><option>and</option><option>or</option></select> Morgan's selections.

<div id="selection_composition" class="vl-example" data-name="selection_composition_and"></div>

With these operators, selections can be combined in arbitrary ways:

- `"selection": {"not": {"and": ["alex", "morgan"]}}`
- `"selection": {"or": ["alex", {"not": "morgan"}]}`

When using selections with filter operators, logical composition can be used to mix selections with other filter operators. For example, as shown below, the `Displacement x Acceleration` scatterplot now visualizes points that lie within the brushed region **and** have a `Weight_in_lbs > 3000`.

<div class="vl-example" data-name="selection_filter_composition"></div>

_Note:_ Logical composition is **not** supported when selections are used to drive scale domains.

{:#config}

## Selection Configuration

```js
// Top-level View Specification
{
  ...,
  "config": {          // Configuration Object
    "selection": { ... },   // - Selection Configuration
    ...
  }
}
```

The `selection` property of the [`config`](config.html) object determines the default properties and transformations applied to different types of [selections](selection.html). The selection config can contain the following properties:

{% include table.html props="single,multi,interval" source="SelectionConfig" %}
