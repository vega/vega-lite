---
layout: docs
title: Stack
permalink: /docs/stack.html
---
<!-- TODO: Intro for stack -->

The `stack` property of a [position field definition](encoding.html#position-field-def)
determines type of stacking offset if the field should be stacked.
`stack` can be one of the following values:

- `"zero"`: stacking with baseline offset at zero value of the scale (for creating typical stacked bar and area chart).
- `"normalize"` - stacking with normalized domain (for creating normalized stacked [bar](mark.html#normalized-stacked-bar-chart) and [area](mark.html#normalized-stacked-area-chart) chart). <br/>
- `"center"` - stacking with center baseline (for [streamgraph](mark.html#streamgraph)).
- `"none"` - No-stacking. This will produce layered [bar](mark.html#layered-bar-chart) and area chart.

{: .suppress-error}
```json
// Specification of a Single View
{
  ...,
  "encoding": {     // Encoding
    ...: {
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

* TOC
{:toc}


## Stack Bar Chart

Similarly, adding a color field to a bar chart also creates stacked bar chart by default.

<span class="vl-example" data-name="stacked_bar_v"></span>

## Stack Area Chart

Similarly, adding a color field to area chart also creates stacked area chart by default.

<span class="vl-example" data-name="stacked_area"></span>

## Normalized Stacked Bar Chart

Setting `stack` to `"center"` creates a normalized (or percentage) stacked chart.

<div class="vl-example" data-name="stacked_bar_normalize"></div>

## Streamgraph

Setting `stack` to `"center"` for a stacked area chart creates a streamgraph:

<div class="vl-example" data-name="stacked_area_stream"></div>

## Layered Bar Chart

If `stack` is `"none"`, the marks will be layered on top of each other.
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
