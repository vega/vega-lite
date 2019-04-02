---
layout: docs
menu: docs
title: Clearing a selection
permalink: /docs/clear.html
---

The `clear` selection transformation resets the visualization to its initial configuration:

- For `single` and `multi` selections, it will clear all selected values.
- For `interval` selections, it will reset the grid position to its initial configuration.

It can take one of the following values:

- `false` -- disables clear behavior; there will be no trigger that resets the visualization to its initial configuration.
- A [Vega event stream definition](https://vega.github.io/vega/docs/event-streams/) to indicate which events should trigger clearing of the visualization.

Vega-Lite automatically adds a clear transform to all selections by default. It will check your Vega-Lite configuration and conditionally pick an appropriate `clear` trigger based off of the `on` trigger (e.g. `click` to `dblclick`, `mouseover` to `mouseout`).

## Examples

Select points by clicking, and double click when you wish to clear your selected values.

TODO: Add visualizaiton example

Mousing out of the visualization will clear your highlighted value.

<div id="paintbrush_nearest" class="vl-example" data-name="interactive_stocks_nearest_index"></div>

Click and drag to shift the current position of the scales, then double click to reset the scales to their initial configuration.

TODO: Add visualization example
