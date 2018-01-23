---
layout: docs
menu: docs
title: Projection
permalink: /docs/projection.html
---
## Projection Overview
A cartographic projection maps longitude and latitude pairs to x, y coordinates. As with Vega, one can use projections in Vega-lite to layout both geographic points (such as locations on a map) represented by longitude and latitude coordinates, or to project geographic regions (such as countries and states) represented using the GeoJSON format. Projection's are specified at the unit specification level, alongside encoding.

{:#properties}
## Projection Properties
{% include table.html props="type,clipAngle,clipExtent,center,rotate,precision" source="Projection" %}

In addition to the shared properties above, the following properties are supported for specific projection types in the [d3-geo-projection](https://github.com/d3/d3-geo-projection) library:([`coefficient`](https://github.com/d3/d3-geo-projection#hammer_coefficient), [`distance`](https://github.com/d3/d3-geo-projection#satellite_distance), [`fraction`](https://github.com/d3/d3-geo-projection#bottomley_fraction), [`lobes`](https://github.com/d3/d3-geo-projection#berghaus_lobes), [`parallel`](https://github.com/d3/d3-geo-projection#armadillo_parallel), [`radius`](https://github.com/d3/d3-geo-projection#gingery_radius), [`ratio`](https://github.com/d3/d3-geo-projection#hill_ratio), [`spacing`](https://github.com/d3/d3-geo-projection#lagrange_spacing), [`tilt`](https://github.com/d3/d3-geo-projection#satellite_tilt).



*Note*: All [properties](#properties) of projections are **optional** with defaults as defined in the [Vega projection properties](https://vega.github.io/vega/docs/projections/#properties). Because of this, marks that don't have explicitly defined projections may implicitly derive a projection. Implicit projections will be added for any [`geoshape`](geoshape.html) mark or any mark that has fields of type [`latitude`](type.html#latitude), [`longitude`](type.html#longitude), or [`geojson`](type.html#geojson).

{:#projection-types}
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
The projection config can contain any of the projection properties [as specified above](#properties).
