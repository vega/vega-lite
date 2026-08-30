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

The `array` mark displays a grid of values, such as an image, an elevation model, or any 2D array, as a single raster image. This is a useful mark for data that is already gridded, where one datum holds a whole grid rather than one row per cell.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#data}

## Grid Data

An array mark reads one grid per datum. A grid gives its size in cells with `width` and `height`, and lists the cell values in `values`, in row-major order.

```json
{"width": 3, "height": 2, "values": [1, 2, 3, 4, 5, 6]}
```

Gridded data is commonly distributed in this form, so it can often be plotted without reshaping. The examples below use `volcano`, an 87 by 61 grid of elevations:

```json
{
  "data": {"url": "data/volcano.json"},
  "mark": "array",
  "encoding": {"color": {"field": "values", "type": "quantitative"}}
}
```

`width` and `height` count cells rather than pixels. The image is scaled to fill the view, so a grid of any size can be drawn at any size.

The first row of `values` is drawn at the top of the image, which places it at the highest `y` value. If your grid is stored the other way up, reverse the axis with `"scale": {"reverse": true}` on `y`.

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

An `array` mark definition can contain any [standard mark properties](mark.html#mark-def) and the following special properties:

{% include table.html props="axis" source="ArrayConfig" %}

{% include table.html props="smooth,aspect" source="MarkConfig" %}

## Examples

### Raster Grid

The [`color`](encoding.html#color) encoding maps the grid's values to a color scheme. Its scale covers the range of the data, so the legend reads in data units.

<span class="vl-example" data-name="array_grid"></span>

### Clipping the Color Range

A few extreme cells can leave the rest of the grid crowded into a narrow band of color. Set an explicit [`domain`](scale.html#domain) with `clamp` to spread the scheme over the range you care about, holding anything beyond it at the end colors.

<span class="vl-example" data-name="array_color_domain"></span>

### Diverging Colors

When a value divides the grid into meaningful sides, such as a threshold or a baseline, pair a diverging scheme with `domainMid` to place the midpoint there.

<span class="vl-example" data-name="array_color_diverging"></span>

### Crisp Cells

The image is smoothed as it scales up. Set `smooth` to `false` to show each cell exactly.

<span class="vl-example" data-name="array_smooth"></span>

### Square Cells

The image is stretched to fill the view, so cells are only square when the view has the same proportions as the grid. Set `aspect` to `true` to fit the grid inside the view instead, keeping its cells square and leaving space on the sides that do not fill.

<span class="vl-example" data-name="array_aspect"></span>

### Adding Axes

An array mark fills the view and needs no position encoding, so it has no axes by default. Set `axis` to `true` to label the grid with its own extent, counted in cells.

<span class="vl-example" data-name="array_axis"></span>

### A Different Extent

To label a grid with something other than cell counts, such as the area it covers, encode `x`/`x2` and `y`/`y2` yourself. Use fields when each grid covers a different extent.

<span class="vl-example" data-name="array_axis_field"></span>

### Shared Axes

Faceted grids share one pair of axes, drawn once around the panels.

<span class="vl-example" data-name="facet_array_axis"></span>

### Faceted Grids

[Faceted](facet.html) grids share one color scale by default, so panels stay comparable. The second grid below covers a narrower range of values and therefore uses only part of the scheme.

<span class="vl-example" data-name="facet_array"></span>

### Independent Color Scales

Set `"resolve": {"scale": {"color": "independent"}}` to give each grid its own range instead. This brings out the structure within each panel, but the panels can no longer be compared to each other.

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

The `array` property of the top-level [`config`](config.html) object sets the default properties for all array marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

The array config can contain any [array mark properties](#properties) (except `type`, `style`, and `clip`).
