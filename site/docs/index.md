---
layout: docs
menu: docs
title: Overview
permalink: /docs/
---

A Vega-Lite specification is a JSON object that describes data source (`data`),
mark type (`mark`), visual encodings of data variables (`encoding`),
and data transformations.

In Vega-Lite, a specification can have the following top-level properties.

| Property             | Type          | Description    |
| :------------        |:-------------:| :------------- |
| [data](data.html)    | Object        | An object describing the data source. |
| [transform](transform.html)  | Object        | An object describing data transformations. |
| [mark](mark.html) | String        | The mark type.  Currently Vega-Lite supports `bar`, `circle`, `square`, `tick`, `line`, `area`, `point`, and `text` (text table). |
| [encoding](encoding.html) | Object        | key-value mapping between encoding channels and encoding object |
| [config](config.html)   | Object        | Configuration object. |
