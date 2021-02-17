---
layout: docs
menu: docs
title: Rect
permalink: /docs/rect.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "rect",
  "encoding": ... ,
  ...
}
```

The `rect` mark represents an arbitrary rectangle.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#properties}

## Rect Mark Properties

```js
// Single View Specification
{
  ...
  "mark": {
    "type": "rect",
    ...
  },
  "encoding": ... ,
  ...
}
```

<span class="vl-example" data-name="rect_params" figure-only=true></span>

A rect mark definition can contain any [standard mark properties](mark.html#mark-def) and the following special properties:

{% include table.html props="width,height,align,baseline,cornerRadius" source="MarkConfig" %}

## Examples

### Heatmap

Using the `rect` marks with discrete fields on `x` and `y` channels creates a heatmap.

<span class="vl-example" data-name="rect_heatmap"></span>

We can similarly use rect with binned fields and discretized temporal fields.

<span class="vl-example" data-name="rect_binned_heatmap"></span>

<span class="vl-example" data-name="rect_heatmap_weather"></span>

{:#ranged}

### Ranged Rectangles

Specifying both `x` and `x2` and/or `y` and `y2` creates a rectangle that spans over certain x and/or y values.

For example, we can use `rect` to create an annotation [`layer`](layer.html) that provides a shading between global `min` and `max` values.

<span class="vl-example" data-name="layer_rect_extent"></span>

{:#config}

## Rect Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "rect": ...,
    ...
  }
}
```

The `rect` property of the top-level [`config`](config.html) object sets the default properties for all rect marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

The rect config can contain any [rect mark properties](#properties) (except `type`, `style`, and `clip`).
