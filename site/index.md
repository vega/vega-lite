---
layout: page
permalink: /

images:
 - spec: stacked_area_stream
   bgposition: 44% 22%
 - spec: circle
   bgposition: 75% 30%
 - spec: bar_layered_transparent
   bgposition: 25% 0
   bgsize: 250%
 - spec: tick_strip
   bgposition: 75% 0%
   bgsize: 150%
 - spec: line_color
   bgposition: 41% 26%
   bgsize: 170%
 - spec: scatter_colored_with_shape
   bgposition: 50% 30%
 - spec: trellis_barley
   bgsize: 226%
   bgposition: 40% 5%
 - spec: bar_grouped
   bgposition: 75% 59%
 - spec: stacked_bar_weather
   bgsize: 170%
   bgposition: 31% 14%
 - spec: trellis_bar_histogram
   bgposition: 75% 82%
   bgsize: 100%

---

{:.hidden}
# Vega-Lite: a high-level visualization grammar

{% include showcase.html %}

{:.lead}
**Vega-Lite** is a high-level visualization grammar. It provides a concise JSON syntax for supporting rapid generation of visualizations to support analysis. Vega-Lite specifications can be compiled to [Vega](http://vega.github.io/vega) specifications.


<span class="lead-columns">
  <span>
    Vega-Lite specifications describe visualizations as mappings from data to **properties of graphical marks** (e.g., points or bars). It **automatically produces visualization components** including axes, legends, and scales. It then determines properties of these components based on a set of **carefully designed rules**. This approach allows Vega-Lite specifications to be succinct and expressive, but also provide user control. As Vega-Lite is designed for analysis, it supports **data transformations** such as aggregation, binning, filtering, sorting, and **visual transformations** including stacking and faceting.
  </span>
  <span class="lead-buttons">
    [Get started]({{site.baseurl}}/tutorials/getting_started.html)
    [Try online](https://vega.github.io/vega-editor/?mode=vega-lite)
  </span>
</span>

Read our [introduction article on Medium](https://medium.com/p/438f9215f09e), check out the [documentation]({{site.baseurl}}/docs/) and take a look at our [example gallery]({{site.baseurl}}/examples/).

**Announcement:** We are working on extending our grammar with interaction for the 2.0 release.
For a sneak peek, you can read our
[award-winning research paper](http://idl.cs.washington.edu/papers/vega-lite) at VIS 2016.

## Example

This is a Vega-Lite specification to create a bar chart that shows the average temperature in Seattle for each month.

<div class="vl-example">
{
  "data": {"url": "data/seattle-temps.csv"},
  "mark": "bar",
  "encoding": {
    "x": {
      "timeUnit": "month",
      "field": "date",
      "type": "temporal",
      "axis": {"shortTimeLabels": true}
    },
    "y": {
      "aggregate": "mean",
      "field": "temp",
      "type": "quantitative"
    }
  }
}
</div>

## Additional Links

* [JSON schema](http://json-schema.org/) specification for Vega-Lite: [vega-lite-schema.json](https://vega.github.io/vega-lite/vega-lite-schema.json)
* Ask questions about Vega-Lite in the [Vega Discussion Group / Mailing List](https://groups.google.com/forum/?fromgroups#!forum/vega-js)


## Team

The development of Vega-Lite is led by [Kanit "Ham" Wongsuphasawat](https://twitter.com/kanitw), [Dominik Moritz](https://twitter.com/domoritz), and [Jeffrey Heer](https://twitter.com/jeffrey_heer) of the [University Washington Interactive Data Lab](http://idl.cs.washington.edu), with significant help from [Arvind Satyanarayan](https://twitter.com/arvindsatya1). Please see the [contributors page](https://github.com/vega/vega-lite/graphs/contributors) for the full list of contributors.
