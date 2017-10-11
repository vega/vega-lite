---
layout: docs
menu: docs
title: Repeat a View
permalink: /docs/repeat.html
---

The `repeat` operator is part of Vega-Lite's [view compostion](compositon.html). It provides a shortcut that creates a view for each entry in an array of fields. This operator generates multiple plots like [`facet`](facet.html). However, unlike `facet` it allows full replication of a data set in each view.

To repeat a view, define what fields should be used for each entry in the row or columns. Then define the repeated view in `spec`.

{: .suppress-error}
```json
{
  "repeat": {
    ... // Repeat definition
  },
  "spec": ... // Specification
}
```

For instance, you can use this operator to create histograms for different fields.

<span class="vl-example" data-name="repeat_histogram"></span>


In addition to [common properties of a view specification](spec.html#common),
a repeat specification has the following properties:

{% include table.html props="repeat,resolve" source="RepeatSpec" %}

The `repeat` property is an object with two optional properties. They define the list of fields that should be repeated into a row or column.

{: #repeat}
{% include table.html props="column,row" source="Repeat" %}

Repeat can be used to create a scatterplot matrix (SPLOM), where each cell shows a different 2D projection of the same data table.

<span class="vl-example" data-name="repeat_splom_iris"></span>


## Resolve

The default [resolutions](resolve.html) for repeat are independent scales and axes for positional channels and shared scales and legends for all other channels.
