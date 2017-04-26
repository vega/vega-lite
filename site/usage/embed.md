---
layout: usage
menu: usage
title: Embedding Vega-Lite
permalink: /usage/embed.html
---

*Fork our [Vega-Lite Block](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9) if you want to quickly publish a Vega-Lite visualization on the web.*

The easiest way to use Vega-Lite on your own web page is with [Vega-Embed](https://github.com/vega/vega-embed), a library we built to make the process as painless as possible.

To embed a Vega-Lite specification on your web page first load the required libraries (D3, Vega, Vega-Lite, **Vega-Embed**).

```html
<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega/{{ site.data.versions.vega }}/vega.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega-lite/{{ site.data.versions.vega-lite }}/vega-lite.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega-embed/{{ site.data.versions.vega-embed }}/vega-embed.js"></script>
```

We suggest that you install Vega-Lite with [npm](https://www.npmjs.com/package/vega-lite) to get the latest stable version. To install Vega-Lite with npm, simply install it as you would any other npm module.

```sh
npm install vega-lite
```

Alternatively you can [download the latest Vega-Lite release](https://github.com/vega/vega-lite/releases/latest) and add it to your project manually.  In this case, you will also have to download [Vega](https://github.com/vega/vega/releases/latest), [D3](http://d3js.org), and [Vega-Embed](https://github.com/vega/vega-embed/releases/latest).

The next step is to create a DOM element that the visualization will be attached to.

```html
<div id="vis"></div>
```

Then use Vega-Embed's provided function to embed your spec.

```js
vg.embed("#vis", vlSpec, function(error, result) {
  // Callback receiving the View instance and parsed Vega spec
  // result.view is the View, which resides under the '#vis' element
});
```

Vega-Embed automatically adds links to export an image, view the source, and open the specification in the online editor. These links can be individually disabled. For more information, read the [Vega-Embed documentation](https://github.com/vega/vega-embed).
