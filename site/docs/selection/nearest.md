---
layout: docs
menu: docs
title: Nearest Value to a Discrete Selection
permalink: /docs/nearest.html
---

The `nearest` selection transform is a simple boolean operator that can be applied to discrete selection types (`single` and `multi`). It is `false` by default which means that data values must be interacted with directly (e.g., clicked on) to be added to the selection. When `nearest` is set to `true`, an invisible [Voronoi diagram](https://en.wikipedia.org/wiki/Voronoi_diagram) is computed and used to accelerate the selection -- the value _nearest_ the mouse cursor will be added to the selection.

## Examples

In the scatterplot below, points <select onchange="changeSpec('paintbrush_nearest', 'interactive_paintbrush_color' + this.value)"><option value="_nearest">nearest</option><option value="">directly underneath</option></select> the mouse cursor are highlighted as it moves.

<div id="paintbrush_nearest" class="vl-example" data-name="interactive_paintbrush_color_nearest"></div>

The `nearest` transform also respects any [position encoding projections](project.html) applied to the selection. For instance, in the example below, moving the mouse cursor back-and-forth snaps the vertical rule and label to the nearest `date` value.

<div id="paintbrush_nearest" class="vl-example" data-name="interactive_stocks_nearest_index"></div>

## Current Limitations

- The `nearest` transform is not supported for continuous mark types (i.e., `line` and `area`). For these mark types, consider layering a discrete mark type (e.g., `point`) with a 0-value `opacity` as in the last example above.
