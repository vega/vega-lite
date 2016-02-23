---
layout: docs
title: Aggregation
permalink: /docs/aggregate.html
---

<!-- TODO why aggregation -->

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": ... ,
  "encoding": {
    "x": {
      "aggregate": ...,               // aggregate
      "field": ...,
      "type": "quantitative",
      ...
    },
    "y": ...,
    ...
  },
  ...
}
```

Vega-Lite supports all [Vega aggregation operations](https://github.com/vega/vega/wiki/Data-Transforms#-aggregate) (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).

If at least one fields in the specified encoding channels contain `aggregate`, the resulting visualization will show aggregate data.  In this case, all fields without aggregation function specified are treated as group-by fields in the aggregation process; Additional summary and group-by fields can be specified using the `detail` channel.

Otherwise, if none of the specified encoding channel contains `aggregate`,
the resulting visualization shows raw data without aggregation.


#### Example

The following bar chart aggregate mean of `Acceleration`, grouped by
`Cylinders` (number of cylinders).

<span class="vl-example">
{
  "data": {"url": "data/cars.json"},
  "mark": "bar",
  "encoding": {
    "x": {"field": "Cylinders", "type": "ordinal"},
    "y": {"aggregate": "mean", "field": "Acceleration", "type": "quantitative"}
  }
}
</span>

<!-- TODO make scatter_aggregate_detail -->
