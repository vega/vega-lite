---
layout: docs
title: Time Unit
permalink: /docs/timeunit.html
---

Time unit is used to discretize times in Vega-Lite. It can be used (1) with the `timeUnit` property of [encoding field definitions](#encoding), (2) as [a standalone transform](#transform), or (3) with the `timeUnit` property of a [field predicate](predicate.html#field-predicate).

Vega-Lite supports the following time units:

- `"year"` - [Gregorian](https://en.wikipedia.org/wiki/Gregorian_calendar) calendar years.
- `"quarter"` - Three-month intervals, starting in one of January, April, July, and October.
- `"month"` - Calendar months (January, February, _etc._).
- `"date"` - Calendar day of the month (January 1, January 2, _etc._).
- `"week"` - Sunday-based weeks. Days before the first Sunday of the year are considered to be in week 0, the first Sunday of the year is the start of week 1, the second Sunday week 2, _etc._.
- `"day"` - Day of the week (Sunday, Monday, _etc._).
- `"dayofyear"` - Day of the year (1, 2, ..., 365, _etc._).
- `"hours"` - Hours of the day (12:00am, 1:00am, _etc._).
- `"minutes"` - Minutes in an hour (12:00, 12:01, _etc._).
- `"seconds"` - Seconds in a minute (12:00:00, 12:00:01, _etc._).
- `"milliseconds"` - Milliseconds in a second.

Vega-Lite time units can also be a string of consecutive time units to indicate desired intervals of time. For example, `yearmonthdate` indicates chronological time sensitive to year, month, and date (but not to hours, minutes, or seconds). The specifier `monthdate` is sensitive to month and date, but not year, which can be useful for binning time values to look at seasonal patterns only.

By default, all time units represent date time using local time. To use UTC time, you can add the `utc` prefix (e.g., `"utcyear"`, `"utcyearmonth"`).

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#encoding}

## Time Unit in Encoding Field Definition

```js
// A Single View or a Layer Specification
{
  ...,
  "mark/layer": ...,
  "encoding": {
    "x": {
      "timeUnit": ...,               // time unit
      "field": ...,
      "type": "temporal",
      ...
    },
    "y": ...,
    ...
  },
  ...
}
```

A field definition can include a `timeUnit` property. For example, the chart below shows temperature in Seattle aggregated by month.

<span class="vl-example" data-name="line_month"></span>

Using `timeUnit` with rect-based marks (including `bar`, `rect`, and `image`) will treat time units as intervals.

<span class="vl-example" data-name="bar_month_temporal"></span>

### Time Unit's Band

By default, Vega-Lite encodes fields with timeUnit using the initial position of a time unit (which is equivalent to having `band` = 0). However, one can set the `band` property to be `0.5` to use place each data point in the middle of each time unit band.

<span class="vl-example" data-name="line_month_center_band"></span>

### Time Unit with Ordinal Fields

{:#ordinal}

By default, fields with time units have "temporal" type and thus use time scales. However, time units can be also used with a discrete scale. For example, you can cast the field to have an `"ordinal"` type.

<span class="vl-example" data-name="bar_month"></span>

{: #transform}

## Time Unit Transform

```js
// Any View Specification
{
  ...,
  "transform": [
    {"timeUnit": ..., "field": ..., "as": ...} // TimeUnit Transform
     ...
  ],
  ...
}
```

A `timeUnit` transform in the `transform` array has the following properties:

{% include table.html props="timeUnit,field,as" source="TimeUnitTransform" %}

In the example below, we use the time unit transform to extract the month component of the dates. We can then visualize the hottest temperature. Note that Vega-Lite will not automatically format the axis if the `timeUnit` is applied outside `encoding` so we have to format it manually. For this reason, you should prefer time units as part of encoding definitions.

<span class="vl-example" data-name="line_timeunit_transform"></span>

{:#utc}

## UTC time

### Input

To parse data in local time or UTC time, there are three cases:

1. Times are parsed as UTC time if the date strings are in [ISO format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse). Note that in JavaScript date strings without time are interpreted as UTC but date strings with time and without timezone as local.

<span class="vl-example" data-name="time_parse_utc"></span>

2. If that is not the case, by default, times are assumed to be local.

<span class="vl-example" data-name="time_parse_local"></span>

3. To parse inline data or url data without ISO format as UTC time, we need to specify the `format` to be `utc` with time format:

<span class="vl-example" data-name="time_parse_utc_format"></span>

### Output

By default, Vega-Lite will output data in local time (even when input is parsed as UTC time). To output data in UTC time, we can specify either a UTC time unit or scale:

1. UTC time unit when input data is in local time.

<span class="vl-example" data-name="time_output_utc_timeunit"></span>

2. UTC scale type when you have input data in UTC time.

<span class="vl-example" data-name="time_output_utc_scale"></span>

{:#params}

## Time Unit Parameters

To customize time unit properties, you can set `timeUnit` to be a time unit definition object. It can have the following properties.

{% include table.html props="unit,maxbins,step,utc" source="TimeUnitParams" %}

### Example: Customizing Step

The `step` parameter can be used to specify a bin size with respect to the smallest denominator in the time unit provided. The following example shows sum of distance traveled for each 5-minute interval.

<span class="vl-example" data-name="time_custom_step"></span>
