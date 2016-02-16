---
layout: page
permalink: /

images:
 - area
 - bar
 - line
 - circle
 - scatter
 - square
 - stacked_bar_h
 - point_filled

---

{:.hidden}
# Vega-Lite: a high-level visualization grammar

{:.lead}
**Vega-Lite** is a high-level visualization grammar.  It provides a concise JSON syntax for supporting rapid generation of visualizations to support analysis.  Vega-Lite specifications can be compiled to [Vega](http://vega.github.io/vega) specifications.

{% include showcase.html %}

Vega-Lite specifications describe visualizations as mappings from data to **properties of graphical marks** (e.g., points or bars).  It **automatically produces visualization components** including axes, legends, and scales. It then determines properties of these components based on a set of **carefully designed rules**.  This approach allows Vega-Lite specifications to be succinct and expressive, but also provide user control.  As Vega-Lite is designed for analysis, it supports **data transformation** such as aggregation, binning, filtering, sorting, and faceting.

Try Vega-Lite in the [online editor](https://vega.github.io/vega-editor/?mode=vega-lite). To learn more about the language and how to use it, read the [getting started tutorial]({{site.baseurl}}/tutorials/getting_started.html) and the [documentation]({{site.baseurl}}/docs/).

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
