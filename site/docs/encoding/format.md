---
layout: docs
title: Format
permalink: /docs/format.html
---

In Vega-Lite specifications you can customize the format of [text marks](text.html), [tooltips](tooltip.html#using-tooltip-channel) and axis and legend labels.

Vega-Lite uses D3's [number format pattern](https://github.com/d3/d3-format#locale_format) for quantitative fields and D3's [time format pattern](https://github.com/d3/d3-time-format#locale_format) for time field. You can override the [default formats in the config](config.html#format).

## Quantitative fields

Below, we override the default number formatting to use exponent notation set to two significant digits.

<span class="vl-example" data-name="bar_aggregate_format"></span>


## Temporal data

In the example below we format the axis label to only show the year.

<span class="vl-example" data-name="line"></span>
