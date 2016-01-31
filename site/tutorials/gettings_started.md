---
layout: tutorials
menu: tutorials
title: Introduction to Vega-Lite
permalink: /tutorials/getting_started.html
---

In this tutorial, you will learn how to write a visualization specification in Vega-Lite. You will start with a simple visualization, which you will then extend the encoding and define additional properties. Lastly, you will learn how to embed the final visualization on a web page. There are similar tutorials for [D3](http://bost.ocks.org/mike/bar/) and [Vega](https://github.com/vega/vega/wiki/Tutorial).

We suggest that you follow along the tutorial by building a visualization in the [online editor](https://vega.github.io/vega-editor/?mode=vega-lite). Extend your specification in the editor as you read through this tutorial. If something does not work as expected, compare with the specifications from this tutorial.

## The Data

Let's say you have some tabular data with a category in the first column `a` and some numbers in the second column `b`.

| a | b |
|---|---|
| C | 2 |
| C | 7 |
| C | 4 |
| D | 1 |
| D | 2 |
| D | 6 |
| E | 8 |
| E | 4 |
| E | 7 |

We can represent this data as a [JSON](http://www.json.org/) array where each row is a new object in the array.

```json
[
  {"a": "C", "b": 2},
  {"a": "C", "b": 7},
  {"a": "C", "b": 4},
  {"a": "D", "b": 1},
  {"a": "D", "b": 2},
  {"a": "D", "b": 6},
  {"a": "E", "b": 8},
  {"a": "E", "b": 4},
  {"a": "E", "b": 7}
]
```

To visualize this data with Vega-Lite, we can add it directly to a Vega-Lite specification (we just formatted the array to make it more compact).

```json
{
  "data": {
    "values": [
      {"a": "C", "b": 2}, {"a": "C", "b": 7}, {"a": "C", "b": 4},
      {"a": "D", "b": 1}, {"a": "D", "b": 2}, {"a": "D", "b": 6},
      {"a": "E", "b": 8}, {"a": "E", "b": 4}, {"a": "E", "b": 7}
    ]
  }
}
```

The `data` property defines the data source of the visualization. For now, we will directly set the `values` property but later we will so how we can use other data sources.

## Visualize Data with Marks

This specification only adds a data source but we haven't defined yet how the the data should be visualized. By setting the `mark` property to `point`, we tell Vega-Lite to render point marks.

<div class="vl-example">
{
  "data": {
    "values": [
      {"a": "C", "b": 2}, {"a": "C", "b": 7}, {"a": "C", "b": 4},
      {"a": "D", "b": 1}, {"a": "D", "b": 2}, {"a": "D", "b": 6},
      {"a": "E", "b": 8}, {"a": "E", "b": 4}, {"a": "E", "b": 7}
    ]
  },
  "mark": "point"
}
</div>

Now, Vega-Lite renders a point. In fact, in renders one point for each of the 9 objects in the array.

## Encode Properties of the Data as Visual Properties

Seeing all points on top of each other is not particularly useful so to visually separate the points, we can *encode* the property `a` of the data as the x-location of the points.

<div class="vl-example">
{
  "data": {
    "values": [
      {"a": "C", "b": 2}, {"a": "C", "b": 7}, {"a": "C", "b": 4},
      {"a": "D", "b": 1}, {"a": "D", "b": 2}, {"a": "D", "b": 6},
      {"a": "E", "b": 8}, {"a": "E", "b": 4}, {"a": "E", "b": 7}
    ]
  },
  "mark": "point",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"}
  }
}
</div>

Here, we added an encoding to our specification.

```json
...
"encoding": {
  "x": {"field": "a", "type": "ordinal"}
}
...
```

this encoding maps the values for field `a` to the *encoding channel* `x` (the x-location of the points). In addition to the mapping, we also have to specify the data type. Vega-Lite currently supports four data types: `ordinal`, `nominal`, `quanititative`, and `temporal`. The difference between these types is explained in the [documentation for data types]({{stite.baseurl}}/docs/encoding.html#types). It is required that you provide a data type for an encoding.

In the visualization that we just crated, Vega-Lite automatically added an axis with labels for the different categories as well as an axis title. However, 3 points are still overlapping in each category. So far, we have only defined a visual encoding for the field `a`. We can add another visual encoding for the field `b`.

```json
...
"y": {"field": "b","type": "quantitative"}
...
```

This time we set the field type to be `quantitative` because the numeric values in field `b` have a magnitude.

<div class="vl-example">
{
  "data": {
    "values": [
      {"a": "C", "b": 2}, {"a": "C", "b": 7}, {"a": "C", "b": 4},
      {"a": "D", "b": 1}, {"a": "D", "b": 2}, {"a": "D", "b": 6},
      {"a": "E", "b": 8}, {"a": "E", "b": 4}, {"a": "E", "b": 7}
    ]
  },
  "mark": "point",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
</div>

Now we can see the raw data points. Note that Vega-Lite automatically added grid lines to the y-axis to help you see the magnitude of the `b` values.

## Aggregate Data

Vega-Lite can do more than just visualizing raw data. By adding `"aggregate": "mean"` to the definition of the y encoding channel, we can see the average value in each category. For example, the average value of category `D` is `(1 + 2 + 6)/3 = 9/3 = 3`.

<div class="vl-example">
{
  "data": {
    "values": [
      {"a": "C", "b": 2}, {"a": "C", "b": 7}, {"a": "C", "b": 4},
      {"a": "D", "b": 1}, {"a": "D", "b": 2}, {"a": "D", "b": 6},
      {"a": "E", "b": 8}, {"a": "E", "b": 4}, {"a": "E", "b": 7}
    ]
  },
  "mark": "point",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative", "aggregate": "mean"}
  }
}
</div>

Great! You computed the aggregate values for each category and visualized the resulting value as a point. Typically aggregated values for categories are visualized using bar charts. To create a bar chart, we have to change the mark type from `point` to `bar`.


```diff
- "mark": "point"
+ "mark": "bar"
```

<div class="vl-example">
{
  "data": {
    "values": [
      {"a": "C", "b": 2}, {"a": "C", "b": 7}, {"a": "C", "b": 4},
      {"a": "D", "b": 1}, {"a": "D", "b": 2}, {"a": "D", "b": 6},
      {"a": "E", "b": 8}, {"a": "E", "b": 4}, {"a": "E", "b": 7}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative", "aggregate": "mean"}
  }
}
</div>

Note that you don't have to specify that you want a vertical bar chart. In fact, we can change the visualization to a horizontal bar chart by swapping the `x` and `y` channels.

<div class="vl-example">
{
  "data": {
    "values": [
      {"a": "C", "b": 2}, {"a": "C", "b": 7}, {"a": "C", "b": 4},
      {"a": "D", "b": 1}, {"a": "D", "b": 2}, {"a": "D", "b": 6},
      {"a": "E", "b": 8}, {"a": "E", "b": 4}, {"a": "E", "b": 7}
    ]
  },
  "mark": "bar",
  "encoding": {
    "y": {"field": "a", "type": "ordinal"},
    "x": {"field": "b", "type": "quantitative", "aggregate": "mean"}
  }
}
</div>

## Customize your Visualization

Vega-Lite automatically provides a large number of defaults, which you can override. For example, to set change the title of the x-axis from `MEAN(b)` to `average of b`, we can set the title property of the axis in the `x` channel.

<div class="vl-example">
{
  "data": {
    "values": [
      {"a": "C", "b": 2}, {"a": "C", "b": 7}, {"a": "C", "b": 4},
      {"a": "D", "b": 1}, {"a": "D", "b": 2}, {"a": "D", "b": 6},
      {"a": "E", "b": 8}, {"a": "E", "b": 4}, {"a": "E", "b": 7}
    ]
  },
  "mark": "bar",
  "encoding": {
    "y": {"field": "a","type": "ordinal"},
    "x": {
      "field": "b", "type": "quantitative", "aggregate": "mean",
      "axis": {
        "title": "average of b"
      }
    }
  }
}
</div>


## Publish your Visualization Online

You can export visualizations as images from the [online editor](https://vega.github.io/vega-editor/?mode=vega-lite). However, if you want to embed your visualization on a website, you can create a web page with the following content.

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
        {"a": "C", "b": 2}, {"a": "C", "b": 7}, {"a": "C", "b": 4},
        {"a": "D", "b": 1}, {"a": "D", "b": 2}, {"a": "D", "b": 6},
        {"a": "E", "b": 8}, {"a": "E", "b": 4}, {"a": "E", "b": 7}
      ]
    },
    "mark": "bar",
    "encoding": {
      "y": {"field": "a","type": "ordinal"},
      "x": {
        "field": "b", "type": "quantitative", "aggregate": "mean",
        "axis": {
          "title": "average of b"
        }
      }
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

As you can see, we created a variable `vlSpec` that holds the specification in JSON format.

We also loaded the dependencies for Vega-Lite (D3, Vega and Vega-Lite) in the head of the document.

In the JavaScript code, Vega-Lite compiles a Vega-Lite specification into a Vega specification. We can then use the [Vega Runtime](https://github.com/vega/vega/wiki/Runtime) to display visualization.

If viewed in a browser, this will display our bar chart. You can also try it [here](demo.html).

## Next Steps

Now that you have seen the basics of Vega-Lite visualizations, we recommend that you build you own visualizations in the [online editor](https://vega.github.io/vega-editor/?mode=vega-lite) and get help from the [full documentation]({{site.baseurl}}/docs/).

We also have a [second tutorial that shows you how to create a visualization of weather data]({{site.baseurl}}/tutorials/weather.html).
