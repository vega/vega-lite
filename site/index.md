---
layout: page
permalink: /

images:
 - spec: area
   bgposition: 80% 30%
 - spec: bar_layered_transparent
   bgposition: 25% 0
   bgsize: 250%
 - spec: circle
   bgposition: 75% 30%
 - spec: tick_strip
   bgposition: 75% 0%
   bgsize: 150%
 - spec: line_color
   bgposition: 50% 30%
   bgsize: 150%
 - spec: scatter_colored_with_shape
 - spec: trellis_barley
   bgsize: 250%
 - spec: bar_grouped
   bgposition: 75% 30%
 - spec: trellis_stacked_bar
   bgsize: 250%
 - spec: trellis_scatter
   bgposition: center 25%
   bgsize: 300%

---

{:.hidden}
# Vega-Lite: a high-level visualization grammar

{% include showcase.html %}

{:.lead}
**Vega-Lite** is a high-level visualization grammar.  It provides a concise JSON syntax for supporting rapid generation of visualizations to support analysis.  Vega-Lite specifications can be compiled to [Vega](http://vega.github.io/vega) specifications.


<span class="lead-columns">
  <span>
    Vega-Lite specifications describe visualizations as mappings from data to **properties of graphical marks** (e.g., points or bars).  It **automatically produces visualization components** including axes, legends, and scales. It then determines properties of these components based on a set of **carefully designed rules**.  This approach allows Vega-Lite specifications to be succinct and expressive, but also provide user control.  As Vega-Lite is designed for analysis, it supports **data transformations** such as aggregation, binning, filtering, sorting, and **visual transformations** including stacking and faceting.
  </span>
  <span class="lead-buttons">
    [Get started]({{site.baseurl}}/tutorials/getting_started.html)
    [Try online](https://vega.github.io/vega-editor/?mode=vega-lite)
  </span>
</span>

Check out the [Documentation]({{site.baseurl}}/docs/) of Vega-Lite specifications and take a look at our [Example Gallery]({{site.baseurl}}/gallery.html).

## Example

This is a Vega-Lite specification to create a bar chart that shows the average temperature in Seattle for each month.

<div class="vl-example">
{
  "data": {"url": "data/seattle-temps.csv", "formatType": "csv"},
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
* Ask questions about Vega-Lite in the [Vega Discussion Group / Mailing List](https://groups.google.com/forum/?fromgroups#!forum/vega-js).


## Team

The development of Vega-Lite is led by [Kanit "Ham" Wongsuphasawat](https://twitter.com/kanitw), [Dominik Moritz](https://twitter.com/domoritz), and [Jeffrey Heer](https://twitter.com/jeffrey_heer) of the [University Washington Interactive Data Lab](http://idl.cs.washington.edu), with significant help from [Arvind Satyanarayan](https://twitter.com/arvindsatya1).  Please see the [contributors page](https://github.com/vega/vega-lite/graphs/contributors) for the full list of contributors.
