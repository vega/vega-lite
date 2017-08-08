---
layout: docs
title: Value
permalink: /docs/value.html
---

<!-- TODO: Intro for value -->


[A value definition can be specified to set a mark's property.](encoding.html#value-def)

{:#value}
### Constant Value

For [mark properties channels](#props-channels), if a `field` is not specified, constant values for the properties (e.g., color, size) can also be set directly with the channel definition's `value` property.

{% include table.html props="value" source="ValueDef<number>" %}

**Note**: `detail`, `path`, `order`, `row`, and `column` channels cannot encode the constant `value`.

#### Example

For example, you can set `color` and `shape` of a scatter plot to constant values. Note that as the value is set directly to the color and shape values, there is no need to specify a data `type`. In fact, the data `type` will be ignored if specified.

<span class="vl-example" data-name="scatter_color_shape_constant"></span>


{:#ex-bar-size}

Similarly, `value` for `size` channel of bar marks will adjust the bar's size. By default, there will be 1 pixel offset between bars. The following example sets the size to 10 to add more offset between bars.

<span class="vl-example" data-name="bar_aggregate_size"></span>
