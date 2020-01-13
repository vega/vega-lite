---
layout: docs
menu: docs
title: Parameter Types
permalink: /docs/types.html
---

Reference documentation for common parameter **types** expected by Vega-Lite specification properties.

{:#reference}

<!--prettier-ignore-start-->

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Primitive Types

### Any

Accepts any literal value, including a string, number, boolean, or `null`.

### Array

Accepts array values. For example: `[]`, `[1, 2, 3]`, `["foo", "bar"]`. If individual array items must adhere to a specific type, bracket notation &ndash; such as `Number[]` or `String[]` &ndash; is used to indicate the item type.

In most cases, arrays may also have [signal references](#Signal) as items. For example: `[{"signal": "width"}, {"signal": "height"}]`.

### Boolean

Accepts boolean values. For example: `true`, `false`.

### Color

Accepts a [valid CSS color string](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). For example: `#f304d3`, `#ccc`, `rgb(253, 12, 134)`, `steelblue`.

### Expression

To enable custom calculations, Vega-Lite uses Vega's expression language for writing basic formulas. Each datum object can be referred using bound variable `datum`.

Please read the [Vega documentation for expressions](https://vega.github.io/vega/docs/expressions/) for details.

### Number

Accepts number values. For example: `1`, `3.14`, `1e5`.

### Object

Accepts general object literals. For example: `{"left":5, "right":30, "top":5, "bottom":50}`. The valid object property names and types will vary across parameters; read the individual parameter descriptions for more information.

### String

Accepts general string values. For example: `"bold"`, `"step-before"`, `""`. The valid object property names and types may vary across parameters; read the individual parameter descriptions for more information.

### Text

Accepts string values or arrays of strings (for multi-line text).

### URL

Accepts a valid URL string linking to external site or resource. For example: `"data/stocks.csv"`, `"images/logo.png"`, `"https://vega.github.io/"`.

## Date Time

A DateTime object (in [filter transform](filter.html), [scale domain](scale.html#domain), and [axis](axis.html#ticks)/[legend](legend.html#properties) values) must have at least one of the following properties:

{% include table.html props="year,quarter,month,date,day,hours,minutes,seconds,milliseconds" source="DateTime" %}

For example `{"year": 2006, "month": "jan", "date": 1}` represents _Jan 1, 2006_.

## Gradient

Accepts an object that specifies a gradient color pattern.

For example:

```json
{
  "gradient": "linear",
  "stops": [
    {"offset": 0.0, "color": "red"},
    {"offset": 0.5, "color": "white"},
    {"offset": 1.0, "color": "blue"}
  ]
}
```

### Linear Gradient

A linear gradient interpolates colors along a line, from a starting point to an ending point. By default a linear gradient runs horizontally, from left to right. Use the _x1_, _y1_, _x2_, and _y2_ properties to configure the gradient direction. All coordinates are defined in a normalized [0, 1] coordinate space, relative to the bounding box of the item being colored.

{% include table.html props="gradient,x1,x2,y1,y2,stops" source="LinearGradient" %}

### Radial Gradient

A radial gradient interpolates colors between two circles, from an inner circle boundary to an outer circle boundary. By default a radial gradient runs from the center point of the coordinate system (zero radius inner circle), out to the maximum extent (0.5 radius outer circle). Use the _x1_, _y1_, _x2_, and _y2_ properties to configure the inner and outer circle center points, and use the _r1_ and _r2_ properties to configure the circle radii. All coordinates are defined in a normalized [0, 1] coordinate space, relative to the bounding box of the item being colored. A value of 1 corresponds to the maximum extent of the bounding box (width or height, whichever is larger).

{% include table.html props="gradient,x1,x2,y1,y2,r1,r2,stops" source="RadialGradient" %}

### Gradient Stop

A gradient stop consists of a [Color](#Color) value and an _offset_ progress fraction.

{% include table.html props="color,offset" source="GradientStop" %}

### Example: Gradient Area Plot

Setting the area plot's `color` encoding to `"linear"` gradient value produces a gradient area plot

<div class="vl-example" data-name="area_gradient"></div>
