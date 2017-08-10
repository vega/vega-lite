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
 - spec: layered_crossfilter
 - spec: scatter_connected

---

{:.lead}
**Vega-Lite** is a high-level visualization grammar. It provides a concise JSON syntax for supporting rapid generation of visualizations to support analysis. Vega-Lite specifications can be compiled to [Vega](http://vega.github.io/vega) specifications.


<span class="lead-columns">
  <span>
    Vega-Lite specifications describe visualizations as mappings from data to **properties of graphical marks** (e.g., points or bars). The Vega-Lite compiler **automatically produces visualization components** including axes, legends, and scales. It then determines properties of these components based on a set of **carefully designed rules**. This approach allows specifications to be succinct and expressive, but also provide user control. As Vega-Lite is designed for analysis, it supports **data transformations** such as aggregation, binning, filtering, sorting, and **visual transformations** including stacking and faceting. Moreover, Vega-Lite views can be **composed** into larger views and made **interactive with selections**.
  </span>
  <span class="lead-buttons">
    [Get started<br><small>Latest Version: {{ site.data.versions.vega-lite }}</small>]({{site.baseurl}}/tutorials/getting_started.html)
    [Try online](https://vega.github.io/editor/#/custom/vega-lite)
  </span>
</span>

Read our [introduction article to Vega-Lite 1 on Medium](https://medium.com/p/438f9215f09e), look at our [talk about the new features in Vega-Lite 2](https://www.domoritz.de/talks/VegaLite-OpenVisConf-2017.pdf), check out the [documentation]({{site.baseurl}}/docs/) and take a look at our [example gallery]({{site.baseurl}}/examples/).

## Example

This is a Vega-Lite specification to create a bar chart that shows the average temperature in Seattle for each month.

<div class="vl-example" data-name="bar_month"></div>

## Additional Links

* Award winning [research paper](http://idl.cs.washington.edu/papers/vega-lite) and [video of our OpenVis Conf talk](https://www.youtube.com/watch?v=9uaHRWj04D4) on the design of Vega-Lite
* [JSON schema](http://json-schema.org/) specification for [Vega-Lite](https://github.com/vega/schema) ([latest](https://vega.github.io/schema/vega-lite/v2.json))
* Ask questions about Vega-Lite in the [Vega Discussion Group / Mailing List](https://groups.google.com/forum/?fromgroups#!forum/vega-js)
* Fork our [Vega-Lite Block](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9)
* The website and documentation for Vega-Lite v1 is at [https://vega.github.io/vega-lite-v1/](https://vega.github.io/vega-lite-v1/).


## Team

The development of Vega-Lite is led by [Kanit "Ham" Wongsuphasawat](https://twitter.com/kanitw), [Dominik Moritz](https://twitter.com/domoritz), [Arvind Satyanarayan](https://twitter.com/arvindsatya1), and [Jeffrey Heer](https://twitter.com/jeffrey_heer) of the [University Washington Interactive Data Lab](https://idl.cs.washington.edu). Please see the [contributors page](https://github.com/vega/vega-lite/graphs/contributors) for the full list of contributors.
