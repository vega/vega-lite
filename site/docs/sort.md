---
layout: docs
title: Sorting
permalink: /docs/sort.html
---

```json
{
  "data": ... ,       
  "mark": ... ,       
  "encoding": {     
    "x": {
      "field": ...,
      "type": ...,
      "sort": {                // sort
        ...
      },
      ...
    },
    "y": ...,
    ...
  },
  ...
}
```

`sort` property of each channel's field definition determines the order of its field values.
For `x`, `y`, `row` and `column`, this determines the order of each value's position via the scale.
For `color`, `shape`, `size`, this determines the order of the channel's scale.
For `detail`, this determines the layer order of the output visualization.

<!-- TODO add `path` -->

`sort` property can be specified for sorting the field's values in two ways:

1. (Supported by all types of fields) as __String__ with the following values:
    - `"ascending"` –  the field is sort by the field's value in ascending order.  This is the default value when `sort` is not specified.
    - `"descending"` –  the field is sort by the field's value in descending order.
    - `"unsorted`" – The field is not sorted. (This is equivalent to specifying `sort:false` in [Vega's scales](https://github.com/vega/vega/wiki/Scales).)

2. (Supported by nominal and ordinal fields only) as a __sort field definition object__ - for sorting the field by an aggregate calculation over another sort field.  A sort field object has the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| _sort.field_  | Field         | The field name to aggregate over.|
| _sort.op_     | String        | A valid [aggregation operation](#aggregate) (e.g., `mean`, `median`, etc.).|
| _sort.order_  | String        | `"ascending"` or `"descending"` order. |

__TODO: Example -- sorting axis__

__TODO: Example -- sorting color mapping__
