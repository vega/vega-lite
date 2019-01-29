---
layout: docs
menu: docs
title: Rect
permalink: /docs/rect.html
---

```json
// Single View Specification
{
  "data": ... ,
  "mark": "rect",
  "encoding": ... ,
  ...
}
```

The `rect` mark represents an arbitrary rectangle.

## Documentation Overview

{:.no_toc}

<!-- prettier-ignore -->
- TOC
{:toc}
{:#properties}

## Rect Mark Properties

```json
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

A rect mark definition can contain any [standard mark properties](mark.html#mark-def) and the following special properties: {% include table.html props="cornerRadius" source="MarkConfig" %}

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

We can also use `rect` to show a band covering one standard deviation over and below the global mean value.

<span class="vl-example" data-name="layer_global_mean_dev"></span>

{:#config}

## Rect Config

```json
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
