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

- Non-periodic Time Unit: `'year'`, `'yearmonth'`, `'yearmonthday'`, `'yearmonthdate'`, `'yearday'`, `'yeardate'`, `'yearmonthdayhours'`, `'yearmonthdayhoursminutes'`.
  - For example the `yearmonth` of `April 4, 2016 11:52:34` is `April 2016`.
  
- Periodic Time Unit: `'month'`, `'day'`, `'date'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`,  `'hoursminutes'`, `'hoursminutesseconds'`, `'minutesseconds'`, `'secondsmilliseconds'`.


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

#### Example

This example shows temperature in Seattle over the months.

<span class="vl-example" data-name="line_month"></span>
