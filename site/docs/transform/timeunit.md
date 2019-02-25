---
layout: docs
title: Time Unit
permalink: /docs/timeunit.html
---

Time unit is used to discretize times in Vega-Lite. It can either be used [inside encoding field definitions](#encoding) or as [a transform](#transform).

Vega-Lite supports the following time units:

- `"year"`, `"yearquarter"`, `"yearquartermonth"`, `"yearmonth"`, `"yearmonthdate"`, `"yearmonthdatehours"`, `"yearmonthdatehoursminutes"`, `"yearmonthdatehoursminutesseconds"`.
- `"quarter"`, `"quartermonth"`
- `"month"`, `"monthdate"`
- `"date"` (Day of month, i.e., 1 - 31)
- `"day"` (Day of week, i.e., Monday - Friday)
- `"hours"`, `"hoursminutes"`, `"hoursminutesseconds"`
- `"minutes"`, `"minutesseconds"`
- `"seconds"`, `"secondsmilliseconds"`
- `"milliseconds"`

By default, all time units represent date time using local time. To use UTC time, you can add the `utc` prefix (e.g., `utcyearmonth`).

## Documentation Overview

{:.no_toc}

<!-- prettier-ignore -->
- TOC
{:toc}

{: #encoding}

## Time Unit in Encoding Field Definition

```js
{
  "data": ... ,
  "mark": ... ,
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

A field definition can include a `timeUnit` property. For example, the chart below shows shows temperature in Seattle aggregated by month.

<span class="vl-example" data-name="line_month"></span>

Note that temporal fields use continuous scales by default for all mark types including `"bar"`.

<span class="vl-example" data-name="bar_month_temporal"></span>

{:#ordinal}

If you want to use a discrete scale instead, you can cast the field to have an `"ordinal"` type. This casting strategy can be useful for time units with low cardinality such as `"month"`.

<span class="vl-example" data-name="bar_month"></span>

{: #transform}

## Time Unit Transform

```js
{
  ...
  "transform": [
    {"timeUnit": ..., "field": ..., "as" ...} // TimeUnit Transform
     ...
  ],
  ...
}
```

A `timeUnit` transform in the `transform` array has the following properties:

{% include table.html props="timeUnit,field,as" source="TimeUnitTransform" %}

In the example below, we use the time unit transform to extract the month component of the dates. We can then visualize the hottest temperature. Note that Vega-Lite will automatically format the axis if the `timeUnit` is applied outside `encoding` so we have to format it manually. For this reason, you should prefer time units as part of encoding definitions.

<span class="vl-example" data-name="line_timeunit_transform"></span>

{:#utc}

## UTC time

### Input

To parse data in local time or UTC time, there are three cases:

1. Times are parsed as UTC time if the date strings are in [ISO format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse). Note that in JavaScript date strings without time are interpreted as UTC but but date strings with time and without timezone as local.

<span class="vl-example" data-name="time_parse_utc"></span>

2. If that is not the case, by default, times are assumed to be local.

<span class="vl-example" data-name="time_parse_local"></span>

3. To parse inline data or url data without ISO format as UTC time, we need to specify the `format` to be `utc`

<span class="vl-example" data-name="time_parse_utc_format"></span>

### Output

By default, Vega-Lite will output data in local time (even when input is parsed as UTC time). To output data in UTC time, we need to specify either a UTC time unit or scale:

1. UTC time unit when input data is in local time.

<span class="vl-example" data-name="time_output_utc_timeunit"></span>

2. UTC scale type when you have input data in UTC time.

<span class="vl-example" data-name="time_output_utc_scale"></span>

Do **not** use UTC time unit and the UTC scale type at the same time since that will cause Vega-Lite to shift the output time twice.
