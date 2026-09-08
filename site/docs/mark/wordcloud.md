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

A `wordcloud` mark lays out words without overlap, using font size to represent a quantitative value. It compiles to a Vega [`text`](text.html) mark with a [wordcloud layout](https://vega.github.io/vega/docs/transforms/wordcloud/).

<span class="vl-example" data-name="wordcloud"></span>

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#encoding}

## Encoding

The `text` encoding sets the word or phrase to display. The `size` encoding maps a quantitative field to font size. Its [`scale.range`](scale.html#range) sets the output font-size range in pixels; the wordcloud layout performs the scaling internally.

The `angle` encoding sets each word's rotation in degrees without applying a scale. To set one angle for all words, use the `angle` mark property. When neither is specified, words are randomly assigned angles of -45, 0, or 45 degrees.

The `color`, `opacity`, `tooltip`, and `href` channels work as they do for text marks. Position channels such as `x` and `y` are not supported because the wordcloud layout determines word positions.

{:#properties}

## Word Cloud Mark Properties

```js
// Single View Specification
{
  ...
  "mark": {
    "type": "wordcloud",
    ...
  },
  "encoding": ... ,
  ...
}
```

A wordcloud mark definition can contain any [standard mark properties](mark.html#mark-def) and the following relevant properties:

{% include table.html props="angle,font,fontSize,fontStyle,fontWeight,padding,spiral" source="MarkDef" %}

The `padding` property sets the padding around each word in pixels. The `spiral` property controls the word-placement path: `"archimedean"` (the default) follows a smooth curve outward from the center, while `"rectangular"` follows an expanding rectangular path.

To render every word horizontally, set `angle` to `0`:

<span class="vl-example" data-name="wordcloud_horizontal"></span>

{:#config}

## Word Cloud Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "wordcloud": ...,
    ...
  }
}
```

The `wordcloud` property of the top-level [`config`](config.html) object sets default properties for all wordcloud marks. Properties specified in the mark definition override these config values.
