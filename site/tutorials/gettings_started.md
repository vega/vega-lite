---
layout: tutorials
menu: tutorials
title: Introduction to Vega-Lite
permalink: /tutorials/getting_started.html
---

This tutorial will guide through the process of writing a visualization specification in Vega-Lite. We will walk you through all main components of Vega-Lite by adding each of them to an example specification one-by-one. After creating the example visualization, we will also guide you how to embed the final visualization on a web page.

* TOC
{:toc}

We suggest that you follow along the tutorial by building a visualization in the [online editor](https://vega.github.io/vega-editor/?mode=vega-lite). Extend your specification in the editor as you read through this tutorial. If something does not work as expected, compare your specifications with ones inside this tutorial.

## The Data

Let's say you have a tabular data set with a categorical variable in the first column `a` and a numerical variable in the second column `b`.

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

We can represent this data as a [JSON array](http://www.json.org/) in which each row is an object in the array.

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

To visualize this data with Vega-Lite, we can add it directly to the `data` property in a Vega-Lite specification. (Note that we reformatted the array to make it more compact.)

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

The [`data`]({{site.baseurl}}/docs/data.html) property defines the data source of the visualization. In this example, we embed the data inline by directly setting `values` property. Vega-Lite also supports [other types of data sources]({{site.baseurl}}/docs/data.html) besides inline data.

## Encoding Data with Marks

Now we have a data source but we haven't defined yet how the data should be visualized.

Basic graphical elements in Vega-Lite are [*marks*]({{site.baseurl}}/docs/mark.html). Marks provide basic shapes whose properties (such as position, size, and color) can be used to visually encode data, either from a data field (or a variable), or a constant value.

To show the data as a point, we can set the `mark` property to `point`.

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

Now, it looks like we get a point. In fact, Vega-Lite renders one point for each object in the array, but they are all overlapping since we have not specified each point's position.

To visually separate the points, data variables can be mapped to visual properties of a mark. For example, we can *encode* the variable `a` of the data with `x` channel, which represents the x-position of the points. We can do that by adding an `encoding` object with its key `x` mapped to a channel definition that describes variable `a`.

{: .suppress-error}
```json
...
"encoding": {
  "x": {"field": "a", "type": "nominal"}
}
...
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
  "mark": "point",
  "encoding": {
    "x": {"field": "a", "type": "nominal"}
  }
}
</div>

The [`encoding`]({{site.baseurl}}/docs/encoding.html) object is a key-value mapping between encoding channels (such as `x`, `y`) and definitions of the mapped data fields. The channel definition describes the field's name (`field`) and its [data type]({{site.baseurl}}/docs/encoding.html#type) (`type`). In this example, we map the values for field `a` to the *encoding channel* `x` (the x-location of the points) and set `a`'s data type to `nominal`, since it represents categories. (See [the documentation for more information about data types]({{site.baseurl}}/docs/encoding.html#type).)

In the visualization above, Vega-Lite automatically adds an axis with labels for the different categories as well as an axis title. However, 3 points in each category are still overlapping. So far, we have only defined a visual encoding for the field `a`. We can also map the field `b` to the `y` channel.

{: .suppress-error}
```json
...
"y": {"field": "b", "type": "quantitative"}
...
```

This time we set the field type to be `quantitative` because the values in field `b` are numeric.

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
    "x": {"field": "a", "type": "nominal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
</div>

Now we can see the raw data points. Note that Vega-Lite automatically adds grid lines to the y-axis to facilitate comparison of the `b` values.

## Data Transformation: Aggregation

Vega-Lite also supports data transformation such as aggregation. By adding `"aggregate": "average"` to the definition of the `y` channel, we can see the average value of `a` in each category. For example, the average value of category `D` is `(1 + 2 + 6)/3 = 9/3 = 3`.

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
    "x": {"field": "a", "type": "nominal"},
    "y": {"aggregate": "average", "field": "b", "type": "quantitative"}
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
    "x": {"field": "a", "type": "nominal"},
    "y": {"aggregate": "average", "field": "b", "type": "quantitative"}
  }
}
</div>

Since the quantitative value is on y, you automatically get a vertical bar chart. If we swap the `x` and `y` channel, we get a horizontal bar chart instead.

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
    "y": {"field": "a", "type": "nominal"},
    "x": {"aggregate": "average", "field": "b", "type": "quantitative"}
  }
}
</div>

## Customize your Visualization

<!-- TODO need to find a way to talk about conciseness here somehow. -->
Vega-Lite automatically provides default properties for the visualization. You can further customize these values by adding more properties. For example, to change the title of the x-axis from `MEAN(b)` to `Average of b`, we can set the title property of the axis in the `x` channel.

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
    "y": {"field": "a", "type": "nominal"},
    "x": {
      "aggregate": "average", "field": "b", "type": "quantitative",
      "axis": {
        "title": "Average of b"
      }
    }
  }
}
</div>

{:#embed}
## Publish your Visualization Online

You have learned about basic components of a Vega-Lite specification.
Now, let's see how to publish your visualization.

You can use [Vega-Embed](https://github.com/vega/vega-embed) to embed your Vega-Lite visualization in a webpage.  For example, you can create a web page with the following content:

{: .suppress-error}
```html
<!DOCTYPE html>
<head>
  <title>Vega Lite Bar Chart</title>
  <meta charset="utf-8">

  <script src="//d3js.org/d3.v3.min.js"></script>
  <script src="//vega.github.io/vega/vega.js"></script>
  <script src="//vega.github.io/vega-lite/vega-lite.js"></script>
  <script src="//vega.github.io/vega-editor/vendor/vega-embed.js" charset="utf-8"></script>

  <style media="screen">
    /* Add space between vega-embed links  */
    .vega-actions a {
      margin-right: 5px;
    }
  </style>
</head>
<body>
  <h1>Template for Embedding Vega-Lite Visualization</h1>
  <div>See code at <a href="https://github.com/vega/vega-lite-demo">https://github.com/vega/vega-lite-demo</a></div>
  <!-- Container for the visualization -->
  <div id="vis"></div>

  <script>
  // Assign the specification to a local variable vlSpec.
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
      "y": {"field": "a", "type": "nominal"},
      "x": {
        "aggregate": "average", "field": "b", "type": "quantitative",
        "axis": {
          "title": "Average of b"
        }
      }
    }
  };

  var embedSpec = {
    mode: "vega-lite",  // Instruct Vega-Embed to use the Vega-Lite compiler
    spec: vlSpec
    // You can add more vega-embed configuration properties here.
    // See https://github.com/vega/vega/wiki/Embed-Vega-Web-Components#configuration-propeties for more information.
  };

  // Embed the visualization in the container with id `vis`
  vg.embed("#vis", embedSpec, function(error, result) {
    // Callback receiving the View instance and parsed Vega spec
    // result.view is the View, which resides under the '#vis' element
  });
  </script>
