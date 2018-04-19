---
layout: docs
menu: docs
title: Window
permalink: /docs/window.html
---

The window transform performs calculations over sorted groups of data objects. These calculations including ranking, lead/lag analysis, and aggregates such as running sums and averages. Calculated values are written back to the input data stream.

All the calculations are computed by: First, the tuples are partitioned according to the groupby fields. Each partition is then sorted. Finally, the window calculations are performed over the sorted partitions.

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

## Window Field Definition

{: .suppress-error}
```json
// A View Specification
{
  ...
  "transform": [
    {
      // Window Transform
      "window": [{
          "op": ...,
          "field": ...,
          "param": ...
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

### Window Sort Field Definition

{% include table.html props="field,order" source="WindowSortField" %}

{:#ops}

## Window Only Operation Reference

The valid operations include all [valid aggregate operations](../aggregate/#ops) plus the following window operations.

| Operation    | Parameter | Description  |
| :----------- | :-------: | :------------|
| row_number   | _None_    | Assigns each data object a consecutive row number, starting from 1.|
| rank         | _None_    | Assigns a rank order value to each data object in a window, starting from 1. Peer values are assigned the same rank. Subsequent rank scores incorporate the number of prior values. For example, if the first two values tie for rank 1, the third value is assigned rank 3.|
| dense_rank   | _None_    | Assigns dense rank order values to each data object in a window, starting from 1. Peer values are assigned the same rank. Subsequent rank scores do not incorporate the number of prior values. For example, if the first two values tie for rank 1, the third value is assigned rank 2.|
| percent_rank | _None_    | Assigns a percentage rank order value to each data object in a window. The percent is calculated as _(rank - 1) / (group_size - 1)_. |
| cume_dist    | _None_    | Assigns a cumulative distribution value between 0 and 1 to each data object in a window.|
| ntile        | Number | Assigns a quantile (e.g., percentile) value to each data object in a window. Accepts an integer parameter indicating the number of buckets to use (e.g., 100 for percentiles, 5 for quintiles).|
| lag          | Number | Assigns a value from the data object that precedes the current object by a specified number of positions. If no such object exists, assigns `null`. Accepts an offset parameter (default `1`) that indicates the number of positions. This operation must have a corresponding entry in the _fields_ parameter array.|
| lead         | Number | Assigns a value from the data object that follows the current object by a specified number of positions. If no such object exists, assigns `null`. Accepts an offset parameter (default `1`) that indicates the number of positions. This operation must have a corresponding entry in the _fields_ parameter array.|
| first_value  | _None_    | Assigns a value from the first data object in the current sliding window frame. This operation must have a corresponding entry in the _fields_ parameter array.|
| last_value   | _None_    | Assigns a value from the last data object in the current sliding window frame. This operation must have a corresponding entry in the _fields_ parameter array.|
| nth_value    | Number | Assigns a value from the nth data object in the current sliding window frame. If no such object exists, assigns `null`. Requires a non-negative integer parameter that indicates the offset from the start of the window frame. This operation must have a corresponding entry in the _fields_ parameter array.|

## Examples

Below are some common use cases for the window transform.

### Percent of Total

Here we use window transform to derive the global sum so that we can calculate percentage.

<div class="vl-example" data-name="window_percent_of_total"></div>

### Difference from Mean

One example is to show the "exemplar" movies from a movie collection. Here "exemplar" is defined by having a score of 2.5 points higher than the global average.

<div class="vl-example" data-name="window_mean_difference"></div>

Another example is to show the "exemplar" movies based on the release year average. Here "exemplar" is defined by having a score 2.5 points higher than the annual average for its release year (instead of the global average).

<div class="vl-example" data-name="window_mean_difference_by_year"></div>

Rather than filtering the above two examples we can also calculate a residual by deriving the mean using the window transform first.

<div class="vl-example" data-name="window_residual_graph"></div>

### Rank Chart

We can also use `rank` operator to calculate ranks over time.

<div class="vl-example" data-name="window_rank"></div>

### Top K

Here we use window transform to derive the total number of students along with the rank of the current student to determine the top K students and display their score.

<div class="vl-example" data-name="window_top_k"></div>


### Cumulative Running Average

Here we use window transform to visualize how the average MPG for vehicles have changed over the years.

<div class="vl-example" data-name="window_cumulative_running_average"></div>
