---
layout: docs
menu: docs
title: Embed
permalink: /docs/embed.html
---

This Document assumes that you have a Vega-Lite spec as a JavaScript object in a variable called `vlSpec`. You can find a simple example in our [tutorial]({{site.baseurl}}/tutorials/getting_started.html#embed).

## Load the Required Libraries

To use Vega-Lite on your own web page, load the required libraries (D3, Vega, and Vega-Lite). You can optionally load vega-embed to enable the convenient `vg.embed` method.

```html
<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="//vega.github.io/vega/vega.js" charset="utf-8"></script>
<script src="//vega.github.io/vega-lite/vega-lite.js" charset="utf-8"></script>
<script src="//vega.github.io/vega-editor/vendor/vega-embed.js" charset="utf-8"></script>
```

You can also download Vega-Lite: [vega-lite.min.js]({{site.baseurl}}/vega-lite.min.js).

Then, create an HTML element that the visualization should be attached to.

```html
<div id="vis"></div>
```

## Render the Visualization

You can either use the convenient `vg.embed` method or call `vl.compile` and `vg.parse` separately.

### Embed Vega Web Components with vega-embed

Directly add the visualization to the element you created with [vega-embed](https://github.com/vega/vega-embed).

```js
var embedSpec = {
  mode: "vega-lite",
  spec: vlSpec
}
vg.embed(embedSpec, function(chart) {
  chart({el:"#vis"}).update();
});
```

Vega-embed automatically adds links to export an image, view the source, and open the specification in the online editor. These links can be individually disabled. For more information, read the [documentation in the vega wiki](https://github.com/vega/vega/wiki/Embed-Vega-Web-Components).

### Call Vega-Lite and Vega separately

To compile a Vega-Lite specification to Vega, call `vl.compile`.

```js
var vgSpec = vl.compile(vlSpec).spec;
```

Then render the Vega specification with the [Vega runtime](https://github.com/vega/vega/wiki/Runtime).

```js
vg.parse.spec(vgSpec, function(chart) {
  chart({el:"#vis"}).update();
});
```
