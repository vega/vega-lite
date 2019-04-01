---
layout: docs
title: Format
permalink: /docs/format.html
---

In Vega-Lite specifications you can customize the format of [text marks](text.html), [tooltips](tooltip.html#using-tooltip-channel), [axis](axis.html), [legend](legend.html), [header](header.html) labels.

The [text field definition](encoding.html#text) as well as definitions of [axis](axis.html), [legend](legend.html), [header](header.html) labels include the following properties:

{% include table.html props="format,formatType" source="Axis" %}

In addition, you can override the [default formats in the config](config.html#format).

## Formatting Text Marks and Tooltips

```js
// A Single View or a Layer Specification
{
  ...,
  "mark/layer": ...
  "encoding": {
    ...,
    "text": {
      "field": ...,
      "type": ...,
      "format": ...,   // Format
      "formatType": ...,
      ...
    },
    ...
  }
}
```

Text marks and tooltips are formatted by setting the `format` property of [text or tooltip channel definitions](encoding.html#text).

For example, we can use Vega-Lite to show the average horsepower for cars from different origins. To format the number to have 2 digits of precisions, we can use the format `.2f`.

<span class="vl-example" data-name="text_format"></span>

Formatting tooltips or dates is done similarly.

## Formatting Axis, Legend, and Header Labels

```js
// A Single View or a Layer Specification
{
  ...,
  "mark/layer": ...,
  "encoding": {
    ...: {
      "field": ...,
      "type": ...,
      "axis/legend/header": {                // Axis / Legend / Header
        "format": ...,
        "formatType": ...,
        ...
      },
      ...
    },
    ...
  }
}
```

### Quantitative Fields

Below, we override the default number formatting to use exponent notation set to two significant digits.

<span class="vl-example" data-name="bar_aggregate_format"></span>

### Temporal Data

In the example below we format the axis label to only show the year.

<span class="vl-example" data-name="line"></span>

The format can also contain text.

<span class="vl-example" data-name="bar_yearmonth_custom_format"></span>
