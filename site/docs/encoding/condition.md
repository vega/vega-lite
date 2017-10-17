---
layout: docs
title: Condition
permalink: /docs/condition.html
---

The `condition` property can be used to determine encodings based on whether data values fall within a [selection](selection.html). It can either a [conditional field definition](#field) or a [conditional value definition](#value).

{:#field}
## Conditional Field Definition

{: .suppress-error}
```json
// Specification of a Single View
{
  ...,
  "encoding": {           // Encoding
    ...: {
      "condition": {      // Conditional rule for data inside the selection.
        "selection": ..., // Selection name
        "field": ...,
        "type": "quantitative"
      },
      "value": ...        // The encoding value set for data outside the selection.
    },
    ...
  },
  ...
}
```

A conditional field definition uses a data-driven encoding rule when marks fall within a selection, and a value encoding otherwise. As shown in the table below, the full gamut of data-driven encoding operations (including `aggregate`, `bin`, and `timeUnit`) are available here.

{% include table.html props="selection,field,type,bin,timeUnit,aggregate" source="ConditionLegendFieldDef" %}

For example, in the following visualization, the color of `rect` marks is driven by a conditional field definition. Drag an interval selection and observe that marks are colored based on their aggregated count if they lie within the interval, and are grey otherwise. _Note:_ When using a conditional field definition, only a `value` may be specified as the else (outer) branch.

<div class="vl-example" data-name="selection_type_interval"></div>

{:#value}
## Conditional Value Definition

{: .suppress-error}
```json
// Specification of a Single View
{
  ...,
  "encoding": {           // Encoding
    ...: {
      "condition": {      // Conditional rule for data inside the selection.
        "selection": ..., // Selection name
        "value": ...
      },
      ... // A field mapping or encoding value set for data outside the selection.
    },
    ...
  },
  ...
}
```

A condition value definition uses a value encoding when data fall within a selection. When data lie outside a selection, either a value or field encoding may be used.

{% include table.html props="selection,value" source="ConditionValueDef" %}

For example, in the visualization below, a conditional value definition causes marks that fall within a dragged interval to be larger than those that lie outside it.

<div class="vl-example" data-name="paintbrush_interval"></div>

A field mapping can also be specified as the else (outer) branch. For example, below, we invert our original example: a conditional value definition sets the `rect` marks to grey when they do _not_ lie within the selection, and a regular field mapping is used otherwise. Notice, all marks are initially colored grey. This is because empty selections are treated as containing all data values.

<div class="vl-example" data-name="selection_type_interval_invert"></div>
