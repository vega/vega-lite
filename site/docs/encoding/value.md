---
layout: docs
title: Value
permalink: /docs/value.html
---

```js
// Specification of a Single View
{
  ...,
  "encoding": {     // Encoding
    ...: {
      "value": ..., // Value
    },
    ...
  },
  ...
}
```

You can use a [value definition](encoding.html#value-def) to map a constant value to an [encoding channel](encoding.html#channels) by setting the `value` property.

For example, you can set `color` and `shape` of a scatter plot to constant values.

<span class="vl-example" data-name="point_color_shape_constant"></span>

{:#ex-bar-size}

Similarly, `value` for `size` channel of bar marks will adjust the bar's size. By default, there will be 1 pixel offset between bars. The following example sets the size to 10 to add more offset between bars.

<span class="vl-example" data-name="bar_aggregate_size"></span>

**Note:** Mapping an encoding channel to a constant `value` is equivalent to setting a property of the [`"mark"`](mark.html#mark-def) definition block. For example, you can also set color and shape of marks by setting `"mark"` to `{"color": "#ff9900", "shape": "square"}`. However, unlike mark definition properties, `value` definition of an encoding channel can also be combined with `condition` to specify conditional encoding. See the [`condition`](condition.html) page for more details.
