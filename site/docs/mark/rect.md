---
layout: docs
menu: docs
title: Rect
permalink: /docs/rect.html
---

{: .suppress-error}
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

- TOC
{:toc}
{:#properties}
## Rect Mark Properties


{: .suppress-error}
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

A rect mark definition can contain any [standard mark properties](mark.html#mark-def).

## Examples

### Heatmap

Use the `rect` marks with discrete fields on `x` and `y` channels creates a heatmap.

<span class="vl-example" data-name="rect_heatmap"></span>

{:#ranged}
### Ranged Rectangles

Specifying both `x` and `x2` and/or `y` and `y2` creates a rectangle that spans over certain x and/or y values.

For example, we can use `rect` to create an annotation [`layer`](layer.html) that provides a shading between global `min` and `max` values.

<span class="vl-example" data-name="layer_rect_extent"></span>

We can also use `rect` to show a band covering one standard deviation over and below the global mean value.

<span class="vl-example" data-name="layer_global_mean_dev"></span>


{:#config}
## Rect Config

{: .suppress-error}
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

The `rect` property of the top-level [`config`](config.html) object sets the default properties for all rect marks.  If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

The rect config can contain any [rect mark properties](#properties) (except `type`, `style`, and `clip`).
