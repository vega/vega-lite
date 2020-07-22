---
layout: docs
menu: docs
title: Legend
permalink: /docs/legend.html
---

Similar to [axes](axis.html), legends visualize scales. However, whereas axes aid interpretation of scales with positional ranges, legends aid interpretation of scales with ranges such as colors, shapes and sizes.

By default, Vega-Lite automatically creates legends with default properties for `color`, `opacity`, `size`, and `shape` channels when they encode data fields. User can set the `legend` property of a [mark property channel's field definition](encoding.html#mark-prop) to an object to customize [legend properties](#legend-properties) or set `legend` to `null` to remove the legend.

Besides `legend` property of a field definition, the configuration object ([`config`](config.html)) also provides [legend config](#config) (`config: {legend: {...}}`) for setting default legend properties for all legends.

<!-- prettier-ignore -->
- TOC
{:toc}

## Legend Types

By default, Vega-Lite automatically generates gradient legends for color channels with non-binned quantitative fields and temporal fields.

<div class="vl-example" data-name="point_color_quantitative"></div>

Otherwise, symbol legends are generated.

<div class="vl-example" data-name="point_color"></div>

## Combined Legend

If multiple channels encode the same fields, Vega-Lite automatically combines their legends. For example, the following plot uses both `color` and `shape` to encode `Origin`; as a result, its legend shows the encoded colors and shapes.

<div class="vl-example" data-name="point_color_with_shape"></div>

## Legend Properties

```js
// A Single View or a Layer Specification
{
  ...,
  "mark/layer": ...,
  "encoding": {
    "x": ...,
    "y": ...,
    "color": {
      "field": ...,
      "type": ...,
      "legend": {                // legend
        ...
      },
      ...
    },
    ...
  }
}
```

To customize legends, you can specify a `legend` object in [an encoding channel's definition](encoding.html). This section lists all properties of legends.

_See also:_ This [interactive article](https://beta.observablehq.com/@jheer/a-guide-to-guides-axes-legends-in-vega) demonstrates axes and legends in the underlying Vega language.

{:#properties}

### General

{% include table.html props="aria,cornerRadius,description,direction,fillColor,legendX,legendY,offset,orient,padding,strokeColor,type,tickCount,values,zindex" source="Legend" %}

### Gradient

{% include table.html props="gradientLength,gradientOpacity,gradientStrokeColor,gradientStrokeWidth,gradientThickness" source="Legend" %}

### Labels

{% include table.html props="format,formatType,labelAlign,labelBaseline,labelColor,labelFont,labelFontSize,labelFontStyle,labelLimit,labelOffset,labelOverlap" source="Legend" %}

### Symbols

{% include table.html props="symbolDash,symbolDashOffset,symbolFillColor,symbolOffset,symbolOpacity,symbolSize,symbolStrokeColor,symbolStrokeWidth,symbolType" source="Legend" %}

### Symbol Layout

{% include table.html props="clipHeight,columnPadding,columns,gridAlign,rowPadding,symbolLimit" source="Legend" %}

### Title

{% include table.html props="title,titleAlign,titleAnchor,titleBaseline,titleColor,titleFont,titleFontSize,titleFontStyle,titleFontWeight,titleLimit,titleLineHeight,titleOpacity,titlePadding" source="Legend" %}

<!--
### Custom Legend Encodings

**TODO** (We have `encoding` property akin to [Vega's axis `encode`](https://vega.github.io/vega/docs/legends/#custom-legend-encodings), but within each element's block, we do not have `enter/update/exit`.)
-->

{:#config}

## Legend Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "legend": {
      ...
    }
  }
}
```

To provide themes for all legends, the legend config (`config: {legend: {...}}`) supports all [legend properties](#properties) except `direction` (there are legend-specific `gradientDirection` and `symbolDirection` instead), `format`, `tickCount`, `values`, and `zindex`.

The legend configuration also supports the following properties:

{% include table.html props="disable,gradientDirection,gradientHorizontalMaxLength,gradientHorizontalMinLength,gradientLabelLimit,gradientLabelOffset,gradientVerticalMaxLength,gradientVerticalMinLength,symbolBaseFillColor,symbolBaseStrokeColor,symbolDirection,unselectedOpacity" source="LegendConfig" %}
