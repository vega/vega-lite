---
layout: docs
menu: docs
title: View Title
permalink: /docs/title.html
---

The `title` property of a [view specification in Vega-Lite](spec.html) adds a descriptive title to a chart. The title property can be either a string or [an object defining the title properties](#props).

For example, the following bar chart is titled "A Simple Bar Chart".

<span class="vl-example" data-name="bar_title"></span>

{:#props}

## Title Properties Object

A `title` properties object can contain the following properties:

{% include table.html props="text,align,anchor,angle,baseline,color,dx,dy,font,fontSize,fontStyle,fontWeight,frame,limit,lineHeight,offset,orient,style,subtitle,subtitleColor,subtitleFont,subtitleFontSize,subtitleFontStyle,subtitleFontWeight,subtitleLineHeight,subtitlePadding,zindex" source="TitleParams" %}

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

To provide themes for all titles, the title configuration (`config: {title: {...}}`) supports all [title properties](#props).
