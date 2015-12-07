# Vega-Lite

[![Build Status](https://travis-ci.org/vega/vega-lite.svg)](https://travis-ci.org/vega/vega-lite)
[![npm dependencies](https://david-dm.org/vega/vega-lite.svg)](https://www.npmjs.com/package/vega-lite)
[![npm version](https://img.shields.io/npm/v/vega-lite.svg)](https://www.npmjs.com/package/vega-lite)

Vega-Lite provides a higher-level grammar for visual analysis, akin to ggplot or Tableau, that generates complete [Vega](https://vega.github.io/) specifications.

Vega-Lite specifications consist of simple mappings of variables in a data set to visual encoding channels such as position (`x`,`y`), `size`, `color` and `shape`. These mappings are then translated into detailed visualization specifications in the form of Vega specification language.  Vega-Lite produces default values for visualization components (e.g., scales, axes, and legends) in the output Vega specification using a rule-based approach, but users can explicit specify these properties to override default values.  

__Try using Vega-Lite in the online [Vega Editor](http://vega.github.io/vega-editor/?mode=vega-lite)__.

The complete schema for specifications as [JSON schema](http://json-schema.org/) is at [vega-lite-schema.json](https://vega.github.io/vega-lite/vega-lite-schema.json).

**Note: Vega-Lite is still in alpha phase and we are working on improving the code and [documentation](https://vega.github.io/vega-lite/docs/).
Our syntax might change slightly before we release 1.0.**  See our wiki pages for [the development roadmap](https://github.com/vega/vega-lite/wiki/Roadmap) and [how you can contribute](https://github.com/vega/vega-lite/wiki/Contribute).
If you find a bug or have a feature request, please [create an issue](https://github.com/vega/vega-lite/issues/new).


## Example specification

We have more example visualizations in our [gallery](https://vega.github.io/vega-lite/gallery.html).

### Barleys

```json
{
  "data": {"url": "data/barley.json"},
  "mark": "point",
  "encoding": {
    "x": {"type": "quantitative", "field": "yield","aggregate": "mean"},
    "y": {
      "sort": {"field": "yield", "aggregate": "mean", "reverse": false},
      "type": "ordinal",
      "field": "variety"
    },
    "row": {"type": "ordinal", "field": "site"},
    "color": {"type": "ordinal", "field": "year"}
  }
}
```

### Simple bar chart

This is a similar chart as one of the Vega examples in https://github.com/trifacta/vega/wiki/Tutorial. See how much simpler it is.

```json
{
  "data": {
    "values": [
      {"a":"A", "b":28}, {"a":"B", "b":55}, {"a":"C", "b":43},
      {"a":"D", "b":91}, {"a":"E", "b":81}, {"a":"F", "b":53},
      {"a":"G", "b":19}, {"a":"H", "b":87}, {"a":"I", "b":52}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"type": "ordinal", "field": "a"},
    "y": {"type": "quantitative", "field": "b"}
  }
}
```

## Development Setup

Make sure you have node.js. (For mac users, we recommend using
[homebrew](http://brew.sh) and simply run `brew install node`.)

Then, cd into your local clone of the repository, and install all the npm dependencies:

```sh
cd vega-lite
npm install
```

We use the [atom](atom.io) editor with typescript plug-in. If you don't want to see intermediate files (`.js`, `.js.map`), you can "Hide VCS Ignored Files" in the `tree-view` plugin.

### Commands

This section lists commonly used commands. More commands are available in `npm run`.

#### Build

You can run `npm run build` to compile Vega-Lite and regenerate `vega-lite-schema.json`.

#### Basic Lint & Test

`npm run lint` and `npm run test` run ts-lint and all unit-tests respectively.  These two commands are automatically run by `npm start` and `npm run watch`.

#### Watch tasks

During development, it can be convenient to rebuild automatically or run tests in the background.

You can run `npm run start` to start a watcher task that shows the example gallery.
Whenever any `.ts` file changes, the watcher:
(1) re-compiles Vega-Lite
(2) automatically refreshes the gallery with BrowserSync
(3) lints and runs tests
(4) regenerates the JSON schema (`vega-lite-schema.json`)

If you only want subset of these actions, you can use:

- `npm run watch` to start a watcher task that do all of above except opening and syncing the gallery.

- `npm run watch:test` to start a watcher task that **lints and runs tests** when any `.ts` file changes.

- `npm run watch:build` to start a watcher task that **re-compiles Vega-Lite** when `.ts` files related to VL change.

#### Output diff

We also have commands for observing changes in output Vega spec and output images.

To create baseline Vega output specs from the Vega-Lite specs in `examples/`,
check out the baseline branch (e.g., `git checkout master`) and run `npm x-compile`.
All compiled specs will be in `examples/_original`.

Once you develop some features and would like to diff the compiled specs, run `npm x-diff`.  
This will compile all examples again and output the diff for changed examples in the console.  
All compiled specs will be in `examples/_output`.  For changed examples,
SVG files will be created in `examples/_diff` for comparison.  
You can open those files to inspect visual changes, or run a diff command
(e.g., `diff examples/_diff/area-base.svg examples/_diff/area.svg`).

#### Deployment

`npm run deploy` will publish latest code to npm and bower and also update github pages,
which contains our webpage and documentation.  If you want to update only github pages,
use `npm run deploy:gh`.  

To both of these commands, you will need to [install jq](https://stedolan.github.io/jq/download/)
i.e., running `brew install jq` if you use [homebrew](http://brew.sh) on mac.

### Developing Vega-Lite and Datalib

Vega-Lite depends on [Datalib](https://github.com/vega/datalib).
If you plan to make changes to datalib and test Vega-Lite without publishing / copying compiled datalib all the time, use npm's [link](http://justjs.com/posts/npm-link-developing-your-own-npm-modules-without-tears) function.


```sh
# first link datalib global npm
cd path/to/datalib
npm link
# then link vega-lite to datalib
cd path/to/vega-lite
npm link datalib
```

Now all the changes you make in Datalib are reflected in your Vega-Lite automatically.
