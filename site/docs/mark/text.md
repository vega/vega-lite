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

{:#placement}

## Label Placement

Set `placement` on a text mark to place each label around its data point so that it does not overlap other labels or the marks listed in `avoid`. Vega-Lite tries each anchor in order and hides a label that collides at every anchor.

{% include table.html props="anchor,offset,avoid,sort,padding" source="TextPlacement" %}

`avoid` takes a list of selectors:

- `{"mark": [...]}` matches layers by mark type, for example `{"mark": ["line", "bar"]}`.
- `{"views": [...]}` matches layers by their `name`, for example a layer of fixed labels. A named layer that contains other layers selects all of them.

Selectors match layers in the same view only. Labels always avoid the labels of earlier placement layers, so earlier layers win, and `sort` sets the order within a layer.

Placement positions each label itself, so `align`, `baseline`, `angle`, `radius`, and `theta` are ignored. `dx` and `dy` move the data point the label is placed around. `opacity` is compiled to `fillOpacity`, because placement uses `opacity` to hide labels that do not fit.

`placement` in [`config.text`](#config) only provides defaults for text marks that set `placement`. It does not turn placement on.

Placement requires a Vega version that includes the fixes in [vega/vega#4383](https://github.com/vega/vega/issues/4383), [#4384](https://github.com/vega/vega/issues/4384), and [#4385](https://github.com/vega/vega/issues/4385).

### Labels on a Line

<span class="vl-example" data-name="text_placement_line"></span>

### Labels on a Multi-Series Line

<span class="vl-example" data-name="text_placement_multi_line"></span>

### Line Labels That Avoid Bars and Bar Labels

<span class="vl-example" data-name="text_placement_combo"></span>

### Labels That Avoid an Area's Line but Not Its Fill

<span class="vl-example" data-name="text_placement_area"></span>

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
