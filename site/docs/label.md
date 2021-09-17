---
layout: docs
menu: docs
title: Labeling
permalink: /docs/label.html
---

Labels can provide details of a particular data point as a text annotation directly near the data point. Users can add text labels to marks of the following types: area, bar, line, trail, rect, circle, point, and square. To annotate marks with labels, users can encode fields with label encoding channel.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Syntax

```js
{
  ...,
  mark: 'point',
  encoding: {
    x: {...},
    y: {...},
    label: {
      // field(s) to encode as text label
      text: {field: 'a', type: 'nominal'},

      // label properties
      positions: ...,
      avoid: ...,
      mark: ...,
      padding: ...,
      method: ...,
      lineAnchor: ...,
    }
  }
}
```

## Configurations

{% include table-anyof.html props="position,avoid,mark,padding,method,lineAnchor" source="LabelDef" index=0 %}

## Examples

{:#example-scatter}

### Scatter Plot

{:#example-line}

### Line Chart

{:#example-multi-line}

### Multi-series Line Chart

{:#example-stacked-area}

### Stacked Area Chart
