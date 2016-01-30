---
layout: page
title: A High-Level Visualization Grammar
permalink: /index.html
---

<span class="lead">
**Vega-Lite** is a higher-level grammar for visual analysis, akin to ggplot or Tableau, that generates complete [Vega](https://vega.github.io/) specifications.
</span>

Vega-Lite specifications consist of simple mappings of variables in a data set to visual encoding channels such as position (`x`,`y`), `size`, `color` and `shape`. These mappings are then translated into detailed visualization specifications in the Vega specification language. Vega-Lite produces default values for visualization components (e.g., scales, axes, and legends) in the output Vega specification using a rule-based approach, but users can explicitly specify these properties to override default values.  
This documentation outlines the syntax and semantics of Vega-Lite specifications, and how you can embed Vega-Lite visualizations in your applications.

<span class="vl-example">
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
</span>

<span class="vl-example" data-name="point_1d" data-dir="docs"></span>



Want to learn more? [Read the getting started tutorial]({{site.baseurl}}/tutorial.html).

## Basic usage

You can develop Vega-Lite visualizations in the online editor. To deploy the visualization online, create a web page and load the Vega_lite library and its dependencies.

### Online editor

You can use the [Vega online editor](https://vega.github.io/vega-editor/?mode=vega-lite) to write Vega-Lite specifications online and immediately see your changes. From the editor you can also export visualizations as images, browse examples, and explore the generated vega code.

### Vega-Lite on your own website

To use Vega-Lite, load the required libraries (D3, Vega, and Vega-Lite).

```html
<script src="//d3js.org/d3.v3.min.js"></script>
<script src="//vega.github.io/vega/vega.js"></script>
<script src="//vega.github.io/vega-lite/vega-lite.js"></script>
```

You can also download Vega-Lite: [vega-lite.min.js]({{site.baseurl}}/vega-lite.min.js).

To compile a Vega-Lite specification to Vega, call `vl.compile`.

```js
var vgSpec = vl.compile(vlSpec).spec;
```

Then render the Vega specification with the [Vega runtime](https://github.com/vega/vega/wiki/Runtime).

```js
vg.parse.spec(vgSpec, function(chart) {
  chart({el:"#vis"}).update();
});
```

See a [complete example in our demo]({{site.baseurl}}/site/demo.html).

<!--
## Vega-Lite, Vega, and D3

Vega-Lite is a higher-level grammar for visual analysis. Common charts (bar chart, line chart, area chart, scatter plot, heatmap, trellis plots, ...) can be easily created with Vega-Lite, often in a few lines of JSON. Vega is much more expressive and also supports interactions.
However, with more expressiveness comes complexity and more code is required to create simple charts. The Vega wiki has a detailed [comparison of Vega and D3](https://github.com/vega/vega/wiki/Vega-and-D3).
-->
