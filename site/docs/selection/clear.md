---
layout: docs
menu: docs
title: Clearing a selection
permalink: /docs/clear.html
---

The `clear` property identifies which events must fire to empty a selection of all selected values (the [`empty`](https://vega.github.io/vega-lite/docs/selection.html#selection-properties) can be used to further determine the behavior of empty selections).

It can take one of the following values:

- `false` -- disables clear behavior; there will be no event trigger that empties a selection.
- A [Vega event stream definition](https://vega.github.io/vega/docs/event-streams/) to indicate which events should trigger clearing the selection.

Vega-Lite automatically adds the clear property to all selections by default. If the selection is triggered by mouse hovers (i.e., `"on": "mouseover"), then`"clear": "mouseout"`is used. For all other selection triggers,`"clear": "dblclick"` is used.

## Examples

The following visualization demonstrates the default clearing behavior: select a square on click and clear out the selection on double click.

<div class="vl-example" data-name="selection_clear_heatmap"></div>

The following example clears the brush when the mouse button is released.

<div class="vl-example" data-name="selection_clear_brush"></div>

Note, in the above example, clearing out the selection does _not_ reset it to its initial value. Instead, when the mouse button is released, the selection is emptied of all values. This behavior is subtly different to when the selection is [bound to scales](https://vega.github.io/vega-lite/docs/bind.html#scale-binding) -- clearing the selection out now resets the view to use the initial scale domains. Try it out below: pan and zoom the plot, and then double click.

<div class="vl-example" data-name="selection_translate_scatterplot_drag"></div>
