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

Vega-lite provides [`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) channel to create tooltip using SVG [`title`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title) tag. For example, this bar chart supports tooltip for field `b`. Hover over the bar will show a simple tooltip that displays individual value of field `b` of each bar.

<div class="vl-example" data-name="bar_tooltip"></div>

[`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) provides a quick and easy way to add a tooltip. However, it is limited to displaying one field on the tooltip at a time. You can further customize the tooltip by specifying custom event handler that gets invoked every time tooltip displays via [`tooltipHandler`](https://vega.github.io/vega/docs/api/view/#view_tooltipHandler) in [`Vega View API`](https://vega.github.io/vega/docs/api/view/).

## Using Vega-tooltip plugin

[`Vega-tooltip`](https://github.com/vega/vega-tooltip/) is a tooltip plugin for both Vega and Vega-lite visualization. It generates tooltip by creating HTML element, rather than using SVG [`title`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title) tag that is produced by using [`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) channel. By using HTML elements to generate tooltip, [`Vega-tooltip`](https://github.com/vega/vega-tooltip/) provides more features compared to the built-in [`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) channel. It can display a table showing multiple fields in the tooltip. You can also [customize](https://github.com/vega/vega-tooltip/blob/master/docs/customizing_your_tooltip.md) the style and fields that the tooltip displays.


<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/vega-tooltip/0.4.0/vega-tooltip.min.css">
<div class="vl-example tooltip" data-name="bar"></div>

