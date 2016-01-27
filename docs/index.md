---
layout: docs
title: Documentation
permalink: /docs/index.html
---

Vega-Lite provides a higher-level grammar for visual analysis, akin to ggplot or Tableau, that generates complete [Vega](https://vega.github.io/) specifications.

Vega-Lite specifications consist of simple mappings of variables in a data set to visual encoding channels such as position (`x`,`y`), `size`, `color` and `shape`. These mappings are then translated into detailed visualization specifications in the Vega specification language. Vega-Lite produces default values for visualization components (e.g., scales, axes, and legends) in the output Vega specification using a rule-based approach, but users can explicitly specify these properties to override default values.  
This documentation outlines the syntax and semantics of Vega-Lite specifications, and how you can embed Vega-Lite visualizations in your applications.


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


## Getting started with Vega-Lite

Here is the bare minimum HTML file to get Vega-Lite with inline values working in a webpage.

```html
<!DOCTYPE html>
<head>
  <title>Vega Lite Bar Chart</title>
  <meta charset="utf-8">

  <script src="//d3js.org/d3.v3.min.js"></script>
  <script src="//vega.github.io/vega/vega.js"></script>
  <script src="//vega.github.io/vega-lite/vega-lite.js"></script>
</head>
<body>
  <div id="vis"></div>
  <script>
  var vlSpec = {
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
    };

  // Use Vega-Lite to compile the Vega-Lite specification to Vega
  var vgSpec = vl.compile(vlSpec).spec;

  // Use Vega to display the visualization
  vg.parse.spec(vgSpec, function(chart) {
    chart({el:"#vis"}).update(); });
  </script>
</body>
</html>
```

Basically, Vega-Lite compiles a Vega-Lite specification into a Vega
specification and use Vega Runtime to display visualizations.

The page first loads the required libraries (D3, Vega and Vega-Lite).
Then we created an HTML element that we will render the visualization in.
In JavaScript, the Vega-Lite specification is compiled to Vega.
Lastly, the Vega specification is passed to the [Vega runtime](https://github.com/vega/vega/wiki/Runtime), which renders it into the `#vis` element.

If viewed in a browser, this will display a simple bar chart. You can also try it [here](demo.html).

### Doing a bit more: load data from a URL

The example above shows only the basic set up. The rest of the Vega-Lite documentation describes the Vega-Lite specification language in detail.

For example, instead of embedding the data in the specification, it can be loaded from a url.
Replace the `vlSpec` variable in the code above with the following specification to create a visualization of a dataset about cars.

Make sure that you have a copy of the [cars dataset](https://vega.github.io/vega-lite/data/cars.json) in the `data` directory.

```json
{
  "data": {"url": "data/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"type": "ordinal","field": "Origin"},
    "y": {"type": "quantitative","field": "Acceleration"}
  }
}
```



__Pending Revision__:
Vega-Lite Compile API is under revision.  A better tutorial is coming soon.
