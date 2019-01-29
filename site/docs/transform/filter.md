---
layout: docs
menu: docs
title: Filter Transform
permalink: /docs/filter.html
---

The filter transform removes objects from a data stream based on a provided filter expression or filter object.

```json
{
  ...
  "transform": [
    {"filter": ...} // Filter Transform
     ...
  ],
  ...
}
```

Vega-Lite filter transforms must have the `filter` property describing the predicate for the filtering condition.

{% include table.html props="filter" source="FilterTransform" %}

{:#expression}

## Filter Expression

For an [expression](types.html#expression) string, each datum object can be referred using bound variable `datum`. For example, setting `filter` to `"datum.b2 > 60"` would make the output data includes only items that have values in the field `b2` over 60.

## Field Predicate

For a field predicate, a `field` must be provided along with one of the predicate properties: [`equal`](#equal-predicate), [`lt`](#lt-predicate) (less than), [`lte`](#lte-predicate) (less than or equal), [`gt`](#gt-predicate) (greater than), [`gte`](#gte-predicate)(greater than or equal), [`range`](#range-predicate), or [`oneOf`](#one-of-predicate). Values of these operators can be primitive types (string, number, boolean) or a [DateTime definition object](types.html#datetime) to describe time. In addition, `timeUnit` can be provided to further transform a temporal `field`.

{:#equal-predicate}

### Field Equal Predicate

{% include table.html props="equal" source="FieldEqualPredicate" %}

For example, to check if the `car_color` field's value is equal to `"red"`, we can use the following filter:

```json
{"filter": {"field": "car_color", "equal": "red"}}
```

{:#lt-predicate}

### Field Less Than Predicate

{% include table.html props="lt" source="FieldLTPredicate" %}

For example, to check if the `height` field's value is less than `180`, we can use the following filter:

```json
{"filter": {"field": "height", "lt": 180}}
```

{:#lte-predicate}

### Field Less Than or Equals Predicate

{% include table.html props="lte" source="FieldLTEPredicate" %}

For example, to check if the `Year` field's value is less than or equals to `"2000"`, we can use the following filter:

```json
{"filter": {"timeUnit": "year", "field": "Year", "lte": "2000"}}
```

{:#gt-predicate}

### Field Greater Than Predicate

{% include table.html props="gt" source="FieldGTPredicate" %}

To check if the `state` field's value is greater than `"Arizona"` by string comparison, we can use the following filter: (Note: Standard Javascript string comparison is done, ie., "A" < "B", but "B" < "a")

```json
{"filter": {"field": "state", "gt": "Arizona"}}
```

{:#gte-predicate}

### Field Greater Than or Equals Predicate

{% include table.html props="gte" source="FieldGTEPredicate" %}

For example, to check if the `height` field's value is greater than or equals to `0`, we can use the following filter:

```json
{"filter": {"field": "height", "gte": 0}}
```

{:#range-predicate}

### Field Range Predicate

{% include table.html props="range" source="FieldRangePredicate" %}

**Examples**

- `{"filter": {"field": "x", "range": [0, 5]}}` checks if the `x` field's value is in range [0,5] (0 ≤ x ≤ 5).
- `{"filter": {"timeUnit": "year", "field": "date", "range": [2006, 2008] }}` checks if the `date`'s value is between year 2006 and 2008.
- `{"filter": {"field": "date", "range": [{"year": 2006, "month": "jan", "date": 1}, {"year": 2008, "month": "feb", "date": 20}] }}` checks if the `date`'s value is between Jan 1, 2006 and Feb 20, 2008.

{:#one-of-predicate}

### Field One-Of Predicate

{% include table.html props="oneOf" source="FieldOneOfPredicate" %}

For example, `{"filter": {"field": "car_color", "oneOf": ["red", "yellow"]}}` checks if the `car_color` field's value is `"red"` or `"yellow"`.

{:#valid-predicate}

### Field Valid Predicate

{% include table.html props="valid" source="FieldValidPredicate" %}

For example, `{"filter": {"field": "car_color", "valid": true}}` checks if the `car_color` field's value is valid meaning it is both not `null` and not [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN).

{:#selection-predicate}

## Selection Predicate

For a selection predicate, a `selection` name must be provided.

{% include table.html props="selection" source="SelectionPredicate" %}

For example, with `{"filter": {"selection": "brush"}}`, only data values that fall within the selection named `brush` will remain in the dataset as shown below.

<div class="vl-example" data-name="selection_filter"></div>

All [selection composition](selection.html#compose) can be used here as well. For instance, `{"filter": {"selection": {"and": ["alex", "morgan"]}}}` filters for data values that are within both the `alex` and `morgan` selections.
