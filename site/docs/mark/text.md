---
layout: docs
menu: docs
title: Text
permalink: /docs/text.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "text",
  "encoding": ... ,
  ...
}
```

`text` mark represents each data point with a text instead of a point.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#properties}

## Text Mark Properties

```js
// Single View Specification
{
  ...
  "mark": {
    "type": "text",
    ...
  },
  "encoding": ... ,
  ...
}
```

<span class="vl-example" data-name="text_params" figure-only=true></span>

A text mark definition can contain any [standard mark properties](mark.html#mark-def) and the following special properties:

{% include table.html props="angle,align,baseline,dir,dx,dy,ellipsis,font,fontSize,fontStyle,fontWeight,limit,lineHeight,radius,text,theta" source="MarkDef" %}

## Examples

### Text Table Heatmap

<span class="vl-example" data-name="layer_text_heatmap"></span>

### Labels

You can also use `text` marks as labels for other marks and set offset (`dx` or `dy`), `align`, and `baseline` properties of the mark definition.

<span class="vl-example" data-name="layer_bar_labels"></span>

### Scatterplot with Text

Mapping a field to `text` channel of text mark sets the mark's text value. For example, we can make a colored scatterplot with text marks showing the initial character of its origin, instead of [`point`](point.html#color) marks.

<span class="vl-example" data-name="text_scatterplot_colored"></span>

### Geo Text

By mapping geographic coordinate data to `longitude` and `latitude` channels of a corresponding [projection](projection.html), we can show text at accurate locations. The example below shows the name of every US state capital at the location of the capital.

<span class="vl-example" data-name="geo_text"></span>

{:#config}

## Text Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "text": ...,
    ...
  }
}
```

The `text` property of the top-level [`config`](config.html) object sets the default properties for all text marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.
