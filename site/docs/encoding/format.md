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

#### Default

By default, time fields may have dynamic time format that uses different formats depending on the granularity of the input date (e.g., if the tick's date lies on a year, month, date, hour, etc. boundary).

<span class="vl-example" data-name="line_default_format"></span>

#### Specifying Dynamic Time Format

{:#dynamic-time-format}

We can override dynamic time format by setting `format` to an object where the keys are valid [Vega time units](https://vega.github.io/vega/docs/api/time/#time-units) (e.g., `year`, `month`, etc) and the values are [d3-time-format](https://d3js.org/d3-time-format#locale_format) specifier strings.

<span class="vl-example" data-name="line_override_dynamic_format"></span>

#### Specifying Static Time Format

If you prefer using a static time format, you can set `format` to a desired time format specifier string:

<span class="vl-example" data-name="line_override_static_format"></span>

Note that time format can also contain text.

<span class="vl-example" data-name="bar_yearmonth_custom_format"></span>
