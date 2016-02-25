---
layout: docs
menu: docs
title: Embedding Vega-Lite in a Web Page
permalink: /docs/embed.html
---

This document assumes that you have a Vega-Lite specification as a JSON object in a variable called `vlSpec`. You can find an example specification in our [getting started tutorial](/tutorials/getting_started.html#embed).

## Load the Required Libraries

To use Vega-Lite on your own web page, load the required libraries (D3, Vega, and Vega-Lite). You can optionally load vega-embed to enable the convenient `vg.embed` method.

```html
<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="//vega.github.io/vega/vega.js" charset="utf-8"></script>
<script src="//vega.github.io/vega-lite/vega-lite.js" charset="utf-8"></script>
<script src="//vega.github.io/vega-editor/vendor/vega-embed.js" charset="utf-8"></script>
```

We suggest that you install Vega-Lite with bower or [npm](https://www.npmjs.com/package/vega-lite), to get the latest stable version of Vega-Lite. To install Vega-Lite with npm, runtime

```sh
npm install vega-lite
```

Alternatively you can [download the latest Vega-Lite release](https://github.com/vega/vega-lite/releases/latest) and add it to your project manually.

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
vg.embed("#vis", embedSpec, function(error, result) {
  // Callback receiving the View instance and parsed Vega spec
  // result.view is the View, which resides under the '#vis' element
});
```

Vega-embed automatically adds links to export an image, view the source, and open the specification in the online editor. These links can be individually disabled. For more information, read the [documentation in the vega wiki](https://github.com/vega/vega/wiki/Embed-Vega-Web-Components).

### Call Vega-Lite and Vega separately

To compile a Vega-Lite specification into a Vega specification, call `vl.compile`.

```js
var vgSpec = vl.compile(vlSpec).spec;
```

Then we can render the Vega specification with the [Vega runtime](https://github.com/vega/vega/wiki/Runtime)'s `vg.parse.spec` method.

```js
vg.parse.spec(vgSpec, function(chart) {
  chart({el:"#vis"}).update();
});
```
