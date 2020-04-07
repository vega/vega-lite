---
layout: docs
menu: docs
title: Filter Transform
permalink: /docs/filter.html
---

The filter transform removes objects from a data stream based on a provided filter expression or filter object.

```js
// Any View Specification
{
  ...
  "transform": [
    {"filter": ...} // Filter Transform
     ...
  ],
  ...
}
```

Vega-Lite filter transforms must have the `filter` property describing the predicate for the filtering condition.

{% include table.html props="filter" source="FilterTransform" %}
