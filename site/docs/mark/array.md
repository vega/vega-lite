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
covers the range of the data, so the legend reads in data units.

<span class="vl-example" data-name="array_grid"></span>

### Clipping the Color Range

A few extreme cells can leave the rest of the grid crowded into a narrow band of color. Set an
explicit [`domain`](scale.html#domain) with `clamp` to spread the scheme over the range you care
about, holding anything beyond it at the end colors.

<span class="vl-example" data-name="array_color_domain"></span>

### Diverging Colors

When a value divides the grid into meaningful sides, such as a threshold or a baseline, pair a
diverging scheme with `domainMid` to place the midpoint there.

<span class="vl-example" data-name="array_color_diverging"></span>

### Crisp Cells

The image is smoothed as it scales up. Set `smooth` to `false` to show each cell exactly.

<span class="vl-example" data-name="array_smooth"></span>

### Adding Axes

An array mark fills the view and needs no position encoding. To label it, give the extent the grid
covers with `x`/`x2` and `y`/`y2`. Constant `datum` values are enough for a fixed extent.

<span class="vl-example" data-name="array_axis"></span>

### Axis Extent from Fields

Use fields when the extent is part of the data or differs per grid, for example grids that each
cover a different area. Here a [`calculate`](calculate.html) transform derives the extent from the
grid's own `width` and `height`.

<span class="vl-example" data-name="array_axis_field"></span>

### Faceted Grids

[Faceted](facet.html) grids share one color scale by default, so panels stay comparable. The second
grid below covers a narrower range of values and therefore uses only part of the scheme.

<span class="vl-example" data-name="facet_array"></span>

### Independent Color Scales

Set `"resolve": {"scale": {"color": "independent"}}` to give each grid its own range instead. This
brings out the structure within each panel, but the panels can no longer be compared to each other.

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
