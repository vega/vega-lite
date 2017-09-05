---
layout: docs
title: Time Unit
permalink: /docs/timeunit.html
---

Table of Contents
- [Transform](#transform)
- [Encoding](#encoding)

{: #transform}
### Transform

{: .suppress-error}
```json
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

**TODO example**

{: #encoding}
### Encoding

{: .suppress-error}
```json
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

**TODO example**

## Date/Time Units

Vega-Lite supports the following time units:

- `"year"`, `"yearquarter"`, `"yearquartermonth"`, `"yearmonth"`, `"yearmonthdate"`, `"yearmonthdatehours"`, `"yearmonthdatehoursminutes"`, , `"yearmonthdatehoursseconds"`.
- `"quarter"`, `"quartermonth"`
- `"month"`, `"monthdate"`
- `"date"` (Day of month, i.e., 1 - 31)
- `"day"` (Day of week, i.e., Monday - Friday)
- `"hours"`, `"hoursminutes"`, `"hoursminutesseconds"`
- `"minutes"`, `"minutesseconds"`
- `"seconds"`, `"secondsmilliseconds"`
- `"milliseconds"`

By default, all time units represent date time using local time.  To use UTC time, you can add the `utc` prefix (e.g., `utcyearmonth`).

#### Example

This example shows temperature in Seattle aggregated by month.

<span class="vl-example" data-name="line_month"></span>

{:#utc}
## UTC time

### Input

To parse data in local time or UTC time, there are three cases:

1) Times are parsed as UTC time if the date strings are in [ISO format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).

<span class="vl-example" data-name="parse_utc_time"></span>

2) If that is not the case, by default, times are assumed to be local.

<span class="vl-example" data-name="parse_local_time"></span>

3) To parse inline data or url data without ISO format as UTC time, we need to specify the `format` to be `utc`

<span class="vl-example" data-name="parse_utc_time_format"></span>

### Output

By default, Vega-Lite will output data in local time (even when input is parsed as UTC time). To output data in UTC time, we need to specify either a UTC time unit or scale:

1) UTC time unit when input data is in local time.

<span class="vl-example" data-name="output_utc_timeunit"></span>

2) UTC scale type when you have input data in UTC time.

<span class="vl-example" data-name="output_utc_scale"></span>

Do **not** use UTC time unit and the UTC scale type at the same time since that will cause Vega-Lite to shift the output time twice.
