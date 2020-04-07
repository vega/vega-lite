---
layout: docs
menu: docs
title: Projection
permalink: /docs/projection.html
---

A cartographic projection maps longitude and latitude pairs to x, y coordinates. As with Vega, one can use projections in Vega-Lite to layout both geographic points (such as locations on a map) represented by longitude and latitude coordinates, or to project geographic regions (such as countries and states) represented using the GeoJSON format. Projections are specified at the unit specification level, alongside encoding. Geographic coordinate data can then be mapped to [`longitude` and `latitude` channels](encoding.html#geo) (and `longitude2` and `latitude2` for ranged marks).

For example, this example chart shows all airports in the United States by projecting `latitude`, `longitude` as `x`, `y` coordinates using the albersUsa projection.

<span class="vl-example" data-name="geo_point"></span>

See [the example gallery for more examples with geographic projection](../examples/#maps-geographic-displays).

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Projection Properties

{% include table.html props="type,center,clipAngle,clipExtent,fit,parallels,pointRadius,precision,rotate,scale,translate" source="Projection" %}

If you want to explore the various available properties in more depth, Vega's projection documentation [hosts a useful demo](https://vega.github.io/vega/docs/projections/)

In addition to the shared properties above, the following properties are supported for specific projection types in the [d3-geo-projection](https://github.com/d3/d3-geo-projection) library: [`coefficient`](https://github.com/d3/d3-geo-projection#hammer_coefficient), [`distance`](https://github.com/d3/d3-geo-projection#satellite_distance), [`fraction`](https://github.com/d3/d3-geo-projection#bottomley_fraction), [`lobes`](https://github.com/d3/d3-geo-projection#berghaus_lobes), [`parallel`](https://github.com/d3/d3-geo-projection#armadillo_parallel), [`radius`](https://github.com/d3/d3-geo-projection#gingery_radius), [`ratio`](https://github.com/d3/d3-geo-projection#hill_ratio), [`spacing`](https://github.com/d3/d3-geo-projection#lagrange_spacing), [`tilt`](https://github.com/d3/d3-geo-projection#satellite_tilt).

_Note_: All [properties](#properties) of projections are **optional** with defaults as defined in the [Vega projection properties](https://vega.github.io/vega/docs/projections/#properties). Because of this, marks that don't have explicitly defined projections may implicitly derive a projection. Implicit projections will be added for any [`geoshape`](geoshape.html) mark, any encoding with field of [`geojson`](type.html#geojson) type, and encoding with [`latitude`](encoding.html#geo) or [`longitude`](encoding.html#geo) channels.

{:#projection-types}

## Projection Types

Vega-Lite includes all cartographic projections provided by the [d3-geo](https://github.com/d3/d3-geo#) library.

| Type | Description |
| :-- | :-- |
| [albers](https://github.com/d3/d3-geo#geoAlbers) | The Albers’ equal-area conic projection. This is a U.S.-centric configuration of `"conicEqualArea"`. |
| [albersUsa](https://github.com/d3/d3-geo#geoAlbersUsa) | A U.S.-centric composite with projections for the lower 48 states, Hawaii, and Alaska (scaled to 0.35 times the true relative area). |
| [azimuthalEqualArea](https://github.com/d3/d3-geo#geoAzimuthalEqualArea) | The azimuthal equal-area projection. |
| [azimuthalEquidistant](https://github.com/d3/d3-geo#geoAzimuthalEquidistant) | The azimuthal equidistant projection. |
| [conicConformal](https://github.com/d3/d3-geo#geoConicConformal) | The conic conformal projection. The parallels default to [30&deg;, 30&deg;] resulting in flat top. |
| [conicEqualArea](https://github.com/d3/d3-geo#geoConicEqualArea) | The Albers’ equal-area conic projection. |
| [conicEquidistant](https://github.com/d3/d3-geo#geoConicEquidistant) | The conic equidistant projection. |
| [equalEarth](https://github.com/d3/d3-geo#equal-earth) | The Equal Earth projection, by Bojan Šavrič et al., 2018. |
| [equirectangular](https://github.com/d3/d3-geo#geoEquirectangular) | The equirectangular (plate carr&eacute;e) projection, akin to use longitude, latitude directly. |
| [gnomonic](https://github.com/d3/d3-geo#geoGnomonic) | The gnomonic projection. |
| [identity](https://github.com/d3/d3-geo#geoIdentity) | The identity projection. Also supports additional boolean `reflectX` and `reflectY` parameters. |
| [mercator](https://github.com/d3/d3-geo#geoMercator) | The spherical Mercator projection. Uses a default `clipExtent` such that the world is projected to a square, clipped to approximately ±85&deg; latitude. |
| [orthographic](https://github.com/d3/d3-geo#geoOrthographic) | The orthographic projection. |
| [stereographic](https://github.com/d3/d3-geo#geoStereographic) | The stereographic projection. |
| [transverseMercator](https://github.com/d3/d3-geo#geoTransverseMercator) | The transverse spherical Mercator projection. Uses a default `clipExtent` such that the world is projected to a square, clipped to approximately ±85&deg; latitude. |

{:#config}

## Projection Configuration

```js
// Top-level View Specification
{
  ...,
  "config": {          // Configuration Object
    "projection": { ... },   // - Projection Configuration
    ...
  }
}
```

The `projection` property of the [`config`](config.html) object determines the default properties and transformations applied to different types of [projections](projection.html). The projection config can contain any of the projection properties [as specified above](#properties).
