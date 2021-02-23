---
layout: docs
menu: docs
title: Dynamic Behaviors with Parameters
permalink: /docs/parameter.html
---

```js
// A Single View Specification
{
  ...,
  "params": [  // An array of named parameters.
    {"name": ..., ...}
  ],
  "mark": ...,
  "encoding": ...,
  ...
}
```

Parameters are the basic building block in Vega-Lite's _grammar of interaction._ Parameters can either be simple variables or more complex _selections_ that map user input (e.g., mouse clicks and drags) to data queries. Parameters can be used throughout the remainder of the chart specification to determine encoding rules, filter data points, determine data extents, or in expression strings. They can also optionally be bound to input widgets (e.g., sliders or drop down menus).

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Defining a Parameter

Both variable and selection parameters support the following properties:

{% include table.html props="name,value,bind" source="VariableParameter" %}

### Variable Parameters

Variables are the simplest form a parameter can take. Variable parameters allow for a value to be defined once and then reused throughout the rest of the specification. For example, here we define a `cornerRadius` parameter:

<div class="vl-example" data-name="bar_params"></div>

As the name suggests, variable values can be modified dynamically, either by [binding the variable](bind.html) to input widgets (e.g., sliders or drop down menus), or by modifying the underlying signal in a [Vega view API](https://vega.github.io/vega/docs/api/view/#signals). For example, here we include widgets to customize bar mark's corner radius:

<div class="vl-example" data-name="bar_params_bound"></div>

{:#expr}

#### Expression

Besides setting the initial `value`, you can also create make a parameter using an expression (`expr`).

{% include table.html props="expr" source="VariableParameter" %}

For example, here we make the inner bars in a bullet chart depends on the chart height.

<div class="vl-example" data-name="bar_bullet_expr_bind"></div>

**Note:** Height is a built-in parameter, as described in the next section.

#### Built-In Variable Parameters

A few parameter names are automatically processed and/or reserved:

- Parameters for the specification `width`, `height`, `padding`, `autosize`, and `background` properties are automatically defined. Specifications may include definitions for these parameters in the top-level parameters array, in which case the definitions will be merged with any top-level specification property values, with precedence given to properties defined in the parameters array.
- The parameters names `datum`, `item`, `event`, `parent` are reserved for top-level variables within expressions. Specifications may not define parameters named `datum`, `item`, `event`, or `parent`.
- If you define a parameter named `cursor`, its value will automatically drive the CSS mouse cursor for the Vega-Lite view. For more details about `cursor` parameter, see the Vega documentation for [the underlying `cursor` signal](https://vega.github.io/vega/docs/signals/#the-cursor-signal).

{:#select}

### Selection Parameters

Selection parameters, on the other hand, define _data queries_ that are driven by direct manipulation user input (e.g., mouse clicks or drags). A parameter becomes a selection when the `select` property is specified. This property identifies properties of a selection including its _type_ (`point` or `interval`), which determines the default events that trigger a selection and the resultant data query.

{% include table.html props="select" source="SelectionParameter" %}

For example, try the two types against the example selection (named `pts`) below: <select onchange="changeSpec('selection_type', 'selection_type_' + this.value)"><option>point</option><option>interval</option></select>.

<div id="selection_type" class="vl-example" data-name="selection_type_point"></div>

While selection types provide useful defaults, you can set `select` to be a [selection definion](selection.html) to override default selection behaviors abd customize the interaction design. See the [selection](selection.html) documentation for more information about the selection definition.

## Using Parameters

### In Expression Strings

Parameter names can be used directly in expression strings. For selection parameters, the parameter name references an object with properties corresponding to the data fields that participate in the selection (specified either by the [`encodings`](#selection-props) or [`fields`](#selection-props) property).

For instance, in the example below, the opacity of the point marks is driven by a [bound](bind.html) variable parameter, and their size is determined by a clicked point's `Miles_per_Gallon`.

<div class="vl-example" data-name="param_expr"></div>

### As Predicates

[Predicates](predicate.html) are functions that return a boolean `true` or `false` value. While predicates can be explicitly written as expression strings (for example, `opacityVar == 25` or `sel.Miles_per_Gallon > 75`), it is often more convenient to treat a parameter as a predicate directly. When variable parameters are used as predicates, their values are coerced to booleans following [JavaScript's conventions](https://www.w3schools.com/js/js_type_conversion.asp). For selection parameters, the predicate evaluates to `true` when the corresponding data point lies within the selection, and `false` otherwise.

For instance, in the example below, we use a variable parameter to toggle the color of points in the scatterplot and a selection parameter to resize points on hover. Notice: by default, empty selections are considered to contain all data values (and thus all points are large at the start, or when the mouse cursor moves into empty space). We can toggle this behavior by setting the optional `empty` property on the predicate: <select onchange="changeSpec('interactive_paintbrush_simple', 'interactive_paintbrush_simple_' + this.value)"><option value="true" selected="true">true (default)</option><option>false</option></select>.

<div class="vl-example" id="interactive_paintbrush_simple" data-name="interactive_paintbrush_simple_true"></div>

See the [`condition`](condition.html) documentation for more information.

As another example of using parameters as predicates, consider how we might use one view to filter the data shown in another view. Below, we show two scatterplots concatenated vertically. An interval selection (named `brush`) is defined in the first plot and is used to filter the points in the second. Thus, the `Acceleration x Displacement` scatterplot only visualizes points that fall within the brushed region.

<div class="vl-example" data-name="selection_filter"></div>

### Data Extents

Selection parameters can additionally be used to define two types of data extents: binning logic or scale domains. Let's look at two examples of an interaction technique called overview+detail.

In the specification below, the bottom plot contains an interval selection named `brush`, which is used in the top plot to interactive re-bin data and "zoom" into the brushed region.

<div class="vl-example" data-name="interactive_bin_extent_bottom"></div>

The specification below has a similar setup. However, in this case, the `brush` in the bottom view drives the `domain` of the top plot's x-scale, to make it show only the selected interval.

<div class="vl-example" data-name="interactive_overview_detail"></div>

An alternate way to construct either of these examples would be to _first_ filter out the input data using the selection like so:

```js
{
  "vconcat": [{
    "transform": [{"filter": {"param": "brush"}}],
    ...
  }]
}
```

However, setting the data extents (rather than filtering data out) yields superior interactive performance. Rather than testing whether each data value falls within the selection or not, the data extents (either the bin extents or scale domains) are changed directly to the brush extents.

If the selection is [projected](project.html) over _multiple_ fields or encodings, one must be given as part of the data extent definition. Vega-Lite automatically infers this property if the selection is only projected over a single field or encoding. Thus, with the above example, the scale domain can be specified more explicitly as:

- `"scale": {"domain": {"param": "brush", "encoding": "x"}}` or
- `"scale": {"domain": {"param": "brush", "field": "date"}}`

_Note:_ Bin extents can be explicitly specified using a similar syntax. For a selection to manipulate the scales of its own view, use the [bind](bind.html#scale-binding) operator instead.

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

The `selection` property of the [`config`](config.html) object determines the default properties and transformations applied to the two types of selection parameters. The selection config can contain the following properties:

{% include table.html props="point,interval" source="SelectionConfig" %}
