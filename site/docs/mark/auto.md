---
layout: docs
menu: docs
title: Auto
permalink: /docs/auto.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "auto",
  "encoding": ... ,
  ...
}
```

The `auto` mark automatically selects a suitable primitive mark from the encodings you provide and their (declared or inferred) data types. It is resolved during normalization &mdash; an `auto` spec compiles to the same Vega specification as the equivalent explicit-mark spec, so there is no runtime cost.

Because Vega-Lite compiles without access to the data, the choice is made purely from the declared (or inferred) channel types &mdash; not from data values. This is more conservative than data-aware tools such as [Observable Plot's `auto` mark](https://observablehq.com/@observablehq/plot-auto) or [CompassQL](https://github.com/vega/compassql): you must supply a `type` (or use `bin`/`timeUnit`/`aggregate`, from which a type can be inferred) on each encoded field.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#selection}

## How the Mark Is Chosen

The following rules are evaluated top-down. A field counts as **continuous** if its declared type is `"quantitative"` or `"temporal"` and it is not binned; otherwise (nominal/ordinal, or binned) it is **discrete**. A field on `color` or `size` is treated as a _measure_ if it is quantitative or has an `aggregate`.

| Condition | Resulting mark | Notes |
| --- | --- | --- |
| A `geojson`-typed field is present | `geoshape` |  |
| `latitude` or `longitude` is encoded | `point` |  |
| `theta` is encoded and `x`/`y` are absent | `arc` | Combine with `color` for a pie chart. |
| `x` and `y` both continuous, one of them is `temporal` | `line` | Time series. |
| `x` and `y` both continuous-`quantitative` | `point` | Scatterplot. Without data, order cannot be detected, so `auto` does not infer a line here. |
| One of `x`/`y` is continuous and the other is discrete | `bar` | Bars of an unaggregated measure: `auto` never silently sums or averages. |
| `x` and `y` both discrete, plus a measure on `size` | `point` | Bubble grid. |
| `x` and `y` both discrete, plus a measure on `color` | `rect` | Heatmap. |
| `x` and `y` both discrete, no measure | `point` | Strip / dot grid. |
| Exactly one positional field is provided, and it is continuous-`quantitative` | `bar` | Histogram: `auto` sets `bin: true` on the present field and `{aggregate: "count"}` on the empty axis. |
| Exactly one positional field is provided, and it is temporal or discrete | `bar` | Count bar: `auto` adds `{aggregate: "count"}` on the empty axis. |
| No positional or geographic encoding is provided | `point` | Defaults to `point` and emits a warning. |

A user-supplied `prefer` overrides the family-selection rules above (rows 4&ndash;9). The structural decisions (binning and `count` injection for the 1D rows) still apply.

{:#properties}

## Auto Mark Properties

`auto` may be written either as the string `"auto"` or as a mark definition object with `type: "auto"` and an optional [`prefer`](#prefer) property:

```js
// Mark definition object
{
  "mark": {"type": "auto", "prefer": "line"},
  ...
}
```

{:#prefer}

{% include table.html props="prefer" source="AutoMarkDef" %}

The `area` mark is intentionally _only_ produced when explicitly requested via `prefer`: choosing area over line implies a part-to-whole reading that cannot be justified from declared types alone.

## Examples

### Scatterplot (quantitative &times; quantitative)

<span class="vl-example" data-name="auto_scatterplot"></span>

### Time Series (temporal &times; quantitative)

<span class="vl-example" data-name="auto_line"></span>

### Histogram (1D quantitative)

`auto` adds `bin: true` to the present field and `{aggregate: "count"}` to the empty axis.

<span class="vl-example" data-name="auto_histogram"></span>

### Category Counts (1D discrete)

<span class="vl-example" data-name="auto_bar"></span>

### Heatmap (discrete &times; discrete with a `color` measure)

<span class="vl-example" data-name="auto_heatmap"></span>

### Requesting Area via `prefer`

<span class="vl-example" data-name="auto_prefer_area"></span>
