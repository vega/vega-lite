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

One grid is drawn as one mark, so a tooltip describes the whole grid rather than the cell under the pointer. With `tooltip` on, it reports the range the values cover.

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

{% include table.html props="axis,smooth,aspect" source="MarkDef" %}

## Examples

### Color

The [`color`](encoding.html#color) encoding maps the grid's values to a color scheme. Its scale covers the range of the data, so the legend reads in data units.

<span class="vl-example" data-name="array_grid"></span>

Without a color encoding the grid is shaded by opacity alone, relative to its largest value. That assumes values are non-negative, so encode color for data that goes below zero.

#### Clipping the Range

A few extreme cells can leave the rest of the grid crowded into a narrow band of color. Set an explicit [`domain`](scale.html#domain) with `clamp` to spread the scheme over the range you care about, holding anything beyond it at the end colors.

<span class="vl-example" data-name="array_color_domain"></span>

#### Diverging Colors

When a value divides the grid into meaningful sides, such as a threshold or a baseline, pair a diverging scheme with `domainMid` to place the midpoint there.

<span class="vl-example" data-name="array_color_diverging"></span>

### Rendering

How the grid is drawn into the view.

#### Crisp Cells

The image is smoothed as it scales up. Set `smooth` to `false` to show each cell exactly.

<span class="vl-example" data-name="array_smooth"></span>

#### Square Cells

The image is stretched to fill the view, so cells are only square when the view has the same proportions as the grid. Set `aspect` to `true` to fit the grid inside the view instead, keeping its cells square and leaving space on the sides that do not fill.

<span class="vl-example" data-name="array_aspect"></span>

#### Cells Without a Value

A cell whose value is `null` is left undrawn, so a grid can cover a rectangle while only part of it holds data.

<span class="vl-example" data-name="array_nodata"></span>

Grid lines are drawn behind the mark, so they show through wherever cells are left out. Set `"axis": {"grid": false}` on `x` and `y` to leave them off.

Grids often mark missing cells with a number instead, such as `-999`. Such a value is a real number to the scale, so it stretches the color range and flattens everything else. Replace it with `null` before plotting.

### Axes

An array mark fills the view and needs no position encoding, so it has no axes by default. Set `axis` to `true` to label the grid with its own extent, counted in cells.

<span class="vl-example" data-name="array_axis"></span>

#### A Different Extent

To label a grid with something other than cell counts, encode `x`/`x2` and `y`/`y2` yourself. These are the outer edges of the grid, not the centres of its first and last cells, so a global grid runs from -180 to 180 rather than -179.5 to 179.5. Constants suit an extent you know when writing the spec: the grid below is sampled every 10 metres, so it covers 870 by 610 metres.

<span class="vl-example" data-name="array_axis_datum"></span>

#### An Extent from the Data

Set `axis` to `"extent"` when the grid carries its own extent, as `[xmin, xmax, ymin, ymax]`. This suits data converted from a labelled array, where the coordinates are known but the spec is generated.

<span class="vl-example" data-name="array_axis_extent"></span>

Encoding `x`/`x2` and `y`/`y2` from fields does the same for any other field names, and lets each grid in a faceted chart cover a different area. Those grids then sit in their own place within a shared scale, rather than each filling its panel, unless the position scale is resolved independently.

<span class="vl-example" data-name="array_axis_field"></span>

### Faceted Grids

Grids can be laid out by a further dimension with the [`column`](encoding.html#facet) or `row` channel. They share one color scale by default, so panels stay comparable: the second grid below covers a narrower range of values and therefore uses only part of the scheme.

<span class="vl-example" data-name="facet_array"></span>

#### Shared Axes

Panels also share their axes, so one pair is drawn around the whole layout rather than repeated.

<span class="vl-example" data-name="facet_array_axis"></span>

#### Independent Color Scales

Set `"resolve": {"scale": {"color": "independent"}}` to give each grid its own range instead. This brings out the structure within each panel, but the panels can no longer be compared to each other.

<span class="vl-example" data-name="facet_array_independent_color"></span>

#### Independent Axes

Axes resolve separately from scales. Below, the grids sit in a two by two trellis with `"resolve": {"axis": {"x": "shared", "y": "independent"}}`, so the x axis is drawn once along the bottom while every panel keeps its own y axis.

<span class="vl-example" data-name="facet_array_independent_axis"></span>

### Repeated Variables

Faceting splits one variable across categories. To show different variables measured over the same area, repeat over their fields. Each grid keeps its own units, so resolve the color scale independently.

<span class="vl-example" data-name="repeat_array"></span>

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
