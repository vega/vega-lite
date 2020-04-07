---
layout: docs
title: Sorting
permalink: /docs/sort.html
---

```js
// A Single View or a Layer Specification
{
  ...,
  "mark/layer": ...,
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

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Sorting Continuous Fields

If the channel has a continuous field (quantitative or time), `sort` can have the following values:

- `"ascending"` (Default) – the field is sorted by the field's value in ascending order.
- `"descending"` – the field is sorted by the field's value in descending order.

#### Example: Reversed X-Scale

Setting x's `sort` to `"descending"` reverses the x-axis. Thus, the following visualization's x-axis starts on the maximum value of the field "Horsepower" and ends on zero.

<div class="vl-example" data-name="tick_sort"></div>

## Sorting Discrete Fields

If the channel has a discrete scale (ordinal or nominal), `sort` can be one of: `"ascending"`, `"descending"`, [a sort-by-encoding definition](#sort-by-encoding) for sorting by another encoding [a sort field definition](#sort-field) for sorting by another field, [an array specifying preferred order](#sort), or `null`.

### Sort by the Field's Natural Order

To order the data by the values' natural order in JavaScript (e.g.,`"a"` < `"b"`), the `sort` property can be:

- `"ascending"` (Default) – sort by the field's value in ascending order.
- `"descending"` – sort by the field's value in descending order.

{:#sort-by-encoding}

### Sort by Another Encoding Channel

To sort data by another encoding channel, the `sort` property can be an encoding channel name to sort by (e.g., `"x"` or `"y"`) with an optional minus prefix for descending sort (e.g., `"-x"` to sort by x-field, descending).

For example, the following plot sorts the y-values by the x-values (in descending order).

<div class="vl-example" data-name="bar_aggregate_sort_by_encoding"></div>

This is equivalent to using an object with the `encoding` and optional `"order"` property:

{% include table.html props="encoding,order" source="SortByEncoding" %}

For example, `"sort": "-x"` is equivalent to `"sort": {"encoding": "x", "order": "descending"}`.

### Sort by a Different Field

{:#sort-field}

To order data by another field, `sort` can be an **encoding sort field definition**, which has the following properties:

{% include table.html props="field,op,order" source="EncodingSortField" %}

For example, the following plot sorts `"age"` values on the y-axis by `"sum"` of `"people"`. Note that this is equivalent to the example above.

<div class="vl-example" data-name="bar_aggregate_sort_mean"></div>

### Specifying Custom Sort Order

{:#sort-array}

If the `sort` property is an array, it specifies the preferred order of values.

In the case that sort array contains every field value, the sort order will follow the specified values in the array.

<div class="vl-example" data-name="bar_custom_sort_full"></div>

If some values are ignored, the sort order will precede by the specified values in the array while unspecified values will follow their original order. For example, this plots orders `B`, `A` and `C` first, followed by `Z`, `Y`, `X`.

<div class="vl-example" data-name="bar_custom_sort_partial"></div>

For discrete time fields, values in the sort array can be [date-time definition objects](types#datetime). In addition, for time units `"month"` and `"day"`, the values can be the month or day names (case insensitive) or their 3-letter initials (e.g., `"Mon"`, `"Tue"`).

For example, the following chart orders the day to start on Monday (instead of Sunday by default).

<div class="vl-example" data-name="circle_github_punchcard"></div>

**Note**: It is also possible to sort by providing custom `scale`'s [`domain`](scale.html#domain). However, it is more error-prone compared to using a `sort` array since `domain` requires every possible value to be included in the array. Thus, any value omitted from `domain` will not render properly.

### No Sorting

If `sort` is `null`, the field is not sorted. This is equivalent to specifying `sort: false` in [Vega's scales](https://vega.github.io/vega/docs/scales/#sort).

**Note:** `null` is not supported for `row` and `column`.

<!-- TODO

## Sorting Layer and Stack Order
## Sorting Line's Path
-->
