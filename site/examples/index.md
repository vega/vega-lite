---
layout: page
menu: examples
title: Example Gallery
permalink: /examples/
---

This page shows example specifications for different types of graphics.
To see example code for embedding visualizations in a webpage, please read the [embed documentation](../usage/embed.html).


* TOC
{:toc}

{% for group in site.data.examples %}
## {{ group[0] }}
<span class="gallery">{% for spec in group[1] %}{% include preview.html spec=spec.name title=spec.title style=spec.style %}{% endfor %}</span>
{% endfor %}

## Community Examples

Here we list great examples of Vega-Lite visualizations that were created by the community. Please help us expand this gallery by [forking our example block](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9) and sending us a [pull request](https://github.com/vega/vega-lite/edit/master/site/examples/gallery.md) with your example added to this list.

* [Grouped Bar Chart](https://bl.ocks.org/domoritz/f5abc519dd990bfcbc3f20f634658364) by @churtado
* [Multi Line Highlight](https://bl.ocks.org/amitkaps/fe4238e716db53930b2f1a70d3401701) by @amitkaps
* [Slope graph](https://bl.ocks.org/g3o2/a6c539eacfb0b99eaf01e4f20b9f2897) by @g3o2
* [Scatter Nearest Rule](https://bl.ocks.org/amitkaps/abfa7157d4366cc43cbbba55353d35d8) by @amitkaps
* [Scatter Brush Rule](https://bl.ocks.org/amitkaps/a484b94a7e1e0705c5ec865ba31f463c) by @amitkaps
* [Unit Chart Rectangular](https://bl.ocks.org/amitkaps/d6648bd8ddb1c1e3706d7530126d1e2b) by @amitkaps
* [Unit Chart Stacked](https://bl.ocks.org/amitkaps/cdc7dacd8f7d9f2a9cff4b10d3279b86) by @amitkaps
* [Unit Chart Small Multiple](https://bl.ocks.org/amitkaps/67bd6dcb2af300a2b76f1e2351c1afdc) by @amitkaps
* [Dot-dash plot](https://bl.ocks.org/g3o2/bd4362574137061c243a2994ba648fb8) by @g3o2
