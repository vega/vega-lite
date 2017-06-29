---
layout: docs
menu: docs
title: Legend
permalink: /docs/legend.html
---

Similar to [axes](axis.html), legends visualize scales. However, whereas axes aid interpretation of scales with spatial ranges, legends aid interpretation of scales with ranges such as colors, shapes and sizes.

By default, Vega-Lite automatically creates legends for `color`, `size`, and `shape` channels when they are encoded. 
If `legend` is not defined, default legend properties are applied. User can  set `legend` to an object to customize [legend properties](#legend-properties) or set `legend` to `null` to remove the legend.

Besides `legend` property of each encoding channel, the configuration object ([`config`](config.html)) also provides [legend config](#legend-config) (`config: {legend: {...}}`) for setting default legend properties for all legends.


{: .suppress-error}
```json
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
  },
  "config":{
    "legend": {
      ...                       // legend config
    }
  }
  ...
}
```

* TOC
{:toc}


## Legend Properties

To customize legend, a `legend` object in [an encoding channel's definition](encoding.html) can contain the following groups of properties:



### General

{% include table.html props="entryPadding,fillColor,format,offset,orient,padding,type,values,zindex" source="Legend" %}

### Tick

{% include table.html props="tickCount" source="Legend" %}

### Title

{% include table.html props="title,titleAlign" source="Legend" %}

### Custom Legend Encodings

**TODO** (We have `encoding` property akin to [Vega's axis `encode`](https://vega.github.io/vega/docs/legends/#custom-legend-encodings), but within each element's block, we do not have `enter/update/exit`.)

{:#legend-config}
## Legend Config

Legend Config will apply to the all encoding channel has `legend`. Legend Config can be customized by setting `config: {legend: {...}}`. Legend Config supports the following configurations:

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

