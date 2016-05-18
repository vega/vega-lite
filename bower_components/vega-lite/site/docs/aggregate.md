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

`aggregate` property of the channel definition can be used to compute aggregate summary statistics (e.g., median, min, max) over groups of data.

If at least one fields in the specified encoding channels contain `aggregate`, the resulting visualization will show aggregate data. In this case, all fields without aggregation function specified are treated as group-by fields<sup>1</sup> in the aggregation process. Additional summary and group-by fields can be specified using the `detail` channel. 

Otherwise, if none of the specified encoding channel contains `aggregate`, the resulting visualization shows raw data without aggregation.

<span class="note-line"><sup>1</sup>The group-by fields are also known as [independent/condition variables](https://en.wikipedia.org/wiki/Dependent_and_independent_variables) in statistics and [dimensions](https://en.wikipedia.org/wiki/Dimension_(data_warehouse)) in Business Intelligence. Similarly, the aggregate fields are known as [dependent variables](https://en.wikipedia.org/wiki/Dependent_and_independent_variables) and [measures](https://en.wikipedia.org/wiki/Measure_(data_warehouse)). </span>

#### Supported Aggregation Operations

The supported **aggregation operations** are:

| Operation       | Description  |
| :---------------| :------------|
| count           | Count the total number of elements in the group. <span class="note-line">__Note:__ _'count'_ operates directly on the input objects and return the same value regardless of the provided field. Similar to SQL's `count(*)`, count can be specified with a `field` `"*"`.|
| valid           | Count values that are not `null`, `undefined` or `NaN`.|
| missing         | Count the number of `null` or `undefined` values.|
| distinct        | Count the number distinct values.|
| sum             | Compute the sum of values in a group.|
| mean            | Compute the mean (average) of values in a group.|
| average         | Compute the mean (average) of values in a group. Identical to _mean_.|
| variance        | Compute the sample variance of values in a group.|
| variancep       | Compute the population variance of values in a group.|
| stdev           | Compute the sample standard deviation of values in a group.|
| stdevp          | Compute the population standard deviation of values in a group.|
| median          | Compute the median of values in a group.|
| q1              | Compute the lower quartile boundary of values in a group.|
| q3              | Compute the upper quartile boundary of values in a group.|
| modeskew        | Compute the mode skewness of values in a group.|
| min             | Compute the minimum value in a group.|
| max             | Compute the maximum value in a group.|

#### Example

The following bar chart aggregate mean of `Acceleration`, grouped by `Cylinders` (number of cylinders).

<div class="vl-example" data-name="bar_aggregate_vertical"></div>

<!-- TODO make scatter_aggregate_detail -->
