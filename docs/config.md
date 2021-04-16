---
layout: docs
menu: docs
title: Configuration
permalink: /docs/config.html
---

```js
{
  ...,
  "config": {                // Configuration Object
    ...                      // - Top-level Configuration
    "axis"      : { ... },   // - Axis Configuration
    "header"    : { ... },   // - Header Configuration
    "legend"    : { ... },   // - Legend Configuration
    "mark"      : { ... },   // - Mark Configuration
    "style"     : { ... },   // - Style Configuration
    "range"     : { ... },   // - Scale Range Configuration
    "scale"     : { ... },   // - Scale Configuration
    "projection": { ... },   // - Projection Configuration
    "selection" : { ... },   // - Selection Configuration
    "title"     : { ... },   // - title Configuration
    "view"      : { ... }    // - View Configuration
    "concat"    : { ... }    // - Concat Configuration
    "facet"     : { ... }    // - Facet Configuration
    "repeat"    : { ... }    // - Repeat Configuration
    "locale"    : { ... }    // - Locale Configuration
    "aria"      : ...        // - Aria Configuration
  }
}
```

Vega-Lite's `config` object lists configuration properties of a visualization for creating a consistent theme. (This `config` object in Vega-Lite is a superset of [Vega config](https://vega.github.io/vega/docs/config/).)

The rest of this page outlines different types of config properties:

<!-- prettier-ignore -->
- TOC
{:toc}

{:#top-level-config}

## Top-level Configuration

A Vega-Lite `config` object can have the following top-level properties:

{% include table.html props="autosize,background,countTitle,fieldTitle,font,lineBreak,padding" source="Config" %}

{:#format}

## Format Configuration

These two config properties define the default number and time formats for text marks as well as axes, headers, and legends:

{% include table.html props="numberFormat,timeFormat,customFormatTypes" source="Config" %}

{:#custom-format-type}

### Providing Custom Formatters

To customize how Vega-Lite formats numbers or text, you can register a new formatter by (1) registering [an expression function](https://vega.github.io/vega/docs/api/extensibility/#expressions) that takes a data point and an optional format property and (2) setting the `customFormatTypes` config to `true`. For example, to register `customFormatA`, you run need to register the function:

```js
vega.expressionFunction('customFormatA', function(datum, params) {
  ...
  return "<formatted string>";
});
```

You can then use this custom format function with `format` and `formatType` properties in text encodings and guides (axis/legend/header).

```json
{
  "format": <params>,
  "formatType": "customFormatA"
}
```

{:#axis-config}

## Guide Configurations

### Axis Configurations

Axis configurations define default settings for axes. Properties defined under the main `"axis"` object are applied to _all_ axes. Additional property blocks can target more specific axis types based on the orientation (`"axisX"`, `"axisY"`, `"axisLeft"`, `"axisTop"`, etc.), band scale type (`"axisBand"`), scale's data type (`"axisDiscrete"`, `"axisQuantitative"`, and `"axisTemporal"`), or both orientation and scale/data type (e.g., `"axisXTemporal"`). For example, properties defined under the `"axisBand"` property will only apply to axes visualizing `"band"` scales. If multiple axis config blocks apply to a single axis, type-based options take precedence over orientation-based options, which in turn take precedence over general options.

See more details in the [axis documentation](axis.html#config).

{% include table.html props="axis,axisX,axisY,axisLeft,axisRight,axisTop,axisBottom,axisBand,axisPoint,axisDiscrete,axisQuantitative,axisTemporal,axisXBand,axisXPoint,axisXDiscrete,axisXQuantitative,axisXTemporal,axisYBand,axisYPoint,axisYDiscrete,axisYQuantitative,axisYTemporal" source="Config" %}

{:#header-config}

### Header Configuration

{% include table.html props="header" source="Config" %}

{:#legend-config}

### Legend Configuration

{% include table.html props="legend" source="Config" %}

{:#guide-config}

### Built-in Guide Styles

In addition to axis, header, and legend styles, Vega-Lite also includes the following built-in styles that are shared across different kinds of guides:

- `"guide-label"`: style for axis, legend, and header labels
- `"guide-title"`: style for axis, legend, and header titles
- `"group-title"`: styles for chart titles

See [the documentation about the style configuration](mark.html#style-config) for more information.

{:#mark-config}

## Mark Configurations

The `mark` property of the [`config`](config.html) object sets the default properties for all marks. In addition, the `config` object also provides mark-specific config using its mark type as the property name (e.g., `config.area`) for defining default properties for each mark.

{% include table.html props="mark,area,bar,circle,line,point,rect,geoshape,rule,square,text,tick" source="Config" %}

## Style Configuration

In addition to the axis and mark config above, default values can be further customized using named _styles_ defined under the `style` block. Styles can then be invoked by including a `style` property within a [mark definition object](mark.html#mark-def) or an [axis definition object](axis.html).

See [the documentation about the mark style configuration](mark.html#style-config) for more information about how to use style configuration to customize mark style.

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

{:#view-config}

## View & View Composition Configuration

{% include table.html props="view,concat,facet" source="Config" %}

Each of the view composition configurations (`concat` and `facet`) supports the following properties:

{% include table.html props="columns,spacing" source="CompositionConfig" %}

Repeat uses the same configuration as concatenation.

{:#aria-config}

## Locale Configuration

{% include table.html props="locale" source="Config" %}

## ARIA Configuration

{% include table.html props="aria" source="Config" %}
