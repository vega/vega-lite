---
layout: home
permalink: /
title: A High-Level Grammar of Interactive Graphics

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
**Vega-Lite** is a high-level grammar of interactive graphics. It provides a concise JSON syntax for supporting rapid generation of visualizations to support analysis. Vega-Lite specifications can be compiled to [Vega](http://vega.github.io/vega) specifications.


<span class="lead-columns">
  <span>
    Vega-Lite specifications describe visualizations as mappings from data to **properties of graphical marks** (e.g., points or bars). The Vega-Lite compiler **automatically produces visualization components** including axes, legends, and scales. It then determines properties of these components based on a set of **carefully designed rules**. This approach allows specifications to be succinct and expressive, but also provide user control. As Vega-Lite is designed for analysis, it supports **data transformations** such as aggregation, binning, filtering, sorting, and **visual transformations** including stacking and faceting. Moreover, Vega-Lite specifications can be **composed** into layered and multi-view displays, and made **interactive with selections**.
  </span>
  <span class="lead-buttons">
    [Get started<br><small>Latest Version: {{ site.data.versions.vega-lite }}</small>]({{site.baseurl}}/tutorials/getting_started.html)
    [Try online](https://vega.github.io/editor/#/custom/vega-lite)
  </span>
</span>

Read our [introduction article to Vega-Lite v1 on Medium](https://medium.com/p/438f9215f09e), watch our [OpenVis Conf talk about the new features in Vega-Lite v2](https://www.youtube.com/watch?v=9uaHRWj04D4), check out the [documentation]({{site.baseurl}}/docs/) and take a look at our [example gallery]({{site.baseurl}}/examples/).

## Example

<div id="carousel" class="carousel">
  <p>With Vega-Lite, we can start with a <a class="slide-nav" data-slide="1" data-state="active">bar chart of the average monthly precipitation</a> in Seattle, <a class="slide-nav" data-slide="2">overlay a rule for the overall yearly average</a>, and have it represent <a class="slide-nav" data-slide="3">an interactive moving average for a dragged region</a>.</p>

  <div class="slides">
    <div class="slide" data-state="active">
      <div class="vl-example" data-name="bar_month"></div>
    </div>
    <div class="slide">
      <div class="vl-example" data-name="layer_bar_month"></div>
    </div>
    <div class="slide video-demo">
      <div class="vl-example" data-name="selection_layer_bar_month"></div>
      <video loop>
        <source src="{{site.baseurl}}/site/static/moving-avg.mp4" type="video/mp4">
      </video>
    </div>
  </div>
  <div class="indicators">
    <input class="indicator" name="indicator" data-slide="1" data-state="active" checked type="radio" />
    <input class="indicator" name="indicator" data-slide="2" type="radio" />
    <input class="indicator" name="indicator" data-slide="3" type="radio" />
  </div>
</div>

## Additional Links

* Award winning [research paper](http://idl.cs.washington.edu/papers/vega-lite) and [video of our OpenVis Conf talk](https://www.youtube.com/watch?v=9uaHRWj04D4) on the design of Vega-Lite
* [JSON schema](http://json-schema.org/) specification for [Vega-Lite](https://github.com/vega/schema) ([latest](https://vega.github.io/schema/vega-lite/v2.json))
* Ask questions about Vega-Lite in the [Vega Discussion Group / Mailing List](https://groups.google.com/forum/?fromgroups#!forum/vega-js)
* Fork our [Vega-Lite Block](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9)
* The website and documentation for Vega-Lite v1 is at [vega.github.io/vega-lite-v1/](https://vega.github.io/vega-lite-v1/).


## Team

The development of Vega-Lite is led by [Kanit "Ham" Wongsuphasawat](https://twitter.com/kanitw), [Dominik Moritz](https://twitter.com/domoritz), [Arvind Satyanarayan](https://twitter.com/arvindsatya1), and [Jeffrey Heer](https://twitter.com/jeffrey_heer) of the [University Washington Interactive Data Lab](https://idl.cs.washington.edu). Please see the [contributors page](https://github.com/vega/vega-lite/graphs/contributors) for the full list of contributors.
