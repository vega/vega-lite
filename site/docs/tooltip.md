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

Vega-lite provided [`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) channel to create tooltip using SVG [`title`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title) tag. For example, this bar chart supports tooltip for field `b`. Hover over the bar will show a simple tooltip that displays individual value of field `b` of each bar.

<div class="vl-example" data-name="bar_tooltip"></div>

You can see that [`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) channel provides a very limited functionality for tooltip since only one field can be displayed at a time. Moreover, no customization of the tooltip can be done using [`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) channel.

## Using Vega-tooltip plugin

[`Vega-tooltip`](https://github.com/vega/vega-tooltip/) is a tooltip plugin for both Vega and Vega-lite visualization. It generates tooltip by creating HTML element, rather than using SVG title that is produced by using Marks channel. However, [`Vega-tooltip`](https://github.com/vega/vega-tooltip/) provides more functionality than using [`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) channel. It allows you to specify fields and values to display, as well as the customization of the tooltip.
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/vega-tooltip/0.4.0/vega-tooltip.min.css">
<div class="vl-example tooltip" data-name="bar"></div>

