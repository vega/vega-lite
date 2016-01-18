---
layout: docs
title: Mark
permalink: /docs/mark.html
---

Marks are the basic visual building block of a visualization.  
`mark` property of a Vega-Lite specification defines the visualization's mark type.
Each mark type supports different [encoding channels](encoding.html#Encoding-Channels),
which can be either mapped to a field or a constant value.  

Currently Vega-Lite supports the following `mark` types:
[`point`](#point),
[`circle`](#circle-and-square),
[`square`](#circle-and-square),
[`tick`](#tick),
[`bar`](#bar),
[`line`](#line),
[`area`](#area), and
[`text`](#text) (text table).

## Point

`point` mark represents each data point with a symbol.  

<!-- It also supports the following encoding channels:
`x`, `y`, `color`, `shape` and `size`. -->

Mapping a field to only either `x` or `y` of `point` mark creates a dot plot.

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower","type": "quantitative"}
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
      "x": {"field": "Horsepower","type": "quantitative"}
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
    "x": {"field": "Horsepower","type": "quantitative"},
    "y": {"field": "Miles_per_Gallon","type": "quantitative"}
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
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"}
    }
  }
});
</script>
<div id="scatter"></div>

Mapping another field to `size` channel in the [scatter plot](#scatter) above
creates a bubble plot instead.  

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower","type": "quantitative"},
    "y": {"field": "Miles_per_Gallon","type": "quantitative"},
    "size": {"field": "Acceleration","type": "quantitative"}
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
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "size": {"field": "Acceleration","type": "quantitative"}
    }
  }
});
</script>
<div id="scatter_bubble"></div>

Alternatively, other fields can be mapped to `color` and/or `shape` of the [scatter plot](#scatter).
For example, this specification over-encodes the field `Origin` with both `color`
and `shape`.

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower","type": "quantitative"},
    "y": {"field": "Miles_per_Gallon","type": "quantitative"},
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
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {"field": "Origin", "type": "nominal"},
      "shape": {"field": "Origin", "type": "nominal"}
    }
  }
});
</script>
<div id="scatter_color_shape"></div>


Or you can set `color` and `shape` to constant values.

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower","type": "quantitative"},
    "y": {"field": "Miles_per_Gallon","type": "quantitative"},
    "color": {"value": "#ff9900"},
    "shape": {"value": "square"}
  }
}
```

<script>
vg.embed('#scatter_color_shape_constant', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/cars.json"},
    "mark": "point",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {"value": "#ff9900"},
      "shape": {"value": "square"}
    }
  }
});
</script>
<div id="scatter_color_shape_constant"></div>

By default, `point` marks have filled borders and are transparent inside.  
Setting `config.mark.filled` creates filled marks instead.

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower","type": "quantitative"},
    "y": {"field": "Miles_per_Gallon","type": "quantitative"},
    "color": {"value": "#ff9900"},
    "shape": {"value": "square"}
  },
  "config": {
    "mark": {"filled": true}
  }
}
```

<script>
vg.embed('#scatter_filled', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/cars.json"},
    "mark": "point",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {"value": "#ff0000"},
      "shape": {"value": "square"}
    },
    "config": {
      "mark": {"filled": true}
    }
  }
});
</script>
<div id="scatter_filled"></div>


## Circle and Square

`circle` and `square` marks are similar to `point` mark except that
(1) the `shape` channel is always set to `circle` and `square`, and
(2) they are filled by default.  Here are some examples:

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "circle",
  "encoding": {
    "x": {"field": "Horsepower","type": "quantitative"},
    "y": {"field": "Miles_per_Gallon","type": "quantitative"}
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
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"}
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
    "x": {"field": "Horsepower","type": "quantitative"},
    "y": {"field": "Miles_per_Gallon","type": "quantitative"}
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
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"}
    }
  }
});
</script>
<div id="square"></div>

## Tick

<!--
- Supported data type
- How orientation is determined
-->


## Bar

`bar` mark represents each data point as a rectangle that fits a dimension scale
and expands its length along a quantitative scale.  

Mapping a quantitative field to either `x` or `y` of `bar` mark produces a 1D bar chart.

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower", "type": "quantitative", "aggregate": "mean"}
  }
}
```

Mapping a quantitative field and another ordinal field to `x` and `y` produces a bar chart.

<!-- EXAMPLE! -->

Adding color to area chart creates a stacked bar chart by default.

<!-- EXAMPLE! -->

Alternatively, setting `config.stack` to `false` will disable stacking and thus
produces a layered bar chart.  (Note: setting the mark to be semi-transparent is
highly-recommended for this chart type.)  

<!-- EXAMPLE! -->


[Faceting](#encoding.md) a bar chart can produce a grouped bar chart.  
<!--In the following example, we also over-encode field XXX with both row/column-facet and color -->

<!-- EXAMPLE! -->

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

Additional grouping can be specified using `color` or `detail` channels.
Mapping a group field to `color` assigns different colors to each line and
thus produces a colored line chart.

<!-- EXAMPLE! -->

Mapping a group field to `detail` creates multiple lines with the same color.

<!-- EXAMPLE! -->

<!-- Line interpolation -->

<!--By default, the order between data points in the line is determined by the dimension axis.
However, -->


## Area

Similar to `line`, using `area` mark with one dimension (typically on `x`)
and one measure (typically on `y`) produces an area chart.  


Adding color to area chart creates stacked area chart by default.


<!-- normalized area chart -->

(Please look at[Stack Config](config.html#stack-config)'s documentation
for how to customize stacking behavior.)


## Text
