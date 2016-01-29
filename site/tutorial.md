---
layout: page
menu: start
title: Introduction to Vega-Lite
permalink: /tutorial.html
---

This tutorial describes the basic setup to show [this basic Vega-Lite visualization](demo.html) on a web page.
Similar tutorials exist for [D3](http://bost.ocks.org/mike/bar/) and [Vega](https://github.com/vega/vega/wiki/Tutorial).

Here is the bare minimum HTML file to get Vega-Lite working with inline values in a webpage.

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
    chart({el:"#vis"}).update();
  });
  </script>
</body>
</html>
```

Basically, Vega-Lite compiles a Vega-Lite specification into a Vega
specification and uses the [Vega Runtime](https://github.com/vega/vega/wiki/Runtime) to display visualizations.

This code first loads the required libraries (D3, Vega and Vega-Lite).
Then it creates the HTML element within which the visualization will be rendered.
In the JavaScript code, the Vega-Lite specification is compiled to Vega.
The Vega specification is then passed to the [Vega runtime](https://github.com/vega/vega/wiki/Runtime), which renders a visualization in the `#vis` element.

If viewed in a browser, this will display a simple bar chart. You can also try it [here](demo.html).

## Doing a bit more: load data from a URL

The example above shows only the basic setup. The rest of the Vega-Lite documentation describes the Vega-Lite specification language in detail.

For example, instead of embedding the data in the specification, it can be loaded from a url.
Replace the `vlSpec` variable in the code above with the following specification to create a visualization of a dataset about cars.

Make sure that you have a copy of the [cars dataset](/vega-lite/data/cars.json) in the `data` directory.

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

To learn more about the Vega-Lite language, [read the full documentation](index.html).
