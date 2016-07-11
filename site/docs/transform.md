---
layout: docs
menu: docs
title: Transformation
permalink: /docs/transform.html
---

Data Transformation in Vega-Lite are described via either top-level transforms (the `transform` property) or [inline transforms inside `encoding`](encoding.html#inline) (`aggregate`, `bin`, `timeUnit`, and `sort`).

When both types of transforms are specified, the top-level transforms are executed first in this order: `filterNull`, `calculate`, and then `filter`. Then the inline transforms are executed in this order: `bin`, `timeUnit`, `aggregate`, and `sort`.

The rest of this page describes the top-level `transform` property. For more information about inline transforms, please see the following pages: [`bin`](bin.html), [`timeUnit`](timeUnit.html), [`aggregate`](aggregate.html), and [`sort`](sort.html).

## Top-level Transform Property

{: .suppress-error}
```json
{
  "data": ... ,
  "transform": {       // transform
    "filterNull": ...,
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
| filterNull    | Boolean       | Whether to filter null values from the data. By default (`undefined`), only quantitative and temporal fields are filtered. If set to `true`, all data items with null values are filtered. If `false`, all data items are included. |
| calculate     | Formula[]      | An array of formula objects for deriving new fields. Each formula object has two properties: <br/>     • `field` _(String)_ – The field name in which to store the computed value. <br/>    • `expr` _(String)_  – A string containing an expression for the formula. Use the variable `datum` to refer to the current data object.|
| [filter](#filter) | String | FilterObject | (String|FilterObject)[]  | A filter object or a [Vega Expression](https://github.com/vega/vega/wiki/Expressions) string for filtering data items (or rows) or an array of either filter objects or expression strings. |

These transforms are executed in this order: `filterNull`, `calculate`, and then `filter`.
Since `calculate` is before `filter`, derived fields can be used in `filter`'s expression.

__Example__

This example use `calculate` to derive a new field, then `filter` data based on the new field.

<span class="vl-example" data-name="bar_filter_calc"></span>


<!-- TODO population use calc to derive Male / Female -->
<!-- TODO example about filterNull -->

### Filter

Vega-Lite's `transform.filter` property can be (1) a filter object, (2) [Vega Expression](https://github.com/vega/vega/wiki/Expressions) string or (3) an array with filter objects and/or Vega Expresssion strings as members.

#### Filter Object

For a filter object, a `field` must be provided with one of the filter operators (`equal`, `in`, or `range`).  The following table describes each of these properties.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | Field to be filtered. |
| equal         | String &#124; Number &#124; Boolean | Value that the `field`'s value should be equal to. |
| range         | Number[]      | Array of length describing (inclusive) minimum and maximum values for the `field`'s value to be included in the filtered data. |
| in         | Array         | A set of values that the `field`'s value should be a member of, for a data item included in the filtered data. |


**Examples**

- `{"field": "car_color", "equal": "red"}` checks if the `car_color` field's value is equal to `"red"`.
- `{"field": "car_color", "in":["red", "yellow"]}` checks if the `car_color` field's value is `"red"` or `"yellow"`.
-  `{"field": "x", "range": [0, 5]}` checks if the `x` field's value is in range `[0,5]` (0 ≤ x ≤ 5).

#### Filter Expresssion

For a [Vega Expression](https://github.com/vega/vega/wiki/Expressions) string, each datum object can be referred using bound variable `datum`. For example, setting `filter` to `"datum.b2 > 60"` would make the output data includes only items that have values in the field `b2` over 60.

#### Filter Array

For a filter array, the array's members should be either filter objects or filter expresssions.  All of member predicates should be satisfied for a data item to be included
in the filtered data.
