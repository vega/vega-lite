---
layout: docs
menu: docs
title: Axis
permalink: /docs/axis.html
---

Axes provide axis lines, ticks and labels to convey how a spatial range represents a data range. Simply put, axes visualize scales.

By default, Vega-Lite automatically creates axes for `x` and `y` channels when they are encoded.
If `axis` is not defined, default axis properties are applied. User can set `axis` to an object to customize [axis properties](#axis-properties) or set `axis` to `null` to remove the axis.

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

## Documentation Overview
{:.no_toc}

* TOC
{:toc}


<!--TODO: add default behavior for each property -->

## Axis Properties

To customize axis, an `axis` object in [an encoding channel's definition](encoding.html) can contain the following groups of properties:

### General

{% include table.html props="domain,grid,orient,offset,position,zindex" source="Axis" %}

### Labels

{% include table.html props="format,labels,labelAngle,labelPadding" source= "Axis" %}

### Ticks

{% include table.html props="ticks,tickCount,tickExtra,tickSize,values" source="Axis" %}

### Title

{% include table.html props="maxExtent,minExtent,title,titleAlign,titleAngle,titleMaxLength,titlePadding" source="Axis" %}

### Custom Axis Encodings

**TODO** (We have `encoding` property akin to [Vega's axis `encode`](https://vega.github.io/vega/docs/axes/#custom-axis-encodings), but within each element's block, we do not have `enter/update/exit`.)

{:#axis-config}
## Axis Config

To provide themes for all axes, the axis config `config: {axis: {...}}` can contain the following properties:

### General

{% include table.html props="bandPosition,domain,domainColor,domainWidth,titleX,titleY" source="AxisConfig" %}

### Grid

{% include table.html props="grid,gridColor,gridDash,gridOpacity,gridWidth" source="AxisConfig" %}

### Labels

{% include table.html props="labels,labelAngle,labelColor,labelFont,labelFontSize,labelLimit,labelPadding,shortTimeLabels" source="AxisConfig" %}

### Ticks

{% include table.html props="ticks,tickColor,tickExtra,tickRound,tickSize,tickWidth" source="AxisConfig" %}

### Title

{% include table.html props="titleAlign,titleAngle,titleBaseline,titleColor,titleFont,titleFontWeight,titleFontSize,titleLimit,titleMaxLength,titlePadding,maxExtent,minExtent" source="AxisConfig" %}

