---
layout: docs
menu: docs
title: Geoshape
permalink: /docs/geoshape.html
---

{: .suppress-error}
```json
// Single View Specification
{
  "data": ... ,
  "mark": "geoshape",
  "encoding": ... ,
  ...
}
```

The `geoshape` mark represents an arbitrary shapes whose geometry is determined by specified GeoJSON shape data.

{:#config}
## Geoshape Config

{: .suppress-error}
```json
// Top-level View Specification
{
  ...
  "config": {
    "geoshape": ...,
    ...
  }
}
```

The `geoshape` property of the top-level [`config`](config.html) object sets the default properties for all geoshape marks.  If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

For the list of all supported properties, please see the [mark config documentation](mark.html#config).
