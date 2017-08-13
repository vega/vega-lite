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

The `sort` property in a [field definition](encoding.html#field) determines the order of the scale domain for a discrete scale (`"band"`, `"point"`, or `"ordinal"`).  The `sort` property supports the following values:

1. `"ascending"` (Default) and `"descending"` for sorting the field by its values in ascending/descending order, using the values' natural order in Javascript. For example, `"a"` < `"b"`.

2. [Sort field definition object](#sort-field), for sorting the field by another field in the data.

3. `null`.  If sort is `null`, the field is not sorted. This is equivalent to specifying `sort: false` in [Vega's scales](https://github.com/vega/vega/wiki/Scales).

__Note__: You may specify custom order of discrete scale by providing custom `scale`'s [`domain`](scale.html#domain).
(In this case, you don't need to use `sort` property.)

{:#sort-field}
## Sort Field

To sort the encoded field by another field, a __sort field definition object__ can have the following properties:

{% include table.html props="field,op,order" source="SortField" %}

### Example: Sorting Ordinal Scale by Another Field

The following example sorts Origin on the y-axis by mean of Horsepower.

<div class="vl-example" data-name="histogram_sort_mean"></div>
