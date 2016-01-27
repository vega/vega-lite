---
layout: docs
title: Mark
permalink: /docs/mark.html
---

Marks are the basic visual building block of a visualization.
In a bar chart, the marks are bars. In a scatterplot, the marks might be circles or squares.

The `mark` property in Vega-Lite defines the visualization's mark type.
Each mark type supports different [encoding channels](encoding.html#Encoding-Channels),
which can be mapped either to a field (a variable in your data) or to a constant value.  

<!-- Replace the following list with a table listing mark types and their supported channels. -->

Vega-Lite supports the following `mark` types:
[`point`](#point),
[`circle`](#circle-and-square),
[`square`](#circle-and-square),
[`tick`](#tick),
[`bar`](#bar),
[`line`](#line),
[`area`](#area), and
[`text`](#text).

## Point Mark

`point` mark represents each data point with a symbol.  

Mapping a field to either `x` or `y` of `point` mark (but only one dimension) creates a dot plot.

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower", "type": "quantitative"}
  }
}
```

<script>
vg.embed('#dot-plot', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/cars.json"},
    "mark": "point",
    "encoding": {
      "x": {"field": "Horsepower", "type": "quantitative"}
    }
  }
});
</script>
<div id="dot-plot"></div>


Mapping fields to both the `x` and `y` dimensions creates a scatter plot.

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower", "type": "quantitative"},
    "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
  }
}
```
<script>
vg.embed('#scatter', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/cars.json"},
    "mark": "point",
    "encoding": {
      "x": {"field": "Horsepower", "type": "quantitative"},
      "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
    }
  }
});
</script>
<div id="scatter"></div>

By mapping a third field to the `size` attribute in the [scatter plot](#scatter), we can create a bubble plot instead.

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower", "type": "quantitative"},
    "y": {"field": "Miles_per_Gallon", "type": "quantitative"},
    "size": {"field": "Acceleration", "type": "quantitative"}
  }
}
```
<script>
vg.embed('#scatter_bubble', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/cars.json"},
    "mark": "point",
    "encoding": {
      "x": {"field": "Horsepower", "type": "quantitative"},
      "y": {"field": "Miles_per_Gallon", "type": "quantitative"},
      "size": {"field": "Acceleration", "type": "quantitative"}
    }
  }
});
</script>
<div id="scatter_bubble"></div>


<a id="ex-scatter_color_shape"></a>

Fields can also be encoded in the [scatter plot](#scatter) using the `color` or `shape` attributes.
For example, this specification doubly-encodes the field `Origin` with both `color` and `shape`.

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower", "type": "quantitative"},
    "y": {"field": "Miles_per_Gallon", "type": "quantitative"},
    "color": {"field": "Origin", "type": "nominal"},
    "shape": {"field": "Origin", "type": "nominal"}
  }
}
```
<script>
vg.embed('#scatter_color_shape', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/cars.json"},
    "mark": "point",
    "encoding": {
      "x": {"field": "Horsepower", "type": "quantitative"},
      "y": {"field": "Miles_per_Gallon", "type": "quantitative"},
      "color": {"field": "Origin", "type": "nominal"},
      "shape": {"field": "Origin", "type": "nominal"}
    }
  }
});
</script>
<div id="scatter_color_shape"></div>

Note that `point` marks have a border but no fill by default.
See [this section for an example with filled `point` marks](config.html#config.mark.filled).

## Circle and Square Marks

`circle` and `square` marks are similar to `point` mark, except:
(1) the `shape` value is always set to `circle` or `square`,
(2) they are filled by default.

Here are some examples:

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "circle",
  "encoding": {
    "x": {"field": "Horsepower", "type": "quantitative"},
    "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
  }
}
```

<script>
vg.embed('#circle', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/cars.json"},
    "mark": "circle",
    "encoding": {
      "x": {"field": "Horsepower", "type": "quantitative"},
      "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
    }
  }
});
</script>
<div id="circle"></div>


```js
{
  "data": {"url": "data/cars.json"},
  "mark": "square",
  "encoding": {
    "x": {"field": "Horsepower", "type": "quantitative"},
    "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
  }
}
```

<script>
vg.embed('#square', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/cars.json"},
    "mark": "square",
    "encoding": {
      "x": {"field": "Horsepower", "type": "quantitative"},
      "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
    }
  }
});
</script>
<div id="square"></div>


## Tick Mark

The `tick` mark represents each data point as a short line.
This is a useful mark for displaying the distribution of values in a field.

```js
{
  "description": "Shows the relationship between horsepower and the numbver of cylinders using tick marks.",
  "data": {"url": "data/cars.json"},
  "mark": "tick",
  "encoding": {
    "x": {"field": "Horsepower", "type": "quantitative"},
    "y": {"field": "Cylinders", "type": "ordinal"}
  }
}
```
<script>
vg.embed('div#tick-plot', {
  mode: 'vega-lite',
  spec: {
    "description": "Shows the relationship between horsepower and the numbver of cylinders using tick marks.",
    "data": {"url": "../data/cars.json"},
    "mark": "tick",
    "encoding": {
      "x": {"field": "Horsepower", "type": "quantitative"},
      "y": {"field": "Cylinders", "type": "ordinal"}
    }
  }
});
</script>
<div id="tick-plot"></div>

__TODO__ Colored Tick with adjusted size and thickness

## Bar Mark

The `bar` mark represents each data point as a rectangle, where the length is mapped to a quantitative scale.

Mapping a quantitative field to either `x` or `y` of the `bar` mark produces a single bar or column.
In the following example, note that the `x` value encodes the sum of the populations.

```js
{
  "data": { "url": "data/population.json"},
  "transform": {
    "filter": "datum.year == 2000"
  },
  "mark": "bar",
  "encoding": {
    "x": {
      "aggregate": "sum", "field": "people", "type": "quantitative",
      "axis": {"title": "population"}}
  }
}
```
<script>
vg.embed('#bar_1d', {
  mode: 'vega-lite',
  spec: {
    "data": { "url": "../data/population.json"},
    "transform": {
      "filter": "datum.year == 2000"
    },
    "mark": "bar",
    "encoding": {
      "x": {
        "aggregate": "sum", "field": "people", "type": "quantitative",
        "axis": {"title": "population"}
      }
    }
  }
});
</script>
<div id="bar_1d"></div>

If we map a quantitative field to the `y` attribute and a different ordinal field to the `x` attribute, we can produce a familiar bar chart.
Specifying `scale.bandWidth` of an ordinal field will adjust the [ordinal scale's band width](https://github.com/mbostock/d3/wiki/Ordinal-Scales#ordinal_rangeBands).
By default, there will be a 1 pixel offset between bars.  (See [an example that customizes size of the bars](encoding.html#ex-bar-size).)

<!-- TODO: Need to update docs our and Vega's scale.bandWidth property and link there instead -->

```js
{
  "description": "A bar chart showing the US population distribution of age groups in 2000.",
  "data": { "url": "data/population.json"},
  "transform": {
    "filter": "datum.year == 2000"
  },
  "mark": "bar",
  "encoding": {
    "y": {
      "aggregate": "sum", "field": "people", "type": "quantitative",
      "axis": {"title": "population"}
    },
    "x": {
      "field": "age", "type": "ordinal",
      "scale": {"bandWidth": 17}
    }
  }
}
```
<script>
vg.embed('#bar_aggregate', {
  mode: 'vega-lite',
  spec: {
    "description": "A bar chart showing the US population distribution of age groups in 2000.",
    "data": { "url": "../data/population.json"},
    "transform": {
      "filter": "datum.year == 2000"
    },
    "mark": "bar",
    "encoding": {
      "y": {"field": "people", "type": "quantitative", "aggregate": "sum", "axis": {"title": "population"}},
      "x": {"field": "age", "type": "ordinal", "scale": {"bandWidth": 17}}
    }
  }
});
</script>
<div id="bar_aggregate"></div>

Adding color to the bar chart (by using the `color` attribute) creates a stacked bar chart by default.
(See [`config.stack` for more detail about customizing stack](config.html#stack-config).)

```js
{
  "description": "A bar chart showing the US population distribution of age groups and gender in 2000.",
  "data": { "url": "data/population.json"},
  "transform": {
    "filter": "datum.year == 2000",
    "calculate": [{"field": "gender", "expr": "datum.sex == 2 ? \"Female\" : \"Male\""}]
  },
  "mark": "bar",
  "encoding": {
    "y": {
      "aggregate": "sum", "field": "people", "type": "quantitative",
      "axis": {"title": "population"}
    },
    "x": {
      "field": "age", "type": "ordinal",
      "scale": {"bandWidth": 17}
    },
    "color": {
      "field": "gender", "type": "nominal",
      "scale": {"range": ["#EA98D2", "#659CCA"]}
    }
  }
}
```
<script>
vg.embed('#bar_stacked', {
  mode: 'vega-lite',
  spec: {
    "description": "A bar chart showing the US population distribution of age groups and gender in 2000.",
    "data": { "url": "../data/population.json"},
    "transform": {
      "filter": "datum.year == 2000",
      "calculate": [{"field": "gender", "expr": "datum.sex == 2 ? \"Female\" : \"Male\""}]
    },
    "mark": "bar",
    "encoding": {
      "y": {"field": "people", "type": "quantitative", "aggregate": "sum", "axis": {"title": "population"}},
      "x": {"field": "age", "type": "ordinal", "scale": {"bandWidth": 17}},
      "color": {"field": "gender", "type": "nominal",
        "scale": {"range": ["#EA98D2", "#659CCA"]}
      }
    }  }
});
</script>
<div id="bar_stacked"></div>

To disable stacking, you can alternatively set `config.stack` to `false`.
This produces a layered bar chart.
To make it clear that bars are layered, we can make marks semi-transparent by setting the `opacity` to 0.6.

```js
{
  "description": "A bar chart showing the US population distribution of age groups and gender in 2000.",
  "data": { "url": "../data/population.json"},
  "transform": {
    "filter": "datum.year == 2000",
    "calculate": [{"field": "gender", "expr": "datum.sex == 2 ? \"Female\" : \"Male\""}]
  },
  "mark": "bar",
  "encoding": {
    "y": {
      "aggregate": "sum", "field": "people", "type": "quantitative",
      "axis": {"title": "population"}
    },
    "x": {
      "field": "age", "type": "ordinal",
      "scale": {"bandWidth": 17}
    },
    "color": {
      "field": "gender", "type": "nominal",
      "scale": {"range": ["#e377c2", "#1f77b4"]}
    }
  },
  "config": {
    "stack" : false,
    "mark": {
      "opacity": 0.6
    }
  }
}

```
<script>
vg.embed('#bar_layered_transparent', {
  mode: 'vega-lite',
  spec: {
    "description": "A bar chart showing the US population distribution of age groups and gender in 2000.",
    "data": { "url": "../data/population.json"},
    "transform": {
      "filter": "datum.year == 2000",
      "calculate": [{"field": "gender", "expr": "datum.sex == 2 ? \"Female\" : \"Male\""}]
    },
    "mark": "bar",
    "encoding": {
      "y": {
        "aggregate": "sum",
        "field": "people",
        "type": "quantitative",
        "axis": {"title": "population"}
      },
      "x": {
        "field": "age",
        "type": "ordinal",
        "scale": {"bandWidth": 17}
      },
      "color": {
        "field": "gender",
        "type": "nominal",
        "scale": {"range": ["#e377c2", "#1f77b4"]}
      }
    },
    "config": {
      "stack" : false,
      "mark": {
        "opacity": 0.6
      }
    }
  }
});
</script>
<div id="bar_layered_transparent"></div>

<!-- [Faceting](#encoding.md) a bar chart can produce a grouped bar chart.  

```js
{
  "description": "A trellis bar chart showing the US population distribution of age groups and gender in 2000.",
  "data": { "url": "data/population.json"},
  "transform": {
    "filter": "datum.year == 2000",
    "calculate": [{"field": "gender", "expr": "datum.sex == 2 ? \"Female\" : \"Male\""}]
  },
  "mark": "bar",
  "encoding": {
    "column": { "field": "age", "type": "nominal", "scale":{"padding": 4}},
    "y": {
      "aggregate": "sum", "field": "people", "type": "quantitative",
      "axis": {"title": "population"}
    },
    "x": {
      "field": "gender", "type": "ordinal",
      "scale": {"bandWidth": 15, "padding": 0.5}
    },
    "color": {
      "field": "gender", "type": "nominal",
      "scale": {"range": ["#EA98D2", "#659CCA"]}
    }
  }
}
```
<script>
vg.embed('#trellis_bar', {
  mode: 'vega-lite',
  spec: {
    "description": "A trellis bar chart showing the US population distribution of age groups and gender in 2000.",
    "data": { "url": "../data/population.json"},
    "transform": {
      "filter": "datum.year == 2000",
      "calculate": [{"field": "gender", "expr": "datum.sex == 2 ? \"Female\" : \"Male\""}]
    },
    "mark": "bar",
    "encoding": {
      "y": {
        "aggregate": "sum",
        "field": "people", "type": "quantitative",
        "axis": {"title": "population"}
      },
      "x": {
        "field": "age",
        "type": "ordinal",
        "scale": {"bandWidth": 17}
      },
      "color": {
        "field": "gender",
        "type": "nominal",
        "scale": {"range": ["#EA98D2", "#659CCA"]}
      },
      "row": {
        "field": "gender",
        "type": "nominal"
      }
    }
  }
});
</script>
<div id="trellis_bar"></div>
--->
<!--
- Heat Map
- How orientation is determined
- (Future -- once we have tooltip) -- playing bar's trick with `detail` channel
-->

## Line Mark

The `line` mark represents the data points stored in a field with a line connecting all of these points.
Using `line` with one dimension (typically on `x`) and one measure (typically on `y`) produces a simple line chart with a single line.

```js
{
  "description": "Google's stock price over time.",
  "data": {"url": "data/stocks.csv", "formatType":"csv"},
  "transform": {"filter": "datum.symbol==='GOOG'"},
  "mark": "line",
  "encoding": {
    "x": {"field": "date", "type": "temporal"},
    "y": {"field": "price", "type": "quantitative"}
  }
}

```
<script>
vg.embed('#line', {
  mode: 'vega-lite',
  spec: {
  "description": "Google's stock price over time.",
  "data": {"url": "../data/stocks.csv", "formatType":"csv"},
  "transform": {"filter": "datum.symbol==='GOOG'"},
  "mark": "line",
  "encoding": {
    "x": {"field": "date", "type": "temporal"},
    "y": {"field": "price", "type": "quantitative"}
  }
}

});
</script>
<div id="line"></div>

We can add create multiple lines by grouping along different attributes, such as `color` or `detail`.

In the example below, we group points using a new field mapped to `color`. This produces a line chart with different colors for each line.

```js
{
  "description": "Stock prices of 5 Tech Companies Over Time.",
  "data": {"url": "data/stocks.csv", "formatType":"csv"},
  "mark": "line",
  "encoding": {
    "x": {"field": "date", "type": "temporal"},
    "y": {"field": "price", "type": "quantitative"},
    "color": {"field": "symbol", "type": "nominal"}
  }
}
```
<script>
vg.embed('#line_color', {
  mode: 'vega-lite',
  spec: {
    "description": "Stock prices of 5 Tech Companies Over Time.",
    "data": {"url": "../data/stocks.csv", "formatType":"csv"},
    "mark": "line",
    "encoding": {
      "x": {"field": "date", "type": "temporal"},
      "y": {"field": "price", "type": "quantitative"},
      "color": {"field": "symbol", "type": "nominal"}
    }
  }
});
</script>
<div id="line_color"></div>

Alternatively, we can map this field to `detail`, creating multiple lines, but with the same color.

```js
{
  "description": "Stock prices of 5 Tech Companies Over Time.",
  "data": {"url": "data/stocks.csv", "formatType":"csv"},
  "mark": "line",
  "encoding": {
    "x": {"field": "date", "type": "temporal"},
    "y": {"field": "price", "type": "quantitative"},
    "detail": {"field": "symbol", "type": "nominal"}
  }
}
```
<script>
vg.embed('#line_detail', {
  mode: 'vega-lite',
  spec: {
    "description": "Stock prices of 5 Tech Companies Over Time.",
    "data": {"url": "../data/stocks.csv", "formatType":"csv"},
    "mark": "line",
    "encoding": {
      "x": {"field": "date", "type": "temporal"},
      "y": {"field": "price", "type": "quantitative"},
      "detail": {"field": "symbol", "type": "nominal"}
    }
  }
});
</script>
<div id="line_detail"></div>

By default, the line's path is ordered by data values on the dimension axis (x or y) like shown in previous examples.
However, a field can be mapped to line path

__TODO__: Example - Connected Scatterplot using "driving.json" data

## Area

Similar to `line`, using `area` mark with one dimension (typically on `x`)
and one measure (typically on `y`) produces an area chart.  


Adding color to area chart creates stacked area chart by default.


<!-- normalized area chart -->

To further customize stack, please look at [`config.stack`](config.html#stack-config) for more detail.


## Text

__TODO__
