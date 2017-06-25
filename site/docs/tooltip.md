---
layout: docs
menu: docs
title: Tooltip
permalink: /docs/tooltip.html
---

Tooltip can provide details-on-demand about various marks on Vega-lite visualization. There are two distinct ways to create a tooltip

* TOC
{:toc}

## Using Tooltip channel

With Vega-lite's [`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) channel set the [`title`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title) attribute, which will show a tooltip on hover. For example, this bar chart supports tooltips for field `b`. Hover over the bar and notice the simple tooltip that displays the value of field `b` for each bar.

<div class="vl-example" data-name="bar_tooltip"></div>

[`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) provides a quick and easy way to add a tooltip. However, it is limited to displaying one field on the tooltip at a time. To show more than one field, you can calculate a new field that concatenates multiple fields. You can further customize the tooltip by specifying a custom event handler that gets invoked every time tooltip displays via [`tooltipHandler`](https://vega.github.io/vega/docs/api/view/#view_tooltipHandler) in [`Vega View API`](https://vega.github.io/vega/docs/api/view/).

## Using Vega-tooltip plugin

[`Vega-tooltip`](https://github.com/vega/vega-tooltip/) is a tooltip plugin for both Vega and Vega-lite visualizations. It generates tooltips by creating an HTML element. HTML elements provide more features compared to the built-in [`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) channel. It can display a list of multiple fields in the tooltip. You can also [customize](https://github.com/vega/vega-tooltip/blob/master/docs/customizing_your_tooltip.md) the style and fields that the tooltip displays.


<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/vega-tooltip/0.4.0/vega-tooltip.min.css">
<div class="vl-example tooltip" data-name="bar"></div>

