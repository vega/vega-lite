---
layout: docs
menu: docs
title: Initializing a Selection
permalink: /docs/init.html
---

To initialize a selection, set the `init` property to a mapping or array of mappings from [projected channels or field names](project.html) to the initial value of the selection. Single selections are initialized with a mapping to single values, multi selections are initialized with a single mapping or an array of mappings to single values, and interval selections are initialized with a single mapping to arrays of values.

## Examples

In the example below, we initialize the `"brush"` selection to the extent of the brush for the `x` and `y` encoding channels. The values specify the start and end of the interval selection.

<div class="vl-example" data-name="interactive_brush"></div>

In the example below, we initalize the `"CylYr"` selection by setting the values for the `"Cylinders"` and `"Years"` fields. The values are single values because the selection is a of type `single`.

<div class="vl-example" data-name="interactive_query_widgets"></div>
