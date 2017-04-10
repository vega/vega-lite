---
layout: docs
menu: docs
title: Axis
permalink: /docs/axis.html
---

Axes provide axis lines, ticks and labels to convey how a spatial range represents a data range. Simply put, axes visualize scales.

By default, Vega-Lite automatically creates axes for `x`, `y`, `row`, and `column` channels when they are encoded. Axis can be customized via the `axis` property of a channel definition.

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": ... ,
  "encoding": {
    "x": {
      "field": ...,
      "type": ...,
      "axis": {                // Axis
        ...
      },
      ...
    },
    "y": ...,
    ...
  },
  "config": {
    "axis": {
      ...                       // Axis Config
    },
    ...
  }
  ...
}
```

## Customizing Axis

The field's axis can be removed by setting `axis` to `false`. If `axis` is `true`, default axis properties are applied.

Either Axis properties or Axis Config can be customized. To customize Axis properties, you need to set `axis` to an axis property object. To customize Axis Config, you need set config properties by specifying `config: {axis: {...}}`.

<!--TODO: add default behavior for each property -->

### Axis Properties

Axis properties will apply to the current encoding channel only. Axis properties can be customized by setting `axis` to an axis property object. The `axis` property object supports the following properties:

#### General

{% include table.html props="domain,orient,offset,position,zindex" source="Axis" %}

#### Labels

{% include table.html props="labels,format,labelAngle" source= "Axis" %}

#### Ticks

{% include table.html props="ticks,labelPadding,tickCount,tickSize,values" source="Axis" %}

#### Title

{% include table.html props="title,maxExtent,minExtent" source="Axis" %}


### Axis Config

Axis Config will apply to the all encoding channel has `axis`. Axis Config can be customized by setting `config: {axis: {...}}`. Axis Config supports the following configurations:

#### General

{% include table.html props="domain,domainColor,domainWidth" source="AxisConfig" %}

#### Grid

{% include table.html props="grid,gridColor,gridDash,gridOpacity,gridWidth" source="AxisConfig" %}

#### Labels

{% include table.html props="shortTimeLabels" source="AxisConfig" %}

#### Ticks

{% include table.html props="tickColor,labelColor,labelFont,labelFontSize,labelLimit,tickWidth" source="AxisConfig" %}

#### Title

{% include table.html props="titleColor,titleFont,titleLimit,titleFontWeight,titleFontSize,titlePadding,titleMaxLength" source="AxisConfig" %}
