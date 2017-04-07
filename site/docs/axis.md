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
  ...
}
```

## Customizing Axis

The field's axis can be removed by setting `axis` to `false`. If `axis` is `true`, default axis properties are applied.

Axis properties can be customized by setting `axis` to an axis property object. The `axis` property object supports the following properties:

<!--TODO: add default behavior for each property -->

### Axis Properties
{% assign schema = site.data.vega-lite-schema.definitions %}

#### General

{% include table.html props="domain,orient,offset,position,zindex" source= schema.Axis.properties %}

#### Labels

{% include table.html props="labels,format,labelAngle" source= schema.Axis.properties %}

#### Ticks

{% include table.html props="ticks,labelPadding,labelLimit,tickCount,tickSize,values" source= schema.Axis.properties %}

#### Title

{% include table.html props="title，maxExtent，minExtent" source= schema.Axis.properties %}


### Axis Config

#### General

{% include table.html props="domain,domainColor,domainWidth" source=schema.AxisConfig.properties %}

#### Grid

{% include table.html props="grid,gridColor,gridDash,gridOpacity,gridWidth" source=schema.AxisConfig.properties %}

#### Labels

{% include table.html props="shortTimeLabels" source=schema.AxisConfig.properties %}

#### Ticks

{% include table.html props="tickColor,labelColor,labelFont,labelFontSize,tickWidth" source=schema.AxisConfig.properties %}

#### Title

{% include table.html props="titleColor,titleFont,titleLimit,titleFontWeight,titleFontSize,titlePadding,titleMaxLength" source=schema.AxisConfig.properties %}
