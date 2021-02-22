---
layout: docs
menu: docs
title: Calculate Transform
permalink: /docs/calculate.html
---

The formula transform extends data objects with new fields (columns) according to an [expression](types.html#expression).

```js
// Any View Specification
{
  ...
  "transform": [
    {"calculate": ..., "as" ...} // Calculate Transform
     ...
  ],
  ...
}
```

## Calculate Transform Definition

{% include table.html props="calculate,as" source="CalculateTransform" %}

## Example

This example uses `calculate` to derive a new field, and then `filter`s the data based on the new field.

<span class="vl-example" data-name="bar_filter_calc"></span>
