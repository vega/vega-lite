---
layout: docs
title: Condition
permalink: /docs/condition.html
---

For [mark property channels](encoding.html#mark-prop) as well as [text and tooltip channels](encoding.html#text), the `condition` property of their channel definitions can be used to determine encoding rules based on whether data values fall within a [selection](selection.html) or satisfy a `test` predicate.

{:#condition}

There are two ways to specify the condition:

1. Specifying `selection` name:

{% include table.html props="selection" source="ConditionalSelection<MarkPropFieldDef>" %}

2. Specifying a `test` predicate:

{% include table.html props="test" source="ConditionalPredicate<MarkPropFieldDef>" %}

In addition, there are two ways to encode the data that satisfy the specified condition:

1. Combining one [conditional field definition](#field) with one base value definition.

2. Combining one or more [conditional value](#value) with a field definition or a value definition.

{:#field}

## Conditional Field Definition

```json
// Specification of a Single View
{
  ...,
  "encoding": {           // Encoding
    ...: {
      "condition": {      // Conditional rule for data inside the selection
        // Selection name or a test predicate
        "selection/test": ...,
        // Field definition if the data is included in the selection (if)
        "field": ..., "type": "quantitative"
      },
      "value": ...        // The (optional) encoding value set for data outside the selection (else)
    },
    ...
  },
  ...
}
```

A conditional field definition uses a data-driven encoding rule when marks fall within a selection or satisfy a logical predicate. A value definition can be specified as the "else" case when the condition is not satisfied otherwise.

A condition field definition must contain either [a `selection` name or a `test` predicate](#condition) in addition to the encoded `field` name and its data `type` like a typical [field definition](encoding.html#field-def). In addition, a condition field definition may contain other encoding properties including transformation functions ([`aggregate`](aggregate.html), [`bin`](bin.html), [`timeUnit`](timeunit.html)) as well as [`scale`](scale.html) and [`legend`](legend.html) (for [mark property channels]({encoding.html#mark-prop})) or [`format`](format.html) (for [text and tooltip channels](encoding.html#text)).

For example, in the following plot, the color of `rect` marks is driven by a conditional field definition. Drag an interval selection and observe that marks are colored based on their aggregated count if they lie within the interval, and are grey otherwise.

<div class="vl-example" data-name="selection_type_interval"></div>

**Note:** When using a conditional field definition, only a `value` may be specified as the else (outer) branch.

{:#value}

## Conditional Value Definition

```json
// Specification of a Single View
{
  ...,
  "encoding": {           // Encoding
    ...: {
      "condition": {      // Conditional rule for data inside the selection
        // Selection name or a test predicate
        "selection/test": ...,
        // Value if the data is included in the selection (if)
        "value": ...
      },
      ... // A field definition or a value definition for data outside the selection (else)
    },
    ...
  },
  ...
}
```

A condition value definition uses a constant value encoding when data fall within a selection or satisfy a logical predicate. A field or value definition can be specified as the "else" case when the condition is not satisfied.

A condition value definition must contain either [a `selection` name or a `test` predicate](#condition) in addition to the encoded constant [`value`](encoding.html#value-def).

For example, in the visualization below, a conditional value definition causes marks that fall within a dragged interval to be larger than those that lie outside it.

<div class="vl-example" data-name="interactive_paintbrush_interval"></div>

A field mapping can also be specified as the else (outer) branch. For example, below, we invert our original example: a conditional value definition sets the `rect` marks to grey when they do _not_ lie within the selection, and a regular field mapping is used otherwise. Notice, all marks are initially colored grey. This is because empty selections are treated as containing all data values.

<div class="vl-example" data-name="selection_type_interval_invert"></div>

Besides specifying `selection` name, we can also specify a `test` condition.

This plot uses a conditional value definition value to use a black label for a light background.

<div class="vl-example" data-name="layer_text_heatmap"></div>

The next plot uses a conditional value definition to color data points with null values in grey. Note that if the "else" case value is not specified, default mark color will be applied.

<div class="vl-example" data-name="point_invalid_color"></div>
