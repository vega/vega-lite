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

You only need to specify the field to encode the text label.
Vega-Lite uses the default configurations based on the type of the chart.

<span class="vl-example" data-name="label_scatter"></span>

You can customize the definition of text label in `mark` the same way as customizing text mark in its mark definition.
TODO: add bold text, opacity, color.

<span class="vl-example" data-name="label_scatter"></span>

{:#example-line}

### Line Chart

Encoding a field to labels in a line chart results the labeling algorithm to label each data point in the line.

<span class="vl-example" data-name="label_line"></span>

{:#example-multi-line}

### Multi-series Line Chart

Encoding a field to labels in multi-series line chart results the labeling algorithm to label each line.

<span class="vl-example" data-name="label_multi_line"></span>

As a default, the labeling algorithm place each label at the end of each line.
You can configure it to place each label at the beginning of each line by setting `lineAnchor: 'begin'`.
TODO: begin label

<span class="vl-example" data-name="label_multi_line"></span>

{:#example-stacked-area}

### Stacked Area Chart

<span class="vl-example" data-name="label_stacked_area"></span>
