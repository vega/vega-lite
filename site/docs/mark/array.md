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

The `array` mark renders dense 2D raster data — a grid of values such as an image, a heatmap, or a
model output field — as a single image, rather than as one mark per cell. Because the whole grid
becomes one rendered image, it stays fast at resolutions where a `rect` mark per cell would not.

The mark expects each datum to describe one grid, with the values flattened into a single array in
row-major order:

```json
{
  "data": {
    "values": [{"width": 3, "height": 2, "values": [1, 2, 3, 4, 5, 6]}]
  },
  "mark": "array",
  "encoding": {
    "color": {"field": "values", "type": "quantitative", "scale": {"scheme": "viridis"}}
  }
}
```

`width` and `height` describe the grid's own resolution and are what reshape the flat `values`
array. They are unrelated to the view's `width`/`height`, which are the size of the plot area in
screen pixels — the image is scaled to fill it. To keep pixels square, keep the two proportional
(a 48×32 grid in a 360×240 view is a uniform 7.5× upscale).

## Color

The color scale's domain is derived from the grid's real values, so the legend shows genuine data
units. Under [faceting](facet.html), this means `resolve` behaves as it does for any other mark: a
shared color scale spans every grid, while `"resolve": {"scale": {"color": "independent"}}` gives
each panel its own range.

Omitting the color encoding renders the grid in greyscale by opacity alone.

{:#axes}

## Axes

An `array` mark needs no position encoding — by default the image fills the view. To label it, give
the extent the grid spans using `x`/`x2` and `y`/`y2`. For a fixed extent, `datum` values are enough
and require no extra fields in the data:

```json
"encoding": {
  "x": {"datum": 0, "type": "quantitative"},
  "x2": {"datum": 48},
  "y": {"datum": 0, "type": "quantitative"},
  "y2": {"datum": 32}
}
```

Use field definitions instead when the extent varies per datum — for example, faceted grids that
each cover a different geographic area. In that case the image is positioned and sized from the
scaled fields rather than simply filling the view.

Position scales for an `array` mark are not [`nice`](scale.html#continuous)d and do not include
zero by default, since a raster spans its extent exactly and rounding the domain outward would
misalign the axis with the image it labels.

{:#smooth}

## Pixelated rendering

Because the grid is drawn at its own resolution and then scaled to fill the view, upscaling is
smoothed (bilinearly) by default — which is usually what you want for a continuous field, but blurs
away cell boundaries for a coarse grid. Set `smooth` to `false` to render exact, crisp cells
instead:

```json
{"mark": {"type": "array", "smooth": false}}
```

{:#orientation}

## Row order

Rows are drawn top-down — the first row of `values` appears at the **top** of the image — while a
`y` axis increases upward. So the first row sits at the *highest* y value.

This matches how images are conventionally stored, and how NumPy renders with
`imshow(..., origin="upper")`. If your rows run bottom-to-top instead (`origin="lower"`), either
flip the array before serializing it:

```python
grid = {"width": w, "height": h, "values": np.flipud(array).ravel().tolist()}
```

or reverse the `y` scale:

```json
"y": {"datum": 0, "type": "quantitative", "scale": {"reverse": true}}
```

{:#config}

## Array Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "array": ...
  }
}
```

The `array` property of the top-level `config` object sets the default properties for all array
marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these
config values will be overridden.

The array config can contain any [mark properties](mark.html#mark-def) (except `type`, `style`, and
`clip`).
