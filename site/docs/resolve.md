---
layout: docs
menu: docs
title: Scale and Guide Resolution
permalink: /docs/resolve.html
---

Vega-Lite determines whether scale domains should be unioned. If the scale domain is unioned, axes and legends can be merged. Otherwise they have to be independent.

{: .suppress-error}
```json
{
  "resolve": {
    CHANNEL: {
      "scale": ...,  // Scale resolution
      "axis": ...,  // Axis resolution for spatial channels
      "legend": ...  // Legend resolution for non-spatial channels
    }
  }
}
```

`resolve` is an object where the keys are channels and the values are again objects that specify the resolution for `scale`, `axis`  or `legend`.

For `x` and `y` (positional channels), the resolution can be defined for scales and axes. For `color`, `opacity`, `shape`, and `size` (non-positional channels), the resolution can be defined for scales and legends.

The two options to resole a scale, axis, or legend are `shared` and `independent`. Independent scales imply independent axes and legends.

The defaults documented on the [faceting](facet.html#combined-scales-and-guides), [layering](layer.html#resolve), [concatenation](concat.html#resolve), and [repeating](repeat.html#resolve) pages.
