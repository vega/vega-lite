---
layout: docs
menu: docs
title: Flatten
permalink: /docs/flatten.html
---

The **flatten** transform maps array-valued _fields_ to a set of individual data objects, one per array entry. This transform generates a new data stream in which each data object consists of an extracted array value as well as all the original fields of the corresponding input data object.


## Flatten Transform Definition

{% include table.html props="flatten,as" source="FlattenTransform" %}


## Examples

Below are some examples to demonstrate the usage of the flatten transform.

### Basic Example

In this example, `flatten` is used on two fields simultaneously. `null` values are added to the shorter array.

<div class="vl-example" data-name="circle_flatten"></div>


### Concat Circle and Line Marks with Nested Data

Here, a single field is flattened and then used to plot the line chart corresponding to the circle chart above.

<div class="vl-example" data-name="vconcat_flatten"></div>
