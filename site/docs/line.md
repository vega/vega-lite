---
layout: docs
menu: docs
title: Line
permalink: /docs/line.html
---

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": "line",
  "encoding": ... ,
  ...
}
```

The `line` mark represents the data points stored in a field with a line connecting all of these points. Unlike other marks that represent one data element per mark, one line mark represents multiple data element as a single line (same is true for [`area`](area.html)).

### Line Chart

Using `line` with one ordinal field (typically on `x`) and another quantitative field (typically on `y`) produces a simple line chart with a single line.

<span class="vl-example" data-name="line"></span>

We can add create multiple lines by grouping along different attributes, such as `color` or `detail`.

### Colored Line Chart

In the example below, we group points using a new field mapped to `color`. This produces a line chart with different colors for each line.

<span class="vl-example" data-name="line_color"></span>

### Line Chart with Multiple Lines

Alternatively, we can map the same field to `detail`, creating multiple lines but with the same color instead.

<span class="vl-example" data-name="line_detail"></span>

### Line Chart with Custom Path

By default, the line's path (order of points in the line) is determined by data values on the ordinal dimension (x or y) like shown in previous examples. However, a field can be mapped to `path` channel for determining custom path.

<span class="vl-example" data-name="scatter_connected"></span>
