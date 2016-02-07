---
layout: docs
menu: docs
title: Overview
permalink: /docs/
---

This documentation describes [Vega-Lite specifications](#spec) and the functionalities of the [Vega-Lite library](#lib).

{:#spec}
## Vega-Lite Specifications

A Vega-Lite specification is a JSON object that describes data source (`data`),
mark type (`mark`), visual mapping between encoding channels and data variables (`encoding`),
and data transformations.

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
| description   | String     | An optional description of this mark for commenting purpose. This property has no effect on the output visualization. |
| [data](data.html)    | Object        | An object describing the data source. |
| [transform](transform.html) | Object | An object describing filter and new field calculation. |
| [mark](mark.html)    | String        | The mark type.  One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`, `"area"`, `"point"`, and `"text"` (text table). |
| [encoding](encoding.html) | Object   | A key-value mapping between encoding channels and definition of fields. |
| [config](config.html)   | Object     | Configuration object. |

{:#lib}
## The Vega-Lite Library

You can create visualizations in the [online editor](https://vega.github.io/vega-editor/?mode=vega-lite) or read about how to [embed Vega-Lite visualizations in a web page](embed.html).
