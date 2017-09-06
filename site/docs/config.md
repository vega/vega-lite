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
  "config": {             // Configuration Object
    ...                   // - Top-level Configuration
    "selection": { ... }, // - Selection Configuration
    "cell": { ... },      // - Cell Configuration
    "axis": { ... },      // - Axis Configuration
    "legend": { ... },    // - Legend Configuration
    "mark": { ... },      // - Mark Configuration
    "style": { ... },     // - Mark Style Configuration
    "range": { ... },     // - Scale Range Configuration
    "scale": { ... },     // - Scale Configuration
    "title": { ... }      // - title Configuration
  }
}
```

Vega-Lite's `config` object lists configuration properties of a visualization for creating a consistent theme. This page outlines different types of config properties:

* TOC
{:toc}

{:#top-level-config}
## Top-level Configuration

A Vega-Lite `config` object can have the following top-level properties:

{:#format}

{% include table.html props="autoResize,background,countTitle,invalidValues,numberFormat,padding,timeFormat" source="Config" %}

<!-- TODO: consider adding width, height, numberFormat, timeFormat  -->
<!-- TODO: move range to its own section -->

{:#selection-config}
## Selection Configuration

{: .suppress-error}
```json
{
  ...,
  "config": {          // Configuration Object
    "selection": { ... },   // - Selection Configuration
    ...
  }
}
```

The selection configuration determines the default properties and transformations applied to [selections](selection.html).

{% include table.html props="single,multi,interval" source="SelectionConfig" %}

{:#cell-config}
## Cell Configuration

{: .suppress-error}
```json
{
  ...,
  "config": {          // Configuration Object
    "cell": { ... },   // - Cell Configuration
    ...
  }
}
```

At its core, a Vega-Lite specification describes a single plot. When a [facet channel](encoding.html#facet) is added, the visualization is faceted into a trellis plot, which contains multiple plots.
Each plot in either a single plot or a trellis plot is called a _cell_. Cell configuration allows us to customize each single plot and each plot in a trellis plot.

### Cell Size Configuration

`width` and `height` property of the cell configuration determine the width of a visualization with a continuous x-scale and the height of a visualization with a continuous y-scale respectively.

{% include table.html props="width,height" source="CellConfig" %}

**For more information about visualization's size, please see [Customizing Size](size.html) page.**

### Cell Style Configuration

{% include table.html props="clip,fill,fillOpacity,stroke,strokeOpacity,strokeWidth,strokeDash,strokeDashOffset" source="CellConfig" %}


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

{% include table.html props="mark,area,bar,circle,line,point,rect,rule,square,text,tick" source="Config" %}

In addition to the default mark properties above, default values can be further customized using named _styles_ defined under the `style` block. Styles can then be invoked by including a `style` property within a [mark definition object](#mark-def).

{% include table.html props="style" source="Config" %}

{:#scale-config}
## Scale and Scale Range Configuration

{% include table.html props="scale,range" source="Config" %}

{:#title-config}
## Title Configuration

{% include table.html props="title" source="Config" %}
