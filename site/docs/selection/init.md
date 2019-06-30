---
layout: docs
menu: docs
title: Initialzing a Selection
permalink: /docs/init.html
---

To initialize a selection, set the `init` property to a map or array of maps from [projected channels or field names](project.html) to the initial value of the selection. Single selections are initialized with a map to single values, multi selections are initialized with an array of maps to single values, and interval selections are initialized with a single map to arrays of values.

## Examples

In the example below, we inialize the `"brush"` selection to the extent of the brush for yhe `x` and `y` encoding channels. The values specify the start and end of the interval selection.

<div class="vl-example" data-name="interactive_brush"></div>

In the example below, we initalize the `"CylYr"` selection by setting the values for the `"Cylinders"` and `"Years"` fields. The values are single values because the selection is a of type `single`.

<div class="vl-example" data-name="interactive_query_widgets"></div>
