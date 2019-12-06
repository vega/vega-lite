---
layout: docs
title: Stack
permalink: /docs/stack.html
---

To stack fields in Vega-Lite, users can either use the `stack` property of an [encoding field definition](#encoding) or a `stack` transform inside the [`transform`](#transform) array.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#encoding}

## Stack in Encoding Field Definition

```js
// A Single View or a Layer Specification
{
  ...,
  "mark/layer": ...,
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

The `stack` property of a [position field definition](encoding.html#position-field-def) determines type of stacking offset if the field should be stacked.

{% include table.html props="stack" source="PositionFieldDef" %}

{:#bar}

### Stack Bar Chart

Adding a color field to a bar chart also creates stacked bar chart by default.

<span class="vl-example" data-name="stacked_bar_v"></span>

{:#area}

### Stack Area Chart

Similarly, adding a color field to area chart also creates stacked area chart by default.

<span class="vl-example" data-name="stacked_area"></span>

{:#normalized}

### Normalized Stacked Bar and Area Charts

You can set `stack` to `"normalize"` to create normalized (or percentage) stacked bar and area charts.

<div class="vl-example" data-name="stacked_bar_normalize"></div>

<div class="vl-example" data-name="stacked_area_normalize"></div>

### Streamgraph

Setting `stack` to `"center"` for a stacked area chart creates a streamgraph:

<div class="vl-example" data-name="stacked_area_stream"></div>

### Layered Bar Chart

If `stack` is `null`, the marks will be layered on top of each other. In this example, setting the mark's `opacity` to be semi-transparent (`0.6`) creates a layered bar chart.

<div class="vl-example" data-name="bar_layered_transparent"></div>

{:#order}

### Diverging Stacked Bar Chart (Stacked with negative values)

The stack transform can also handle negative values by creating a diverging stacked bar chart.

<div class="vl-example" data-name="bar_diverging_stack_population_pyramid"></div>

Note: that the stack transform cannot handle if there should be items stacked in the middle like in the ["Diverging Stacked Bar Chart with Neutral Parts"](https://vega.github.io/vega-lite/examples/bar_diverging_stack_transform.html) example.

### Sorting Stack Order

You can use the order channel to sort the order of stacked marks.

For example, given a stacked bar chart for the barley dataset:

<div class="vl-example" data-name="stacked_bar_h"></div>

By default, the stacked bar are sorted by the stack grouping fields (`color` in this example).

Mapping the sum of yield to `order` channel will sort the layer of stacked bar by the sum of yield instead.

<div class="vl-example" data-name="stacked_bar_h_order"></div>

Here we can see that site with higher yields for each type of barley are put on the top of the stack (rightmost).

If you want to define custom sort order, you can derive a new field using the [`calculate` transform](calculate.html) and sort by that field instead. For example, the following plot makes "University Farm" and "Grand Rapids" be the first (`0`) and second values in the stack order:

<div class="vl-example" data-name="stacked_bar_h_order_custom"></div>

Note: we plan to have [a better syntax for customized sort order](https://github.com/vega/vega-lite/issues/2915) in the future.

### Layering Lines on top of Stacked Area Chart

Since `line` marks are not stacked by default, to layer lines on top of stacked area charts, you have to manually set the `stack` offset for the lines.

<div class="vl-example" data-name="normalized/stacked_area_overlay_normalized"></div>

{:#transform}

## Stack Transform

```js
// Any View Specification
{
  ...
  "transform": [
    // Stack Transform
    {
      "stack": ...,
      "groupby": ...,
      "offset": ...,
      "sort": ...,
      "as": ...
    }
    ...
  ],
  ...
}
```

For example, here is the same [normalized stacked bar chart](stack.html#normalized) of the `"population"`, grouped by `"age"` and colored by `"gender"`, but this time using the `stack` property of `transform`.

<div class="vl-example" data-name="stacked_bar_population_transform"></div>

The `stack` transform in the `transform` array has the following properties:

{% include table.html props="stack,groupby,offset,sort,as" source="StackTransform" %}

We can use `stack` transform in conjunction with other transforms to create more complicated charts.

### Diverging Bar Chart

Here we initially `stack` by `"question"` and then use `window` transform to offset each stack.

<div class="vl-example" data-name="bar_diverging_stack_transform"></div>

### Mosaic Chart

To create a mosaic chart we `stack` twice, once in each direction along with `window` transform.

<div class="vl-example" data-name="rect_mosaic_simple"></div>

To add labels to this chart, consult [this example]({{site.baseurl}}/examples/rect_mosaic_labelled_with_offset).
