---
layout: docs
menu: docs
title: Mark
permalink: /docs/mark.html
---

Marks are the basic visual building block of a visualization. They provide basic shapes whose properties (such as position, size, and color) can be used to visually encode data, either from a data field, or a constant value.

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": ... ,       // mark
  "encoding": ... ,
  ...
}
```

The `mark` property of a [single view specification](spec.html#single-view-spec) can either be (1) a string describing [mark type](#mark-type) or (2) a [mark definition object](#mark-def).

For example, a bar chart has `mark` as a simple string `"bar"`.

<span class="vl-example" data-name="bar"></span>

## Mark Definition Object
{:#mark-def}


{: .suppress-error}
```json
{
  ...
  "mark": {
    "type": ...,       // mark
    ...
  },
  ...
}
```

A mark definition object can contains the following values.

{% include table.html props="type,style,clip,filled,orient,interpolate,tension" source="MarkDef" %}

## Supported Mark Types
{:#mark-type}

The supported mark types are [`point`](point.html), [`circle`](circle.html), [`square`](square.html), [`text`](text.html), [`tick`](tick.html), [`bar`](bar.html), [`rectangle`](rectangle.html), [`line`](line.html), [`rule`](rule.html), and [`area`](area.html). In general, one mark instance is generated per input data element. However, line and area mark types represent multiple data elements as a contiguous line or shape.


<!-- why mark-based approach over chart typology + but we support variety of chart types -->
