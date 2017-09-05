---
layout: docs
title: Aggregation
permalink: /docs/aggregate.html
---

To aggregate data in Vega-Lite, users can either use a `summarize` transform as a part of the [`transform`](transform.html) array or use an `aggregate` property of an encoding field definition.

## Documentation Overview
{:.no_toc}

* TOC
{:toc}


{:#aggregate}
## Aggregate (Encoding)

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

`aggregate` property of the channel definition can be used to compute aggregate summary statistics (e.g., median, min, max) over groups of data.

If at least one fields in the specified encoding channels contain `aggregate`, the resulting visualization will show aggregate data. In this case, all fields without aggregation function specified are treated as group-by fields<sup>1</sup> in the aggregation process. Additional summary and group-by fields can be specified using the `detail` channel.

Otherwise, if none of the specified encoding channel contains `aggregate`, the resulting visualization shows raw data without aggregation.

<span class="note-line"><sup>1</sup>The group-by fields are also known as [independent/condition variables](https://en.wikipedia.org/wiki/Dependent_and_independent_variables) in statistics and [dimensions](https://en.wikipedia.org/wiki/Dimension_(data_warehouse)) in Business Intelligence. Similarly, the aggregate fields are known as [dependent variables](https://en.wikipedia.org/wiki/Dependent_and_independent_variables) and [measures](https://en.wikipedia.org/wiki/Measure_(data_warehouse)). </span>


{:#summarize}
## Summarize (Transform)


{: .suppress-error}
```json
{
  ...
  "transform": [
    {
      "summarize": [{"aggregate": ..., "field": ..., "as": ...}],
      "groupby": [...]
    } // Summarize Transform
     ...
  ],
  ...
}
```

A `summarize` transform in the `transform` array has the following properties:

{% include table.html props="summarize,groupby" source="SummarizeTransform" %}

### Aggregated Field Definition for Summarize Transform

{% include table.html props="aggregate,field,as" source="Summarize" %}


{:#ops}
## Supported Aggregation Operations

The supported **aggregation operations** are:

| Operation | Description  |
| :-------- | :------------|
| count     | The total count of data objects in the group. <span class="note-line">__Note:__ _'count'_ operates directly on the input objects and return the same value regardless of the provided field. Similar to SQL's `count(*)`, count can be specified with a `field` `"*"`.|
| valid     | The count of field values that are not `null`, `undefined` or `NaN`.|
| missing   | The count of `null` or `undefined` field values.|
| distinct  | The count of distinct field values.|
| sum       | The sum of field values.|
| mean      | The mean (average) field value.|
| average   | The mean (average) field value. Identical to _mean_.|
| variance  | The sample variance of field values.|
| variancep | The population variance of field values.|
| stdev     | The sample standard deviation of field values.|
| stdevp    | The population standard deviation of field values.|
| stderr    | The standard error of field values.|
| median    | The median field value.|
| q1        | The lower quartile boundary of field values.|
| q3        | The upper quartile boundary of field values.|
| ci0       | The lower boundary of the bootstrapped 95% confidence interval of the mean field value.|
| ci1       | The upper boundary of the bootstrapped 95% confidence interval of the mean field value.|
| min       | The minimum field value.|
| max       | The maximum field value.|
| argmin    | An input data object containing the minimum field value.|
| argmax    | An input data object containing the maximum field value.|


## Example

The following bar chart aggregate mean of `Acceleration`, grouped by `Cylinders` (number of cylinders).

<div class="vl-example" data-name="bar_aggregate_vertical"></div>

<!-- TODO make scatter_aggregate_detail -->
