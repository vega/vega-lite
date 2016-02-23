---
layout: docs
menu: docs
title: Overview
permalink: /docs/
---

**Vega-Lite** is a high-level visualization grammar.  It provides a concise JSON syntax for supporting rapid generation of visualizations to support analysis.  Vega-Lite can serve as a declarative format for describing and creating data visualizations.  Vega-Lite specifications can be compiled to a lower-level, more detailed [Vega](http://vega.github.io/vega) specifications and rendered using Vega's compiler.

This documentation describes the [JSON specification language](#spec) and how to [embed Vega-Lite visualizations](#lib) in a web application.

{:#spec}
## Vega-Lite Specifications

At its core, Vega-Lite specifications are JSON objects that describe visualizations as [mappings](encoding.html) from data to properties of [graphical marks](mark.html) (e.g., points or bars).  By simply providing a mark type and a mapping, Vega-Lite automatically produces other visualization components including axes, legends, and scales. Unless explicitly specified, Vega-Lite determines properties of these components based on a set of carefully designed rules.  This approach allows Vega-Lite specifications to be succinct and expressive, but also provide user control.

As it is designed for analysis, Vega-Lite also supports data transformation such as [aggregation](aggregate.html), [binning](bin.html), [time unit conversion](timeunit.html), [filtering](transform.html), and [sorting](sort.html).  In addition, it also supports faceting a single plot into [trellis plots or small multiples](https://en.wikipedia.org/wiki/Small_multiple).

{: .suppress-error}
```json
{
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
  },
  "config": ...
}
```

In Vega-Lite, a specification can have the following top-level properties.

| Property             | Type          | Description    |
| :------------        |:-------------:| :------------- |
| description   | String     | An _optional_ description of this mark for commenting purpose. This property has no effect on the output visualization. |
| [data](data.html)    | Object        | An object describing the data source. |
| [transform](transform.html) | Object | An object describing filter and new field calculation. |
| [mark](mark.html)    | String        | The mark type.  One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`, `"area"`, `"point"`, and `"text"`. |
| [encoding](encoding.html) | Object   | A key-value mapping between encoding channels and definition of fields. |
| [config](config.html)   | Object     | Configuration object. |

{:#lib}
## Using Vega-Lite

<!--TODO more about API -->

You can create visualizations in the [online editor](https://vega.github.io/vega-editor/?mode=vega-lite) or read about how to [embed Vega-Lite visualizations in a web page](embed.html).
