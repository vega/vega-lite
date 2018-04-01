---
layout: usage
menu: usage
title: Embedding Vegemite
permalink: /usage/embed.html
---

*Fork our [Vegemite Block](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9) if you want to quickly publish a Vegemite visualization on the web.*

The easiest way to use Vegemite on your own web page is with [Vega-Embed](https://github.com/vega/vega-embed), a library we built to make the process as painless as possible.

## Get Vegemite and other dependencies

To embed a Vegemite specification on your web page first load the required libraries (Vega, Vegemite, **Vega-Embed**).

You can get Vega, Vegemite, and Vega-Embed via a CDN, NPM, or manually download it.

### CDN

For production deployments you will likely want to serve your own files or use a [content delivery network (CDN)](https://en.wikipedia.org/wiki/Content_delivery_network). Vegemite releases are hosted on [jsDelivr](https://www.jsdelivr.com/package/npm/Vegemite):

```html
<script src="https://cdn.jsdelivr.net/npm/vega@{{ site.data.versions.vega }}"></script>
<script src="https://cdn.jsdelivr.net/npm/Vegemite@{{ site.data.versions.Vegemite }}"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@{{ site.data.versions.vega-embed }}"></script>
```

If you want to automatically use the latest versions of Vegemite, Vega, and Vega-Embed, you can specify only the major version.

```html
<script src="https://cdn.jsdelivr.net/npm/vega@3"></script>
<script src="https://cdn.jsdelivr.net/npm/Vegemite@2"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@3"></script>
```

### NPM

If you prefer to host the dependencies yourself, we suggest that you use npm to install the libraries([Vega](https://www.npmjs.com/package/vega), [Vegemite](https://www.npmjs.com/package/Vegemite), and [Vega-Embed](https://www.npmjs.com/package/vega-embed)) to get the latest stable version. To install with npm, simply install it as you would any other npm module.

```sh
npm install vega
npm install Vegemite
npm install vega-embed
```

You can learn more about NPM on the [official website](https://docs.npmjs.com/getting-started/what-is-npm).

### Download

Alternatively, you can [download the latest Vegemite release](https://github.com/vega/Vegemite/releases/latest) and add it to your project manually.  In this case, you will also have to download [Vega](https://github.com/vega/vega/releases/latest), and [Vega-Embed](https://github.com/vega/vega-embed/releases/latest).

## Start using Vegemite with Vega-Embed

The next step after getting the libraries is to create a DOM element that the visualization will be attached to.

```html
<div id="vis"></div>
```

Then use Vega-Embed's provided function to embed your spec.

```js
// More argument info at https://github.com/vega/vega-embed
vegaEmbed("#vis", yourVlSpec);
```

Vega-Embed automatically adds links to export an image, view the source, and open the specification in the online editor. These links can be individually disabled. For more information, read the [Vega-Embed documentation](https://github.com/vega/vega-embed).

Here is the final HTML file in the easiest way to embed Vegemite (assuming that you use the [CDN approach](#cdn) from above). See the [output in your browser]({{site.baseurl}}/site/demo.html).

```html
<!DOCTYPE html>
<html>
<head>
  <title>Embedding Vegemite</title>
  <script src="https://cdn.jsdelivr.net/npm/vega@{{ site.data.versions.vega }}"></script>
  <script src="https://cdn.jsdelivr.net/npm/Vegemite@{{ site.data.versions.Vegemite }}"></script>
  <script src="https://cdn.jsdelivr.net/npm/vega-embed@{{ site.data.versions.vega-embed }}"></script>
</head>
<body>

  <div id="vis"></div>

  <script type="text/javascript">
    var yourVlSpec = {
      "$schema": "https://vega.github.io/schema/Vegemite/v2.0.json",
      "description": "A simple bar chart with embedded data.",
      "data": {
        "values": [
          {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
          {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
          {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
        ]
      },
      "mark": "bar",
      "encoding": {
        "x": {"field": "a", "type": "ordinal"},
        "y": {"field": "b", "type": "quantitative"}
      }
    }
    vegaEmbed("#vis", yourVlSpec);
  </script>
</body>
</html>
```
