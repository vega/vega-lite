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

The `sort` property of [a mark properties channel](encoding.html#mark-props) determines the order of the scale domain. Supported `sort` values depend on the field's scale type.

## Sorting Continuous Scales

If the channel has a continuous scale (quantitative or time), `sort` can have the following values:
- `"ascending"` (Default) –  the field is sorted by the field's value in ascending order.
- `"descending"` –  the field is sorted by the field's value in descending order.

#### Example: Reversed X-Scale

Setting x's `sort` to `"descending"` reverses the x-axis. Thus, the following visualization's x-axis starts on the maximum value of the field "Horsepower" and ends on zero.

<div class="vl-example" data-name="tick_sort"></div>


## Sorting Discrete Scales

If the channel has a discrete scale (`band`, `point` or `ordinal`), the field's values of the channel can be sorted in the following ways:

1) Sorting by the values' natural order in Javascript. For example, `"a"` < `"b"`. In this case, `sort` can be:

- `"ascending"` (Default) –  sort by the field's value in ascending order.
- `"descending"` –  sort by the field's value in descending order.

{:#sort-field}

2) Sorting by aggregated value of another "sort" field. In this case, `sort` is a __sort field definition object__, which has the following properties:

{% include table.html props="field,op,order" source="SortField" %}

3) Unsorted – `null` – The field is not sorted. This is equivalent to specifying `sort: false` in [Vega's scales](https://vega.github.io/vega/docs/scales/#sort).

{:#sort-array}

4) Sorting by preferred order of values by providing `sort` as an array of values that specify the order. Unspecified values will assume their original orders in the data source, preceded by the orders in the sort array.

__Note__: It is also possible to sort by providing custom `scale`'s [`domain`](scale.html#domain). However, it is more error-prone compared to using `sort` array since `domain` requires every possible value to be included in the array. Thus, any value omitted from `domain` will not render properly.

In the case that sort array contains every field value, the sort order will follow the specified values in the array.

<div class="vl-example" data-name="bar_custom_sort_full"></div>

If some values are ignored, the sort order will precede by the specified values in the array while unspecified values will follow their original order.  For example, this plots orders `B`, `A` and `C` first, followed by `Z`, `Y`, `X`. 

<div class="vl-example" data-name="bar_custom_sort_partial"></div>

#### Example: Sorting Ordinal Scale by Another Field

The following example sorts x by mean of Horsepower.

<div class="vl-example" data-name="histogram_sort_mean"></div>

<!-- TODO

## Sorting Layer and Stack Order
## Sorting Line's Path
-->
