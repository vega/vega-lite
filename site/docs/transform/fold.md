---
layout: docs
menu: docs
title: Fold
permalink: /docs/fold.html
---

The fold transform collapses (or "folds") one or more data fields into two properties: a _key_ property (containing the original data field name) and a _value_ property (containing the data value).

The fold transform is useful for mapping matrix or cross-tabulation data into a standardized format.

This transform generates a new data stream in which each data object consists of the _key_ and _value_ properties as well as all the original fields of the corresponding input data object.

_Note:_ The `fold` transform only applies to a list of known fields (set using the `fields` parameter). If your data objects instead contain array-typed fields, you may wish to use the [flatten](flatten.html) transform instead.

```js
// Any View Specification
{
  ...
  "transform": [
    {"fold": ...} // Fold Transform
     ...
  ],
  ...
}
```

## Fold Transform Definition

{% include table.html props="fold,as" source="FoldTransform" %}

## Usage

```json
{"fold": ["gold", "silver"]}
```

This example folds the `"gold"` and `"silver"` properties. Given the input data

```json
[
  {"country": "USA", "gold": 10, "silver": 20},
  {"country": "Canada", "gold": 7, "silver": 26}
]
```

this example produces the output:

```json
[
  {"key": "gold", "value": 10, "country": "USA", "gold": 10, "silver": 20},
  {"key": "silver", "value": 20, "country": "USA", "gold": 10, "silver": 20},
  {"key": "gold", "value": 7, "country": "Canada", "gold": 7, "silver": 26},
  {"key": "silver", "value": 26, "country": "Canada", "gold": 7, "silver": 26}
]
```

## Example

<div class="vl-example" data-name="bar_column_fold"></div>
