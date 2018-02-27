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

4) Specify custom order by:
  1) providing `sort` with an array that lists valid input domains
  2) providing custom `scale`'s [`domain`](scale.html#domain)

#### Example: Sorting Ordinal Scale by Another Field

The following example sorts x by mean of Horsepower.

<div class="vl-example" data-name="histogram_sort_mean"></div>

#### Example: Custom Sort Order On Ordinal Scale

You can specify custom sort order by providing an array of valid domains of data source

<div class="vl-example" data-name="bar_custom_sort"></div>

<!-- TODO

## Sorting Layer and Stack Order
## Sorting Line's Path
-->
