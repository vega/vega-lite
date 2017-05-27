---
layout: docs
title: Time Unit
permalink: /docs/timeunit.html
---

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

The `timeUnit` property of a channel definition sets the level of specificity for a temporal field. Currently supported values are:

- Non-periodic Time Unit: `'year'`, `'yearmonth'`, `'yearmonthday'`, `'yearmonthdate'`, `'yearday'`, `'yeardate'`, `'yearmonthdayhours'`, `'yearmonthdayhoursminutes'`, `'utcyear'`, `'utcyearmonth'`, `'utcyearmonthday'`, `'utcyearmonthdate'`, `'utcyearday'`, `'utcyeardate'`, `'utcyearmonthdayhours'`, `'utcyearmonthdayhoursminutes'`.
  - For example the `yearmonth` of `April 4, 2016 11:52:34` is `April 2016`.

- Periodic Time Unit: `'month'`, `'day'`, `'date'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`,  `'hoursminutes'`, `'hoursminutesseconds'`, `'minutesseconds'`, `'secondsmilliseconds'`, `'utcmonth'`, `'utcday'`, `'utcdate'`, `'utchours'`, `'utcminutes'`, `'utcseconds'`, `'utcmilliseconds'`,  `'utchoursminutes'`, `'utchoursminutesseconds'`, `'utcminutesseconds'`, `'utcsecondsmilliseconds'`.


## Date/Time Units

Vega-Lite supports the following time units, which can be combined into the `timeUnit` properties above (e.g. `yearmonthday`, `hoursminutes`).

| Function      | Description    |  Example value for `Monday April 4, 2016 11:52:34:0201`  |
| :------------ | :------------- | :-----------------------------------------------|
| `date`        | returns the day of the month for a given date input, in local time. | `4` |
| `day`         | returns the day of the week for a given date input, in local time.  (`0` for Sunday, `1` for Monday, `2` for Tuesday, and so on.)   | `1` |
| `year`        | returns the year for a given date input, in local time. | `2016` |
| `month`       | returns the (zero-based) month for a given date input, in local time (e.g., `0` for January).   | `3` |
| `hours`       | returns the hours component for a given date input, in local time (number between `0` and `23`). | `11` |
| `minutes`     | returns the minutes component for a given date input, in local time (number between `0` and `59`). | `52` |
| `seconds`     | returns the seconds component for a given date input, in local time (number between `0` and `59`). | `34` |
| `milliseconds`| returns the milliseconds component for a given date input, in local time  (number between `0` and `999`). | `201` |
| `utcdate`        | returns the day of the month for a given date input, in utc time. | `4` |
| `utcday`         | returns the day of the week for a given date input, in utc time.  (`0` for Sunday, `1` for Monday, `2` for Tuesday, and so on.)   | `1` |
| `utcyear`        | returns the year for a given date input, in utc time. | `2016` |
| `utcmonth`       | returns the (zero-based) month for a given date input, in utc time (e.g., `0` for January).   | `3` |
| `utchours`       | returns the hours component for a given date input, in utc time (number between `0` and `23`). | `11` |
| `utcminutes`     | returns the minutes component for a given date input, in utc time (number between `0` and `59`). | `52` |
| `utcseconds`     | returns the seconds component for a given date input, in utc time (number between `0` and `59`). | `34` |
| `utcmilliseconds`| returns the milliseconds component for a given date input, in utc time  (number between `0` and `999`). | `201` |


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

Do **not** use UTC time unit and the UTC scale type at the same time since that will cause Vega to shift the output twice.
