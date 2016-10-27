---
layout: docs
menu: docs
title: Transformation
permalink: /docs/transform.html
---

Data Transformation in Vega-Lite are described via either top-level transforms (the `transform` property) or [inline transforms inside `encoding`](encoding.html#inline) (`aggregate`, `bin`, `timeUnit`, and `sort`).

When both types of transforms are specified, the top-level transforms are executed first in this order: `filterInvalid`, `calculate`, and then `filter`. Then the inline transforms are executed in this order: `bin`, `timeUnit`, `aggregate`, and `sort`.

The rest of this page describes the top-level `transform` property. For more information about inline transforms, please see the following pages: [`bin`](bin.html), [`timeUnit`](timeUnit.html), [`aggregate`](aggregate.html), and [`sort`](sort.html).

## Top-level Transform Property

{: .suppress-error}
```json
{
  "data": ... ,
  "transform": {       // transform
    "filterInvalid": ...,
    "calculate": ...,
    "filter": ...
  },
  "mark": ... ,
  "encoding": ... ,
  ...
}
```

The top-level `transform` object supports the following transformation properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| filterInvalid    | Boolean       | Whether to filter invalid values (`null` and `NaN`) from the data. <br/>     •By default (`undefined`), only quantitative and temporal fields are filtered. <br/>     •If set to `true`, all data items with null values are filtered. <br/>     •If `false`, all data items are included.  In this case, null values will be interpret as zeroes. |
| calculate     | Formula[]      | An array of formula objects for deriving new fields. Each formula object has two properties: <br/>     • `field` _(String)_ – The field name in which to store the computed value. <br/>    • `expr` _(String)_  – A string containing an expression for the formula. Use the variable `datum` to refer to the current data object.|
| [filter](#filter) | String &#124; FilterObject &#124; String[] &#124; FilterObject[]  | A filter object or a [Vega Expression](https://github.com/vega/vega/wiki/Expressions) string for filtering data items (or rows) or an array of either filter objects or expression strings. |

These transforms are executed in this order: `filterInvalid`, `calculate`, and then `filter`.
Since `calculate` is before `filter`, derived fields can be used in `filter`'s expression.

__Example__

This example use `calculate` to derive a new field, then `filter` data based on the new field.

<span class="vl-example" data-name="bar_filter_calc"></span>


<!-- TODO population use calc to derive Male / Female -->
<!-- TODO example about filterInvalid -->

### Filter

Vega-Lite's `transform.filter` property can be (1) a filter predicate object, (2) [Vega Expression](https://github.com/vega/vega/wiki/Expressions) string or (3) an array of filter predicates (either predicate object or expression string) that must be all true for a datum to be include.

#### Filter Object

For a filter object, a `field` must be provided with one of the filter operators (`equal`, `in`, `range`).  Values of these operators can be primitive types (string, number, boolean) or a [DateTime definition object](#datetime) for describiing time. In addition, `timeUnit` can be provided to further transform a temporal `field`.

The following table describes properties of a filter object.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | Field to be filtered. |
| equal         | String &#124; Number &#124; [DateTime](#datetime) &#124; Boolean | Value that the `field`'s value should be equal to. |
| range         | Number[] &#124; [DateTime](#datetime)[] | Array of length 2 describing (inclusive) minimum and maximum values for the `field`'s value to be included in the filtered data.  If the minimum / maximum is `null`, then the ranged has unbounded minimum / maximum.  |
| oneOf         | String[] &#124; Number[] &#124; [DateTime](#datetime)[] | A set of values that the `field`'s value should be a member of, for a data item included in the filtered data. |

{:#datetime}
##### Date Time Definition Object

A DateTime object must have at least one of the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| year          | Number        | Integer value representing the year. |
| quarter       | Number        | Integer value representing the quarter of the year (from 1-4). |
| month         | Number &#124; string | One of: (1) integer value representing the month from `1`-`12`. `1` represents January;  (2) case-insensitive month name (e.g., `"January"`);  (3) case-insensitive, 3-character short month name (e.g., `"Jan"`). |
| date          | Number        | Integer value representing the date from 1-31. |
| day           | Number &#124; string | Value representing the day of week.  This can be one of: (1) integer value -- `1` represents Monday; (2) (2) case-insensitive day name (e.g., `"Monday"`);  (3) case-insensitive, 3-character short day name (e.g., `"Mon"`).   <br/> **Warning:** A DateTime definition object with `day`** should not be combined with `year`, `quarter`, `month`, or `date`. |
| hours         | Number        | Integer value representing the hour of day from 0-23. |
| minutes       | Number        | Integer value representing minute segment of a time from 0-59. |
| seconds       | Number        | Integer value representing  second segment of a time from 0-59. |
| milliseconds  | Number        | Integer value representing  millsecond segment of a time. |

**Examples**

- `{"field": "car_color", "equal": "red"}` checks if the `car_color` field's value is equal to `"red"`.
- `{"field": "car_color", "in":["red", "yellow"]}` checks if the `car_color` field's value is `"red"` or `"yellow"`.
- `{"field": "x", "range": [0, 5]}` checks if the `x` field's value is in range [0,5] (0 ≤ x ≤ 5).
- `{"field": "x", "range": [null, 5]}` checks if the `x` field's value is in range [-Infinity,5] (x ≤ 5).
- `{"timeUnit": "year", "field": "date", "range": [2006, 2008] }` checks if the `date`'s value is between year 2006 and 2008.
- `{"field": "date", "range": [{"year": 2006, "month": "jan", "date": 1}, {"year": 2008, "month": "feb", "date": 20}] }` checks if the `date`'s value is between Jan 1, 2006  and Feb 20, 2008.

#### Filter Expresssion

For a [Vega Expression](https://github.com/vega/vega/wiki/Expressions) string, each datum object can be referred using bound variable `datum`. For example, setting `filter` to `"datum.b2 > 60"` would make the output data includes only items that have values in the field `b2` over 60.

#### Filter Array

For a filter array, the array's members should be either filter objects or filter expresssions.  All of member predicates should be satisfied for a data item to be included in the filtered data.  In other words, the `filter` array will form a conjunctive predicate that join all predicates with "and" operators.
