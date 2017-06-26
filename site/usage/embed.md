---
layout: usage
menu: usage
title: Embedding Vega-Lite
permalink: /usage/embed.html
---

*Fork our [Vega-Lite Block](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9) if you want to quickly publish a Vega-Lite visualization on the web.*

The easiest way to use Vega-Lite on your own web page is with [Vega-Embed](https://github.com/vega/vega-embed), a library we built to make the process as painless as possible.

To embed a Vega-Lite specification on your web page first load the required libraries (Vega, Vega-Lite, **Vega-Embed**).

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega/{{ site.data.versions.vega }}/vega.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega-lite/{{ site.data.versions.vega-lite }}/vega-lite.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega-embed/{{ site.data.versions.vega-embed }}/vega-embed.js"></script>
```

We suggest that you use npm to install the libraries([Vega](https://www.npmjs.com/package/vega), [Vega-Lite](https://www.npmjs.com/package/vega-lite), and [Vega-Embed](https://www.npmjs.com/package/vega-embed)) to get the latest stable version. To install with npm, simply install it as you would any other npm module.

```sh
npm install vega
npm install vega-lite
npm install vega-embed
```

Alternatively, you can [download the latest Vega-Lite release](https://github.com/vega/vega-lite/releases/latest) and add it to your project manually.  In this case, you will also have to download [Vega](https://github.com/vega/vega/releases/latest), and [Vega-Embed](https://github.com/vega/vega-embed/releases/latest).

The next step is to create a DOM element that the visualization will be attached to.

```html
<div id="vis"></div>
```

Then use Vega-Embed's provided function to embed your spec.

```js
// More argument info at https://github.com/vega/vega-embed
vega.embed("#vis", yourVlSpec);
```

Vega-Embed automatically adds links to export an image, view the source, and open the specification in the online editor. These links can be individually disabled. For more information, read the [Vega-Embed documentation](https://github.com/vega/vega-embed).

Here is the fianl html file in the easiest way to embed Vega-Lite:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Embedding Vega-Lite</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vega/{{ site.data.versions.vega }}/vega.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vega-lite/{{ site.data.versions.vega-lite }}/vega-lite.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vega-embed/{{ site.data.versions.vega-embed }}/vega-embed.js"></script>
</head>
<body>

  <div id="vis"></div>

  <script type="text/javascript">
    var yourVlSpec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v2.0.json",
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
    vega.embed("#vis", yourVlSpec);
  </script>
</body>
</html>
```
