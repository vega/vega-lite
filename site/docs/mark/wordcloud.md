---
layout: docs
menu: docs
title: Word Cloud
permalink: /docs/wordcloud.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "wordcloud",
  "encoding": ... ,
  ...
}
```

A word cloud visualizes a collection of words where the size of each word reflects its frequency or importance. To create a word cloud, set `mark` to `"wordcloud"`.

Vega-Lite's wordcloud mark uses [Vega's built-in wordcloud layout engine](https://vega.github.io/vega/docs/transforms/wordcloud/), which places words without overlap using a spiral placement algorithm.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#properties}

## Word Cloud Mark Properties

A wordcloud's mark definition contains the following properties:

{% include table.html props="type,font,fontStyle,fontWeight,fontSize,fontSizeRange,rotate,padding,spiral,color,opacity" source="WordcloudDef" %}

{:#encoding}

## Encoding Channels

| Channel   | Description                                                                     |
| --------- | ------------------------------------------------------------------------------- |
| `text`    | **Required.** The data field containing the words to display.                   |
| `size`    | A quantitative field whose values are scaled to font sizes via `fontSizeRange`. |
| `color`   | Color of each word. Can be a field or a fixed value.                            |
| `opacity` | Opacity of each word.                                                           |
| `angle`   | Per-word rotation. Can be a quantitative field or a fixed value (in degrees).   |

{:#basic}

## Basic Word Cloud

A minimal word cloud requires only a `text` encoding. Word sizes are uniform unless a `size` channel is also provided.

<div class="vl-example" data-name="wordcloud_basic"></div>

{:#custom}

## Customizing the Word Cloud

Use the mark definition object to control font, size range, spiral algorithm, and padding.

<div class="vl-example" data-name="wordcloud_custom"></div>

{:#config}

## Word Cloud Config

```js
// Top-level View Specification
{
  "config": {
    "wordcloud": {
      "fontSizeRange": [10, 56],  // default font size range
      "padding": 1,               // default padding between words
      "spiral": "archimedean"     // default spiral algorithm
    }
  }
}
```

{% include table.html props="font,fontStyle,fontWeight,fontSizeRange,padding,spiral" source="WordcloudConfig" %}
