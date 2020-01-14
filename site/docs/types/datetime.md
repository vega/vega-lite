---
layout: docs
menu: docs
title: Date Time
permalink: /docs/datetime.html
---

A date time definition object (as used in [filter transform](filter.html), [scale domain](scale.html#domain), and [axis](axis.html#ticks)/[legend](legend.html#properties) values) provides a convenient way to specify a date time value (without having to specify a timestamp integer).

A date time definition object must have at least one of the following properties:

{% include table.html props="year,quarter,month,date,day,hours,minutes,seconds,milliseconds" source="DateTime" %}

For example `{"year": 2006, "month": "jan", "date": 1}` represents _Jan 1, 2006_.
