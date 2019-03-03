---
layout: docs
menu: docs
title: Faceting a Plot into a Trellis Plot
permalink: /docs/facet.html
---

[A Trellis plot (or small multiple)](https://en.wikipedia.org/wiki/Small_multiple) is a series of similar plots that displays different subsets of the same data, facilitating comparison across subsets.

There are **two ways** to facet views in Vega-Lite:

First, the [`facet` operator](#facet-operator) is one of Vega-Lite's [view composition operators](composition.html). This is the most flexible way to create faceted plots and allows composition with other operators.

Second, as a shortcut you can use the [`facet`, `column`, or `row` encoding channels](#facet-channels).

## Documentation Overview

{:.no_toc}

<!-- prettier-ignore -->
- TOC
{:toc}

## Facet Operator

To create a faceted view, define how the data should be faceted in `facet` and how each facet should be displayed in the `spec`.

```js
{
  "facet": {
    ... // Facet definition
  },
  "spec": ...  // Specification
}
```

In addition to [common properties of a view specification](spec.html#common), a facet specification has the following properties:

{% include table.html props="facet,spec,columns" source="FacetSpec" %}

{:#field-def}

### Facet Field Definition

A facet [field definition](encoding.html#field-def) has the following properties:

{% include table.html props="bin,field,timeUnit,type,header" source="FacetFieldDef" %}

**Note**

1. Unlike a [positional field definition](https://vega.github.io/vega-lite/docs/encoding.html#position-field-def), a facet field definition has the `header` property instead of `scale` and `axis`.
2. Since `facet`, `row` and `column` represent actual data fields that are used to partition the data, they cannot encode a constant `value`. In addition, you should not facet by quantitative fields unless they are [binned](bin.html), or temporal fields unless you use [`timeUnit`](timeunit.html).

{:#mapping}

### Row/Column Facet Mapping

The `facet` property of a faceted view specification describes mappings between `row` and `column` and their field definitions:

{% include table.html props="column,row" source="FacetMapping" %}

{:#header}

### Facet Headers

Similar to axes of position channels, a [header](header.html) of a facet channel provides guides to convey the data value that each row and column represent.

You can find more about facet headers in the [header documentation](header.html).

### Example

Here are examples of full row-facet and wrapped facet specifications. For more example, see the [example gallery]({{site.baseurl}}/examples/#trellis).

{:#row-full}

#### Row-Facet

The following specification uses the `facet` operator to vertically facet the histograms for the "horsepower" of cars by "origin" (using `"row"`). Each chart shows the histogram for one origin (Europe, Japan, and USA).

<span class="vl-example" data-dir="normalized" data-name="trellis_bar_histogram_normalized"></span>

This is the same example as [below](#row-encoding) but the facet operator is more flexible as it allows composition and more customization such as overriding scale, axis, and legend resolution.

{:#facet-full}

#### Wrapped Facet

<span class="vl-example" data-name="trellis_barley"></span>

## Facet, Row, and Column Encoding Channels

The [facet channels](encoding.html#facet) (`facet`, `row`, and `column`) are [encoding channels](encoding.html#channels) that serves as macros for a facet specification. Vega-Lite automatically translates this shortcut to use the facet operator.

### Examples

Here are examples of row-facet and wrapped facet plots that use encoding to specify the faceted fields. For more example, see the [example gallery]({{site.baseurl}}/examples/#trellis).

{:#row-encoding}

#### Row-Facet (with Row Encoding)

<span class="vl-example" data-name="trellis_bar_histogram"></span>

Under the hood, Vega-Lite translates this spec with `"row"` channel to the more flexible [specs with the facet operator above](#row-full).

{:#facet-encoding}

#### Wrapped Facet (with Facet Encoding)

<span class="vl-example" data-name="trellis_barley"></span>

Under the hood, Vega-Lite translates this spec with `"facet"` channel to the more flexible [specs with the facet operator above](#facet-full).

## Resolve

The default [resolutions](resolve.html) for row/column facet are shared scales, axes, and legends. Meanwhile, the general (wrappable) facet uses independent axes as Vega-Lite currently does not support shared axes for the general facet operator.)

## Facet Configuration

```js
// Top-level View Specification
{
  ...,
  "config": { // Configuration Object

    "facet": { // - Facet Configuration
      "spacing": ...,
      "columns": ...,
    },
    ...
  }
}
```

The facet configuration supports the following properties:

{% include table.html props="columns,spacing" source="CompositionConfig" %}
