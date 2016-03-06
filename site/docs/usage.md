---
layout: docs
menu: docs
title: Usage Instructions
permalink: /docs/usage.html
---

The Vega-Lite specification can be compiled using a multitude of tools that make it easy to compile and embed in your web page/

This document assumes that you have a Vega-Lite specification as a JSON object in a variable called `vlSpec`. You can find an example specification in our [getting started tutorial]({{site.baseurl}}/tutorials/getting_started.html#embed).

* TOC
{:toc}

## Embedding Vega-Lite
To embed a Vega-Lite specification on your web page first load the required libraries (D3, Vega, Vega-Lite).

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

From here, there are two ways to link your spec to the HTML element:
1. Using Vega-Embed (suggested)
2. Manually compiling your specs and linking with Vega

### Using Vega-Embed (suggested)
The easiest way to use Vega-Lite on your own web page is with [vega-embed](https://github.com/vega/vega-embed), a library we built to make the process as painless as possible.

Simply import vega-embed in your HTML.

```html
<script src="//vega.github.io/vega-editor/vendor/vega-embed.js" charset="utf-8"></script>
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


### Manually Compiling Vega-Lite and Vega
If you don't want to utilize Vega-Embed and would rather hand compile your Vega-Lite specifications into Vega, you can use the provided vl.compile function.

```js
var vgSpec = vl.compile(vlSpec).spec;
```

You can then continue to use the [Vega runtime](https://github.com/vega/vega/wiki/Runtime)'s `vg.parse.spec` method to render your Vega spec.

```js
vg.parse.spec(vgSpec, function(chart) {
  chart({el:"#vis"}).update();
});
```


## Compiling Vega-Lite from the Command Line
If you want to compile your Vega-Lite specs from the command line, we provide a [set of scripts](https://github.com/vega/vega-lite/tree/master/bin) which make it easy to go from Vega-Lite to Vega, SVG, or PNG. These scripts are `vl2vg`, `vl2svg`, and `vl2png` respectively.

Each script simply accepts your Vega-Lite specification as its first argument

```sh
vl2svg vlSpec
```

## Using 3rd Party Tools
Other people have built tools to compile Vega-Lite that may address some of your use cases.

- Python
  - [Altair](https://github.com/ellisonbg/altair) exposes a Python API for building statistical visualizations that follows Vega-Lite syntax.
- R
  - [vegaliteR](https://github.com/timelyportfolio/vegaliteR)  provides HTML widgets for Vega-Lite in R.
  - [ggplot2 "bindings"](https://github.com/hrbrmstr/vegalite) lets you use ggplot2 bindings to generate Vega-Lite specifications.
