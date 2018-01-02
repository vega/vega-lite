---
layout: docs
menu: docs
title: Configuration
permalink: /docs/config.html
---

{: .suppress-error}
```json
{
  ...,
  "config": {                // Configuration Object
    ...                      // - Top-level Configuration
    "axis"      : { ... },   // - Axis Configuration
    "legend"    : { ... },   // - Legend Configuration
    "mark"      : { ... },   // - Mark Configuration
    "style"     : { ... },   // - Mark Style Configuration
    "range"     : { ... },   // - Scale Range Configuration
    "scale"     : { ... },   // - Scale Configuration
    "projection": { ... },   // - Projection Configuration
    "selection" : { ... },   // - Selection Configuration
    "title"     : { ... },   // - title Configuration
    "view"      : { ... }    // - View Configuration
  }
}
```

Vega-Lite's `config` object lists configuration properties of a visualization for creating a consistent theme. (This `config` object in Vega-Lite is a superset of [Vega config](https://vega.github.io/vega/docs/config/).)

The rest of this page outlines different types of config properties:

* TOC
{:toc}

{:#top-level-config}
## Top-level Configuration

A Vega-Lite `config` object can have the following top-level properties:

{:#format}

{% include table.html props="autosize,background,countTitle,fieldTitle,invalidValues,numberFormat,padding,stack,timeFormat" source="Config" %}

{:#axis-config}
## Axis Configurations

Axis configuration defines default settings for axes. Properties defined under the `"axis"` property in the config object are applied to _all_ axes.

Additional property blocks can target more specific axis types based on the orientation (`"axisX"`, `"axisY"`, `"axisLeft"`, `"axisTop"`, etc.) or band scale type (`"axisBand"`). For example, properties defined under the `"axisBand"` property will only apply to axes visualizing `"band"` scales. If multiple axis config blocks apply to a single axis, type-based options take precedence over orientation-based options, which in turn take precedence over general options.

{% include table.html props="axis,axisX,axisY,axisLeft,axisRight,axisTop,axisBottom,axisBand" source="Config" %}


{:#legend-config}
## Legend Configuration

{% include table.html props="legend" source="Config" %}

{:#mark-config}
## Mark and Mark Style Configurations

The `mark` property of the [`config`](config.html) object sets the default properties for all marks. In addition, the `config` object also provides mark-specific config using its mark type as the property name (e.g., `config.area`) for defining default properties for each mark.

{% include table.html props="mark,area,bar,circle,line,point,rect,geoshape,rule,square,text,tick" source="Config" %}

In addition to the default mark properties above, default values can be further customized using named _styles_ defined under the `style` block. Styles can then be invoked by including a `style` property within a [mark definition object](mark.html#mark-def).

{% include table.html props="style" source="Config" %}

{:#scale-config}
## Scale and Scale Range Configuration

{% include table.html props="scale,range" source="Config" %}

{:#projection-config}
## Projection Configuration

{% include table.html props="projection" source="Config" %}

{:#selection-config}
## Selection Configuration

{% include table.html props="selection" source="Config" %}

{:#title-config}
## Title Configuration

{% include table.html props="title" source="Config" %}

## View Configuration

{% include table.html props="view" source="Config" %}
