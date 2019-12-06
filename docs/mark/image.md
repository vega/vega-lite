---
layout: docs
menu: docs
title: Image
permalink: /docs/image.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "image",
  "encoding": ... ,
  ...
}
```

Image marks allow external images, such as icons or photographs, to be included in Vega-Lite visualizations. Image files such as PNG or JPG images are loaded from provided URLs.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#properties}

## Image Mark Properties

```js
// Single View Specification
{
  ...
  "mark": {
    "type": "image",
    ...
  },
  "encoding": ... ,
  ...
}
```

An `image` mark definition can contain any [standard mark properties](mark.html#mark-def) and the following special properties:

{% include table.html props="url,aspect,align,baseline" source="MarkConfig" %}

## Examples

### Scatterplot with Image Marks

<span class="vl-example" data-name="scatter_image"></span>

## Image Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "image": ...,
    ...
  }
}
```

The `image` property of the top-level [`config`](config.html) object sets the default properties for all image marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

The image config can contain any [image mark properties](#properties) (except `type`, `style`, and `clip`).
