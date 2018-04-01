---
layout: docs
menu: docs
title: Layering views
permalink: /docs/layer.html
---

Sometimes, it's useful to superimpose one chart on top of another. You can accomplish this by using the `layer` operator. This operator is one of Vegemite's [view composition operators](composition.html). To define a layered chart, put multiple specifications into an array under the `layer` property.

{: .suppress-error}
```json
{
  "layer": [
    ...  // Single or layered view specifications
  ]
}
```

In addition to [common properties of a view specification](spec.html#common),
a layer specification has the following properties:

{% include table.html props="layer,width,height,encoding,projection,resolve" source="LayerSpec" %}

Please note that you can *only layer single or layered views* to guarantee that the combined views have a compatible layout. For instance, it is not clear how a composed view with two views side-by-side could be layered on top of a single view.

## Example

A layered chart consistent of multiple charts that are drawn on top of each other. We will start by creating specifications for the individual layers and eventually combine them in a single `layer` spec.

The first chart is a line chart that shows the stock price of different stocks over time.

<div class="vl-example" data-name="line_color"></div>

The second chart shows the mean price of individual stocks with a rule mark. The `rule` mark is a special mark that can span the whole with/height of a single view specification.

<div class="vl-example" data-name="rule_color_mean"></div>

To layer these two charts on top of each other, we have to put the two specifications in the same layer array. Note that we can leave `data` at the top level as both layers use the same data.

<div class="vl-example" data-name="layer_line_color_rule"></div>

See [the example gallery](examples.html#layering) for more layering examples.

### Combined Scales and Guides

When you have different scales in different layers, the scale domains are unioned so that all layers can use the same scale. In the example above, Vegemite automatically uses a common y-axis and color legend. We can disable this by setting the `resolve` property.

The default [resolutions](resolve.html) for layer are shared scales, axes, and legends.

In the chart below, we set the y-scales of the different layers to be independent with `"resolve": {"scale": {"y": "independent"}}`.

<div class="vl-example" data-name="layer_bar_dual_axis"></div>
