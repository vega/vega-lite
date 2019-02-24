---
layout: docs
menu: docs
title: View Title
permalink: /docs/title.html
---

The `title` property of a [view specification in Vega-lite](spec.html) adds a descriptive title to a chart. The title property can be either a string or [an object defining the title parameters](#params).

For example, the following bar chart is titled "A Simple Bar Chart".

<span class="vl-example" data-name="bar_title"></span>

{:#params}

## Title Parameter Object

A `title` parameter object can contain the following properties:

{% include table.html props="text,anchor,angle,baseline,color,font,fontSize,fontWeight,frame,limit,offset,orient,style,zindex" source="TitleParams" %}

For example, we can customize the `anchor` of the title of a bar chart.

<span class="vl-example" data-name="bar_title_start"></span>

```js
// Top-level View Specification
{
  ...
  "config": {
    "title": : {
      ...
    }
  }
}
```

{:#config}

## Title Config

To provide themes for all titles, the title configuration (`config: {title: {...}}`) supports all [title parameters](#params).
