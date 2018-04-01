---
layout: docs
menu: docs
title: Tooltip
permalink: /docs/tooltip.html
---

Tooltip can provide details of a particular data point on demand. There are two ways to create a tooltip in Vegemite.

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

## Using Tooltip channel

To quickly create a tooltip without a plugin, Vegemite's [`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) channel can be mapped to a data field. For example, this bar chart supports tooltips for field `b`. Hover over the bar and notice the simple tooltip that displays the value of field `b` for each bar.

<div class="vl-example" data-name="bar_tooltip"></div>

To show more than one field, you can calculate a new field that concatenates multiple fields. You can further customize the tooltip by specifying a custom event handler that gets invoked every time tooltip displays via [`tooltipHandler`](https://vega.github.io/vega/docs/api/view/#view_tooltipHandler)of the [`Vega View API`](https://vega.github.io/vega/docs/api/view/).

## Using Vega-tooltip plugin

While [`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) provides a quick and easy way to add a tooltip, it is limited to displaying one field on the tooltip at a time.
[`Vega-tooltip`](https://github.com/vega/vega-tooltip/) is a tooltip plugin for both Vega and Vegemite visualizations that generates tooltips using a HTML table element to show values of multiple data fields.  For more information about how to create a tooltip using `vega-tooltip`, please see [`vega-tooltip`'s documentation](https://github.com/vega/vega-tooltip). Below is an example of Vegemite visualization with [`vega-tooltip`](https://github.com/vega/vega-tooltip/) plugin.

<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/vega-tooltip@{{ site.data.versions.vega-tooltip }}/build/vega-tooltip.css">
<div class="vl-example tooltip" data-name="bar"></div>
