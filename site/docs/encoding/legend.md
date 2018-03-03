---
layout: docs
menu: docs
title: Legend
permalink: /docs/legend.html
---

Similar to [axes](axis.html), legends visualize scales. However, whereas axes aid interpretation of scales with positional ranges, legends aid interpretation of scales with ranges such as colors, shapes and sizes.

By default, Vega-Lite automatically creates legends with default properties for `color`, `opacity`, `size`, and `shape` channels when they encode data fields.
User can set the `legend` property of a [mark property channel's field definition](encoding.html#mark-prop) to an object to customize [legend properties](#legend-properties) or set `legend` to `null` to remove the legend.

Besides `legend` property of a field definition, the configuration object ([`config`](config.html)) also provides [legend config](#config) (`config: {legend: {...}}`) for setting default legend properties for all legends.

- TOC
{:toc}

## Legend Types

By default, Vega-Lite automatically generates gradient legends for color channels with
non-binned quantitative fields and temporal fields.

<div class="vl-example" data-name="point_color_quantitative"></div>

Otherwise, symbol legends are generated.

<div class="vl-example" data-name="point_color"></div>


## Combined Legend

If multiple channels encode the same fields, Vega-lite automatically combines their legends. For example, the following plot uses both `color` and `shape` to encode `Origin`; as a result, its legend shows the encoded colors and shapes.

<div class="vl-example" data-name="point_color_with_shape"></div>

## Legend Properties

{: .suppress-error}
```json
// Single View Specification
{
  "data": ... ,
  "mark": ... ,
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

To customize legends, a `legend` object in [an encoding channel's definition](encoding.html) can contain the following properties:

{:#properties}

{% include table.html props="type,entryPadding,format,offset,orient,padding,tickCount,title,values,zindex" source="Legend" %}

<!--
### Custom Legend Encodings

**TODO** (We have `encoding` property akin to [Vega's axis `encode`](https://vega.github.io/vega/docs/legends/#custom-legend-encodings), but within each element's block, we do not have `enter/update/exit`.)
-->

{:#config}
## Legend Config

{: .suppress-error}
```json
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

To provide themes for all legends, the legends config (`config: {legend: {...}}`) can contain the following properties:

### General

{% include table.html props="cornerRadius,fillColor,orient,offset,strokeColor,strokeDash,strokeWidth,padding" source="LegendConfig" %}

### Gradient

{% include table.html props="gradientLabelBaseline,gradientLabelLimit,gradientLabelOffset,gradientStrokeColor,gradientStrokeWidth,gradientHeight,gradientWidth" source="LegendConfig" %}

### Labels

{% include table.html props="labelAlign,labelBaseline,labelColor,labelFont,labelFontSize,labelLimit,labelOffset,shortTimeLabels" source="LegendConfig" %}

### Symbols

{% include table.html props="entryPadding,symbolColor,symbolType,symbolSize,symbolStrokeWidth" source="LegendConfig" %}

### Title

{% include table.html props="titleAlign,titleBaseline,titleColor,titleFont,titleFontSize,titleFontWeight,titleLimit,titlePadding" source="LegendConfig" %}

