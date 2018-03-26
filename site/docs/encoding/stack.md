---
layout: docs
title: Stack
permalink: /docs/stack.html
---

The `stack` property of a [position field definition](encoding.html#position-field-def)
determines type of stacking offset if the field should be stacked.

{% include table.html props="stack" source="PositionFieldDef" %}

{: .suppress-error}
```json
// Specification of a Single View
{
  ...,
  "encoding": {     // Encoding
    "x" or "y": {
      "field": ...,
      "type": "quantitative",
      "stack": ..., // Stack
      ...
    },
    ...
  },
  ...
}
```

## Documentation Overview
{:.no_toc}

- TOC
{:toc}


{:#bar}
## Stack Bar Chart

Adding a color field to a bar chart also creates stacked bar chart by default.

<span class="vl-example" data-name="stacked_bar_v"></span>

{:#area}
## Stack Area Chart

Similarly, adding a color field to area chart also creates stacked area chart by default.

<span class="vl-example" data-name="stacked_area"></span>

{:#normalized}
## Normalized Stacked Bar and Area Charts

You can set `stack` to `"normalize"` to create normalized (or percentage) stacked bar and area charts.

<div class="vl-example" data-name="stacked_bar_normalize"></div>

<div class="vl-example" data-name="stacked_area_normalize"></div>

## Streamgraph

Setting `stack` to `"center"` for a stacked area chart creates a streamgraph:

<div class="vl-example" data-name="stacked_area_stream"></div>

## Layered Bar Chart

If `stack` is `null`, the marks will be layered on top of each other.
In this example, setting the mark's `opacity` to be semi-transparent (`0.6`) creates a layered bar chart.

<div class="vl-example" data-name="bar_layered_transparent"></div>


{:#order}
## Sorting Stack Order

You can use the order channel to sort the order of stacked marks.

For example, given a stacked bar chart for the barley dataset:

<div class="vl-example" data-name="stacked_bar_h"></div>

By default, the stacked bar are sorted by the stack grouping fields (`color` in this example).

Mapping the sum of yield to `order` channel will sort the layer of stacked bar by the sum of yield instead.

<div class="vl-example" data-name="stacked_bar_h_order"></div>

Here we can see that site with higher yields for each type of barley are put on the top of the stack (rightmost).

If you want to define custom sort order, you can derive a new field using the [`calculate` transform](calculate.html) and sort by that field instead.  For example, the following plot makes "University Farm" and "Grand Rapids" be the first (`0`) and second values in the stack order:

<div class="vl-example" data-name="stacked_bar_h_order_custom"></div>

Note: we plan to have [a better syntax for customized sort order](https://github.com/vega/vega-lite/issues/2915) in the future.

## Layering Lines on top of Stacked Area Chart

Since `line` marks are not stacked by default, to layer lines on top of stacked area charts, you have to manually set the `stack` offset for the lines.

<div class="vl-example" data-name="normalized/overlay_stacked_area_normalized"></div>
