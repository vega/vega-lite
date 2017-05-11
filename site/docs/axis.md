---
layout: docs
menu: docs
title: Axis
permalink: /docs/axis.html
---

Axes provide axis lines, ticks and labels to convey how a spatial range represents a data range. Simply put, axes visualize scales.

By default, Vega-Lite automatically creates axes for `x`, `y`, `row`, and `column` channels when they are encoded.

Axis can be customized via the `axis` property of a channel definition.
The field's axis can be removed by setting `axis` to `false`. If `axis` is `true`, default axis properties are applied.
As described below, `axis` can also be an [object that defines its properties](#axis-properties).

Besides `axis` property of each encoding channel, the configuration object ([`config`](config.html)) also provides [axis config](#axis-config) (`config: {axis: {...}}`) for setting default axis properties for all axes.


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

<!--TODO: add default behavior for each property -->

## Axis Properties

To customize axis, an `axis` object can contain the following groups of properties:

### General

{% include table.html props="domain,orient,offset,position,zindex" source="Axis" %}

### Labels

{% include table.html props="labels,format,labelAngle,labelPadding" source= "Axis" %}

### Ticks

{% include table.html props="ticks,tickExtra,labelPadding,tickCount,tickSize,values" source="Axis" %}

### Title

{% include table.html props="title,titleAlign,titleAngle,maxExtent,minExtent" source="Axis" %}

{:#axis-config}
## Axis Config

To provide themes for all axes, the axis config `config: {axis: {...}}` can contain the following properties:

### General

{% include table.html props="bandPosition,domain,domainColor,domainWidth,titleX,titleY" source="AxisConfig" %}

### Grid

{% include table.html props="grid,gridColor,gridDash,gridOpacity,gridWidth" source="AxisConfig" %}

### Labels

{% include table.html props="shortTimeLabels" source="AxisConfig" %}

### Ticks

{% include table.html props="tickColor,tickRound,labelColor,labelFont,labelFontSize,labelLimit,tickWidth" source="AxisConfig" %}

### Title

{% include table.html props="titleBaseline,titleColor,titleFont,titleLimit,titleFontWeight,titleFontSize,titlePadding,titleMaxLength" source="AxisConfig" %}
