---
layout: docs
menu: docs
title: Window
permalink: /docs/window.html
---

The window transform performs calculations over sorted groups of data objects. These calculations including ranking, lead/lag analysis, and aggregates such as running sums and averages. Calculated values are written back to the input data stream. If you only want to set the same aggregated value in a new field, you can use the simpler [join aggregate](joinaggregate.html) transform.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Window Field Definition

```js
// Any View Specification
{
  ...
  "transform": [
    {
      // Window Transform
      "window": [{
          "op": ...,
          "field": ...,
          "param": ...,
          "as": ...
      }],
      "sort": [
        {"field": ..., "order": ...}
      ],
      "ignorePeers": ...,
      "groupby": [
        "..."
      ],
      "frame": [...,...]
    }
     ...
  ],
  ...
}
```

## Window Transform Definition

{% include table.html props="window,frame,ignorePeers,groupby,sort" source="WindowTransform" %}

{:#field-def}

### Window Transform Field Definition

{% include table.html props="op,param,field,as" source="WindowFieldDef" %}

{:#sort-field-def}

### Sort Field Definition

{% include table.html props="field,order" source="SortField" %}

{:#ops}

## Window Only Operation Reference

The valid operations include all [aggregate operations](../aggregate/#ops) plus the following window operations.

| Operation | Parameter | Description |
| :-- | :-: | :-- |
| row_number | _None_ | Assigns each data object a consecutive row number, starting from 1. |
| rank | _None_ | Assigns a rank order value to each data object in a window, starting from 1. Peer values are assigned the same rank. Subsequent rank scores incorporate the number of prior values. For example, if the first two values tie for rank 1, the third value is assigned rank 3. |
| dense_rank | _None_ | Assigns dense rank order values to each data object in a window, starting from 1. Peer values are assigned the same rank. Subsequent rank scores do not incorporate the number of prior values. For example, if the first two values tie for rank 1, the third value is assigned rank 2. |
| percent_rank | _None_ | Assigns a percentage rank order value to each data object in a window. The percent is calculated as _(rank - 1) / (group_size - 1)_. |
| cume_dist | _None_ | Assigns a cumulative distribution value between 0 and 1 to each data object in a window. |
| ntile | Number | Assigns a quantile (e.g., percentile) value to each data object in a window. Accepts an integer parameter indicating the number of buckets to use (e.g., 100 for percentiles, 5 for quintiles). |
| lag | Number | Assigns a value from the data object that precedes the current object by a specified number of positions. If no such object exists, assigns `null`. Accepts an offset parameter (default `1`) that indicates the number of positions. This operation must have a corresponding entry in the _fields_ parameter array. |
| lead | Number | Assigns a value from the data object that follows the current object by a specified number of positions. If no such object exists, assigns `null`. Accepts an offset parameter (default `1`) that indicates the number of positions. This operation must have a corresponding entry in the _fields_ parameter array. |
| first_value | _None_ | Assigns a value from the first data object in the current sliding window frame. This operation must have a corresponding entry in the _fields_ parameter array. |
| last_value | _None_ | Assigns a value from the last data object in the current sliding window frame. This operation must have a corresponding entry in the _fields_ parameter array. |
| nth_value | Number | Assigns a value from the nth data object in the current sliding window frame. If no such object exists, assigns `null`. Requires a non-negative integer parameter that indicates the offset from the start of the window frame. This operation must have a corresponding entry in the _fields_ parameter array. |

## Examples

Below are some common use cases for the window transform.

### Cumulative Frequency Distribution

Here we use the window transform with `frame: [null, 0]` to accumulate count in a cumulative frequency distribution plot.

<div class="vl-example" data-name="area_cumulative_freq"></div>

**See also:** [layered histogram and cumulative histogram](../examples/layer_cumulative_histogram.html)

### Rank Chart

We can also use `rank` operator to calculate ranks over time.

<div class="vl-example" data-name="window_rank"></div>

### Top K

Here we use window transform to derive the total number of students along with the rank of the current student to determine the top K students and display their score.

<div class="vl-example" data-name="window_top_k"></div>

Also see [this example](https://vega.github.io/vega-lite/examples/window_top_k_others.html) for a top-K plot with "others".

### Cumulative Running Average

Here we use window transform to visualize how the average MPG for vehicles have changed over the years.

<div class="vl-example" data-name="window_cumulative_running_average"></div>

## Additional Examples

These are examples of window transforms that can be simplifies with the join aggregate transform. Please refer to the [join aggregate examples](joinaggregate.html#examples).

### Percent of Total

You can use the window transform to compute an aggregate and attach it to all records. In this case, you can use the [join aggregate](joinaggregate.html) instead of the window transform. Please refer to the [join aggregate examples](joinaggregate.html#examples).

Here we use the window transform to derive the global sum so that we can calculate percentage.

<div class="vl-example" data-name="window_percent_of_total"></div>
