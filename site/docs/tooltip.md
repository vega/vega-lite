---
layout: docs
menu: docs
title: Tooltip
permalink: /docs/tooltip.html
---

Tooltip can provide details of a particular data point on demand. Tooltips are created with the `tooltip` channel. By default, the renderer will generate tooltips via native HTML ["title" attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/title).

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

## Tooltip channel

To create a tooltip, Vega-Lite's [`tooltip`]({{site.baseurl}}/docs/encoding.html#mark-properties-channels) channel can be mapped to a data field. For example, this bar chart supports tooltips for field `b`. Hover over the bar and notice the simple tooltip that displays the value of field `b` for each bar.

<div class="vl-example" data-name="bar_tooltip"></div>

To show more than one field, you can provide an array of field definitions. [Vega tooltip](https://github.com/vega/vega-tooltip/) will display a table that shows the name of the field and its value. Here is an example.

<div class="vl-example" data-name="bar_tooltip_multi"></div>

Alternatively, you can [calculate](calculate.html) a new field that concatenates multiple fields (and use a single field definition).

## Vega Tooltip plugin

You can further customize the tooltip by specifying a custom event handler via [`tooltipHandler`](https://vega.github.io/vega/docs/api/view/#view_tooltipHandler) of the [`Vega View API`](https://vega.github.io/vega/docs/api/view/). Vega invokes the handler every time a tooltip is shown.

We provide [Vega Tooltip](https://github.com/vega/vega-tooltip/), a tooltip handler that creates a customizable HTML tooltip. Below is an example of Vega-lite visualization with [Vega Tooltip](https://github.com/vega/vega-tooltip/) plugin. Vega Tooltip comes with [Vega Embed](https://github.com/vega/vega-embed) so you might already be using it.

<div class="vl-example" data-name="bar_tooltip"></div>

Without the tooltip plugin, Vega-Lite will generate tooltips via native HTML ["title" attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/title). Move your cursor over one of the bars to see it (you might have to wait for a little bit for the tooltip to appear).

<div class="vl-example no-tooltip" data-name="bar_tooltip"></div>
