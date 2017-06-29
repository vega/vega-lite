---
layout: docs
menu: docs
title: Axis
permalink: /docs/axis.html
---

Axes provide axis lines, ticks and labels to convey how a spatial range represents a data range. Simply put, axes visualize scales.

By default, Vega-Lite automatically creates axes for `x` and `y` channels when they are encoded.
If `axis` is not defined, default axis properties are applied. User can provide set `axis` to an object to customize [axis properties](#axis-properties) or set `axis` to `null` to remove the axis.

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

* TOC
{:toc}


<!--TODO: add default behavior for each property -->

## Axis Properties

To customize axis, an `axis` object in [an encoding channel's definition](encoding.html) can contain the following groups of properties:

### General

{% include table.html props="domain,grid,orient,offset,position,zindex" source="Axis" %}

### Labels

{% include table.html props="labels,format,labelAngle,labelPadding" source= "Axis" %}

### Ticks

{% include table.html props="ticks,tickExtra,tickCount,tickSize,values" source="Axis" %}

### Title

{% include table.html props="title,titleAlign,titleAngle,titleMaxLength,titlePadding,maxExtent,minExtent" source="Axis" %}

### Custom Axis Encodings

**TODO**

{:#axis-config}
## Axis Config

To provide themes for all axes, the axis config `config: {axis: {...}}` can contain the following properties:

### General

{% include table.html props="bandPosition,domain,domainColor,domainWidth,titleX,titleY" source="AxisConfig" %}

### Grid

{% include table.html props="grid,gridColor,gridDash,gridOpacity,gridWidth" source="AxisConfig" %}

### Labels

{% include table.html props="labels,labelAngle,labelPadding,labelColor,labelFont,labelFontSize,labelLimit,shortTimeLabels" source="AxisConfig" %}

### Ticks

{% include table.html props="ticks,tickColor,tickExtra,tickRound,tickSize,tickWidth" source="AxisConfig" %}

### Title

{% include table.html props="maxExtent,minExtent,titleAlign,titleAngle,titleBaseline,titleColor,titleFont,titleLimit,titleFontWeight,titleFontSize,titlePadding,titleMaxLength" source="AxisConfig" %}

