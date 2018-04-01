---
layout: docs
menu: docs
title: Faceting a Plot into a Trellis Plot
permalink: /docs/facet.html
---

[A Trellis plot (or small multiple)](https://en.wikipedia.org/wiki/Small_multiple) is a series of similar plots that displays different subsets of the same data, facilitating comparison across subsets.

There are **two ways** to facet views in Vegemite:

First, the [`facet` operator](#facet-operator) is one of Vegemite's [view composition operators](composition.html). This is the most flexible way to create faceted plots and allows composition with other operators.

Second, as a shortcut you can use the [`column` or `row` encoding channels](#facet-channels).

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

## Facet Operator

To create a faceted view, define how the data should be faceted in `facet` and how each facet should be displayed in the `spec`.

{: .suppress-error}
```json
{
  "facet": {
    ... // Facet definition
  },
  "spec": ...  // Specification
}
```

In addition to [common properties of a view specification](spec.html#common),
a facet specification has the following properties:

{% include table.html props="facet,spec,resolve" source="FacetSpec" %}

{:#mapping}
### Facet Mapping

The `facet` property of a faceted view specification describes mappings between `row` and `column` and their field definitions:

{% include table.html props="column,row" source="FacetMapping" %}

{:#field-def}
### Facet Field Definition

A `FacetFieldDef` is a [field definition](encoding.html#field-def) that has `header` (instead of `scale` and `axis`).

{% include table.html props="aggregate,bin,field,timeUnit,type,header" source="FacetFieldDef" %}

**Note** Since `row` and `column` represent actual data fields that are used to partition the data, they cannot encode a constant `value`. In addition, you should not facet by quantitative fields unless they are [binned](bin.html), or temporal fields unless you use [`timeUnit`](timeunit.html).


### Example

Below are three histograms for the horsepower of cars. Each chart shows the histogram for one origin (Europe, Japan, and USA).

<span class="vl-example" data-dir="normalized" data-name="trellis_bar_histogram_normalized"></span>

This is the same example as below but the facet operator is more flexible as it allows composition and more customization such as overriding scale, axis, and legend
resolution.

You can find more examples in the [example gallery]({{site.baseurl}}/examples/#trellis).


{:#header}
### Facet Headers

Similar to axes of position channels, a header of a facet channel provides guides to convey the data value that each row and column represent.

By default, Vegemite automatically creates axes with default properties for `row` and `column` channels of a faceted view.
User can set the `header` property of row- or column-[field definition](#field-def) to an object to customize header properties.

{% include table.html props="format,title" source="Header" %}

__See also:__ You may also use `guide-title` and `guide-label` [style configs](mark.html#style-config) to customize common styles for [axis](axis.html), [legend](legend.html), and header labels and titles.

## Row & Column Encoding Channels

The `row` and `column` encoding channels.

The [facet channels](encoding.html#facet) are encoding channels, which produce a trellis plot that facets a plot into columns or rows respectively. Vegemite automatically translates this shortcut to use the facet operator.

{% include table.html props="row,column" source="EncodingWithFacet" %}


### Example

<span class="vl-example" data-name="trellis_bar_histogram"></span>

Vegemite translates this spec to the more flexible [spec with the facet operator above](#example).

You can find more examples in the [example gallery]({{site.baseurl}}/examples/#trellis).


## Resolve

The default [resolutions](resolve.html) for facet are shared scales, axes, and legends.
