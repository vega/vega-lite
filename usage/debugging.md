---
layout: usage
menu: usage
title: Debugging Guide
permalink: /usage/debugging.html
---

## Validate the Schema

The first step to debugging a problem with Vega-Lite is to make sure that the specification is valid. The [Vega Editor](https://vega.github.io/editor/) shows warnings if the schema has a valid `$schema` reference and the specification is not valid according to the schema for the version specified in the `$schema`. Make sure that you are using the version that is provided by the editor if you see inconsistent behavior.

## Debug Vega Runtime

Vega-Lite specifications compile to Vega and are executed by the Vega runtime. This means that at runtime there is no difference between a chart that comes from a Vega-Lite specification and a chart that comes from the compiled Vega specification. Therefore, to debug runtime behavior, you have to understand the behavior of the Vega runtime. Follow the [debugging guide in the Vega documentation](https://vega.github.io/vega/docs/api/debugging/) to debug the Vega runtime.

## Step Through the Execution

When debugging Vega and Vega-Lite in the browser, it can be useful to step through the execution in the [Firefox](https://developer.mozilla.org/en-US/docs/Tools), [Chrome](https://developers.google.com/web/tools/chrome-devtools), or [Safari](https://developer.apple.com/safari/tools/) developer tools.

You can even debug minified JavaScript sources since Vega and Vega-Lite provide [source maps](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map). However, sometimes it can be useful to use non-minified sources, which you can load from the jsDelivr CDN.

For example, to use non-minified sources with Vega-Embed, load the following scripts.

```html
<script src="https://cdn.jsdelivr.net/npm/vega@{{ site.data.versions.vega }}/build/vega.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@{{ site.data.versions.vega-lite }}/build/vega-lite.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@{{ site.data.versions.vega-embed }}/build/vega-embed.js"></script>
```

## Logging Warnings

The Vega Editor automatically collects and displays logs. If you are debugging your own application and see strange behavior, [look at the logs](compile#logging) from Vega-Lite.
