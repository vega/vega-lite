---
layout: docs
menu: docs
title: Window
permalink: /docs/window.html
---

The window transform performs calculations over sorted groups of data objects. These calculations including ranking, lead/lag analysis, and aggregates such as running sums and averages. Calculated values are written back to the input data stream.

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
          "op": "...",
          "field": "...",
          "as": "..."
      }],
      "groupby": [
          "..."
      ],
      "frame": "..."
    }
     ...
  ],
  ...
}
```

## Window Transform Definition

| Property    | Type | Description  |
| :----------- | :-------: | :------------|
| window | WindowFieldDef[] | The definition of the fields in the window, and what calculations to use. |
| frame | Number[] | A two element specification about how large the sliding window is. The first element indicates the start and the second element indicates the end. If `null` is specified for the start, it will include everything before the current point. If `null` is specified for the end, it will include everything after the endpoint. For example a frame of `[-5,5]` says the window should include 5 previous objects and 5 after objects. The default is `[null, 0]`, which means include everything in the window. `[null, null]` would mean include everything in the window. |
| ignorePeers | boolean | Will indicate whether to ignore peer values (items with the same rank) in the window. The default value is `False`.|
| groupBy | String[] | The names of the data fields to partioin the objects into seprate windows. If not specified, everything will be in a single group. |
| sort | WindowSortField | A definition for sorting the objects within the window. Equivalent objects are considered a peer (Look at ignorePeers). If left undefined, the order of items in the window is undefined.|

### Window Transform Field Definition
| Property    | Type | Description  |
| :----------- | :-------: | :------------|
| field | String | The name of the field to sort.  |
| order | `'ascending' | 'descending'` | Whether to sort the field in ascending or descending order |

### Window Sort Field Definition
| Property    | Type | Description  |
| :----------- | :-------: | :------------|
| op | AggregateOp or WindowOnlyOp | See supported operations in the table below.  |
| param | number | Parameter values for the window functions. Parameter value can be null for operations that do not accept a parameter. |
| field | string | The data field for which to compute the aggregate or window function. This can be null for functions that do not operate over a field such as `count`, `rank`, `dense_rank`. |
| as | string | The output name for each field. If non specified will use the format `window_op_field` for example, `count_field` for count and `sum_field` for sum. |

## <a name="ops"></a> Window Only Operation Reference

The valid operations include all [valid aggregate operations](../aggregate/#ops) plus the following window operations.

| Operation    | Parameter | Description  |
| :----------- | :-------: | :------------|
| row_number   | _None_    | Assigns each data object a consecutive row number, starting from 1.|
| rank         | _None_    | Assigns a rank order value to each data object in a window, starting from 1. Peer values are assigned the same rank. Subsequent rank scores incorporate the number of prior values. For example, if the first two values tie for rank 1, the third value is assigned rank 3.|
| dense_rank   | _None_    | Assigns dense rank order values to each data object in a window, starting from 1. Peer values are assigned the same rank. Subsequent rank scores do not incorporate the number of prior values. For example, if the first two values tie for rank 1, the third value is assigned rank 2.|
| percent_rank | _None_    | Assigns a percentage rank order value to each data object in a window. The percent is calculated as _(rank - 1) / (group_size - 1)_. |
| cume_dist    | _None_    | Assigns a cumulative distribution value between 0 and 1 to each data object in a window.|
| ntile        | {% include type t="Number" %} | Assigns a quantile (e.g., percentile) value to each data object in a window. Accepts an integer parameter indicating the number of buckets to use (e.g., 100 for percentiles, 5 for quintiles).|
| lag          | {% include type t="Number" %} | Assigns a value from the data object that precedes the current object by a specified number of positions. If no such object exists, assigns `null`. Accepts an offset parameter (default `1`) that indicates the number of positions. This operation must have a corresponding entry in the _fields_ parameter array.|
| lead         | {% include type t="Number" %} | Assigns a value from the data object that follows the current object by a specified number of positions. If no such object exists, assigns `null`. Accepts an offset parameter (default `1`) that indicates the number of positions. This operation must have a corresponding entry in the _fields_ parameter array.|
| first_value  | _None_    | Assigns a value from the first data object in the current sliding window frame. This operation must have a corresponding entry in the _fields_ parameter array.|
| last_value   | _None_    | Assigns a value from the last data object in the current sliding window frame. This operation must have a corresponding entry in the _fields_ parameter array.|
| nth_value    | {% include type t="Number" %} | Assigns a value from the nth data object in the current sliding window frame. If no such object exists, assigns `null`. Requires a non-negative integer parameter that indicates the offset from the start of the window frame. This operation must have a corresponding entry in the _fields_ parameter array.|

## Examples
To replace any of the examples from total to `mean`, the operation just needs to be changed from `sum` to `mean`.

### Percent of Total

```json
  {
    "window": [{
        "op": "sum",
        "field": "x",
        "as": "total"
    }],
    "frame": [null, null]
  },
  {
    "calculate": "datum.x/datum.total",
    "as": "Percent of Total"
  }
```


### Difference from Total

```json
  {
    "window": [{
        "op": "sum",
        "field": "x",
        "as": "total"
    }],
    "frame": [null, null]
  },
  {
    "calculate": "datum.total - datum.x",
    "as": "Difference from total"
  }
```

### Percent Difference from Total

```json
  {
    "window": [{
        "op": "sum",
        "field": "x",
        "as": "total"
    }],
    "frame": [null, null]
  },
  {
    "calculate": "(datum.total - datum.x)/dataum.total",
    "as": "Percent difference from total"
  }
```