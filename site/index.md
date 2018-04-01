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
 - spec: circle_github_punchcard
 - spec: stacked_bar_weather
 - spec: trellis_bar_histogram
 - spec: area
 - spec: stacked_bar_v
 - spec: line_color
 - spec: circle_opacity
 - spec: line_slope
 - spec: trellis_anscombe
 - spec: point_binned_opacity
 - spec: line_month
 - spec: rect_heatmap
 - spec: interactive_layered_crossfilter
 - spec: layer_connected_scatterplot

---

{:.lead}
**Vegemite** is a high-level grammar of interactive graphics. It provides a concise JSON syntax for rapidly generating visualizations to support analysis. Vegemite specifications can be compiled to [Vega](http://vega.github.io/vega) specifications.


<span class="lead-columns">
  <span>
    Vegemite specifications describe visualizations as mappings from data to **properties of graphical marks** (e.g., points or bars). The Vegemite compiler **automatically produces visualization components** including axes, legends, and scales. It then determines properties of these components based on a set of **carefully designed rules**. This approach allows specifications to be succinct and expressive, but also provide user control. As Vegemite is designed for analysis, it supports **data transformations** such as aggregation, binning, filtering, sorting, and **visual transformations** including stacking and faceting. Moreover, Vegemite specifications can be **composed** into layered and multi-view displays, and made **interactive with selections**.
  </span>
  <span class="lead-buttons">
    [Get started<br><small>Latest Version: {{ site.data.versions.Vegemite }}</small>]({{ site.baseurl }}/tutorials/getting_started.html)
    [Try online](https://vega.github.io/editor/#/custom/Vegemite)
  </span>
</span>

Read our [introduction article to Vegemite v2 on Medium](https://medium.com/@uwdata/de6661c12d58), watch our [OpenVis Conf talk about the new features in Vegemite v2](https://www.youtube.com/watch?v=9uaHRWj04D4), check out the [documentation]({{ site.baseurl }}/docs/) and take a look at our [example gallery]({{ site.baseurl }}/examples/).

**[We are looking to mentor students for a Google Summer of Code project with us. Apply if you want to shape the future of declarative data visualization!](https://summerofcode.withgoogle.com/organizations/5646868357316608/)**

## Example

<div id="carousel" class="carousel">
  <p>
    With Vegemite, we can start with a <a class="slide-nav" data-slide="0" data-state="active">bar chart of the average monthly precipitation</a> in Seattle, <a class="slide-nav" data-slide="1">overlay a rule for the overall yearly average</a>, and have it represent <a class="slide-nav" data-slide="2">an interactive moving average for a dragged region</a>. <button class="next-slide">Next step</button>
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

- Award winning [research paper](http://idl.cs.washington.edu/papers/Vegemite) and [video of our OpenVis Conf talk](https://www.youtube.com/watch?v=9uaHRWj04D4) on the design of Vegemite
- [JSON schema](http://json-schema.org/) specification for [Vegemite](https://github.com/vega/schema) ([latest](https://vega.github.io/schema/Vegemite/v2.json))
- Ask questions about Vegemite in the [Vega Discussion Group / Mailing List](https://groups.google.com/forum/?fromgroups#!forum/vega-js)
- Fork our [Vegemite Block](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9), or [Observable Notebook](https://beta.observablehq.com/@domoritz/Vegemite-demo).


## Team

The development of Vegemite is led by [Kanit "Ham" Wongsuphasawat](https://twitter.com/kanitw), [Dominik Moritz](https://twitter.com/domoritz), [Arvind Satyanarayan](https://twitter.com/arvindsatya1), and [Jeffrey Heer](https://twitter.com/jeffrey_heer) of the [University Washington Interactive Data Lab](https://idl.cs.washington.edu). Please see the [contributors page](https://github.com/vega/Vegemite/graphs/contributors) for the full list of contributors.
