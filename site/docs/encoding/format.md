---
layout: docs
title: Format
permalink: /docs/format.html
---

In Vega-Lite specifications you can customize the format of [text marks](text.html), [tooltips](tooltip.html#using-tooltip-channel), and [axis](axis.html) and [legend](legend.html) labels.

Vega-Lite uses D3's [number format pattern](https://github.com/d3/d3-format#locale_format) for quantitative fields and D3's [time format pattern](https://github.com/d3/d3-time-format#locale_format) for time field. You can override the [default formats in the config](config.html#format).

## Formatting text marks and tooltips

Text marks and tooltips are formatted by setting the `format` property of [text or tooltip channel definitions](encoding.html#text).

For example, we can use Vega-Lite to show the average horsepower for cars from different origins. To format the number to have 2 digits of precisions, we can use the format `.2f`.

<span class="vl-example" data-name="text_format"></span>

Formatting tooltips or dates is done similarly.

## Formatting axis and legend labels

### Quantitative fields

Below, we override the default number formatting to use exponent notation set to two significant digits.

<span class="vl-example" data-name="bar_aggregate_format"></span>

### Temporal data

In the example below we format the axis label to only show the year.

<span class="vl-example" data-name="line"></span>

The format can also contain text.

<span class="vl-example" data-name="bar_yearmonth_custom_format"></span>
