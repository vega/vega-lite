---
layout: docs
menu: docs
title: Trail
permalink: /docs/trail.html
---

{: .suppress-error}

```json
{
  "data": ... ,
  "mark": "trail",
  "encoding": ... ,
  ...
}
```

The `trail` mark represents the data points stored in a field with a line connecting all of these points. Trail is similar to the `line` mark but a trail can have variable widths determined by backing data. Unlike lines, trails do not support different interpolation methods and use `fill` (not `stroke`) for their color. Trail marks are useful if you want to draw lines with changing size to reflect the underlying data.

## Documentation Overview

{:.no_toc}

<!-- prettier-ignore -->
- TOC
{:toc}

{:#properties}

## Trail Mark Properties

{: .suppress-error}

```json
// Single View Specification
{
  ...
  "mark": {
    "type": "trail",
    ...
  },
  "encoding": ... ,
  ...
}
```

A trail mark definition can contain any [standard mark properties](mark.html#mark-def) and the following properties:

{% include table.html props="orient" source="MarkDef" %}

## Examples

### A Line Chart with varying size using `trail` mark

<span class="vl-example" data-name="trail_color"></span>

{:#config}

## Trail Config

{: .suppress-error}

```json
// Top-level View Specification
{
  ...
  "config": {
    "trail": ...,
    ...
  }
}
```

The `trail` property of the top-level [`config`](config.html) object sets the default properties for all trail marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

The trail config can contain any [trail mark properties](#properties) (except `type`, `style`, and `clip`).
