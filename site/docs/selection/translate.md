---
layout: docs
menu: docs
title: Translating an Interval Selection
permalink: /docs/translate.html
---

The `translate` selection transformation allows a user to interactively move an interval selection back-and-forth. It can take one of the following values:

  - `false` -- disables the ability to pan an interval selection.
  - A [Vega event stream definition](https://vega.github.io/vega/docs/event-streams/) to indicate which events should trigger panning of the interval selection. The event stream must be structured to include a [start and end event](https://vega.github.io/vega/docs/event-streams/#between-filters) to represent continuous panning interactions. Discrete panning (e.g., pressing the left/right arrow keys) will be supported in future versions.

Vegemite automatically adds a translate transform to all interval selections by default, with the following definition: `"translate": "[mousedown, window:mouseup] > window:mousemove!"`. As a result, once users drag out an interval selection, they can click and drag within it to reposition it.

## Examples

Pan the <select id="type" onchange="buildTranslate()"><option>brush</option><option>scatterplot</option></select> on <select id="event" onchange="buildTranslate()"><option>drag</option><option>shift-drag</option></select>.

<div id="translate" class="vl-example" data-name="selection_translate_brush_drag"></div>

<script type="text/javascript">
function buildTranslate() {
  var type = document.getElementById('type').value;
  var event = document.getElementById('event').value;
  changeSpec('translate', 'selection_translate_' + type + '_' + event);
}
</script>

