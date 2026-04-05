---
layout: docs
menu: docs
title: Density Mark
permalink: /docs/density-mark.html
---

```js
// Single View Specification
{
  "data": ...,
  "mark": "density",
  "encoding": ...,
  ...
}
```

The density mark is a [composite mark](mark.html#composite-marks) for visualizing a one-dimensional kernel density estimate (KDE) directly from raw data.

To create a density mark, set `mark` to `"density"`.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#properties}

## Density Mark Properties

A density mark definition can contain the following properties:

{% include table.html props="type,bandwidth,cumulative,counts,extent,minsteps,maxsteps,steps,resolve,orient,point,color,opacity,interpolate,tension,clip,stroke,strokeWidth,strokeOpacity,strokeDash,strokeDashOffset,fill,fillOpacity,stack" source="DensityDef" %}

{:#line-vs-area}

## Line vs Area Behavior

The density mark chooses line or area output based on fill properties:

1. If neither `fill` nor `fillOpacity` is set (in mark definition or encoding), the density renders as a **line**.
2. If either `fill` or `fillOpacity` is set, the density renders as an **area**.

When rendered as an area, `fillOpacity` defaults to `0.6` unless explicitly provided.

If both fill-side and stroke-side styling are present (for example `fill` with `color`), Vega-Lite expands the density mark into layered area + line marks.

{:#stacking}

## Stacking

The `stack` property applies only to area densities.

- Area densities support `"zero"`, `"center"`, `"normalize"`, and `null`.
- Line densities do not include stack on the density axis.

Stacking is most useful when grouping by a discrete field (for example `color`).

{:#orient}

## Orientation

The density mark orientation is inferred from the continuous axis:

- Continuous `x` produces a vertical density (density mapped to `y`).
- Continuous `y` produces a horizontal density (density mapped to `x`).

You can set `orient` explicitly if the orientation is ambiguous.

{:#examples}

## Examples

Density line by default:

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "data": {"url": "data/movies.json"},
  "mark": "density",
  "encoding": {
    "x": {"field": "IMDB Rating", "type": "quantitative"}
  }
}
```

Density area with stacking by group:

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "data": {"url": "data/movies.json"},
  "mark": {"type": "density", "fill": "steelblue", "stack": "center"},
  "encoding": {
    "x": {"field": "IMDB Rating", "type": "quantitative"},
    "color": {"field": "Major Genre", "type": "nominal"}
  }
}
```

Density area + line overlay:

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "data": {"url": "data/penguins.json"},
  "mark": {"type": "density", "fill": "steelblue", "stroke": "black"},
  "encoding": {
    "x": {"field": "Body Mass (g)", "type": "quantitative"},
    "color": {"field": "Species", "type": "nominal"}
  }
}
```

{:#config}

## Mark Config

```js
{
  "density": {
    "bandwidth": ...,
    "counts": ...,
    "resolve": ...,
    "fillOpacity": ...
  }
}
```

The `density` config object sets default properties for density marks.

{:#transform-compare}

## Density Mark vs Density Transform

The [density transform](density.html) computes KDE values into output fields (`value`, `density`) that you then visualize manually.

The density mark performs the transform and mark construction for you in one shorthand mark definition.
