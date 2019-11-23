---
layout: docs
menu: docs
title: Composing Layered & Multi-view Plots
permalink: /docs/composition.html
---

With Vega-Lite, you can not only create single view visualizations, but also [facet](facet.html), [layer](layer.html), [concatenate](concat.html), and [repeat](repeat.html) these views into layered or multiview displays.

A layered or multi-view display can also be composed with other views. Through this **hierarchical composition**, you can create a whole dashboard as a single specification.

Vega-Lite's compiler infers how input data should be reused across constituent views, and whether scale domains should be unioned or remain independent.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Faceting

With the `facet` operator, you can partition the data and create a view for each subset to create a [trellis plot](https://en.wikipedia.org/wiki/Small_multiple). As a shortcut, Vega-Lite also has the [`column` and `row` encoding channels](encoding.html#facet) to quickly create a faceted view.

Learn how to use it on the [facet page](facet.html).

## Layering

With the `layer` operator, you can place multiple views on top of each other. This can be useful to add annotations to views. Vega-Lite automatically unions scale domains and combines axes and legends.

However, Vega-Lite can not enforce that a unioned domain is _semantically meaningful_. To prohibit layering of composite views with incompatible layouts, the layer operator restricts its operands to be single or layered views.

Learn how to use it on the [layering page](layer.html).

## Concatenation

To place views side-by-side, Vega-Lite provides operators for horizontal (`hconcat`) and vertical (`vconcat`) concatenation.

Learn how to use it on the [concatenation page](concat.html).

## Repeating

Often, you may concatenate similar views where the only difference is the field that is used in an encoding. The `repeat` operator is a shortcut that creates a view for each entry in an array of fields.

The `repeat` operator generates multiple plots like `facet`. However, unlike `facet` it allows full replication of a data set in each view.

Learn how to use it on the [repeat page](repeat.html).

## Resolution

Vega-Lite determines whether scale domains should be unioned. If the scale domain is unioned, axes and legends can be merged. Otherwise they have to be independent.

To override scale, axis, and legend resolution, you can set the [resolve](resolve.html) property.
