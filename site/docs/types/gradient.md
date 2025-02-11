---
layout: docs
menu: docs
title: Gradient
permalink: /docs/gradient.html
---

A gradient definition specifies a gradient color pattern. Vega-Lite supports either a linear gradient or a radial gradient.

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

## Linear Gradient

A linear gradient interpolates colors along a line, from a starting point to an ending point. By default a linear gradient runs horizontally, from left to right. Use the _x1_, _y1_, _x2_, and _y2_ properties to configure the gradient direction. All coordinates are defined in a normalized [0, 1] coordinate space, relative to the bounding box of the item being colored.

{% include table.html props="gradient,x1,x2,y1,y2,stops" source="LinearGradient" %}

### Example: Gradient Area Plot

Setting the area plot's `color` encoding to `"linear"` gradient value produces a gradient area plot

<div class="vl-example" data-name="area_gradient"></div>

## Radial Gradient

A radial gradient interpolates colors between two circles, from an inner circle boundary to an outer circle boundary. By default a radial gradient runs from the center point of the coordinate system (zero radius inner circle), out to the maximum extent (0.5 radius outer circle). Use the _x1_, _y1_, _x2_, and _y2_ properties to configure the inner and outer circle center points, and use the _r1_ and _r2_ properties to configure the circle radii. All coordinates are defined in a normalized [0, 1] coordinate space, relative to the bounding box of the item being colored. A value of 1 corresponds to the maximum extent of the bounding box (width or height, whichever is larger).

{% include table.html props="gradient,x1,x2,y1,y2,r1,r2,stops" source="RadialGradient" %}

## Gradient Stop

A gradient stop consists of a [Color](#Color) value and an _offset_ progress fraction.

{% include table.html props="color,offset" source="GradientStop" %}
