---
layout: docs
menu: docs
title: Vega-Lite Specification
permalink: /docs/spec.html
---

{:#spec}

Vega-Lite specifications are JSON objects that describe a diverge range of interactive visualizations.  The simplest form of specification is a specification of a [single view](#single-view-spec), which describes a view that uses a single [mark type](mark.html) to visualize the data.  Besides using a single view specification as a standalone visualization, Vega-Lite also provides operators for composing multiple view specifications into a layered or multi-view specification.
These operators include [`layer`](layer.html), [`facet`](facet.html), [`concat`](concat.html), [`repeat`](repeat.html).

* TOC
{:toc}

## Top-Level Specifications
{:top-level-spec}

Any kind of top-level specifications (such as a standalone single view specification) can contain the following properties:

__TODO: Add TopLevelProperties for `$schema`, `background`, `padding`, `autoResize`, `config`. (Please look at toplevelprops.ts for now)__

## Single View Specifications
{:#single-view-spec}

{: .suppress-error}
```json
{
  // Properties for standalone single view specifications
  "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
  "background": ...,
  "padding": ...,
  "autoResize": ...,
  "config": ...,

  // Properties for any single view specifications
  "description": ... ,
  "data": ... ,
  "mark": ... ,
  "transform": ...,
  "encoding": {
    "x": {
      "field": ...,
      "type": ...,
      ...
    },
    "y": ...,
    "color": ...,
    ...
  }
}
```

A single view specification describes a graphical [`mark`](mark.html) type (e.g., `point`s or `bar`s) and its [`encoding`](encoding.html), or the mapping between data values and properties of the mark. By simply providing the mark type and the encoding mapping, Vega-Lite automatically produces other visualization components including [axes](axis.html), [legends](legend.html), and [scales](scale.html). Unless explicitly specified, Vega-Lite determines properties of these components based on a set of carefully designed rules. This approach allows Vega-Lite specifications to be succinct and expressive, but also enables customization.

As it is designed for analysis, Vega-Lite also supports data transformation such as [aggregation](aggregate.html), [binning](bin.html), [time unit conversion](timeunit.html), [filtering](transform.html), and [sorting](sort.html).

To summarize, a single-view specification in Vega-Lite can have the following top-level properties:

{% include table.html props="name,description,width,height,data,transform,selection,mark,encoding" source="UnitSpec" %}

## Layered and Multi-view Specifications

To create layered and multi-view graphics, please refer to the following pages:

- [`layer`](layer.html)
- [`facet`](facet.html)
- [`concat`](concat.html)
- [`repeat`](repeat.html)
