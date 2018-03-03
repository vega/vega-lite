---
layout: docs
menu: docs
title: Toggling a Multi Selection
permalink: /docs/toggle.html
---

The `toggle` selection transformation inserts or removes data values from a multi selection if they, respectively, are or are not already members of it.

It can take one of the following values:

  - `false` -- disables toggling behaviour; as the user interacts, data values are only inserted into the multi selection and never removed.
  - A [Vega expression](https://vega.github.io/vega/docs/expressions/) which is re-evaluated as the user interacts. If the expression evaluates to `true`, the data value is toggled into or out of the multi selection. If the expression evaluates to `false`, the multi selection is first clear, and the data value is then inserted.

Vega-Lite automatically adds a toggle transformation to all multi selections by default, with the following definition: `"toggle": "event.shiftKey"`. As a result, data values are toggled when the user interacts with the shift-key pressed.

## Examples

Highlight points in the scatterplot below by <select name="toggle" onchange="buildToggle(true)"><option value="toggle">toggling</option><option value="insert">inserting</option></select> into the `paintbrush` selection when clicking<span id="toggle-expl"> with: <br> <label onclick="buildToggle()"><input type="checkbox" name="toggle" value="shiftKey" checked="checked" />`event.shiftKey`</label> <label onclick="buildToggle()"><input type="checkbox" name="toggle" value="altKey" />`event.altKey`</label></span>.

<div id="toggle" class="vl-example" data-name="selection_toggle_shiftKey"></div>

<script type="text/javascript">
function buildToggle(changeType) {
  var type = document.querySelector('select[name=toggle]');
  var expl = document.getElementById('toggle-expl');
  var inputs = document.querySelectorAll('input[name=toggle]');

  if (!changeType && !inputs[0].checked && !inputs[1].checked) {
    type.value = 'insert';
    changeType = true;
  }

  if (changeType) {
    if (type.value === 'toggle') {
      expl.style.display = 'inline';
      inputs[0].checked = true;
      inputs[1].checked = false;
    } else {
      expl.style.display = 'none';
      inputs[0].checked = inputs[1].checked = false;
    }
  }

  buildSpecOpts('toggle', 'selection_');
}
</script>
