---
layout: docs
menu: docs
title: Header
permalink: /docs/header.html
---

Headers provide a title and labels for [faceted plots](facet.html). A header's title describes the field that is used to facet the plot, while a header's labels describe that field's value for each subplot.

By default, Vega-Lite automatically creates headers with default properties for `row` and `column` channels of a faceted view.
User can set the `header` property of row- or column-[field definition](facet.html#field-def) to an object to customize [header properties](#header-properties).

In addition to the `header` property of a row- or column-field definition, users can also set default header properties for all headers with the configuration object's ([`config`](config.html)) [header configuration](#config) (`config: {header: {...}}`).

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

## Header Properties

{: .suppress-error}
```json
// Single View Specification
{
  "data": ... ,
  "mark": ... ,
  "encoding": {
    "row": {
      "field": ...,
      "type": ...,
      "header": {                // Header
        ...
      },
      ...
    },
    "x": ...,
    "y": ...,
    ...
  }
}
```

To customize header, a `header` object in row- or column-[field definitions](facet.html#mapping) can contain the following groups of properties:

{:#general}
### General

{% include table.html props="format,title" source="Header" %}

__See also:__ You may also use `guide-title` and `guide-label` [style configs](mark.html#style-config) to customize common styles for [axis](axis.html), [legend](legend.html), and [header](header.html) labels and titles.

{:#labels}
### Labels

{% include table.html props="labelAngle,labelColor,labelFont,labelFontSize,labelLimit" source= "Header" %}

{:#title}
### Title

{% include table.html props="titleAnchor,titleAngle,titleBaseline,titleColor,titleFont,titleFontWeight,titleFontSize,titleLimit" source="Header" %}

### Example

<span class="vl-example" data-name="facet_custom_header"></span>

This example uses header properties to change the font size of this faceted plot's title and labels.

{:#config}
## Header Config

{: .suppress-error}
```json
// Top-level View Specification
{
  ...
  "config": {
    "header": {               // Header
      ...
    }
    ...
  }
}
```

The `header` property of the top-level `config` object sets the default properties for all headers. If header properties are set in row- or column-[field definitions](facet.html#mapping), these configuration values will be overridden.

The header configuration can contain any [header properties](#general).
