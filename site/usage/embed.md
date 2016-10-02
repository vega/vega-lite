---
layout: usage
menu: usage
title: Embedding Vega-Lite
permalink: /usage/embed.html
---

See [this repository](https://github.com/vega/vega-lite-demo) for full code of this page.

The easiest way to use Vega-Lite on your own web page is with [vega-embed](https://github.com/vega/vega-embed), a library we built to make the process as painless as possible.

To embed a Vega-Lite specification on your web page first load the required libraries (D3, Vega, Vega-Lite, **Vega-Embed**).

```html
<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="//vega.github.io/vega/vega.js" charset="utf-8"></script>
<script src="//vega.github.io/vega-lite/vega-lite.js" charset="utf-8"></script>
<script src="//vega.github.io/vega-editor/vendor/vega-embed.js" charset="utf-8"></script>
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
var embedSpec = {
  mode: "vega-lite",
  spec: vlSpec
}
vg.embed("#vis", embedSpec, function(error, result) {
  // Callback receiving the View instance and parsed Vega spec
  // result.view is the View, which resides under the '#vis' element
});
```

Vega-Embed automatically adds links to export an image, view the source, and open the specification in the online editor. These links can be individually disabled. For more information, read the [documentation in the vega wiki](https://github.com/vega/vega/wiki/Embed-Vega-Web-Components).
