---
layout: docs
menu: docs
title: Faceting a plot into a Trellis Plot.
permalink: /docs/facet.html
---

[A Trellis plot (or small multiple)](https://en.wikipedia.org/wiki/Small_multiple) is a series of similar plots that displays different subsets of the same data, facilitating comparison across subsets. Adding a field to the [`column` or `row` channel](encoding.html#facet) produces a trellis plot that facets the plots into columns or rows respectively.

## Example

Below are three histograms for the horsepower of cars. Each chart shows the histogram for one origin (Europe, Japan, and USA).

<span class="vl-example" data-name="trellis_bar_histogram"></span>

You can find more examples in the [example gallery]({{site.baseurl}}/gallery.html#trellis-plots).

**Note** Since `row` and `column` represent actual data fields that are used to partition the data, they cannot encode constant `value`. Also, you should not facet by quantitative fields unless they are [binned](bin.html), or temporal fields unless you use [`timeUnit`](timeunit.html).
