---
layout: docs
title: Band Position
permalink: /docs/bandposition.html
---

Band properties can be used to adjust mark bandwidth or position for band scales, bin intervals, or time unit intervals.

{% include table.html props="bandPosition" source="DatumDef" %}

## Examples

### Line Position

By default, points in line marks are placed at the beginning of a time interval (e.g., "month"):

<div class="vl-example" data-name="line_month"></div>

Setting `bandPosition` to `0.5` moves the points to the middle of the time interval.

<div class="vl-example" data-name="line_month_center_band"></div>

### Bar Position

By default, bar marks are placed from the beginning of a time interval (e.g., "month") to the end of the interval:

<div class="vl-example" data-name="bar_month_temporal"></div>

Setting `bandPosition` to `0` moves the bar to center-align with ticks.

<div class="vl-example" data-name="bar_month_temporal_band_center"></div>
