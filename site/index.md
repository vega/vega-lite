---
layout: home
permalink: /
title: A High-Level Grammar of Interactive Graphics

images:
  - spec: stacked_area_stream
  - spec: selection_translate_scatterplot_drag
  - spec: layer_point_errorbar_stdev
  - spec: tick_strip
  - spec: line_overlay_stroked
  - spec: trellis_barley
  - spec: geo_choropleth
  - spec: circle_github_punchcard
  - spec: geo_layer_line_london
  - spec: stacked_bar_weather
  - spec: layer_line_co2_concentration
  - spec: circle_natural_disasters
  - spec: trellis_area
  - spec: layer_line_errorband_ci
  - spec: line_slope
  - spec: layer_ranged_dot
  - spec: layer_bar_annotations
  - spec: rect_binned_heatmap
  - spec: interactive_splom
  - spec: interactive_layered_crossfilter
  - spec: interactive_overview_detail
---

{:.lead} **Vega-Lite** is a high-level grammar of interactive graphics. It provides a concise JSON syntax for rapidly generating visualizations to support analysis. Vega-Lite specifications can be compiled to [Vega](https://vega.github.io/vega) specifications.

<span class="lead-columns">
  <span>
    Vega-Lite specifications describe visualizations as mappings from data to **properties of graphical marks** (e.g., points or bars). The Vega-Lite compiler **automatically produces visualization components** including axes, legends, and scales. It then determines properties of these components based on a set of **carefully designed rules**. This approach allows specifications to be succinct and expressive, but also provide user control. As Vega-Lite is designed for analysis, it supports **data transformations** such as aggregation, binning, filtering, sorting, and **visual transformations** including stacking and faceting. Moreover, Vega-Lite specifications can be **composed** into layered and multi-view displays, and made **interactive with selections**.
  </span>
  <span class="lead-buttons">
    [Get started<br><small>Latest Version: {{ site.data.versions.vega-lite }}</small>]({{ site.baseurl }}/tutorials/getting_started.html)
    [Try online](https://vega.github.io/editor/#/custom/vega-lite)
  </span>
</span>

Read our [introduction article to Vega-Lite v2 on Medium](https://medium.com/@uwdata/de6661c12d58), watch our [OpenVis Conf talk about the new features in Vega-Lite v2](https://www.youtube.com/watch?v=9uaHRWj04D4), check out the [documentation]({{ site.baseurl }}/docs/) and take a look at our [example gallery]({{ site.baseurl }}/examples/).

## Example

<div id="carousel" class="carousel">
  <p>
    With Vega-Lite, we can start with a <a class="slide-nav" data-slide="0" data-state="active">bar chart of the average monthly precipitation</a> in Seattle, <a class="slide-nav" data-slide="1">overlay a rule for the overall yearly average</a>, and have it represent <a class="slide-nav" data-slide="2">an interactive moving average for a dragged region</a>. <button class="next-slide">Next step</button>
  </p>

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
        <source src="{{ site.baseurl }}/site/static/moving-avg.mp4" type="video/mp4">
      </video>
    </div>
  </div>
  <div class="indicators">
    <input class="indicator" name="indicator" data-slide="0" data-state="active" checked type="radio" />
    <input class="indicator" name="indicator" data-slide="1" type="radio" />
    <input class="indicator" name="indicator" data-slide="2" type="radio" />
  </div>
</div>

## Additional Links

- Award winning [research paper](https://idl.cs.washington.edu/papers/vega-lite) and [video of our OpenVis Conf talk](https://www.youtube.com/watch?v=9uaHRWj04D4) on the design of Vega-Lite
- Listen to a Data Stories episode about [Declarative Visualization with Vega-Lite and Altair](http://datastori.es/121-declarative-visualization-with-vega-lite-and-altair-with-dominik-moritz-jacob-vanderplas-kanit-ham-wongsuphasawat/)
- [JSON schema](http://json-schema.org/) specification for [Vega-Lite](https://github.com/vega/schema) ([latest](https://vega.github.io/schema/vega-lite/v3.json))
- Ask questions about Vega-Lite in the [Vega Discussion Group / Mailing List](https://bit.ly/vega-discuss) or [Slack](https://bit.ly/join-vega-slack)
- Fork our [Vega-Lite Block](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9), or [Observable Notebook](https://beta.observablehq.com/@domoritz/vega-lite-demo).

## Team

The development of Vega-Lite is led by the alumni and members of the [University Washington Interactive Data Lab](https://idl.cs.washington.edu) (UW IDL), including [Kanit "Ham" Wongsuphasawat](https://twitter.com/kanitw) (now at Apple), [Dominik Moritz](https://twitter.com/domoritz) (UW IDL), [Arvind Satyanarayan](https://twitter.com/arvindsatya1) (now at MIT), and [Jeffrey Heer](https://twitter.com/jeffrey_heer) (UW IDL). Please see the [contributors page](https://github.com/vega/vega-lite/graphs/contributors) for the full list of contributors.
