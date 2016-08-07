---
layout: docs
title: Sorting
permalink: /docs/sort.html
---

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": ... ,
  "encoding": {
    "x": {
      "field": ...,
      "type": ...,
      "sort": ...,         // sort
      ...
    },
    "y": ...,
    ...
  },
  ...
}
```

`sort` property of [a mark properties channel](encoding.html#mark-props) determines the order of the scale domain. Supported `sort` value depends on the field's scale type.

## Continuous Scale

If the channel has a continuous scale (quantitative or time), `sort` can have the following values:
- `"ascending"` –  the field is sort by the field's value in ascending order.
- `"descending"` –  the field is sort by the field's value in descending order.

<span class="note-line">__Default value:__ `"ascending"`.</span>


#### Example: Reversed X-Scale

Setting x's `sort` to `"descending"` reverses the x-axis. Thus, the following visualization's x-axis starts on the maximum value of the field "Horsepower" and ends on zero.

<div class="vl-example">
{
  "data": {"url": "data/cars.json"},
  "mark": "tick",
  "encoding": {
    "x": {"field": "Horsepower", "type": "quantitative", "sort": "descending"}
  }
}
</div>


## Ordinal Scale

If the channel has an ordinal scale, the field's values of the channel can be sorted in the following ways:

1) Sorting by the values's natural order in Javascript. For example, `"a"` < `"b"`. In this case, `sort` can be:

- `"ascending"` –  sort by the field's value in ascending order.
- `"descending"` –  sort by the field's value in descending order.

{:#sort-field}

2) Sorting by aggregated value of another "sort" field. In this case, `sort` is a __sort field definition object__, which has the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| _field_       | Field         | The field name to aggregate over.|
| _op_          | String        | A valid [aggregation operation](#aggregate) (e.g., `mean`, `median`, etc.).|
| _order_       | String        | `"ascending"` or `"descending"` order. |

<!-- TODO:
support manually specify sort order
example: sorting color mapping
 -->

3) Unsorted – `"none`" – The field is not sorted. This is equivalent to specifying `sort: false` in [Vega's scales](https://github.com/vega/vega/wiki/Scales).

<span class="note-line">__Default value:__ `"ascending"`.</span>

4) Specify custom order by providing custom `scale`'s [`domain`](scale.html#domain).  (In this case, you don't need to use `sort` property.)

#### Example: Sorting Ordinal Scale by Another Field

The following example sorts x by mean of Horsepower.

<div class="vl-example">
{
  "data": {"url": "data/cars.json"},
  "mark": "bar",
  "encoding": {
    "y": {
      "field": "Origin", "type": "ordinal",
      "sort": {"op": "mean", "field": "Horsepower"}
    },
    "x": {"aggregate": "mean", "field": "Horsepower", "type": "quantitative"}
  }
}
</div>


<!-- TODO

## Sorting Layer and Stack Order
## Sorting Line's Path
-->
