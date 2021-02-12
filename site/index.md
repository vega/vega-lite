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

<p class="lead" markdown="1">
  **Vega-Lite** is a high-level grammar of interactive graphics. It provides a concise, declarative JSON syntax to create an expressive range of visualizations for data analysis and presentation.
</p>

<span class="lead-columns">
  <span>
    Vega-Lite specifications describe visualizations as encoding mappings from data to **properties of graphical marks** (e.g., points or bars).
    The Vega-Lite compiler **automatically produces visualization components** including axes, legends, and scales.
    It determines default properties of these components based on a set of **carefully designed rules**.
    This approach allows Vega-Lite specifications to be concise for quick visualization authoring, while giving user control to override defaults and customize various parts of a visualization.
    As we also designed Vega-Lite to support data analysis, Vega-Lite supports both **data transformations** (e.g., aggregation, binning, filtering, sorting) and **visual transformations** (e.g., stacking and faceting).
    Moreover, Vega-Lite specifications can be **composed** into layered and multi-view displays, and made **interactive with selections**.
  </span>
  <span class="lead-buttons">
  [Get started<br><small>Latest Version: {{ site.data.versions.vega-lite }}</small>]({{ site.baseurl }}/tutorials/getting_started.html)
  [Try online](https://vega.github.io/editor/#/custom/vega-lite)
  </span>
</span>

Compared to [Vega](https://vega.github.io/vega), Vega-Lite provides a more concise and convenient form to author common visualizations. As Vega-Lite can compile its specifications to Vega specifications, users may use Vega-Lite as the _primary_ visualization tool and, if needed, transition to use the lower-level Vega for advanced use cases.

For more information, read our [introduction article to Vega-Lite v2 on Medium](https://medium.com/@uwdata/de6661c12d58), watch our [OpenVis Conf talk about the new features in Vega-Lite v2](https://www.youtube.com/watch?v=9uaHRWj04D4), see the [documentation]({{ site.baseurl }}/docs/) and take a look at our [example gallery]({{ site.baseurl }}/examples/). Follow us on [Twitter at @vega_vis](https://twitter.com/vega_vis) to stay informed about updates.

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
        <source src="{{ site.baseurl }}/static/moving-avg.mp4" type="video/mp4">
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
- [JSON schema](http://json-schema.org/) specification for [Vega-Lite](https://github.com/vega/schema) ([latest](https://vega.github.io/schema/vega-lite/v5.json))
- Ask questions about Vega-Lite on [Stack Overflow](https://stackoverflow.com/tags/vega-lite) or [Slack](https://bit.ly/join-vega-slack-2020)
- Fork our [Vega-Lite Block](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9), or [Observable Notebook](https://beta.observablehq.com/@domoritz/vega-lite-demo).

## Users

Vega-Lite is used by thousands of data enthusiasts, developers, journalists, data scientists, teachers, and researchers across many organizations. Here are some of them. Learn about integrations on our [ecosystem page]({{ site.baseurl }}/ecosystem.html).

{:.logos}

- ![Apple]({{ site.baseurl }}/static/logo_apple.png 'Apple')
- ![Google]({{ site.baseurl }}/static/logo_google.png 'Google')
- ![Microsoft]({{ site.baseurl }}/static/logo_ms.png 'Microsoft')
- ![Tableau]({{ site.baseurl }}/static/logo_tableau.png 'Tableau')
- ![Airbnb]({{ site.baseurl }}/static/logo_airbnb.png 'Airbnb')
- ![JupyterLab]({{ site.baseurl }}/static/logo_jlab.png 'JupyterLab')
- ![LA Times]({{ site.baseurl }}/static/logo_la_times.png 'LA Times')
- ![CERN]({{ site.baseurl }}/static/logo_cern.png 'CERN')
- ![Massachusetts Institute of Technology]({{ site.baseurl }}/static/logo_mit.png 'Massachusetts Institute of Technology')
- ![University of Washington]({{ site.baseurl }}/static/logo_uw.png 'University of Washington')
- ![Carnegie Mellon University]({{ site.baseurl }}/static/logo_cmu.png 'Carnegie Mellon University')
- ![Berkeley]({{ site.baseurl }}/static/logo_berkeley.png 'Berkeley')

## Team

The development of Vega-Lite is led by the alumni and members of the [University of Washington Interactive Data Lab](https://idl.cs.washington.edu) (UW IDL), including [Kanit "Ham" Wongsuphasawat](https://twitter.com/kanitw) (now at Apple), [Dominik Moritz](https://twitter.com/domoritz) (now at CMU / Apple), [Arvind Satyanarayan](https://twitter.com/arvindsatya1) (now at MIT), and [Jeffrey Heer](https://twitter.com/jeffrey_heer) (UW IDL).

Vega-Lite gets significant contributions from its community--in particular [Will Strimling](https://willium.com), [Yuhan (Zoe) Lu](https://github.com/YuhanLu), [Souvik Sen](https://github.com/invokesus), [Chanwut Kittivorawong](https://github.com/chanwutk), [Matthew Chun](https://github.com/mattwchun), [Akshat Shrivastava](https://github.com/AkshatSh), [Saba Noorassa](https://github.com/Saba9), [Sira Horradarn](https://github.com/sirahd), [Donghao Ren](https://github.com/donghaoren), and [Halden Lin](https://github.com/haldenl). Please see the [contributors page](https://github.com/vega/vega-lite/graphs/contributors) for the full list of contributors.
