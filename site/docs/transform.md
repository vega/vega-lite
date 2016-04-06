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
| filter        | String | [Vega Expression](https://github.com/vega/vega/wiki/Expressions) for filtering data items (or rows). Each datum object can be referred using bound variable `datum`. For example, setting `filter` to `"datum.b2 > 60"` would make the output data includes only items that have values in the field `b2` over 60. |

These transforms are executed in this order: `filterNull`, `calculate`, and then `filter`.
Since `calculate` is before `filter`, derived fields can be used in `filter`'s expression.

__Example__

This example use `calculate` to derive a new field, then `filter` data based on the new field.

<span class="vl-example" data-name="bar_filter_calc"></span>


<!-- TODO population use calc to derive Male / Female -->
<!-- TODO example about filterNull -->
