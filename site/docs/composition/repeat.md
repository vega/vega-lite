---
layout: docs
menu: docs
title: Repeat a View
permalink: /docs/repeat.html
---

The `repeat` operator is part of Vega-Lite's [view composition](composition.html). It provides a shortcut that creates a view for each entry in an array of fields. This operator generates multiple plots like [`facet`](facet.html). However, unlike `facet` it allows full replication of a data set in each view.

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

## Repeat Operator

To repeat a view, define what fields should be used for each entry in the row or columns. Then define the repeated view in `spec` with a reference to a repeated field (`{"repeat": ...}`).

{: .suppress-error}
```json
{
  "repeat": {
    ... // Repeat definition
  },
  "spec": ... // Specification
}
```

For instance, you can use this operator to quickly create an overview over the trends in multiple variables.

<span class="vl-example" data-name="repeat_line_weather"></span>

Note how the field for the y channel refers to a repeated field.

{: .suppress-error}
```json
"y": {
  "field": {"repeat": "column"}
  ...
},
```

In addition to [common properties of a view specification](spec.html#common), a repeat specification has the following properties:

{% include table.html props="repeat,resolve" source="RepeatSpec" %}

The `repeat` property is an object with two optional properties. They define the list of fields that should be repeated into a row or column.

{: #repeat}
{% include table.html props="column,row" source="Repeat" %}

## Example: Repeated Histogram

<span class="vl-example" data-name="repeat_histogram"></span>

## Example: Scatterplot Matrix (SPLOM)

Repeat can be used to create a scatterplot matrix (SPLOM), where each cell shows a different 2D projection of the same data table. Here, we define **both** `row` and `column`.

<span class="vl-example" data-name="repeat_splom_iris"></span>


## Resolve

The default [resolutions](resolve.html) for repeat are independent scales and axes for [position channels](encoding.html#position) and shared scales and legends for all other channels.
Currently, Vega-Lite does not support shared axes for repeated views.
