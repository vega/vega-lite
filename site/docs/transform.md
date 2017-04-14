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
  "transform": [      // transform
    "calculate": ...,
    "filter": ...
  ],
  "mark": ... ,
  "encoding": ... ,
  ...
}
```

The top-level `transform` object is an array describing transformations.
Vega-Lite supports the following types of transfomation: [calculate](#calculate) and [filter](#filter) also.

supports the following transformation properties:

<!-- TODO population use calc to derive Male / Female -->
<!-- TODO example about filterInvalid -->

{:#calculate}
### Calculate

{% include table.html props="calculate,as" source="CalculateTransform" %}

__Example__

This example use `calculate` to derive a new field, then `filter` data based on the new field.

<span class="vl-example" data-name="bar_filter_calc"></span>

{:#filter}
### Filter

Vega-Lite filter transform the following property:

{% include table.html props="filter" source="FilterTransform" %}

A `filter` property can be (1) a filter predicate object including Equal Filter, Range Filter and OneOf Filter (2) [Vega Expression](https://github.com/vega/vega/wiki/Expressions) string or (3) an array of filter predicates (either predicate object or expression string) that must be all true for a datum to be include.


For a filter object, a `field` must be provided with one of the filter operators (`equal`, `in`, `range`).  Values of these operators can be primitive types (string, number, boolean) or a [DateTime definition object](#datetime) for describiing time. In addition, `timeUnit` can be provided to further transform a temporal `field`.

The following table describes properties of a filter object.

#### Equal Filter

{% include table.html props="field,equal,timeUnit" source="EqualFilter" %}

#### Range Filter

{% include table.html props="field,range,timeUnit" source="RangeFilter" %}

#### OneOf Filter

{% include table.html props="field,oneOf,timeUnit" source="OneOfFilter" %}

{:#datetime}
##### Date Time Definition Object

A DateTime object must have at least one of the following properties:

{% include table.html props="year,quarter,month,date,day,hours,minutes,seconds,milliseconds" source="DateTime" %}

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
