---
layout: docs
menu: docs
title: Circle
permalink: /docs/circle.html
---

```json
// Single View Specification
{
  "data": ... ,
  "mark": "circle",
  "encoding": ... ,
  ...
}
```

`circle` mark is similar to [`point`](point.html) mark, except that (1) the `shape` value is always set to `circle` (2) they are filled by default.

{:#properties}

## Circle Mark Properties

```json
// Single View Specification
{
  ...
  "mark": {
    "type": "circle",
    ...
  },
  "encoding": ... ,
  ...
}
```

A circle mark definition can contain any [standard mark properties](mark.html#mark-def) and the following special properties:

{% include table.html props="size" source="MarkDef" %}

## Examples

### Scatterplot with Circle

Here is an example scatter plot with `circle` marks:

<span class="vl-example" data-name="circle"></span>

{:#config}

## Circle Config

```json
// Top-level View Specification
{
  ...
  "config": {
    "circle": ...,
    ...
  }
}
```

The `circle` property of the top-level [`config`](config.html) object sets the default properties for all circle marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

The circle config can contain any [circle mark properties](#properties) (except `type`, `style`, and `clip`).
