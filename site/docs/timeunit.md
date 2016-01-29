---
layout: docs
title: Time Unit Conversion
permalink: /docs/timeunit.html
---

New time unit fields can be derived from existing temporal fields using each field definition's `timeUnit` property.  

Currently supported values are: `'year'`, `'month'`, `'day'`, `'date'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'yearmonth'`, `'yearmonthday'`, `'yearmonthdate'`, `'yearday'`, `'yeardate'`, `'yearmonthdayhours'`, `'yearmonthdayhoursminutes'`, `'hoursminutes'`,
`'hoursminutesseconds'`, `'minutesseconds'`, `'secondsmilliseconds'`.


----
#### Example

This example shows temperature in Seattle over the months.

```js
{
  "data": {"url": "data/seattle-temps.csv","formatType": "csv"},
  "mark": "line",
  "encoding": {
    "x": {
      "timeUnit": "month", "field": "date", "type": "temporal",
      "axis": {"shortTimeLabels": true}
    },
    "y": {"aggregate": "mean", "field": "temp", "type": "quantitative"}
  }
}
```
<script>
vg.embed('#temp_histogram', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/seattle-temps.csv","formatType": "csv"},
    "mark": "line",
    "encoding": {
      "x": {
        "field": "date",
        "type": "temporal",
        "timeUnit": "month",
        "axis": {"shortTimeLabels": true}
      },
      "y": {
        "aggregate": "mean",
        "field": "temp",
        "type": "quantitative"
      }
    }
  }
});
</script>
<div id="temp_histogram"></div>
