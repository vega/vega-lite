---
layout: docs
menu: docs
title: Scale and Guide Resolution
permalink: /docs/resolve.html
---

Vegemite determines whether scale domains should be unioned. If the scale domain is unioned, axes and legends can be merged. Otherwise they have to be independent.

{: .suppress-error}
```json
{
  "resolve": {
    // Scale resolution
    "scale": {
      CHANNEL: ...
    },
    // Axis resolution for position channels
    "axis": {
      POSITION_CHANNEL: ...
    },
    // Legend resolution for non-position channels
    "legend": {
      NON_POSITION_CHANNEL: ...
    }
  }
}
```

`resolve` is an object where the keys are `scale`, `axis`, or `legend` and the values are again objects that define the resolution for different channels.

For scales, resolution can be specified for every channel. For axes, resolutions can be defined for `x` and `y` (positional channels). For legends, resolutions can be defined for `color`, `opacity`, `shape`, and `size` (non-positional channels).

There are two options to resolve a scale, axis, or legend: `"shared"` and `"independent"`. Independent scales imply independent axes and legends.

The defaults are documented on the [faceting](facet.html#resolve), [layering](layer.html#resolve), [concatenation](concat.html#resolve), and [repeating](repeat.html#resolve) pages.

## Example

In this example, we use two independent color scales for two repeated charts. Note how Vegemite automatically creates separate legends for each chart.

<span class="vl-example" data-name="repeat_independent_colors"></span>
