---
layout: docs
title: Time Unit Conversion
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


New time unit fields can be derived from existing temporal fields using each field definition's `timeUnit` property.  

Currently supported values are: `'year'`, `'month'`, `'day'`, `'date'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'yearmonth'`, `'yearmonthday'`, `'yearmonthdate'`, `'yearday'`, `'yeardate'`, `'yearmonthdayhours'`, `'yearmonthdayhoursminutes'`, `'hoursminutes'`,
`'hoursminutesseconds'`, `'minutesseconds'`, `'secondsmilliseconds'`.

<!-- TODO: explain more distinction between `'month'`, `'day'`, `'date'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'` and yearmonth, .. -->

----
#### Example

This example shows temperature in Seattle over the months.

<span class="vl-example" data-name="line_month"></span>
