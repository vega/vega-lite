---
layout: docs
title: Value
permalink: /docs/value.html
---

<!-- TODO: Intro for value -->


[A value is part of a value definition](encoding.html#value)

{:#value}
### Constant Value

For [mark properties channels](#props-channels), if a `field` is not specified, constant values for the properties (e.g., color, size) can also be set directly with the channel definition's `value` property.

{% include table.html props="value" source="ValueDef<number>" %}

**Note**: `detail`, `path`, `order`, `row`, and `column` channels cannot encode the constant `value`.
