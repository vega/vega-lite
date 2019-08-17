---
layout: docs
menu: docs
title: Bind a Selection
permalink: /docs/bind.html
---

Using the `bind` property, selections can be bound in two ways:

- Single selections can be bound to [input elements](#input-element-binding) also known as dynamic query widgets.
- Interval selections can be bound to their own [view's scales](#scale-binding) to enable panning &amp; zooming.

## Input Element Binding

With single selections, the `bind` property follows the form of Vega's [input element binding definition](https://vega.github.io/vega/docs/signals/#bind) to establish a two-way binding between input elements and the selection. One input element per [projection](project.html) is generated and can be used to manipulate the selection; any direct manipulation interactions (e.g., clicking on the visualization) will similarly update the input element.

For instance, in the example below, `org` selects a single `Origin` data value, and is bound to a dropdown menu with three options to choose from.

<div class="vl-example" data-name="selection_bind_origin"></div>

If multiple projections are specified, customized bindings can be specified by mapping the projected field/encoding to a binding definition. For example, the scatterplot below projects over both the `Cylinders` and `Year` fields, and uses a customize `range` slider for each one.

<div class="vl-example" data-name="selection_bind_cylyr"></div>

## Scale Binding

With interval selections, the `bind` property can be set to the value `"scales"` to enable a two-way binding between the selection and the scales used within the same view. This binding first populates the interval selection with the scale domains, and then uses the selection to drive the scale domains. As a result, the view now functions like an interval selection and can be [panned](translate.html) and [zoomed](zoom.html).

<div class="vl-example" data-name="selection_translate_scatterplot_drag"></div>

In multi-view displays, binding shared scales will keep the views synchronized. For example, below we explicitly share the `x` scale between the two vertically concatenated views. Panning/zooming the bound interval selection in the first view also updates the second view.

<div class="vl-example" data-name="interactive_panzoom_vconcat_shared"></div>

A similar setup can be used to pan and zoom the cells of a scatterplot matrix:

<div class="vl-example" data-name="interactive_panzoom_splom"></div>
