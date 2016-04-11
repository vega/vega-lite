---
layout: usage
menu: usage
title: Compiling Vega-Lite
permalink: /usage/compile.html
---

If you would rather hand compile your Vega-Lite specifications into Vega, you can use Vega-Lite's provided `vl.compile` function.

First, load the required libraries (D3, Vega, Vega-Lite).

```html
<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="//vega.github.io/vega/vega.js" charset="utf-8"></script>
<script src="//vega.github.io/vega-lite/vega-lite.js" charset="utf-8"></script>
```

We suggest that you install Vega-Lite with [npm](https://www.npmjs.com/package/vega-lite) to get the latest stable version. To install Vega-Lite with npm, simply install it as you would any other npm module.

```sh
npm install vega-lite
```

Alternatively you can [download the latest Vega-Lite release](https://github.com/vega/vega-lite/releases/latest) and add it to your project manually.

Then, create an HTML element that the visualization should be attached to.

```html
<div id="vis"></div>
```

To actually compile the spec, use `vl.compile`

```js
var vgSpec = vl.compile(vlSpec).spec;
```

You can then continue to use the [Vega runtime](https://github.com/vega/vega/wiki/Runtime)'s `vg.parse.spec` method to render your Vega spec.

```js
vg.parse.spec(vgSpec, function(chart) {
  chart({el:"#vis"}).update();
});
```
