---
layout: docs
menu: docs
title: Axis
permalink: /docs/axis.html
---

Axes provide axis lines, ticks, and labels to convey how a positional range represents a data range. Simply put, axes visualize scales.

By default, Vega-Lite automatically creates axes with default properties for `x` and `y` channels when they encode data fields.
User can set the `axis` property of x- or y-[field definition](encoding.html#field) to an object to customize [axis properties](#axis-properties) or set `axis` to `null` to remove the axis.

Besides `axis` property of a field definition, the configuration object ([`config`](config.html)) also provides [axis config](#config) (`config: {axis: {...}}`) for setting default axis properties for all axes.


## Documentation Overview
{:.no_toc}

- TOC
{:toc}


## Axis Properties


{: .suppress-error}
```json
// Single View Specification
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
  }
}
```

{:#properties}

To customize axis, you can specify an `axis` object in [an encoding channel's definition](encoding.html).  This section lists all properties of axes.

_See also:_ This [interactive article](https://beta.observablehq.com/@jheer/a-guide-to-guides-axes-legends-in-vega) demonstrates axes and legends in the underlying Vega language.

{:#general}
### General

{% include table.html props="bandPosition,maxExtent,minExtent,orient,offset,position,zindex" source="Axis" %}

__See also:__ [General Axis Config](#general-config).

{:#domain}
### Domain

{% include table.html props="domain,domainColor,domainOpacity,domainWidth" source="Axis" %}

{:#labels}
### Labels

{% include table.html props="format,labels,labelAlign,labelAngle,labelBaseline,labelBound,labelColor,labelFlush,labelFlushOffset,labelFont,labelFontSize,labelFontWeight,labelLimit,labelOpacity,labelOverlap,labelPadding" source= "Axis" %}

__See also:__  [`guide-label` style config](mark.html#style-config) (common styles for axis, [legend](legend.html), and [header](facet.html#header) labels).

{:#ticks}
### Ticks

{% include table.html props="tickColor,tickCount,tickExtra,tickOffset,tickOpacity,tickRound,ticks,tickSize,tickStep,tickWidth,values" source="Axis" %}

{:#title}
### Title

{% include table.html props="title,titleAlign,titleAngle,titleBaseline,titleColor,titleFont,titleFontSize,titleFontWeight,titleLimit,titleOpacity,titlePadding,titleX,titleY" source="Axis" %}

For example, the following plot has a customized x-axis title.

<div class="vl-example" data-name="bar_1d"></div>


__See also:__ [Axis Title Config](#title-config) and [`guide-title` style config](mark.html#style-config) (common styles for axis, [legend](legend.html), and [header](facet.html#header) titles).

### Grid

{% include table.html props="grid,gridColor,gridDash,gridOpacity,gridWidth" source="Axis" %}

<!--
### Custom Axis Encodings

**TODO** (We have `encoding` property akin to [Vega's axis `encode`](https://vega.github.io/vega/docs/axes/#custom-axis-encodings), but within each element's block, we do not have `enter/update/exit`.)
-->

{:#config}
## Axis Config

{: .suppress-error}
```json
// Top-level View Specification
{
  ...
  "config": {
    "axis": : ...,
    "axisX": : ...,
    "axisY": : ...,
    "axisLeft": : ...,
    "axisRight": : ...,
    "axisTop": : ...,
    "axisBottom": : ...,
    "axisBand": : ...,
    ...
  }
}
```

Axis configuration defines default settings for axes. Properties defined under the `"axis"` property in the top-level [`config`](config.html) object are applied to _all_ axes.

Additional property blocks can target more specific axis types based on the orientation (`"axisX"`, `"axisY"`, `"axisLeft"`, `"axisTop"`, etc.) or band scale type (`"axisBand"`). For example, properties defined under the `"axisBand"` property will only apply to axes visualizing `"band"` scales. If multiple axis config blocks apply to a single axis, type-based options take precedence over orientation-based options, which in turn take precedence over general options.

An axis configuration supports all [axis properties](#properties) except `position`, `orient`, `format`, `tickCount`, `title`, `values`, and `zindex`.

The `shortTimeLabels` property is also available for the general axis config (`config.axis`), but not for specific axis config (e.g., `config.axisX`).

{% include table.html props="shortTimeLabels" source="AxisConfig" %}

__See also:__ [Axis Labels Properties](#labels) and [`guide-label` style config](mark.html#style-config) (common styles for by axis, [legend](legend.html), and [header](facet.html#header) labels).


<!-- hide as `grid` in axis config does not work yet.
### Axis Config Example

Setting axis config's `domain` and `grid` to `false` hides all axis domain lines and grids.

<div class="vl-example" data-name="point_no_axis_domain_grid"></div> -->
