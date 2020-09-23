---
layout: docs
menu: docs
title: Repeat a View
permalink: /docs/repeat.html
---

The `repeat` operator is part of Vega-Lite's [view composition](composition.html). It provides a shortcut that creates a view for each entry in an array of fields. This operator generates multiple plots like [`facet`](facet.html). However, unlike `facet` it allows full replication of a data set in each view.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Repeat Operator

To repeat a view, define what fields should be used for each entry. Then define the repeated view in `spec` with a reference to a repeated field (`{"repeat": ...}`).

```js
{
  "repeat": {
    ... // Repeat definition
  },
  "spec": ... // Specification
}
```

In addition to [common properties of a view specification](spec.html#common), a repeat specification has the following properties:

{% include table.html props="repeat,spec,columns" source="RepeatSpec" %}

{: #repeat-mapping}

## Row/Column/Layer Repeat Mapping

The `repeat` property can be an object with at least one of `"row"`, `"column"` and `"layer"` properties, which define the list of fields that should be repeated into a row, a column, or a layer.

Note that when you repeat views into layers, the views are superimposed. Even if different layers use different colors, Vega-Lite will not generate a legend and not stack marks such as bars or areas. If you want a legend or stack different fields, use the [fold transform](fold.html) to convert your data to long form and then use a color encoding.

{% include table.html props="row,column" source="RepeatMapping" %}

## Examples

### Repeated Line Charts

For instance, you can use this operator to quickly create an overview over the trends in multiple variables.

<span class="vl-example" data-name="repeat_line_weather"></span>

Note how the field for the y channel refers to a repeated field.

```js
"y": {
  "field": {"repeat": "repeat"}
  ...
},
```

### Multi-series Line Chart with Repeated Layers

You can also use `repeat` with `layer` to create a multi-series line chart. Here we map a repeater field as data value ([`datum`](datum.html)) for the color encoding.

<span class="vl-example" data-name="repeat_layer"></span>

### Repeated Histogram (Wrapped)

<span class="vl-example" data-name="repeat_histogram"></span>

### Scatterplot Matrix (SPLOM)

Repeat can be used to create a scatterplot matrix (SPLOM), where each cell shows a different 2D projection of the same data table. Here, we define **both** `row` and `column`.

<span class="vl-example" data-name="repeat_splom"></span>

You can also check the [interactive SPLOM example]({{ site.baseurl }}/examples/interactive_splom.html).

## Resolve

The default [resolutions](resolve.html) for repeat are independent scales and axes for [position channels](encoding.html#position) and shared scales and legends for all other channels. Currently, Vega-Lite does not support shared axes for repeated views.

{:#config}

## Repeat Configuration

Since repeat is a shorthand for concatenation, the [concat configuration](concat.html#config) is also used for repeated views.

```js
// Top-level View Specification
{
  ...,
  "config": { // Configuration Object

    "concat": { // - Concat Configuration
      "spacing": ...,
      "columns": ...,
    },
    ...
  }
}
```

The repeat configuration supports the following properties:

{% include table.html props="columns,spacing" source="CompositionConfig" %}
