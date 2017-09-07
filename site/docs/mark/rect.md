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

## Heatmap

Use the `rect` mark to create a heatmap.

<span class="vl-example" data-name="rect_heatmap"></span>
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

For the list of all supported properties, please see the [mark config documentation](mark.html#config).
