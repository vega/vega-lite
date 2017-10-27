---
layout: docs
title: Condition
permalink: /docs/condition.html
---

For [mark property channels](encoding.html#mark-prop) as well as [text and tooltip channels](encoding.html#text), the `condition` property of their channel definitions can be used to determine encoding rules based on whether data values fall within a [selection](selection.html).

There are two ways to use the `condition` property:

1) Combining one [conditional field definition](#field) with one base value definition.

2) Combining one or more [conditional value](#value) with a field definition or a value definition.


{:#field}
## Conditional Field Definition

{: .suppress-error}
```json
// Specification of a Single View
{
  ...,
  "encoding": {           // Encoding
    ...: {
      "condition": {      // Conditional rule for data inside the selection
        // Selection name
        "selection": ...,
        // Field definition if the data is included in the selection (if)
        "field": ..., "type": "quantitative"
      },
      "value": ...        // The encoding value set for data outside the selection (else)
    },
    ...
  },
  ...
}
```

A conditional field definition uses a data-driven encoding rule when marks fall within a selection, and a value encoding otherwise. As shown in the table below, the full gamut of encoding properties including transformation functions (`aggregate`, `bin`, `timeUnit`) as well as `scale` and `legend` are available here.

{% include table.html props="selection,field,type,bin,timeUnit,aggregate,scale,legend" source="Conditional<LegendFieldDef>" %}

For example, in the following visualization, the color of `rect` marks is driven by a conditional field definition. Drag an interval selection and observe that marks are colored based on their aggregated count if they lie within the interval, and are grey otherwise.

<div class="vl-example" data-name="selection_type_interval"></div>

__Note:__ When using a conditional field definition, only a `value` may be specified as the else (outer) branch.

{:#value}
## Conditional Value Definition

{: .suppress-error}
```json
// Specification of a Single View
{
  ...,
  "encoding": {           // Encoding
    ...: {
      "condition": {      // Conditional rule for data inside the selection
        "selection": ..., // Selection name
        "value": ...      // Value if the data is included in the selection (if)
      },
      ... // A field definition or a value definition for data outside the selection (else)
    },
    ...
  },
  ...
}
```

A condition value definition uses a value encoding when data fall within a selection. When data lie outside a selection, either a value or field encoding may be used.

{% include table.html props="selection,value" source="Conditional<ValueDef>" %}

For example, in the visualization below, a conditional value definition causes marks that fall within a dragged interval to be larger than those that lie outside it.

<div class="vl-example" data-name="paintbrush_interval"></div>

A field mapping can also be specified as the else (outer) branch. For example, below, we invert our original example: a conditional value definition sets the `rect` marks to grey when they do _not_ lie within the selection, and a regular field mapping is used otherwise. Notice, all marks are initially colored grey. This is because empty selections are treated as containing all data values.

<div class="vl-example" data-name="selection_type_interval_invert"></div>
