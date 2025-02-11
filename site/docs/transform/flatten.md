---
layout: docs
menu: docs
title: Flatten
permalink: /docs/flatten.html
---

The **flatten** transform maps array-valued _fields_ to a set of individual data objects, one per array entry. This transform generates a new data stream in which each data object consists of an extracted array value as well as all the original fields of the corresponding input data object.

```js
// Any View Specification
{
  ...
  "transform": [
    {"flatten": ...} // Flatten Transform
     ...
  ],
  ...
}
```

## Flatten Transform Definition

{% include table.html props="flatten,as" source="FlattenTransform" %}

## Usage

```json
{"flatten": ["foo", "bar"]}
```

This example flattens the `"foo"` and `"bar"` array-valued fields. Given the input data

```json
[
  {"key": "alpha", "foo": [1, 2], "bar": ["A", "B"]},
  {"key": "beta", "foo": [3, 4, 5], "bar": ["C", "D"]}
]
```

this example produces the output:

```json
[
  {"key": "alpha", "foo": 1, "bar": "A"},
  {"key": "alpha", "foo": 2, "bar": "B"},
  {"key": "beta", "foo": 3, "bar": "C"},
  {"key": "beta", "foo": 4, "bar": "D"},
  {"key": "beta", "foo": 5, "bar": null}
]
```

## Examples

Below are some examples to demonstrate the usage of the flatten transform.

### Basic Example

In this example, `flatten` is used on two fields simultaneously. `null` values are added to the shorter array.

<div class="vl-example" data-name="circle_flatten"></div>

### Advanced Example: Coordinated Views with Nested Time Series

Here, a single field is flattened and then used to plot the line chart corresponding to the circle chart above.

<div class="vl-example" data-name="vconcat_flatten"></div>
