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

`timeUnit` property of a channel definition sets the level of specificity for a temporal field.  Currently supported values are:

- Non-periodic Time Unit: `'year'`, `'yearmonth'`, `'yearmonthday'`, `'yearmonthdate'`, `'yearday'`, `'yeardate'`, `'yearmonthdayhours'`, `'yearmonthdayhoursminutes'`.  

- Periodic Time Unit: `'month'`, `'day'`, `'date'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`,  `'hoursminutes'`, `'hoursminutesseconds'`, `'minutesseconds'`, `'secondsmilliseconds'`.

<!-- TODO: given a example datetime, show examples show each different time unit property transforms the original time -->

#### Example

This example shows temperature in Seattle over the months.

<span class="vl-example" data-name="line_month"></span>
