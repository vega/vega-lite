---
layout: docs
menu: docs
title: Square
permalink: /docs/square.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "square",
  "encoding": ... ,
  ...
}
```

`square` marks is similar to [`point`](point.html) mark, except that (1) the `shape` value is always set to `square` (2) they are filled by default.

{:#properties}

## Square Mark Properties

A square mark definition can contain any [standard mark properties](mark.html#mark-def) and the following special properties:

{% include table.html props="size" source="MarkConfig" %}

## Example: Scatterplot with Square

Here are an example scatter plot with `square` marks:

<span class="vl-example" data-name="square"></span>

{:#config}

## Square Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "square": ...,
    ...
  }
}
```

The `square` property of the top-level [`config`](config.html) object sets the default properties for all square marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

The square config can contain any [point mark properties](#properties) (except `type`, `style`, and `clip`).
