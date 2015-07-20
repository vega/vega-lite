# Vega-lite

[![Build Status](https://travis-ci.org/uwdata/vega-lite.svg)](https://travis-ci.org/uwdata/vega-lite)
[![npm dependencies](https://david-dm.org/uwdata/vega-lite.svg)](https://www.npmjs.com/package/vega-lite)
[![npm version](https://img.shields.io/npm/v/vega-lite.svg)](https://www.npmjs.com/package/vega-lite)
[![Coverage Status](https://coveralls.io/repos/uwdata/vega-lite/badge.svg)](https://coveralls.io/r/uwdata/vega-lite)

**Vega-lite is work in progress and we are working on improving the code and documentation.**

Provides a higher-level grammar for visual analysis, comparable to ggplot or Tableau, that generates complete [Vega](https://vega.github.io/) specifications.

Vega-lite specifications consist of simple mappings of variables in a data set to visual encoding channels such as position (`x`,`y`), `size`, `color` and `shape`. These mappings are then translated into full visualization specifications using the Vega visualization grammar. These resulting visualizations can then be exported or further modified to customize the display.

Use Vega-lite in the [online editor](https://uwdata.github.io/vega-lite/).

If you are using Vega-lite for your project(s), please let us know by emailing us at [Vega-lite \[at\] cs.washington.edu](mailto:vega-lite@cs.washington.edu).  Feedbacks are also welcomed.
If you find a bug or have a feature request, please [create an issue](https://github.com/uwdata/vega-lite/issues/new).

The complete schema for specifications as [JSON schema](http://json-schema.org/) is at [spec.json](https://uwdata.github.io/vega-lite/spec.json).

## Example specification

We have more example visualizations in our [gallery](https://uwdata.github.io/vega-lite/gallery.html).

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
      {"x":"A", "y":28}, {"x":"B", "y":55}, {"x":"C", "y":43},
      {"x":"D", "y":91}, {"x":"E", "y":81}, {"x":"F", "y":53},
      {"x":"G", "y":19}, {"x":"H", "y":87}, {"x":"I", "y":52}
    ]
  },
  "marktype": "bar",
  "encoding": {
    "y": {"type": "Q","name": "y"},
    "x": {"type": "O","name": "x"}
  }
}
```

## Setup Instructions

Make sure you have node.js. (We recommend using [homebrew](http://brew.sh) and simply run `brew install node`.)

Install gulp  globally by running

```sh
npm install -g gulp
```

Then install all the npm dependencies:

```sh
npm install
```

You can run `gulp` to compile vega-lite or run `gulp serve` to open the live vega-lite editor.

### Developing Vega-lite and Datalib

Vega-lite depends on [Datalib](https://github.com/uwdata/datalib).
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

