---
layout: docs
menu: docs
title: Binding a Parameter
permalink: /docs/bind.html
---

Using the `bind` property, parameters can be bound in the following ways:

- Variable parameters and point selections can be bound to [input elements](#input-element-binding).
- Point selections can also be bound to [legends](#legend-binding).
- Interval selections can be bound to their own [view's scales](#scale-binding) to enable panning &amp; zooming.

## Input Element Binding

For variable parameters and point selections, the `bind` property can follow the form of Vega's [input element binding definition](https://vega.github.io/vega/docs/signals/#bind). Doing so generates an input element (per [projected channel or field](project.html) for selections) which can be used to interactively set the parameter value.

For example, in the specification below, we use a variety of variable parameters to interactively manipulate the `rect` mark.

<div class="vl-example" data-name="rect_params"></div>

Similarly, in the example below, the `org` selections selects a single `Origin` data value, and is bound to a dropdown menu with three options to choose from.

<div class="vl-example" data-name="selection_bind_origin"></div>

If multiple projections are specified, customized bindings can be specified by mapping the projected field/encoding to a binding definition. For example, the scatterplot below projects over both the `Cylinders` and `Year` fields, and uses a customize `range` slider for each one.

<div class="vl-example" data-name="selection_bind_cylyr"></div>

**Note:** When point selections are bound to input widgets, direct manipulation interaction (e.g., clicking or double clicking the visualization) is disabled by default. Such interaction can be re-enabled by explicitly specifying the [`on`](selection.html#selection-props) and [`clear`](clear.html) properties.

## Legend Binding

When a point selection is [projected](project.html) over only one field or encoding channel, the `bind` property can be set to `"legend"` to populate the selection by interacting with the corresponding legend.

<div class="vl-example" data-name="interactive_legend"></div>

To customize the events that trigger legend interaction, expand the `bind` property to an object, with a single `legend` property that maps to a [Vega event stream](https://vega.github.io/vega/docs/event-streams/).

<div class="vl-example" data-name="interactive_legend_dblclick"></div>

**Note:** When a selection is bound to legends, direct manipulation interaction (e.g., clicking or double clicking the visualization) is disabled by default. Such interaction can be re-enabled by explicitly specifying the [`on`](selection.html#selection-props) and [`clear`](clear.html) properties.

**Limitations:** Currently, only binding to [symbol legends]({{ site.baseurl }}/docs/legend.html#legend-types) are supported.

## Scale Binding

With interval selections, the `bind` property can be set to the value `"scales"` to enable a two-way binding between the selection and the scales used within the same view. This binding first populates the interval selection with the scale domains, and then uses the selection to drive the scale domains. As a result, the view now functions like an interval selection and can be [panned](translate.html) and [zoomed](zoom.html).

<div class="vl-example" data-name="selection_translate_scatterplot_drag"></div>

In multi-view displays, binding shared scales will keep the views synchronized. For example, below we explicitly share the `x` scale between the two vertically concatenated views. Panning/zooming the bound interval selection in the first view also updates the second view.

<div class="vl-example" data-name="interactive_panzoom_vconcat_shared"></div>

A similar setup can be used to pan and zoom the cells of a scatterplot matrix:

<div class="vl-example" data-name="interactive_panzoom_splom"></div>
