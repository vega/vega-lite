---
layout: docs
menu: docs
title: Extent
permalink: /docs/extent.html
---

The extent transform finds the extent of a field and stores the result in a [parameter]({{site.baseurl}}/docs/parameter.html).

```js
// Any View Specification
{
  ...
  "transform": [
    {"extent": ..., "param": ...} // Extent Transform
     ...
  ],
  ...
}
```

## Extent Transform Definition

{% include table.html props="extent,param" source="ExtentTransform" %}

## Usage

Given the following data:

```json
"data": {
  "values": [
    {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
    {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
    {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
  ]
}
```

And the transform:

```json
"transform": [
  {"extent": "b", "param": "b_extent"}
]
```

this example produces the param `b_extent` with the value `[19, 91]`.

## Example

<div class="vl-example" data-name="bar_simple_extent"></div>
