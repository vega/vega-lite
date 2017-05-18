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

`timeUnit` property of a channel definition sets the level of specificity for a temporal field. Currently supported values are:

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

This example shows temperature in Seattle over the months.

<span class="vl-example" data-name="line_month"></span>

{:#utc}
## UTC time

### Input
To parse data in local time or UTC time, there are three cases:

1) By default, user will parse data in local time if the input data is inline data or url data is **not** in [ISO format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
<span class="vl-example" data-name="parse_local_time"></span>

2) By default, user will parse data in UTC time if the input url data is in [ISO format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
<span class="vl-example" data-name="parse_utc_time"></span>

3) If the input data is inline data or url data without ISO format, to parse data in UTC time, we need to have custom `format` with `UTC`
<span class="vl-example" data-name="parse_utc_time_format"></span>

### Output
By default, vega-lite will output data in local time (even when input is parsed in UTC time). To output data in UTC time, we need to let user specify either one of:

1) UTC timeunit when you have input data in local time,
<span class="vl-example" data-name="output_utc_timeunit"></span>

2) or, UTC scale type when you have input data in UTC time
<span class="vl-example" data-name="output_utc_scale"></span>

to have the correct UTC output in UTC time. But not **both** of UTC timeunit and UTC scale type since that will cause a trouble by shifting the output twice in vega.
