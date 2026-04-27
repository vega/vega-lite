---
layout: docs
menu: docs
title: Treemap
permalink: /docs/treemap.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "treemap",
  "encoding": ... ,
  ...
}
```

The `treemap` mark displays hierarchical data as nested rectangles. Each branch of the tree is a rectangle whose area is proportional to a specified data field, subdivided into smaller rectangles representing sub-branches.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Basic Treemap

To create a treemap, set `mark` to `"treemap"` and define the tree structure using the `hierarchy` encoding channel.

### Stratify mode (explicit parent references)

When your data has explicit ID and parent-ID columns, use an object with `key` and `parentKey`. The data must include a **root node** whose `parentKey` value is `null`.

<span class="vl-example" data-name="treemap_simple"></span>

### Nest mode (categorical grouping)

When your data is flat and the hierarchy is implied by categorical fields, use an object with a `nest` array of field definitions. The array order goes from root to leaf level:

<span class="vl-example" data-name="treemap_nest"></span>

{:#hierarchy}

## Hierarchy Encoding

The `hierarchy` encoding channel tells Vega-Lite how to construct a tree from flat tabular data. It supports two modes:

**Stratify** — object with `key` + `parentKey` (for data with explicit parent references):

| Property | Type | Description |
| :-- | :-- | :-- |
| `key` | Object | `{"field": ...}` — field that uniquely identifies each node. |
| `parentKey` | Object | `{"field": ...}` — field pointing to the parent node's key. Root nodes should have a `null` parent. |

```json
{
  "encoding": {
    "hierarchy": {
      "key": {"field": "id"},
      "parentKey": {"field": "parent"}
    }
  }
}
```

**Nest** — object with a `nest` array (for flat data grouped by categories):

```json
{
  "encoding": {
    "hierarchy": {"nest": [{"field": "Origin"}, {"field": "Cylinders"}]}
  }
}
```

The array order defines the grouping levels from root to leaf. A synthetic root node and intermediate grouping nodes are created automatically.

{:#encoding}

## Encoding Channels

In addition to `hierarchy`, treemap supports the following encoding channels:

- **`size`** — quantitative field that determines each rectangle's area. If omitted, all leaf nodes are given equal area.
- **`color`** — field that determines each rectangle's fill color (nominal, ordinal, or quantitative).
- **`tooltip`** — tooltip content shown on hover.

{:#properties}

## Treemap Mark Properties

```js
// Single View Specification
{
  ...
  "mark": {
    "type": "treemap",
    ...
  },
  "encoding": ... ,
  ...
}
```

A treemap mark definition can contain any [standard mark properties](mark.html#mark-def) and the following treemap-specific properties:

{% include table.html props="nodes,method,padding,paddingInner,paddingOuter,paddingTop,paddingRight,paddingBottom,paddingLeft,ratio,round" source="TreemapConfig" %}

### Node Filtering

The `nodes` property controls which tree nodes are rendered:

- `"leaves"` (default) — only nodes without children
- `"internal"` — only nodes with children (root + intermediate nodes)
- `"all"` — every node in the tree

By default, only leaf nodes are rendered, which produces the standard treemap look. To create a layered treemap with colored category backgrounds and white-stroked leaf cells, use two treemap marks in a [`layer`](layer.html):

<span class="vl-example" data-name="treemap_layered"></span>

### Layout Methods

The `method` property controls the tiling algorithm:

| Method         | Description                                                                   |
| :------------- | :---------------------------------------------------------------------------- |
| `"squarify"`   | (default) Produces rectangles with aspect ratios close to the target `ratio`. |
| `"resquarify"` | Like squarify but preserves node order for stable transitions.                |
| `"binary"`     | Recursively partitions to balance area, producing near-square rectangles.     |
| `"dice"`       | Divides horizontally by data order.                                           |
| `"slice"`      | Divides vertically by data order.                                             |
| `"slicedice"`  | Alternates between slice and dice at each tree level.                         |

{:#config}

## Treemap Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "treemap": ...,
    ...
  }
}
```

The `treemap` property of the top-level [`config`](config.html) object sets the default properties for all treemap marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

For the list of all supported properties, please see the [mark config documentation](mark.html#config).
