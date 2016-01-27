---
layout: docs
title: Mark
permalink: /docs/mark.html
---

Marks are the basic visual building block of a visualization.  
`mark` property in Vega-Lite defines the visualization's mark type.
Each mark type supports different [encoding channels](encoding.html#Encoding-Channels),
which can be either mapped to a field or a constant value.  

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

## Point

`point` mark represents each data point with a symbol.  

Mapping a field to only either `x` or `y` of `point` mark creates a dot plot.

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


Mapping fields to both `x` and `y` creates a scatter plot.

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

Mapping another field to `size` channel in the [scatter plot](#scatter) above creates a bubble plot instead.  

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

Alternatively, other fields can be mapped to `color` and/or `shape` of the [scatter plot](#scatter).
For example, this specification over-encodes the field `Origin` with both `color` and `shape`.

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

Note that `point` marks have filled border and are transparent inside by default.
See [this section for an example that creates filled `point` marks](config.html#config.mark.filled).

## Circle and Square

`circle` and `square` marks are similar to `point` mark except that
(1) the `shape` value is always set to `circle` and `square`, and
(2) they are filled by default.  Here are some examples:

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


## Tick

`tick` mark represents each data point as a tick.  
It is an ideal mark for displaying distribution of data.  

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

## Bar

`bar` mark represents each data point as a rectangle that fits a dimension scale
and expands its length along a quantitative scale.  

Mapping a quantitative field to either `x` or `y` of `bar` mark produces a 1D bar chart.
Note that the `x` in the following example encodes sum of the population.

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

Mapping a quantitative field and another ordinal field to `x` and `y` produces a bar chart.
Specifying `scale.bandWidth` of an ordinal field will adjust the [ordinal scale's band width](https://github.com/mbostock/d3/wiki/Ordinal-Scales#ordinal_rangeBands).
By default, there will be 1 pixel offset between bars.  (See [an example that customizes size of the bars](encoding.html#ex-bar-size).)

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


Adding color to the bar chart creates a stacked bar chart by default.
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

Alternatively, setting `config.stack` to `false` will disable stacking and thus
produces a layered bar chart.  To make it clear that bars are layered,
the following example sets the mark's `opacity` to be semi-transparent.

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

## Line

`line` mark represents each group of data points
with a line that connects all the points in the group.

Using `line` mark with one dimension (typically on `x`) and
one measure (typically on `y`) produces a line chart with single line.  

__TODO__: Line with interpolation

Additional grouping can be specified using `color` or `detail` channels.
Mapping a group field to `color` assigns different colors to each line and
thus produces a colored line chart.

__TODO__: Example - "Stock"

Mapping a group field to `detail` creates multiple lines with the same color.

__TODO__: Example - "Stock" with detail instead of color


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
