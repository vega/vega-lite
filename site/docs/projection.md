---
layout: docs
menu: docs
title: Projection
permalink: /docs/projection.html
---
## Projection Overview
Projection's are specified at the mark specification level, alongside encoding.

{:#properties}
## Projection Properties
{% include table.html props="type,clipAngle,clipExtent,center,rotate,precision" source="Projection" %}


*Note*: All [properties](#properties) of projections are **optional** with defaults as defined in the [Vega projection properties](https://vega.github.io/vega/docs/projections/#properties). Because of this, defined marks that don't have explicitly defined projections may implicitly derive a projection. Implicit projections will be added for any [`geoshape`](geoshape.html) mark or any mark that has fields of type [`latitude`](type.html#latitude), [`longitude`](type.html#longitude), or [`geojson`](type.html#geojson).


## Projection Types
For a list of all supported projection types, please see the [Vega projection types](https://vega.github.io/vega/docs/projections/#types).


{:#config}
## Projection Configuration

{: .suppress-error}
```json
// Top-level View Specification
{
  ...,
  "config": {          // Configuration Object
    "projection": { ... },   // - Projection Configuration
    ...
  }
}
```

The `projection` property of the [`config`](config.html) object determines the default properties and transformations applied to different types of [projections](projection.html).
The projection config can contain any of the properties as specified above.
