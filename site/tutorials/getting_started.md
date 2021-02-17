---
layout: tutorials
menu: tutorials
title: Introduction to Vega-Lite
permalink: /tutorials/getting_started.html
---

This tutorial will guide through the process of writing a visualization specification in Vega-Lite. We will walk you through all main components of Vega-Lite by adding each of them to an example specification one-by-one. After creating the example visualization, we will also guide you how to embed the final visualization on a web page.

We suggest that you follow along the tutorial by building a visualization in the [online editor](https://vega.github.io/editor/#/custom/vega-lite). Extend your specification in the editor as you read through this tutorial. If something does not work as expected, compare your specifications with ones inside this tutorial.

## Tutorial Overview

<!-- prettier-ignore -->
- TOC
{:toc}

## The Data

Let's say you have a tabular data set with a categorical variable in the first column `a` and a numerical variable in the second column `b`.

{:.small-table}

| a   | b   |
| --- | --- |
| C   | 2   |
| C   | 7   |
| C   | 4   |
| D   | 1   |
| D   | 2   |
| D   | 6   |
| E   | 8   |
| E   | 4   |
| E   | 7   |

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

To visualize this data with Vega-Lite, we can add it directly to the `data` property in a Vega-Lite specification.

```json
{
  "data": {
    "values": [
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
  }
}
```

The [`data`]({{site.baseurl}}/docs/data.html) property defines the data source of the visualization. In this example, we embed the data inline by directly setting `values` property. Vega-Lite also supports [other types of data sources]({{site.baseurl}}/docs/data.html) besides inline data.

## Encoding Data with Marks

Now we have a data source but we haven't defined yet how the data should be visualized.

Basic graphical elements in Vega-Lite are [_marks_]({{site.baseurl}}/docs/mark.html). Marks provide basic shapes whose properties (such as position, size, and color) can be used to visually encode data, either from a data field (or a variable), or a constant value.

To show the data as a point, we can set the `mark` property to `point`.

<div class="vl-example" data-name="point_overlap"></div>

Now, it looks like we get a point. In fact, Vega-Lite renders one point for each object in the array, but they are all overlapping since we have not specified each point's position.

To visually separate the points, data variables can be mapped to visual properties of a mark. For example, we can [_encode_]({{site.baseurl}}/docs/encoding.html) the variable `a` of the data with `x` channel, which represents the x-position of the points. We can do that by adding an `encoding` object with its key `x` mapped to a channel definition that describes variable `a`.

```js
...
"encoding": {
  "x": {"field": "a", "type": "nominal"}
}
...
```

<div class="vl-example" data-name="point_1d_array"></div>

The [`encoding`]({{site.baseurl}}/docs/encoding.html) object is a key-value mapping between encoding channels (such as `x`, `y`) and definitions of the mapped data fields. The channel definition describes the field's name (`field`) and its [data type]({{site.baseurl}}/docs/encoding.html#type) (`type`). In this example, we map the values for field `a` to the _encoding channel_ `x` (the x-location of the points) and set `a`'s data type to `nominal`, since it represents categories. (See [the documentation for more information about data types]({{site.baseurl}}/docs/encoding.html#type).)

In the visualization above, Vega-Lite automatically adds an axis with labels for the different categories as well as an axis title. However, 3 points in each category are still overlapping. So far, we have only defined a visual encoding for the field `a`. We can also map the field `b` to the `y` channel.

```js
...
"y": {"field": "b", "type": "quantitative"}
...
```

This time we set the field type to be `quantitative` because the values in field `b` are numeric.

<div class="vl-example" data-name="point_2d_array"></div>

Now we can see the raw data points. Note that Vega-Lite automatically adds grid lines to the y-axis to facilitate comparison of the `b` values.

## Data Transformation: Aggregation

Vega-Lite also supports data transformation such as aggregation. By adding `"aggregate": "average"` to the definition of the `y` channel, we can see the average value of `a` in each category. For example, the average value of category `D` is `(1 + 2 + 6)/3 = 9/3 = 3`.

<div class="vl-example" data-name="point_2d_aggregate"></div>

Great! You computed the aggregate values for each category and visualized the resulting value as a point. Typically aggregated values for categories are visualized using bar charts. To create a bar chart, we have to change the mark type from `point` to `bar`.

```diff
- "mark": "point"
+ "mark": "bar"
```

<div class="vl-example" data-name="bar_array_aggregate"></div>

Since the quantitative value is on `y`, you automatically get a vertical bar chart. If we swap the `x` and `y` channel, we get a horizontal bar chart instead.

<div class="vl-example" data-name="bar_swap_axes"></div>

## Customize your Visualization

<!-- TODO need to find a way to talk about conciseness here somehow. -->

Vega-Lite automatically provides default properties for the visualization. You can further customize these values by adding more properties. For example, to change the title of the x-axis from `Average of b` to `Mean of b`, we can set the title property of the axis in the `x` channel.

<div class="vl-example" data-name="bar_swap_custom"></div>

{:#embed}

## Publish your Visualization Online

You have learned about basic components of a Vega-Lite specification. Now, let's see how to publish your visualization.

You can use [Vega-Embed](https://github.com/vega/vega-embed) to embed your Vega-Lite visualization in a webpage. For example, you can create a web page with the following content:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Vega-Lite Bar Chart</title>
    <meta charset="utf-8" />

    <script src="https://cdn.jsdelivr.net/npm/vega@{{ site.data.versions.vega }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-lite@{{ site.data.versions.vega-lite }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-embed@{{ site.data.versions.vega-embed }}"></script>

    <style media="screen">
      /* Add space between Vega-Embed links  */
      .vega-actions a {
        margin-right: 5px;
      }
    </style>
  </head>
  <body>
    <h1>Template for Embedding Vega-Lite Visualization</h1>
    <!-- Container for the visualization -->
    <div id="vis"></div>

    <script>
      // Assign the specification to a local variable vlSpec.
      var vlSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {
          values: [
            {a: 'C', b: 2},
            {a: 'C', b: 7},
            {a: 'C', b: 4},
            {a: 'D', b: 1},
            {a: 'D', b: 2},
            {a: 'D', b: 6},
            {a: 'E', b: 8},
            {a: 'E', b: 4},
            {a: 'E', b: 7}
          ]
        },
        mark: 'bar',
        encoding: {
          y: {field: 'a', type: 'nominal'},
          x: {
            aggregate: 'average',
            field: 'b',
            type: 'quantitative',
            axis: {
              title: 'Average of b'
            }
          }
        }
      };

      // Embed the visualization in the container with id `vis`
      vegaEmbed('#vis', vlSpec);
    </script>
  </body>
</html>
```

In this webpage, we first load the dependencies for Vega-Lite (Vega-Embed, Vega, and Vega-Lite) in the `<head/>` tag of the document. We also create an HTML `<div/>` element with id `vis` to serve as a container for the visualization.

In the JavaScript code, we create a variable `vlSpec` that holds the Vega-Lite specification in JSON format. The `vegaEmbed` method translates a Vega-Lite specification into a Vega specification and then calls the [Vega Runtime](https://vega.github.io/vega/usage/) to display visualization in the container `<div/>` element.

If viewed in a browser, this page displays our bar chart like on our [demo page]({{site.baseurl}}/demo.html). You can also fork our [Vega-Lite Block example](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9).

## Next Steps

Now you can create a website that embeds a Vega-Lite specification. If you want to learn more about Vega-Lite, please feel free to:

- Read the [next tutorial]({{site.baseurl}}/tutorials/explore.html).
- See the [examples gallery]({{site.baseurl}}/examples/).
- Build your own visualizations in the [online editor](https://vega.github.io/editor/#/custom/vega-lite).
- Browse through the [documentation]({{site.baseurl}}/docs/).
- See the [list of applications]({{site.baseurl}}/ecosystem.html) that you can use Vega-Lite with.
