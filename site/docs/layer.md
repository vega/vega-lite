---
layout: docs
menu: docs
title: Layering views
permalink: /docs/layer.html
---

{: .suppress-error}
```json
{
  "$schema": ...,
  "layer": [ // Layer array
    ... // Specifications
  ]
}
```

Sometimes, it's useful to superimpose one chart on top of another. You can accomplish this by using the `layer` property.
To define a layered chart, you only have to assign an array of chart objects to `layer`.

#### Example

A layered chart consistent of multiple charts that are drawn on top of each other. We will start by creating specifications for the individual layers and eventually combine them in a single `layer` spec.

The first chart is a line chart that shows the stock price of different stocks over time.

<div class="vl-example" data-name="line_color"></div>

The second chart shows the mean price of individual stocks with a rule mark. The `rule` mark is a special mark that can span the whole with/height of a single view specification.

<div class="vl-example" data-name="rule_color_mean"></div>

To layer these two charts on top of each other, we have to put the two specifications in the same layer array. Note that we can leave `data` at the top level as both layers use the same data.

<div class="vl-example" data-name="layer_line_color_rule"></div>

#### Combined Scales and Guides

When you have different scales in different layers, the scale domains are unioned so that all layers can use the same scale. In the example above, Vega-Lite automatically uses a common y-axis and color legend. We can disable this by setting the `resolve` property.

`resolve` is an object where the keys are channels and the values are again objects that specify the resolution for `scale`, `axis` (for positional channels) or `legend` (for non-positional channels). Independent scales imply independent axes and legends. Possible resolutions are `shared` and `independent`.

In the chart below, we set the y-scales of the different layers to be independent with `"resolve": {"y": {"scale": "independent"}}`.

<div class="vl-example" data-name="layer_bar_dual_axis"></div>

##### Advanced Layering Example

The population of the German city of Falkensee over time. Based on a [visualization built using Vega]((https://vega.github.io/vega/examples/falkensee-population/)).
<div class="vl-example" data-name="layered_falkensee">
