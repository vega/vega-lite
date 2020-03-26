---
layout: docs
menu: docs
title: Header
permalink: /docs/header.html
---

Headers provide a title and labels for [faceted plots](facet.html). A header's title describes the field that is used to facet the plot, while a header's labels describe that field's value for each subplot.

By default, Vega-Lite automatically creates headers with default properties for `row` and `column` channels of a faceted view. User can set the `header` property of row- or column-[field definition](facet.html#field-def) to an object to customize [header properties](#header-properties).

In addition to the `header` property of a row- or column-field definition, users can also set default header properties for all headers with the configuration object's ([`config`](config.html)) [header configuration](#config) (`config: {header: {...}}`).

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Header Properties

```js
// A Single View or a Layer Specification
{
  ...,
  "mark/layer": ...,
  "encoding": {
    "row": {
      "field": ...,
      "type": ...,
      "header": {...}, // Header
      ...
    },
    "x": ...,
    "y": ...,
    ...
  }
}
```

```js
// A Facet Specification
{
  ...,
  "facet": {
    "row/column": {
      "field": ...,
      "type": ...,
      "header": {...}, // Header
      ...
    },
    ...
  },
  "spec": ...
}
```

To customize header, a `header` definiton in row- or column-[field definitions](facet.html#mapping) can contain the following groups of properties:

{:#general}

### General

{% include table.html props="title" source="Header" %}

**See also:** You may also use `guide-title` and `guide-label` [style configs](mark.html#style-config) to customize common styles for [axis](axis.html), [legend](legend.html), and [header](header.html) labels and titles.

{:#labels}

### Labels

{% include table.html props="format,formatType,labelAlign,labelAnchor,labelAngle,labelBaseline,labelColor,labelExpr,labelFont,labelFontSize,labelFontStyle,labelFontWeight,labelLimit,labelLineHeight,labelOrient,labelPadding" source= "Header" %}

{:#title}

### Title

{% include table.html props="titleAlign,titleAnchor,titleAngle,titleBaseline,titleColor,titleFont,titleFontWeight,titleFontSize,titleFontStyle,titleFontWeight,titleLimit,titleLineHeight,titleOrient,titlePadding" source="Header" %}

### Example

<span class="vl-example" data-name="facet_custom_header"></span>

This example uses header properties to change the font size of this faceted plot's title and labels.

{:#config}

## Header Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "header": {...},               // Header
    "headerRow": {...},
    "headerColumn": {...},
    "headerFacet": {...},
    ...
  }
}
```

The `header` property of the top-level `config` object sets the default properties for all headers. If header properties are set in row-, column-, or facet-[field definitions](facet.html#mapping), these configuration values will be overridden. Additional property blocks can target more specific header types based on types of facet channels (`"headerRow"`, `"headerColumn"`, `"headerFacet"`).

The header configuration can contain any [header properties](#general).
