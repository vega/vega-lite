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
[`"tick"`](tick.html),
and [`"geoshape"`](geoshape.html).
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

The `mark` property of a [single view specification](spec.html#single) can either be (1) a string describing a mark type or (2) a [mark definition object](#mark-def).

For example, a bar chart has `mark` as a simple string `"bar"`.

<span class="vl-example" data-name="bar"></span>

## Documentation Overview
{:.no_toc}

- TOC
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

A mark definition object can contains the following properties and [all properties of the mark config](#config):

{% include table.html props="type,style,clip" source="MarkDef" %}

### Example: Filled Points

By default, `point` marks have filled borders and are transparent inside. Setting `filled` to `true` creates filled points instead.

<span class="vl-example" data-name="point_filled"></span>

### Example: Interpolate with `monotone`

<span class="vl-example" data-name="line_monotone"></span>

### Example: Interpolate with `line-step` (Step-Chart)

<span class="vl-example" data-name="line_step"></span>

### Example: Offsetting Labels

You can use [`text`](text.html) marks as labels and set its offset (`dx` or `dy`), `align`, and `baseline` properties of the mark definition.

<span class="vl-example" data-name="layer_bar_labels"></span>


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
    "geoshape": ...,
    "square": ...,
    "text": ...,
    "tick": ...
  }
}
```

The `mark` property of the [`config`](config.html) object sets the default properties for all marks. In addition, the `config` object also provides mark-specific config using its mark type as the property name (e.g., `config.area`) for defining default properties for each mark.

Note: If [mark property encoding channels](encoding.html#mark-prop) are specified, these config values will be overridden.

The rest of this section describe groups of properties supported by the `mark` config and all mark-specific configs.  Besides the properties listed below, [`"bar"`](bar.html#config), [`"text"`](text.html#config), and [`"tick"`](tick.html#config) marks contain additional mark-specific config properties:

### Color

{% include table.html props="filled,color,fill,stroke" source="MarkConfig" %}

### Opacity

{% include table.html props="opacity,fillOpacity,strokeOpacity" source="MarkConfig" %}

### Stroke Style

{% include table.html props="strokeWidth,strokeDash,strokeDashOffset" source="MarkConfig" %}

{:#hyperlink}
### Hyperlink Properties

Marks can act as hyperlinks when the `href` property or [channel](encoding.html#href) is defined. A `cursor` property can also be provided to serve as affordance for the links.

{% include table.html props="href,cursor" source="MarkConfig" %}

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


### Text Config (for Text Marks)

{% include table.html props="angle,align,baseline,dx,dy,font,fontSize,fontStyle,fontWeight,radius,text,theta" source="MarkConfig" %}


{:#style-config}
## Mark Style Config

{: .suppress-error}
```json
{
  // Top Level Specification
  "config": {
    "style": {
      ...
    }
    ...
  }
}
```

In addition to the default mark properties above, default values can be further customized using named _styles_ defined under the `style` property in the config object.

{% include table.html props="style" source="Config" %}

For example, to set a default shape and stroke width for `point` marks with a style named `"triangle"`:

{: .suppress-error}
```json
{
  "style": {
    "triangle": {
      "shape": "triangle-up",
      "strokeWidth": 2
    }
  }
}
```

Styles can then be invoked by including a `style` property within a [mark definition object](#mark-def).

In addition to custom `style` names, Vega-Lite includes the following built-in style names:

- `"guide-label"`: style for axis, legend, and header labels
- `"guide-title"`: style for axis, legend, and header titles

### Example: Styling Labels

You can use [`text` marks](text.html) as labels for other marks by setting `style` for the marks and using [style config](mark.html#style-config) to configure offset (`dx` or `dy`), `align`, and `baseline`.

<span class="vl-example" data-name="layer_bar_labels_style"></span>

See also: [a similar example that uses mark definition to configure offset, align, and baseline](text.html#labels).
