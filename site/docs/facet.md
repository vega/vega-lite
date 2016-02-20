---
layout: docs
menu: docs
title: Faceting
permalink: /docs/facet.html
---

Faceting can be used to create [trellis plots (or small multiples)](https://en.wikipedia.org/wiki/Small_multiple), which are are useful for representing data with many categories because it avoids occlusion across categories. To facet a chart means to partition the dataset into groups or *facets* by a specified field. Vega-Lite creates a chart for each group, which are then laid out in columns or rows.

A visualization is facetted by encoding a field with the [`column` and `row` channels](encoding.html#facet).
Since `row` and `column` represent actual data fields that are used to partition the data, they cannot encode constant `value`. Also, you cannot facet by quantitative fields unless they are [binned](bin.html), or temporal fields unless you use [`timeUnit`](timeunit.html).

## Examples

Below are three histograms for the horsepower of cars. Each chart shows the histogram for one origin (Europe, Japan, and USA).

<span class="vl-example" data-name="trellis_bar_histogram"></span>

You can find more examples in the [example gallery]({{site.baseurl}}/gallery.html#trellis-plots).
