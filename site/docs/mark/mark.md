---
layout: docs
menu: docs
title: Mark
permalink: /docs/mark.html
---

Marks are the basic visual building block of a visualization. They provide basic shapes whose properties (such as position, size, and color) can be used to visually encode data, either from a data field, or a constant value.

The supported `mark` types are
[`"area"`](area.html),
[`"bar"`](bar.html),
[`"circle"`](circle.html),
[`"line"`](line.html),
[`"point"`](point.html),
[`"rect"`](rectangle.html),
[`"rule"`](rule.html),
[`"square"`](square.html),
[`"text"`](text.html),
and [`"tick"`](tick.html).

In general, one mark instance is generated per input data element. However, line and area marks represent multiple data elements as a contiguous line or shape.

<!-- why mark-based approach over chart typology + but we support variety of chart types -->

{: .suppress-error}
```json
// Single View Specification
{
  "data": ... ,
  "mark": ... ,       // mark
  "encoding": ... ,
  ...
}
```

The `mark` property of a [single view specification](spec.html#single-view-spec) can either be (1) a string describing a mark type or (2) a [mark definition object](#mark-def).

For example, a bar chart has `mark` as a simple string `"bar"`.

<span class="vl-example" data-name="bar"></span>

## Documentation Overview
{:.no_toc}

* TOC
{:toc}

## Mark Definition Object
{:#mark-def}


{: .suppress-error}
```json
// Single View Specification
{
  ...
  "mark": {
    "type": ...,       // mark
    ...
  },
  ...
}
```

A mark definition object can contains the following values.

{% include table.html props="type,style,clip,filled,orient,interpolate,tension" source="MarkDef" %}

### Example: Filled Points

By default, `point` marks have filled borders and are transparent inside. Setting `filled` to `true` creates filled points instead.

<span class="vl-example" data-name="point_filled"></span>

### Example: interpolate with `monotone`

<span class="vl-example" data-name="line_monotone"></span>

### Example: interpolate with `line-step` (Step-Chart)

<span class="vl-example" data-name="line_step"></span>

{:#config}
## Mark Config

{: .suppress-error}
```json
// Top-level View Specification
{
  ...
  "config": {
    "mark": ...,
    "area": ...,
    "bar": ...,
    "circle": ...,
    "line": ...,
    "point": ...,
    "rect": ...,
    "rule": ...,
    "square": ...,
    "text": ...,
    "tick": ...
  }
}
```

The `mark` property of the [`config`](config.html) object sets the default properties for all marks. In addition, the `config` object also provides mark-specific config using its mark type as the property name (e.g., `config.area`) for defining default properties for each mark.

Note: If [mark property encoding channels](encoding.html#mark-prop) are specified, these config values will be overridden.

The rest of this section describe groups of properties supported by the `mark` config and all mark-specific configs.  Besides the properties listed below, the following types of marks contain additional mark-specific config properties: [`"bar"`](bar.html#config), [`"text"`](text.html#config), and [`"tick"`](tick.html#config).

### Color

{% include table.html props="filled,color,fill,stroke" source="MarkConfig" %}

### Opacity

{% include table.html props="opacity,fillOpacity,strokeOpacity" source="MarkConfig" %}


### Stroke Style

{% include table.html props="strokeWidth,strokeDash,strokeDashOffset" source="MarkConfig" %}

<!-- one example for custom fill/stroke -->

{:#interpolate}
### Interpolation (for Line and Area Marks)

{% include table.html props="interpolate,tension" source="MarkConfig" %}

{:#orient}
### Orientation (for Bar, Tick, Line, and Area Marks)

{% include table.html props="orient" source="MarkConfig" %}

### Shape Config (for Point)

{% include table.html props="shape" source="MarkConfig" %}


### Point Size Config (for Point, Circle, and Square Marks)

{% include table.html props="size" source="MarkConfig" %}



<!-- TODO: write better explanation for default behavior -->

<!-- TODO: think about better example -->
<!--
#### Example: `"horizontal"` orient in the line.
```json
{
  "data": {"url": "data/cars.json"},
  "mark": "line",
  "encoding": {
    "x": {"field": "Horsepower","type": "quantitative"},
    "y": {"field": "Miles_per_Gallon","type": "quantitative"}
  },
  "config": {
    "mark": {"orient": "horizontal"}
  }
}

```
<script>
vg.embed('#horizontal_line', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/cars.json"},
    "mark": "point",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"}
    },
    "config": {
      "mark": {"filled": true}
    }
  }
});
</script>
<div id="horizontal_line"></div>
---->

