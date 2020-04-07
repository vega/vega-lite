---
layout: docs
title: Band
permalink: /docs/band.html
---

Band properties can be used to adjust mark bandwidth or position for band scales, bin intervals, or time unit intervals.

{% include table.html props="band" source="DatumDef" %}

## Examples

### Line Position

By default, points in line marks are placed at the beginning of a time interval (e.g., "month"):

<div class="vl-example" data-name="line_month"></div>

Setting `band` to `0.5` moves the points to the middle of the time interval.

<div class="vl-example" data-name="line_month_center_band"></div>
