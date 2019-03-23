---
layout: docs
menu: docs
title: Vega-Lite View Specification
permalink: /docs/spec.html
---

{:#spec}

Vega-Lite specifications are JSON objects that describe a diverse range of interactive visualizations. The simplest form of specification is a specification of a [single view](#single), which describes a view that uses a single [mark type](mark.html) to visualize the data. Besides using a single view specification as a standalone visualization, Vega-Lite also provides operators for composing multiple view specifications into a layered or multi-view specification. These operators include [`layer`](layer.html), [`facet`](facet.html), [`concat`](concat.html), and [`repeat`](repeat.html).

## Documentation Overview

{:.no_toc}

<!-- prettier-ignore -->
- TOC
{:toc}

{:#common}

## Common Properties of Specifications

All view specifications in Vega-Lite can contain the following properties:

{% include table.html props="name,description,title,data,transform" source="TopLevelUnitSpec" %}

In addition, all view composition specifications ([`layer`](layer.html), [`facet`](facet.html), [`concat`](concat.html), and [`repeat`](repeat.html)) and unit specifications with [facet channels](https://vega.github.io/vega-lite/docs/encoding.html#facet) can have the following composition layout and [resolution](https://vega.github.io/vega-lite/docs/resolve.html) properties:

{% include table.html props="bounds,center,spacing,resolve" source="TopLevelUnitSpec" %}

{:#top-level}

## Top-Level Specifications

In addition to the [common properties](#common), any kind of top-level specifications (including a standalone single view specification as well as layered and multi-view specifications) can contain the following properties:

{% include table.html props="$schema,background,padding,autosize,config" source="TopLevelUnitSpec" %}

{:#single}

## Single View Specifications

```js
{
  // Properties for top-level specification (e.g., standalone single view specifications)
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "background": ...,
  "padding": ...,
  "autosize": ...,
  "config": ...,

  // Properties for any specifications
  "title": ...,
  "name": ...,
  "description": ...,
  "data": ...,
  "transform": ...,

  // Properties for any single view specifications
  "width": ...,
  "height": ...,
  "mark": ...,
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

To summarize, a single-view specification in Vega-Lite can have the following properties (in addition to [common properties of a specification](#common)):

{% include table.html props="mark,encoding,width,height,view,selection,projection" source="TopLevelUnitSpec" %}

{:#view-background}

### View Background

The `background` property of a _top-level_ view specification defines the background of the whole visualization canvas. Meanwhile, the `view` property of a single-view or [layer](layer.html) specification can define the background of the view with the following properties:

{% include table.html props="style,cornerRadius,fill,fillOpacity,opacity,stroke,strokeCap,strokeDash,strokeDashOffset,strokeJoin,strokeMiterLimit,strokeOpacity,strokeWidth" source="ViewBackground" %}

#### Example: Background

For example, the following plot has orange as the whole visualization background color while setting the view background to yellow.

<span class="vl-example" data-name="point_background"></span>

## Layered and Multi-view Specifications

To create layered and multi-view graphics, please refer to the following pages:

- [`layer`](layer.html)
- [`facet`](facet.html)
- [`concat`](concat.html)
- [`repeat`](repeat.html)

{:#config}

## View Configuration

```js
// Top-level View Specification
{
  ...,
  "config": { // Configuration Object

    "view": { // - View Configuration

      // View Size
      "width": ...,
      "height": ...,
      // View Background Properties
      "fill": ...,
      "stroke": ...,
      ...
    },
    ...
  }
}
```

The style of a single view visualization can be customized by specifying the `view` property of the `config` object. The view config support all [view background properties](#view-background) except `"style"`.

In addition, the `width` and `height` properties of the `view` configuration determine the width of a single view with a continuous x-scale and the height of a single view with a continuous y-scale respectively.

{% include table.html props="width,height" source="ViewConfig" %}

**For more information about view size, please see the [size](size.html) documentation.**
