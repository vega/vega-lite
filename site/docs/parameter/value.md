---
layout: docs
menu: docs
title: Initializing a Parameter
permalink: /docs/value.html
---

Parameters can be initialized using the `value` property.

- For variable parameters, this `value` can be set to any valid JSON primitive type including booleans, numbers, or string.
- For selection parameters, `value` should specify mappings between [projected channels or field names](project.html) to initial values.
  - Point selections are initialized with an array of such mappings.
  - Interval selections are initialized with a single object mapping to arrays of values.

## Examples

In the example below, we initalize the `"CylYr"` selection with two values by setting the values for the `"Cylinders"` and `"Years"` fields.

<div class="vl-example" data-name="interactive_point_init"></div>

Similarly, we initialize the `"brush"` selection to the extent of the brush for the `x` and `y` encoding channels. The values specify the start and end of the interval selection.

<div class="vl-example" data-name="interactive_brush"></div>
