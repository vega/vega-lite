---
layout: docs
title: Documentation
permalink: /docs/index.html
---

[Vega-Lite](/vega-lite/) provides a higher-level grammar for visual analysis, akin to ggplot or Tableau, that generates complete [Vega](https://vega.github.io/) specifications.

Vega-Lite specifications consist of simple mappings of variables in a data set to visual encoding channels such as position (`x`,`y`), `size`, `color` and `shape`. These mappings are then translated into detailed visualization specifications in the Vega specification language. Vega-Lite produces default values for visualization components (e.g., scales, axes, and legends) in the output Vega specification using a rule-based approach, but users can explicitly specify these properties to override default values.  
This documentation outlines the syntax and semantics of Vega-Lite specifications, and how you can embed Vega-Lite visualizations in your applications.


Want to learn more? [Read the getting started tutorial](tutorial.html).

## Vega-Lite Specification

A Vega-Lite specification is a JSON object that describes data source (`data`),
mark type (`mark`), visual encodings of data variables (`encoding`),
and data transformations.

In Vega-Lite, a specification can have the following top-level properties.

| Property             | Type          | Description    |
| :------------        |:-------------:| :------------- |
| [data](data.html)    | Object        | An object describing the data source. |
| [transform](transform.html)  | Object        | An object describing data transformations. |
| [mark](mark.html) | String        | The mark type.  Currently Vega-Lite supports `bar`, `line`, `area`, `point`, and `text` (text table). |
| [encoding](encoding.html) | Object        | key-value mapping between encoding channels and encoding object |
| [config](config.html)   | Object        | Configuration object. |

## Basic usage

### Online editor

Instead of setting up a web page, you can use the [Vega online editor](https://vega.github.io/vega-editor/?mode=vega-lite) to write Vega-Lite specifications online and immediately see your changes.

### Vega-Lite on your own website

To use Vega-Lite, load the required libraries (D3, Vega, and Vega-Lite).

```html
<script src="//d3js.org/d3.v3.min.js"></script>
<script src="//vega.github.io/vega/vega.js"></script>
<script src="//vega.github.io/vega-lite/vega-lite.js"></script>
```

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

<!--
## Vega-Lite, Vega, and D3

Vega-Lite is a higher-level grammar for visual analysis. Common charts (bar chart, line chart, area chart, scatter plot, heatmap, trellis plots, ...) can be easily created with Vega-Lite, often in a few lines of JSON. Vega is much more expressive and also supports interactions.
However, with more expressiveness comes complexity and more code is required to create simple charts. The Vega wiki has a detailed [comparison of Vega and D3](https://github.com/vega/vega/wiki/Vega-and-D3).
-->
