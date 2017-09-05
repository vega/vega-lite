---
layout: docs
menu: docs
title: Rule
permalink: /docs/rule.html
---

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": "rule",
  "encoding": ... ,
  ...
}
```

The `rule` mark represents each data point as a line. It can be used in two ways. First, as a line that spans the complete width or height of a view. This is useful for adding annotations. Second, a rule can be used to draw a line segment between two positions.


### Rules as annotations

The rule mark can be used similar to a [`tick`](tick.html) mark. The difference is that a rule mark automatically spans the complete width or height of a single view such that no dimension is required. We can sue this for example to show the average price of different stocks.

<span class="vl-example" data-name="rule_color_mean"></span>

The fact that rule marks span the width or the height of a single view make them perfect for adding annotations to charts using [layering]({{site.baseurl}}/docs/layer.html).

Here is an example where we use the spec from above to show the average value of stocks alongside the price curve.

<span class="vl-example" data-name="layer_line_color_rule"></span>


### Rules with two positional encodings

Rules can encode two positions for x and y. This is useful to show multiple measures for a single ordinal value.

For example, we can show the extent of horsepowers for cars from different locations.

<span class="vl-example" data-name="rule_extent"></span>