</body>
</html>
```

In this webpage, we first load the dependencies for Vega-Lite (D3, Vega-Embed, Vega, and Vega-Lite) in the `<head/>` tag of the document. We also create an HTML `<div/>` element with id `vis` to serve as a container for the visualization.

In the JavaScript code, we create a variable `vlSpec` that holds the Vega-Lite specification in JSON format. The `vl.embed` method translates a Vega-Lite specification into a Vega specification and then calls the [Vega Runtime](https://github.com/vega/vega/wiki/Runtime) to display visualization in the container `<div/>` element.

If viewed in a browser, this page displays our bar chart.
You can also see the html page [here]({{site.baseurl}}/site/demo.html), or fork it from our [vega-lite-demo](https://github.com/vega/vega-lite-demo) repository.

## Next Steps

Now you can create a website that embeds a Vega-Lite specification. If you want to learn more about Vega-Lite, please feel free to:

- Read the [next tutorial]({{site.baseurl}}/tutorials/explore.html).
- See the [examples gallery]({{site.baseurl}}/examples/).
- Build your own visualizations in the [online editor](https://vega.github.io/vega-editor/?mode=vega-lite).
- Browse through the [documentation]({{site.baseurl}}/docs/).
- See the [list of applications](https://vega.github.io/vega-lite/usage/applications.html) that you can use Vega-Lite with.
