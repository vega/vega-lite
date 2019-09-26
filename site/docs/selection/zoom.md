---
layout: docs
menu: docs
title: Zooming an Interval Selection
permalink: /docs/zoom.html
---

The `zoom` selection transformation allows a user to interactively resize an interval selection. It can take one of the following values:

- `false` -- disables the ability to zoom an interval selection.
- A [Vega event stream definition](https://vega.github.io/vega/docs/event-streams/) to indicate which events should trigger panning of the interval selection. Currently, only `wheel` event types are supported, but custom event streams can still be used to specify filters, debouncing, and throttling. Future versions will expand the set of events that can trigger this transformation.

Vega-Lite automatically adds a zoom transform to all interval selections by default, with the following definition: `"zoom": "wheel!"`. As a result, once users drag out an interval selection, they can click and drag within it to reposition it.

## Examples

Zoom the <select id="type" onchange="buildTranslate()"><option>brush</option><option>scatterplot</option></select> on <select id="event" onchange="buildTranslate()"><option>wheel</option><option>shift-wheel</option></select>.

<div id="zoom" class="vl-example" data-name="selection_zoom_brush_wheel"></div>

<script type="text/javascript">
function buildTranslate() {
  const type = document.getElementById('type').value;
  const event = document.getElementById('event').value;
  changeSpec('zoom', 'selection_zoom_' + type + '_' + event);
}
</script>
