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
<span class="gallery">{% for spec in group[1] %}{% include preview spec=spec.name title=spec.title %}{% endfor %}</span>
{% endfor %}

## Community Examples


* Grouped Bar Chart by @churtado: https://bl.ocks.org/domoritz/f5abc519dd990bfcbc3f20f634658364
