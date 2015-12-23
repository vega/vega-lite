# vega-embed

The [vega-embed](http://github.com/vega/vega-embed) module provides advanced support for embedding interactive Vega views into web pages. The primary features include:

- Load Vega specs from source text, parsed JSON, or URLs.
- Add action links such as "View Source" and "Open in Vega Editor".
- Parameterize visualizations with auto-generated dynamic query widgets.

This last feature provides a powerful and convenient way to interact with a visualization by adding interactive widgets such as sliders, text fields, dropdown menus, and radio boxes. For Vega specifications without interactive signals defined, vega-embed provides _rewriting rules_ for injecting interactivity into an existing spec.

For more, see the [documentation on the Vega wiki](http://github.com/vega/vega/wiki/Embed-Vega-Web-Components).

For examples of vega-embed in action, take a look at the "Parameterized" specs in the [Vega Editor](http://vega.github.io/vega-editor), including the [interactive job voyager](http://vega.github.io/vega-editor/?spec=jobs-params) and [configurable force layout](http://vega.github.io/vega-editor/?spec=force-params).

## Build Process

To build `vega-embed.js` and view the test examples, you must have [npm](https://www.npmjs.com/) installed.

1. Run `npm install` in the vega-embed folder to install dependencies.
2. Run `npm run build`. This will invoke [browserify](http://browserify.org/) to bundle the source files into vega-embed.js, and then [uglify-js](http://lisperator.net/uglifyjs/) to create the minified vega-embed.min.js.
3. Run a local webserver (e.g., `python -m SimpleHTTPServer 8000`) in the vega-embed folder and then point your web browser at the test directory (e.g., `http://localhost:8000/test/`).
