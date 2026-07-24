---
layout: docs
menu: docs
title: Wordcloud Transform
permalink: /docs/wordcloud-transform.html
---

The wordcloud transform computes a non-overlapping word layout using a spiral placement algorithm, adding position, font size, and rotation fields to each data object.

```js
// Any View Specification
{
  ...
  "transform": [
    {"wordcloud": "fieldName", ...}  // Wordcloud Transform
  ],
  ...
}
```

> **Tip:** For most use cases, the [`"wordcloud"` composite mark](wordcloud.html) is simpler — it handles the transform and text mark automatically. Use this transform directly when you need full control over the mark encoding.

## Wordcloud Transform Definition

{% include table.html props="wordcloud,size,font,fontStyle,fontWeight,fontSize,fontSizeRange,rotate,padding,spiral,as" source="WordcloudTransform" %}

## Output Fields

By default, the transform adds the following fields to each datum (configurable via `as`):

| Default field | Description                                                   |
| ------------- | ------------------------------------------------------------- |
| `x`           | Computed x position in pixels (centered on layout width / 2)  |
| `y`           | Computed y position in pixels (centered on layout height / 2) |
| `font`        | Font family used for the word                                 |
| `fontSize`    | Computed font size in pixels                                  |
| `fontStyle`   | Font style                                                    |
| `fontWeight`  | Font weight                                                   |
| `angle`       | Rotation angle in degrees                                     |

## Usage

```json
{
  "transform": [
    {
      "wordcloud": "word",
      "fontSize": {"field": "count"},
      "fontSizeRange": [12, 56],
      "padding": 2,
      "spiral": "archimedean"
    }
  ]
}
```

Then use a `text` mark with `x`/`y` value encodings to render the result:

```json
{
  "mark": "text",
  "encoding": {
    "x": {"value": {"expr": "datum.x"}},
    "y": {"value": {"expr": "datum.y"}},
    "text": {"field": "word"},
    "size": {"value": {"expr": "datum.fontSize"}},
    "color": {"field": "category", "type": "nominal"}
  }
}
```

### Example: Basic Word Cloud via Transform

<div class="vl-example" data-name="wordcloud_basic"></div>
