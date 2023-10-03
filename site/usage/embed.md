---
layout: usage
menu: usage
title: Embedding Vega-Lite
permalink: /usage/embed.html
---

_Fork our [Vega-Lite Block](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9) if you want to quickly publish a Vega-Lite visualization on the web._

The easiest way to use Vega-Lite on your own web page is with [Vega-Embed](https://github.com/vega/vega-embed), a library we built to make the process as painless as possible.

## Get Vega-Lite and other dependencies

To embed a Vega-Lite specification on your web page first load the required libraries. You can get Vega, Vega-Lite, and Vega-Embed via a CDN, NPM, or manually download them.

### CDN

For production deployments you will likely want to serve your own files or use a [content delivery network (CDN)](https://en.wikipedia.org/wiki/Content_delivery_network). Vega-Lite releases are hosted on [jsDelivr](https://www.jsdelivr.com/package/npm/vega-lite):

```html
<script src="https://cdn.jsdelivr.net/npm/vega@{{ site.data.versions.vega }}"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@{{ site.data.versions.vega-lite }}"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@{{ site.data.versions.vega-embed }}"></script>
```

If you want to automatically use the latest versions of Vega-Lite, Vega, and Vega-Embed, you can specify only the major version.

```html
<script src="https://cdn.jsdelivr.net/npm/vega@{{ site.data.versions.vega | slice: 0 }}"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@{{ site.data.versions.vega-lite | slice: 0 }}"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@{{ site.data.versions.vega-embed | slice: 0 }}"></script>
```

### NPM

If you prefer to host the dependencies yourself, we suggest that you use npm to install the libraries ([Vega](https://www.npmjs.com/package/vega), [Vega-Lite](https://www.npmjs.com/package/vega-lite), and [Vega-Embed](https://www.npmjs.com/package/vega-embed)) to get the latest stable version. To install with npm, simply install it as you would any other npm module.

```sh
npm install vega
npm install vega-lite
npm install vega-embed
```

You can learn more about NPM on the [official website](https://docs.npmjs.com/getting-started/what-is-npm).

### Download

Alternatively, you can [download the latest Vega-Lite release](https://github.com/vega/vega-lite/releases/latest) and add it to your project manually. In this case, you will also have to download [Vega](https://github.com/vega/vega/releases/latest), and [Vega-Embed](https://github.com/vega/vega-embed/releases/latest).

## Start using Vega-Lite with Vega-Embed

The next step after getting the libraries is to create a DOM element that the visualization will be attached to.

```html
<div id="vis"></div>
```

Then use Vega-Embed's provided function to embed your spec.

```js
// More argument info at https://github.com/vega/vega-embed
vegaEmbed('#vis', yourVlSpec);
```

Vega-Embed automatically adds links to export an image, view the source, and open the specification in the online editor. These links can be individually disabled. For more information, read the [Vega-Embed documentation](https://github.com/vega/vega-embed).

Here is the final HTML file in the easiest way to embed Vega-Lite (assuming that you use the [CDN approach](#cdn) from above). See the [output in your browser]({{site.baseurl}}/demo.html).

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Embedding Vega-Lite</title>
    <script src="https://cdn.jsdelivr.net/npm/vega@{{ site.data.versions.vega }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-lite@{{ site.data.versions.vega-lite }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-embed@{{ site.data.versions.vega-embed }}"></script>
  </head>
  <body>
    <div id="vis"></div>

    <script type="text/javascript">
      var yourVlSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        description: 'A simple bar chart with embedded data.',
        data: {
          values: [
            {a: 'A', b: 28},
            {a: 'B', b: 55},
            {a: 'C', b: 43},
            {a: 'D', b: 91},
            {a: 'E', b: 81},
            {a: 'F', b: 53},
            {a: 'G', b: 19},
            {a: 'H', b: 87},
            {a: 'I', b: 52}
          ]
        },
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'ordinal'},
          y: {field: 'b', type: 'quantitative'}
        }
      };
      vegaEmbed('#vis', yourVlSpec);
    </script>
  </body>
</html>
```
