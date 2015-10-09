# Vega-lite

[![Build Status](https://travis-ci.org/vega/vega-lite.svg)](https://travis-ci.org/vega/vega-lite)
[![npm dependencies](https://david-dm.org/vega/vega-lite.svg)](https://www.npmjs.com/package/vega-lite)
[![npm version](https://img.shields.io/npm/v/vega-lite.svg)](https://www.npmjs.com/package/vega-lite)
[![Coverage Status](https://coveralls.io/repos/vega/vega-lite/badge.svg)](https://coveralls.io/r/vega/vega-lite)


**Vega-lite is still in alpha phase and we are working on improving the code and [documentation](Documentation).
Note that our syntax might change slightly before we release 1.0.**

Vega-lite provides a higher-level grammar for visual analysis, comparable to ggplot or Tableau, that generates complete [Vega](https://vega.github.io/) specifications.

Vega-lite specifications consist of simple mappings of variables in a data set to visual encoding channels such as position (`x`,`y`), `size`, `color` and `shape`. These mappings are then translated into full visualization specifications using the Vega visualization grammar. These resulting visualizations can then be exported or further modified to customize the display.

If you are using Vega-lite for your project(s), please let us know by emailing us at [Vega-lite \[at\] cs.washington.edu](mailto:vega-lite@cs.washington.edu).  Feedbacks are also welcomed.
If you find a bug or have a feature request, please [create an issue](https://github.com/vega/vega-lite/issues/new).

Use Vega-lite in the [online editor](https://vega.github.io/vega-lite/).

The complete schema for specifications as [JSON schema](http://json-schema.org/) is at [spec.json](https://vega.github.io/vega-lite/spec.json).

## Example specification

We have more example visualizations in our [gallery](https://vega.github.io/vega-lite/gallery.html).

### Barleys

```json
{
  "data": {"url": "data/barley.json"},
  "marktype": "point",
  "encoding": {
    "x": {"type": "Q","name": "yield","aggregate": "avg"},
    "y": {
      "sort": [{"name": "yield","aggregate": "avg","reverse": false}],
      "type": "O",
      "name": "variety"
    },
    "row": {"type": "O","name": "site"},
    "color": {"type": "O","name": "year"}
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
  "marktype": "bar",
  "encoding": {
    "x": {"type": "O","name": "a"},
    "y": {"type": "Q","name": "b"}
  }
}
```

## Setup Instructions

Make sure you have node.js. (We recommend using [homebrew](http://brew.sh) and simply run `brew install node`.)

Then, cd into your local clone of the repository, and install all the npm dependencies:

```sh
cd vega-lite
npm install
```

### Commands

You can run `npm run build` to compile vega-lite or run `npm start` to open the live vega-lite editor.

You can `npm run watch` to start a watcher task that regenerate the `spec.json` file whenever `schema.js` changes, and lints and tests all JS files when any `.js` file in `test/` or `src/` changes.

Note: These commands use [Gulp](http://gulpjs.com) internally; to run them directly (instead of through the `npm run` aliases), install gulp globally with
```sh
npm install -g gulp
```

### Developing Vega-lite and Datalib

Vega-lite depends on [Datalib](https://github.com/vega/datalib).
If you plan to make changes to datalib and test Vega-lite without publishing / copying compiled datalib all the time, use npm's [link](http://justjs.com/posts/npm-link-developing-your-own-npm-modules-without-tears) function.


```
# first link datalib global npm
cd path/to/datalib
npm link
# then link vega-lite to datalib
cd path/to/vega-lite
npm link datalib
```

Now all the changes you make in Datalib are reflected in your Vega-lite automatically.

