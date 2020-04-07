---
layout: docs
menu: docs
title: Join Aggregate
permalink: /docs/joinaggregate.html
---

The joinaggregate transform extends the input data objects with aggregate values in a new field. Aggregation is performed and the results are then joined with the input data. This transform can be helpful for creating derived values that combine both raw data and aggregate calculations, such as percentages of group totals. This transform is a special case of the [window](window.html) transform where the `frame` is always `[null, null]`. Compared with the regular [aggregate](aggregate.html) transform, joinaggregate preserves the original table structure and augments records with aggregate values rather than summarizing the data in one record for each group.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Join Aggregate Field Definition

```js
// Any View Specification
{
  ...
  "transform": [
    {
      // Join Aggregate Transform
      "joinaggregate": [{
          "op": ...,
          "field": ...,
          "as": ...
      }],
      "groupby": [
        "..."
      ]
    }
     ...
  ],
  ...
}
```

## Join Aggregate Transform Definition

{% include table.html props="joinaggregate,groupby" source="JoinAggregateTransform" %}

{:#field-def}

### Join Aggregate Transform Field Definition

{% include table.html props="op,field,as" source="JoinAggregateFieldDef" %}

{:#ops}

## Examples

Below are some common use cases for the join aggregate transform.

### Percent of Total

Here we use the join aggregate transform to derive the global sum so that we can calculate percentage.

<div class="vl-example" data-name="joinaggregate_percent_of_total"></div>

### Difference from Mean

One example is to show the "exemplar" movies from a movie collection. Here "exemplar" is defined by having a score of 2.5 points higher than the global average.

<div class="vl-example" data-name="joinaggregate_mean_difference"></div>

Another example is to show the "exemplar" movies based on the release year average. Here "exemplar" is defined by having a score 2.5 points higher than the annual average for its release year (instead of the global average).

<div class="vl-example" data-name="joinaggregate_mean_difference_by_year"></div>

Rather than filtering the above two examples we can also calculate a residual by deriving the mean using the join aggregate transform first.

<div class="vl-example" data-name="joinaggregate_residual_graph"></div>

### Text Color with Contrast

Here, we layer text on a table heatmap. The text is black or white depending on the values of `num_cars`. One issue with this specification is that we have to know the range of `num_cars` ahead of time to determine a suitable threshold (e.g. `40`).

<div class="vl-example" data-name="layer_text_heatmap"></div>

We can use a joinaggregate with a calculate to determine the threshold dynamically.

<div class="vl-example" data-name="layer_text_heatmap_joinaggregate"></div>
