---
layout: docs
menu: docs
title: Concatenating views
permalink: /docs/concat.html
---

To place views side-by-side, Vega-Lite's [view composition](composition.html) provides the following concatenation operators:

- [`hconcat`](#hconcat) - horizontal concatenation
- [`vconcat`](#vconcat) - vertical concatenation
- [`concat`](#concat) - general concatenation (wrappable)

If you concatenate similar views where the only difference is the field that is used in an encoding, use the [`repeat` operator](repeat.html).

## Documentation Overview

{:.no_toc}

<!-- prettier-ignore -->
- TOC
{:toc}

{:#hconcat}

## Horizontal Concatenation

To put multiple views into a column, set the `"hconcat"` to an array of view specifications.

```js
{
  "hconcat": [
    ...  // Specifications
  ],
  ...
}
```

In addition to [common properties of a view specification](spec.html#common), a horizontal concat specification has the following properties:

{% include table.html props="hconcat" source="HConcatSpec" %}

### Example

<span class="vl-example" data-name="hconcat_weather"></span>

{:#vconcat}

## Vertical Concatenation

To put multiple views into a row, set the `"vconcat"` to an array of view specifications.

```js
{
  "vconcat": [
    ...  // Specifications
  ],
  ...
}
```

In addition to [common properties of a view specification](spec.html#common), a vertical concat specification has the following properties:

{% include table.html props="vconcat" source="VConcatSpec" %}

### Example

<span class="vl-example" data-name="vconcat_weather"></span>

## General (Wrappable) Concatenation

To put multiple views into a flexible flow layout, set the `"concat"` to an array of view specifications and specify the `"columns"` property to set the number of maximum items per rows.

{: .suppress-error}

```js
{
  "concat": [
    ...  // Specifications
  ],
  "columns": ...,
  ...
}
```

In addition to [common properties of a view specification](spec.html#common), a general concat specification has the following properties:

{% include table.html props="concat,columns" source="ConcatSpec" %}

### Example

<span class="vl-example" data-name="concat_weather"></span>

## Resolve

The default [resolutions](resolve.html) for concatenation are independent scales and axes for [position channels](encoding.html#position) and shared scales and legends for all other channels. Currently, Vega-Lite does not support shared axes for concatenated views.

## Concat Configuration

```js
// Top-level View Specification
{
  ...,
  "config": { // Configuration Object

    "concat": { // - Concat Configuration
      "spacing": ...,
      "columns": ...,
    },
    ...
  }
}
```

The concat configuration supports the following properties:

{% include table.html props="columns,spacing" source="CompositionConfig" %}
