---
layout: docs
menu: docs
title: Text
permalink: /docs/text.html
---

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": "text",
  "encoding": ... ,
  ...
}
```

`text` mark represents each data point with a text instead of a point.

## Scatterplot with Text

Mapping a field to `text` channel of text mark sets the mark's text value. For example, we can make a colored scatterplot with text marks showing the initial character of its origin, instead of [`point`](point.html#color) marks.

<span class="vl-example" data-name="text_scatter_colored"></span>

<!--
### Text Table Heatmap
__TODO__
-->
