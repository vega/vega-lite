---
layout: examples
menu: examples
title: Example Gallery
permalink: /examples/
---

This page shows example specifications for different types of graphics.
To see example code for embedding visualization in a webpage, please refer to [this page](../usage/embed.html).

* TOC
{:toc}

{% for group in site.data.examples %}
## {{ group[0] }}
<span class="gallery">{% for spec in group[1] %}{% include preview.html spec=spec.name title=spec.title %}{% endfor %}</span>
{% endfor %}

## Community Examples

Here we list great examples of Vega-Lite visualizations that were created by the community. Please help us expand this gallery by [forking our example block](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9) and sending us a [pull request](https://github.com/vega/vega-lite/edit/master/site/examples/gallery.md) with your example added to this list.

* [Grouped Bar Chart by @churtado](https://bl.ocks.org/domoritz/f5abc519dd990bfcbc3f20f634658364)
* [Multi Line Highlight by @amitkaps](https://bl.ocks.org/amitkaps/fe4238e716db53930b2f1a70d3401701)
