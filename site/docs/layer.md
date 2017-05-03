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
Let's create a chart that shows the mean price of individual stocks.

<div class="vl-example" data-name="layer_single_mean"></div>
Of course `layer` isn't needed here, it's added only for demonstrational purposes.
Now, let's draw a simple line chart of prices of stocks.

<div class="vl-example" data-name="layer_single_color"></div>

Now, let's add the chart into the layer array.
<div class="vl-example" data-name="layer_line_color_rule"></div>

And voila! You have a layered chart.
##### Note
When you have different scales in different layers, the layers are unioned to give a net example having one union scale.

##### Advanced Example
The population of the German city of Falkensee over time. Based on a [visualization built using Vega]((https://vega.github.io/vega/examples/falkensee-population/)).
<div class="vl-example" data-name="layered_falkensee">