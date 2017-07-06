---
layout: docs
menu: docs
title: Repeat a View
permalink: /docs/repeat.html
---

The `repeat` operator is part of Vega-Lite's [view compostion](compositon.html). It provides a shortcut that creates a view for each entry in an array of fields. This operator generates multiple plots like [`facet`](facet.html). However, unlike `facet` it allows full replication of a data set in each view.

To create a faceted view, define how the data should be faceted in `facet` and how each facet should be displayed in the `spec`.

{: .suppress-error}
```json
{
  "repeat": {
    ... // Repeat definition
  },
  "spec": ... // Specification
}
```

A repeat spec has the following properties:

{% include table.html props="repeat,data,transform,resolve,description,name" source="RepeatSpec" %}

Repeat can be used to create a scatterplot matrix (SPLOM), where each cell shows a different 2D projection of the same data table.

<span class="vl-example" data-name="repeat_splom_iris"></span>


## Resolve

The default [resolutions](resolve.html) for repeat are independent scales and axes for spatial channels and shared scales and legends for legends.
