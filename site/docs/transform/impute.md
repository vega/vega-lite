---
layout: docs
title: Impute
permalink: /docs/impute.html
---

To impute missing data in Vega-Lite, you can either use the `impute` transform, either via an [encoding field definition](#encoding) or via an [`transform`](#transform) array.

The impute transform groups data and determines missing values of the `key` field within each group. For each missing value in each group, the impute transform will produce a new tuple with the `impute`d field generated based on a specified imputation `method` (by using a constant `value` or by calculating statistics such as mean within each group).

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#encoding}

## Impute in Encoding Field Definition

```js
// A Single View or a Layer Specification
{
  ...,
  "mark/layer": ...,
  "encoding": {
    "x": {
      "field": ...,
      "type": "quantitative",
      "impute": {...},               // Impute
      ...
    },
    "y": ...,
    ...
  },
  ...
}
```

An [encoding field definition](encoding.html#field-def) can include an `impute` definition object to generate new data objects in place of the missing data.

The `impute` definition object can contain the following properties:

{% include table.html props="frame,keyvals,method,value" source="ImputeParams" %}

For `impute` in encoding, the grouping fields and the key field (for identifying missing values) are automatically determined. Values are automatically grouped by the specified fields of [mark property channels](encoding.html#mark-prop), [key channel](encoding.html#key) and [detail channel](encoding.html#detail). If x-field is `impute`d, y-field is the key field. Basically, any missing y-value in each group will lead to a new tuple imputed, and vice versa.

In this example, we `impute` the `y`-field (`"b"`), so the `x`-field (`"a"`) will be used as the `"key"`. The values are then grouped by the field `"c"` of the `color` encoding. The impute transform then determines missing key values within each group. In this case, the data tuple where `"a"` is `3` and `"c"` is `1` is missing, so a new tuple with `"a"` = `3`, `"c"` = `1`, and `"b"` = `0` will be added.

{:#encoding-impute-value}

<div class="vl-example" data-name="line_impute_value"></div>

Besides imputing with a constant `value`, we can also use a `method` (such as `"mean"`) on existing data points to generate the missing data.

<div class="vl-example" data-name="line_impute_method"></div>

The `frame` property of `impute` can be used to control the window over which the specified `method` is applied. Here, the `frame` is `[-2, 2]` which indicates that the window for calculating mean includes two objects preceding and two objects following the current object.

<div class="vl-example" data-name="line_impute_frame"></div>

### Specifying the Key Values to be Imputed

The `keyvals` property provides additional key values that should be considered for imputation. If not provided, all of the values will be derived from all unique values of the `key` field. If there is no grouping field (e.g., no `color` in the examples given above), then `keyvals` _must_ be specified. Otherwise, the impute transform will have no effect on the data.

The `keyvals` property can be an array:

<div class="vl-example" data-name="line_encoding_impute_keyvals"></div>

{:#sequence-def}

Alternatively, the `keyvals` property can be an [object](#sequence-def) defining a sequence, which can contain the following properties:

{% include table.html props="start,stop,step" source="ImputeSequence" %}

<div class="vl-example" data-name="line_encoding_impute_keyvals_sequence"></div>

{:#transform}

## Impute Transform

An impute transform can also be specified as a part of the `transform` array.

```js
// A View Specification
{
  ...
  "transform": [
    ...
    {
      // Impute Transform
      "impute": ...,
      "key": ...,
      "keyvals": ...,
      "groupby": [...],
      "frame": [...],
      "method": ...,
      "value": ...
    }
    ...
  ],
  ...
}
```

{% include table.html props="impute,key,keyvals,groupby,frame,method,value" source="ImputeTransform" %}

For example, the same chart with `impute` in encoding [above]("#encoding-impute-value") can be created using the `impute` transform. Here, we have to manually specify the `key` and `groupby` fields, which were inferred automatically for `impute` in `encoding`.

<div class="vl-example" data-name="line_impute_transform_value"></div>

<div class="vl-example" data-name="line_impute_transform_frame"></div>

Similarly `keyvals` _must_ be specified if the `groupby` property is not specified.

<div class="vl-example" data-name="line_impute_keyvals"></div>
