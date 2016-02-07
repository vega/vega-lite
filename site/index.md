---
layout: page
title: A High-Level Visualization Grammar
permalink: /
---

<span class="lead">
**Vega-Lite** is a higher-level grammar for visual analysis, akin to ggplot or Tableau, that generates complete [Vega](https://vega.github.io/) specifications.
</span>

Vega-Lite specifications consist of simple mappings of variables in a data set to visual encoding channels such as position (`x`,`y`), `size`, `color` and `shape`. These mappings are then translated into detailed visualization specifications in the Vega specification language. Vega-Lite produces default values for visualization components (e.g., scales, axes, and legends) in the output Vega specification using a rule-based approach, but users can explicitly specify these properties to override default values.  
This documentation outlines the syntax and semantics of Vega-Lite specifications, and how you can embed Vega-Lite visualizations in your applications.

<div class="vl-example">
{
  "data": {
    "values": [
      {"a":"A", "b":28}, {"a":"B", "b":55}, {"a":"C", "b":43},
      {"a":"D", "b":91}, {"a":"E", "b":81}, {"a":"F", "b":53},
      {"a":"G", "b":19}, {"a":"H", "b":87}, {"a":"I", "b":52}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"type": "ordinal","field": "a"},
    "y": {"type": "quantitative","field": "b"}
  }
}
</div>

<div class="vl-example" data-name="point_1d" data-dir="docs"></div>

Want to learn more? [Read the getting started tutorial](tutorials/getting_started.html) and create your own visualizations in the [online editor](https://vega.github.io/vega-editor/?mode=vega-lite)


<!--
## Vega-Lite, Vega, and D3

Vega-Lite is a higher-level grammar for visual analysis. Common charts (bar chart, line chart, area chart, scatter plot, heatmap, trellis plots, ...) can be easily created with Vega-Lite, often in a few lines of JSON. Vega is much more expressive and also supports interactions.
However, with more expressiveness comes complexity and more code is required to create simple charts. The Vega wiki has a detailed [comparison of Vega and D3](https://github.com/vega/vega/wiki/Vega-and-D3).
-->
