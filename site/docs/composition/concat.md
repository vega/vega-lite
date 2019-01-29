---
layout: docs
menu: docs
title: Concatenating views
permalink: /docs/concat.html
---

To place views side-by-side, Vega-Lite's [view composition](composition.html) provides operators for horizontal (`hconcat`) and vertical (`vconcat`) concatenation.

If you concatenate similar views where the only difference is the field that is used in an encoding, use the [`repeat` operator](repeat.html).

## Documentation Overview

{:.no_toc}

<!-- prettier-ignore -->
- TOC
{:toc}

## Horizontal Concatenation

Put multiple views into a row by putting the specs for each view into an array and assign it to the `hconcat` property.

```json
{
  "hconcat": [
    ...  // Specifications
  ]
}
```

In addition to [common properties of a view specification](spec.html#common), a horizontal concatenation specification has the following properties:

{% include table.html props="hconcat,bounds,center,spacing,resolve" source="HConcatSpec" %}

### Example

<span class="vl-example" data-name="hconcat_weather"></span>

## Vertical Concatenation

Put multiple views into a column by putting the specs for each view into an array and assign it to the `vconcat` property.

```json
{
  "vconcat": [
    ...  // Specifications
  ]
}
```

In addition to [common properties of a view specification](spec.html#common), a vertical concatenation specification has the following properties:

{% include table.html props="vconcat,bounds,center,spacing,resolve" source="VConcatSpec" %}

### Example

<span class="vl-example" data-name="vconcat_weather"></span>

## Resolve

The default [resolutions](resolve.html) for concatenation are independent scales and axes for [position channels](encoding.html#position) and shared scales and legends for all other channels. Currently, Vega-Lite does not support shared axes for concatenated views.
