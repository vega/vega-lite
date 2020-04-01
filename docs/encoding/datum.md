---
layout: docs
title: Value
permalink: /docs/datum.html
---

```js
// A Single View or a Layer Specification
{
  ...,
  "mark/layer": ...,
  "encoding": {     // Encoding
    ...: {
      "datum": ..., // Value
    },
    ...
  },
  ...
}
```

You can use a [datum definition](encoding.html#datum-def) to map a constant data value to an [encoding channel](encoding.html#channels) via an underlying scale by setting the `datum` property.

## Examples

### Highlight a Specific Data Value

`datum` is particularly useful for annotating a certain data value.

For example, you can use it with a rule mark to highlight a certain threshold value (e.g., 200 dollars stock price).

<span class="vl-example" data-name="layer_line_datum_rule"></span>

You can also use datum with a [date time](datetime.html) definition, for example, to highlight a certain year:

<span class="vl-example" data-name="layer_line_datum_rule_datetime"></span>

### Using Datum to Color Multi-series Chart

Another application of `datum` is to color a multi-series line chart created with `repeat`.

<span class="vl-example" data-name="repeat_layer"></span>
