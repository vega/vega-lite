---
layout: docs
menu: docs
title: Array
permalink: /docs/array.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "array",
  "encoding": ... ,
  ...
}
```

The `array` mark displays a grid of values, such as an image, an elevation model, or any 2D array,
as a single raster image. Since the whole grid is drawn as one image instead of one mark per cell,
it stays responsive at resolutions where a [`rect`](rect.html) mark would not.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#data}

## Grid Data

Each datum describes one grid: `width` and `height` give its size in cells, and `values` lists the
cells in row-major order. The `volcano` dataset is stored this way:

```json
{
  "width": 87,
  "height": 61,
  "values": [103, 104, 104, 105, ...]
}
```

so it can be used directly:

```json
{
  "data": {"url": "data/volcano.json"},
  "mark": "array",
  "encoding": {"color": {"field": "values", "type": "quantitative"}}
}
```

`width` and `height` count cells rather than pixels. The image is scaled to fill the view, so a grid
of any size can be drawn at any size.

The first row of `values` is drawn at the top of the image, which places it at the highest `y`
value. If your grid is stored the other way up, reverse the axis with `"scale": {"reverse": true}`
on `y`.

{:#properties}

## Array Mark Properties

```js
// Single View Specification
{
  ...
  "mark": {
    "type": "array",
    ...
  },
  "encoding": ... ,
  ...
}
```

An `array` mark definition can contain any [standard mark properties](mark.html#mark-def) and the
following special properties:

{% include table.html props="smooth,aspect" source="MarkConfig" %}

## Examples

### Raster Grid

The [`color`](encoding.html#color) encoding maps the grid's values to a color scheme. Its scale
covers the range of the data, so the legend reads in data units. Set an explicit
[`domain`](scale.html#domain) to clip outliers, or `domainMid` to centre a diverging scheme.

<span class="vl-example" data-name="array_grid"></span>

### Crisp Cells

The image is smoothed as it scales up. Set `smooth` to `false` to show each cell exactly.

<span class="vl-example" data-name="array_smooth"></span>

### Adding Axes

An array mark fills the view and needs no position encoding. To label it, give the extent the grid
covers with `x`/`x2` and `y`/`y2`, as constant `datum` values here, or as fields when the extent
differs per grid.

<span class="vl-example" data-name="array_axis"></span>

### Faceted Grids

[Faceted](facet.html) grids share one color scale by default, which makes them comparable. Use
`"resolve": {"scale": {"color": "independent"}}` to give each its own range instead.

<span class="vl-example" data-name="facet_array_independent_color"></span>

{:#config}

## Array Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "array": ...,
    ...
  }
}
```

The `array` property of the top-level [`config`](config.html) object sets the default properties for
all array marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for
marks, these config values will be overridden.

The array config can contain any [array mark properties](#properties) (except `type`, `style`, and
`clip`).
