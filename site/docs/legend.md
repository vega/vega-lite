---
layout: docs
menu: docs
title: Legend
permalink: /docs/legend.html
---

Similar to [axes](axis.html), legends visualize scales. However, whereas axes aid interpretation of scales with spatial ranges, legends aid interpretation of scales with ranges such as colors, shapes and sizes.

By default, Vega-Lite automatically creates legends for `color`, `size`, and `shape` channels when they are encoded. Legend can be further customized via the channel definition's `legend` property.

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

## Customizing Legend

The field's legend can be removed by setting `legend` to `false`.
If `legend` is `true`, default legend properties are applied.


Either Legend properties or Legend Config can be customized. To customize Legend properties, you need to set `legend` to an legend property object. To customize Legend Config, you need set config properties by specifying `config: {legend: {...}}`.


### Legend Properties

Legend properties will apply to the current encoding channel only. Axis properties can be customized by setting `legend` to an legend property object. The `legend` property object supports the following properties:

#### General

{% include table.html props="fillColor,offset,orient,padding,values,format,entryPadding,type,zindex" source="Legend" %}

#### Title

{% include table.html props="title,titleAlign" source="Legend" %}

#### Tick

{% include table.html props="tickCount" source="Legend" %}

{:#legend-config}
### Legend Config

Legend Config will apply to the all encoding channel has `legend`. Legend Config can be customized by setting `config: {legend: {...}}`. Legend Config supports the following configurations:

#### General

{% include table.html props="cornerRadius,fillColor,orient,offset,strokeColor,strokeDash,strokeWidth,padding" source="LegendConfig" %}

#### Labels

{% include table.html props="labelAlign,labelBaseline,labelColor,labelFont,labelFontSize,labelLimit,labelOffset,shortTimeLabels" source="LegendConfig" %}

#### Symbols

{% include table.html props="entryPadding,symbolColor,symbolType,symbolSize,symbolStrokeWidth" source="LegendConfig" %}

#### Title

{% include table.html props="titleAlign,titleBaseline,titleColor,titleFont,titleFontSize,titleFontWeight,titleLimit,titlePadding" source="LegendConfig" %}

#### Gradient

{% include table.html props="gradientLabelBaseline,gradientLabelLimit,gradientLabelOffset,gradientHeight,gradientStrokeColor,gradientStrokeWidth,gradientWidth" source="LegendConfig" %}

