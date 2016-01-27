---
layout: docs
title: Tutorial
permalink: /docs/tutorial.html
---

This tutorial describes the basic set up to show [this basic Vega-Lite visualization](demo.html) on a web page.
Similar tutorial exist for [D3](http://bost.ocks.org/mike/bar/) and [Vega](https://github.com/vega/vega/wiki/Tutorial) but as you will see, creating a bar chart in Vega-Lite is much easier!

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
    chart({el:"#vis"}).update();
  });
  </script>
</body>
</html>
```

Basically, Vega-Lite compiles a Vega-Lite specification into a Vega
specification and use Vega Runtime to display visualizations.

This code first loads the required libraries (D3, Vega and Vega-Lite).
Then it creates an HTML element that will later be used to render the visualization in.
In the JavaScript code, the Vega-Lite specification is compiled to Vega.
The Vega specification is then passed to the [Vega runtime](https://github.com/vega/vega/wiki/Runtime), which renders a visualization in the `#vis` element.

If viewed in a browser, this will display a simple bar chart. You can also try it [here](demo.html).

## Doing a bit more: load data from a URL

The example above shows only the basic set up. The rest of the Vega-Lite documentation describes the Vega-Lite specification language in detail.

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

## A complex visualizations

Here is an even more complex chart. It shows barley yields for different locations and varieties for two years in a trellis plot. Make sure that you have the [barleys dataset](/vega-lite/data/barley.json) in your `data` directory as before. You can also see [this visualization in the Vega online editor](https://vega.github.io/vega-editor/?mode=vega-lite&spec=trellis_barley).

```json
{
  "data": {"url": "data/barley.json"},
  "mark": "point",
  "encoding": {
    "x": {"type": "quantitative", "field": "yield","aggregate": "mean"},
    "y": {
      "sort": {"field": "yield", "aggregate": "mean", "reverse": false},
      "type": "ordinal",
      "field": "variety"
    },
    "row": {"type": "ordinal", "field": "site"},
    "color": {"type": "ordinal", "field": "year"}
  }
}
```

To learn more about the Vega-Lite language, [read the full documentation](index.html).
