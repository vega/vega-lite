---
layout: usage
menu: usage
title: Embedding Vega-Lite with vega-element
permalink: /usage/webcomponent.html
---

[Web components]((https://www.webcomponents.org/introduction) are a set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps.

[`vega-element`](https://www.webcomponents.org/element/PolymerVis/vega-element) is a Polymer webcomponent that can be used to embed vega or vega-lite visualization using custom HTML tags.

**Quick start**
The simplest usage case is to just embed a vega-lite visualization.
```html
<!-- import vega-element webcomponent from CDN (not for production use!!) -->
<link rel="import" href="https://rawgit.com/PolymerVis/vega-element/polymer2/vega-element-cdn.html">
<!-- import vega-tooltip (required only if using vega-tooltip plugin)-->
<link rel="import" href="https://rawgit.com/PolymerVis/vega-element/polymer2/vega-tooltip.html">

<!--
hover flag enables hover event processing
tooltip flag enables vega-tooltip plugin
-->
<vega-element hover tooltip vega-lite-spec-url="vl-spec.json"></vega-element>
```

Export SVG or PNG
```html
<!-- import vega-element webcomponent from CDN (not for production use!!) -->
<link rel="import" href="https://rawgit.com/PolymerVis/vega-element/polymer2/vega-element-cdn.html">

<!-- do not render anything when headless flag is set -->
<vega-element id="chart" headless vega-lite-spec-url="vl-spec.json"></vega-element>

<!-- buttons to trigger download -->
<button onclick="javascript:download('svg')">export SVG</button>
<button onclick="javascript:download('png')">export PNG</button>
```
```javascript
function download(type) {
  documentation.querySelector('#chart').downloadImage(type);
}
```

vega signals and data can be also be reactively updated using `vega-signal`, `vega-data`, and `vega-data-stream` webcomponents. More examples and full documentation on `vega-element` can be found @
[`here`](https://www.webcomponents.org/element/PolymerVis/vega-element)

**Blocks examples**
[Basic demo](https://bl.ocks.org/eterna2/65dacb480846bf08f645033b607b1e93)
[Reactive update of signal from 1 vega vis to another vega vis](https://bl.ocks.org/eterna2/77329460e8e405b701699863ac2ce6e3)
[Reactive update of data](http://bl.ocks.org/eterna2/d0d0c4593b8306926161571814859055)
