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

This is a similar chart as one of the Vega examples in https://github.com/vega/vega/wiki/Tutorial. See how much simpler it is.

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

### Contributing

Please refer to CONTRIBUTE.md if you would like to contribute to Vega-Lite.
