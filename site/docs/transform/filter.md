---
layout: docs
menu: docs
title: Filter Transform
permalink: /docs/filter.html
---

{: .suppress-error}
```json
{
  ...
  "transform": [
    {"filter": ...} // Calculate Transform
     ...
  ],
  ...
}
```

Vega-Lite filter transforms can have the following properties:

{% include table.html props="filter" source="FilterTransform" %}

The `filter` property can be (1) a filter predicate object including equal filters, range filters and one-of filters (2) [Vega Expression](https://vega.github.io/vega/docs/expressions/) string or (3) an array of filter predicates (either predicate object or expression string) that must be all true for a datum to be include.


In filter objects, a `field` must be provided with one of the filter operators (`equal`, `in`, `range`).  Values of these operators can be primitive types (string, number, boolean) or a [DateTime definition object](types.html#datetime) to describe time. In addition, `timeUnit` can be provided to further transform a temporal `field`.

{:#filter}
## Filter Expression

For a [Vega Expression](https://vega.github.io/vega/docs/expressions/) string, each datum object can be referred using bound variable `datum`. For example, setting `filter` to `"datum.b2 > 60"` would make the output data includes only items that have values in the field `b2` over 60.

{:#equalfilter}
### Equal Filter

{% include table.html props="field,equal,timeUnit" source="EqualFilter" %}

For example, to check if the `car_color` field's value is equal to `"red"`, we can use the following filter:

{: .suppress-error}
```json
{"filter": {"field": "car_color", "equal": "red"}}
```

{:#rangefilter}
### Range Filter

{% include table.html props="field,range,timeUnit" source="RangeFilter" %}

**Examples**

- `{"field": "x", "range": [0, 5]}` checks if the `x` field's value is in range [0,5] (0 ≤ x ≤ 5).
- `{"field": "x", "range": [null, 5]}` checks if the `x` field's value is in range [-Infinity,5] (x ≤ 5).
- `{"timeUnit": "year", "field": "date", "range": [2006, 2008] }` checks if the `date`'s value is between year 2006 and 2008.
- `{"field": "date", "range": [{"year": 2006, "month": "jan", "date": 1}, {"year": 2008, "month": "feb", "date": 20}] }` checks if the `date`'s value is between Jan 1, 2006  and Feb 20, 2008.


{:#oneoffilter}
### One-Of Filter

{% include table.html props="field,oneOf,timeUnit" source="OneOfFilter" %}

For example, `{"field": "car_color", "oneOf":["red", "yellow"]}` checks if the `car_color` field's value is `"red"` or `"yellow"`.
