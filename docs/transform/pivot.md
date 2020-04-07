---
layout: docs
menu: docs
title: Pivot
permalink: /docs/pivot.html
---

The **pivot** transform maps unique values from a field to new aggregated fields (columns) in the output stream. The transform requires both a field to pivot on (providing new field names) and a field of values to aggregate to populate the new cells. In addition, any number of groupby fields can be provided to further subdivide the data into output data objects (rows).

Pivot transforms are useful for creating matrix or cross-tabulation data, acting as an inverse to the [fold](fold.html) transform.

## Pivot Transform Definition

{% include table.html props="pivot,value,groupby,limit,op" source="PivotTransform" %}

## Usage

For the following input data:

```json
[
  {"country": "Norway", "type": "gold", "count": 14},
  {"country": "Norway", "type": "silver", "count": 14},
  {"country": "Norway", "type": "bronze", "count": 11},
  {"country": "Germany", "type": "gold", "count": 14},
  {"country": "Germany", "type": "silver", "count": 10},
  {"country": "Germany", "type": "bronze", "count": 7},
  {"country": "Canada", "type": "gold", "count": 11},
  {"country": "Canada", "type": "silver", "count": 8},
  {"country": "Canada", "type": "bronze", "count": 10}
]
```

The pivot transform

```json
{
  "pivot": "type",
  "groupby": ["country"],
  "value": "count"
}
```

produces the output:

```json
[
  {"country": "Norway", "gold": 14, "silver": 14, "bronze": 11},
  {"country": "Germany", "gold": 14, "silver": 10, "bronze": 7},
  {"country": "Canada", "gold": 11, "silver": 8, "bronze": 10}
]
```

## Example

<div class="vl-example" data-name="bar_column_pivot"></div>

<div class="vl-example" data-name="interactive_multi_line_pivot_tooltip"></div>
