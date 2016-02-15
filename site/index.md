---
layout: home
title: Vega-Lite
permalink: /
---

{:.lead}
**Vega-Lite** is a high-level visualization grammar.  It provides a concise JSON syntax for supporting rapid generation of visualizations to support analysis.  Vega-Lite specifications can be compiled to [Vega](http://vega.github.io/vega) specifications.

Vega-Lite specifications describe visualizations as mappings from data to **properties of graphical marks** (e.g., points or bars).  It **automatically produces visualization components** including axes, legends, and scales. It then determines properties of these components based on a set of **carefully designed rules**.  This approach allows Vega-Lite specifications to be succinct and expressive, but also provide user control.  As Vega-Lite is designed for analysis, it supports **data transformation** such as aggregation, binning, filtering, sorting, and faceting.

Try Vega-Lite in the [online editor](https://vega.github.io/vega-editor/?mode=vega-lite). To learn more about the language and how to use it, read the [getting started tutorial]({{site.baseurl}}/tutorials/getting_started.html) and the [documentation]({{site.baseurl}}/docs/).

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


---


Want to learn more? [Read the getting started tutorial]({{site.baseurl}}/tutorials/getting_started.html) and create your own visualizations in the [online editor](https://vega.github.io/vega-editor/?mode=vega-lite)

The complete schema for specifications as [JSON schema](http://json-schema.org/) is at [vega-lite-schema.json](https://vega.github.io/vega-lite/vega-lite-schema.json).

Feel free to ask questions about Vega-Lite in the [Vega Discussion Group / Mailing List](https://groups.google.com/forum/?fromgroups#!forum/vega-js).
