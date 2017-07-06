---
layout: docs
menu: docs
title: Concatenating views
permalink: /docs/concat.html
---

To place views side-by-side, Vega-Lite's [view compositon](composition.html) provides operators for horizontal (`hconcat`) and vertical (`vconcat`) concatenation.

If you concatenate similar views where the only difference is the field that is used in an encoding, use the [`repeat` operator](repeat.html).

## Horizontal Concatenation

Put multiple views into a row by putting the specs for each view into an array and assign it to the `hconcat` property.

{: .suppress-error}
```json
{
  "hconcat": [
    ...  // Specifications
  ]
}
```

A horizontal concatenation specification has the following properties:

{% include table.html props="hconcat,data,transform,resolve,name,description" source="HConcatSpec" %}

## Vertical Concatenation

Put multiple views into a column by putting the specs for each view into an array and assign it to the `vconcat` property.

{: .suppress-error}
```json
{
  "vconcat": [
    ...  // Specifications
  ]
}
```

A vertical concatenation specification has the following properties:

{% include table.html props="vconcat,data,transform,resolve,name,description" source="VConcatSpec" %}

## Resolve

The default [resolutions](resolve.html) for concatenation are independent scales, axes, and legends.
