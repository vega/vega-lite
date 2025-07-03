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

Check out the [documentation]({{ site.baseurl }}/docs/) and take a look at our [example gallery]({{ site.baseurl }}/examples/). Follow us on [Bluesky](https://bsky.app/profile/vega-vis.bsky.social) to stay informed about updates.

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
- [The about page for the Vega project](https://vega.github.io/vega/about/)
- Watch Dr. Lace Padilla's [series of videos on Vega-Lite](https://www.youtube.com/playlist?list=PLe9dkYfBBHFktHd5Tn2FAlADEbQ70kUSp)
- Listen to a Data Stories episode about [Declarative Visualization with Vega-Lite and Altair](http://datastori.es/121-declarative-visualization-with-vega-lite-and-altair-with-dominik-moritz-jacob-vanderplas-kanit-ham-wongsuphasawat/)
- Learn about visualization design principles in the [Visualization curriculum](https://observablehq.com/@uwdata/data-visualization-curriculum?collection=@uwdata/visualization-curriculum)
- [JSON schema](http://json-schema.org/) specification for [Vega-Lite](https://github.com/vega/schema) ([latest](https://vega.github.io/schema/vega-lite/v6.json))
- Ask questions about Vega-Lite on [Stack Overflow](https://stackoverflow.com/tags/vega-lite) or [Slack](https://bit.ly/join-vega-slack-2022)
- Fork our [Observable Notebook](https://beta.observablehq.com/@domoritz/vega-lite-demo).

## Users

Vega-Lite is used by thousands of data enthusiasts, developers, journalists, data scientists, teachers, and researchers across many organizations. Here are some of them. Learn about integrations on our [ecosystem page]({{ site.baseurl }}/ecosystem.html).

{:.logos}

- ![Airbnb]({{ site.baseurl }}/static/logo_airbnb.png 'Airbnb')
- ![Apple]({{ site.baseurl }}/static/logo_apple.png 'Apple')
- ![Databricks]({{ site.baseurl }}/static/logo_databricks.png 'Databricks')
- ![Google]({{ site.baseurl }}/static/logo_google.png 'Google')
- ![Microsoft]({{ site.baseurl }}/static/logo_ms.png 'Microsoft')
- ![Tableau]({{ site.baseurl }}/static/logo_tableau.png 'Tableau')
- ![Berkeley]({{ site.baseurl }}/static/logo_berkeley.png 'Berkeley')
- ![Carnegie Mellon University]({{ site.baseurl }}/static/logo_cmu.png 'Carnegie Mellon University')
- ![CERN]({{ site.baseurl }}/static/logo_cern.png 'CERN')
- ![JupyterLab]({{ site.baseurl }}/static/logo_jlab.png 'JupyterLab')
- ![LA Times]({{ site.baseurl }}/static/logo_la_times.png 'LA Times')
- ![Massachusetts Institute of Technology]({{ site.baseurl }}/static/logo_mit.png 'Massachusetts Institute of Technology')
- ![University of Washington]({{ site.baseurl }}/static/logo_uw.png 'University of Washington')

## Team

The development of Vega-Lite is led by the alumni and members of the [University of Washington Interactive Data Lab](https://idl.cs.washington.edu) (UW IDL), including [Kanit "Ham" Wongsuphasawat](https://kanitw.github.io) (now at Databricks), [Dominik Moritz](https://bsky.app/profile/domoritz.de) (now at CMU / Apple), [Arvind Satyanarayan](https://bsky.app/profile/arvind.bsky.social) (now at MIT), and [Jeffrey Heer](https://bsky.app/profile/jheer.org) (UW IDL).

Vega-Lite gets significant contributions from its community. Please see the [contributors page](https://github.com/vega/vega-lite/graphs/contributors) for the full list of contributors.
