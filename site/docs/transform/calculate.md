---
layout: docs
menu: docs
title: Calculate Transform
permalink: /docs/calculate.html
---

The formula transform extends data objects with new fields (columns) according to a calculation formula.

{: .suppress-error}
```json
{
  ...
  "transform": [
    {"calculate": ..., "as" ...} // Calculate Transform
     ...
  ],
  ...
}
```

{% include table.html props="calculate,as" source="CalculateTransform" %}

## Example

This example use `calculate` to derive a new field, then `filter` data based on the new field.

<span class="vl-example" data-name="bar_filter_calc"></span>
