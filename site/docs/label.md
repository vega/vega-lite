---
layout: docs
menu: docs
title: Labeling
permalink: /docs/label.html
---

Labels can provide details of a particular data point as a text annotation directly near the data point. Users can add text labels to marks of the following types: [area](area.html), [bar](bar.html), [circle](circle.html), [line](line.html), [point](point.html), [rect](rect.html), [square](square.html), and [trail](trail.html). To annotate marks with labels, users can encode fields with the `label` encoding channel.

```js
{
  ...,
  mark: ...,
  encoding: {
    x: {...},
    y: {...},
    label: {
      // field(s) to encode as text label
      field: ...,

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

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Properties

In addition to the general [field definition properties](encoding.html#field-def), field definitions for `label` channels may also include these properties:

{% include table-anyof.html props="format, formatType, position,avoid,mark,padding,method,lineAnchor" source="LabelDef" index=0 %}

## Examples

You only need to specify the field to encode the text label. Vega-Lite uses the default configurations based on the type of the chart.

{:#example-scatter}

### Scatter Plot

<span class="vl-example" data-name="point_2d_label"></span>

### Customizing Label Mark

You can customize the definition of text label in `mark` the same way as customizing text mark in its mark definition. In this example, we change the color of the labels to red and reduce the font size of the labels to 5.

<span class="vl-example" data-name="point_2d_label_with_configs"></span>

{:#example-connected-scatter}

### Connected Scatter Plot

<span class="vl-example" data-name="connected_scatterplot_label"></span>

{:#example-line}

### Bar Chart

<span class="vl-example" data-name="bar_label"></span>

### Line Chart

Encoding a field to labels in a line chart results the labeling algorithm to label each data point in the line.

<span class="vl-example" data-name="line_label"></span>

{:#example-multi-line}

### Multi-series Line Chart

Encoding a field to labels in multi-series line chart results the labeling algorithm to label each line.

<span class="vl-example" data-name="multi_line_label"></span>

As a default, the labeling algorithm place each label at the end of each line. You can configure it to place each label at the beginning of each line by setting `lineAnchor: 'begin'`.

<span class="vl-example" data-name="line_color_label_begin"></span>

{:#example-stacked-area}

### Stacked Area Chart

<span class="vl-example" data-name="stacked_area_label"></span>
