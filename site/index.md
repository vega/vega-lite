---
layout: home
permalink: /
title: A High-Level Visualization Grammar

images:
 - spec: stacked_area_stream
 - spec: circle
 - spec: bar_layered_transparent
 - spec: tick_strip
 - spec: layer_line_color_rule
 - spec: trellis_barley
 - spec: bar_grouped
 - spec: github_punchcard
 - spec: stacked_bar_weather
 - spec: trellis_bar_histogram
 - spec: area
 - spec: stacked_bar_v
 - spec: line_color
 - spec: scatter_opacity
 - spec: line_slope
 - spec: trellis_anscombe
 - spec: scatter_binned_opacity
 - spec: line_month
 - spec: rect_heatmap
 - spec: box_plot
 - spec: scatter_connected

---

{:.lead}
**Vega-Lite** is a high-level visualization grammar. It provides a concise JSON syntax for supporting rapid generation of visualizations to support analysis. Vega-Lite specifications can be compiled to [Vega](http://vega.github.io/vega) specifications.


<span class="lead-columns">
  <span>
    Vega-Lite specifications describe visualizations as mappings from data to **properties of graphical marks** (e.g., points or bars). It **automatically produces visualization components** including axes, legends, and scales. It then determines properties of these components based on a set of **carefully designed rules**. This approach allows Vega-Lite specifications to be succinct and expressive, but also provide user control. As Vega-Lite is designed for analysis, it supports **data transformations** such as aggregation, binning, filtering, sorting, and **visual transformations** including stacking and faceting.
  </span>
  <span class="lead-buttons">
    [Get started]({{site.baseurl}}/tutorials/getting_started.html)
    [Try online](https://vega.github.io/new-editor/#/vega_lite)
  </span>
</span>

Read our [introduction article on Medium](https://medium.com/p/438f9215f09e), check out the [documentation]({{site.baseurl}}/docs/) and take a look at our [example gallery]({{site.baseurl}}/examples/).

## Using Vega-Lite

<!--TODO more about API -->

To get started quickly, you can create visualizations in our [online editor](https://vega.github.io/vega-editor/?mode=vega-lite).

There are many ways to use Vega-Lite in your webpage or project. You can use the included compile function, the bundled command-line tools, our easy-to-use [embed library](https://github.com/vega/vega-embed), or a multitude of third party tools. To learn more about using Vega-Lite and other methods of compiling Vega-Lite specifications, visit our [usage instructions]({{site.baseurl}}/docs/usage.html).

## Example

This is a Vega-Lite specification to create a bar chart that shows the average temperature in Seattle for each month.

<div class="vl-example" data-name="bar_month"></div>

## Additional Links

* Award winning [research paper](http://idl.cs.washington.edu/papers/vega-lite) on the design of Vega-Lite
* [JSON schema](http://json-schema.org/) specification for [Vega-Lite](https://github.com/vega/schema) ([latest](https://vega.github.io/vega-lite/vega-lite-schema.json))
* Ask questions about Vega-Lite in the [Vega Discussion Group / Mailing List](https://groups.google.com/forum/?fromgroups#!forum/vega-js)


## Team

The development of Vega-Lite is led by [Kanit "Ham" Wongsuphasawat](https://twitter.com/kanitw), [Dominik Moritz](https://twitter.com/domoritz), and [Jeffrey Heer](https://twitter.com/jeffrey_heer) of the [University Washington Interactive Data Lab](http://idl.cs.washington.edu), with significant help from [Arvind Satyanarayan](https://twitter.com/arvindsatya1). Please see the [contributors page](https://github.com/vega/vega-lite/graphs/contributors) for the full list of contributors.
