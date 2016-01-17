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
[`bar`](#bar),
[`line`](#line),
[`area`](#area),
[`circle`](#circle),
[`square`](#square),
[`tick`](#tick), and
[`text`](#text) (text table).

## Point

Point mark can be used with any data type.  It also supports all encoding channels.  
You can create a dot plot with `point` mark and either `x` or `y`.

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


If both `x` and `y` are encoded, you get a scatter plot.

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

If you add `size` encoding to a scatter plot, you get a bubble plot instead.  

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

Alternatively, you can map other fields to `color` and `shape`.

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


## Bar




<!--
- How orientation is determined
- Bar can be used to create bar chart, stacked bar chart, layered bar chart and grouped bar chart (when combined with facets)
- (Future -- once we have tooltip) -- playing bar's trick with `detail` channel
-->

## Line

<!--
- Line = ordinal / temporal and typically another measure  
- How sort order is determined
- Custom order for line
- (Future) color
-->

## Area
<!--
- Area = ordinal / temporal and typically another measure  
- How sort order is determined
- Stacking
-->

## Circle and Square

## Tick
<!--
- Supported data type
- How orientation is determined
-->

## Text
