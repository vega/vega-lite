---
layout: docs
title: Field
permalink: /docs/field.html
---

```js
// A Single View or a Layer Specification
{
  ...,
  "mark/layer": ...,
  "encoding": {     // Encoding
    ...: {
      "field": ..., // Field
      "type": "quantitative",
      ...
    },
    ...
  },
  ...
}
```

A [field definition](encoding.html#field-def) of an [encoding channel](encoding.html#channels) must include a `field` in order to map an encoding channel to a data field. The [sort field definition](sort.html#sort-field) can also have the `field` property to sort the encoded field by another field as well.

The `field` property can be one of:

**1) A string representing the data field.**

For example, we can set `field` to `"precipitation"` to map it to `x` position.

<span class="vl-example" data-name="tick_dot"></span>

Valid JavaScript object access paths using either dot (e.g., `foo.bar`) or bracket with quotes (e.g., `foo['bar']`) notations can be used in `field` to perform nested object lookups. If field names contain dots or brackets but are not nested, use `\\` to escape dots and brackets. For example, if the field name is `a.b`, use `a\\.b`. Similarly, if the field name is `a[0]`, use `a\\[0\\]`.

Further note that in JSON, you have to escape backslashes. Hence, a single backslash (`\`) is escaped as `\\\\` in JSON. You also need to escape quotes (`\"`) and use special escape characters for newlines (`\n`), carriage returns (`\r`), and tabs (`\t`).

{:#repeat-ref}

**2) An object defining iterated values from the `repeat` operator**

For example, we can set `field` of `x` channel to `{"repeat": "column"}` to create a histogram of different fields.

<span class="vl-example" data-name="repeat_histogram"></span>

See the [`repeat`](repeat.html) page for more information about the `repeat` operator and more examples.
