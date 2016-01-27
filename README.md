# Vega-Lite

[![Build Status](https://travis-ci.org/vega/vega-lite.svg)](https://travis-ci.org/vega/vega-lite)
[![npm dependencies](https://david-dm.org/vega/vega-lite.svg)](https://www.npmjs.com/package/vega-lite)
[![npm version](https://img.shields.io/npm/v/vega-lite.svg)](https://www.npmjs.com/package/vega-lite)

Vega-Lite provides a higher-level grammar for visual analysis, akin to ggplot or Tableau, that generates complete [Vega](https://vega.github.io/) specifications.

Vega-Lite specifications consist of simple mappings of variables in a data set to visual encoding channels such as position (`x`,`y`), `size`, `color` and `shape`. These mappings are then translated into detailed visualization specifications in the form of Vega specification language.  Vega-Lite produces default values for visualization components (e.g., scales, axes, and legends) in the output Vega specification using a rule-based approach, but users can explicit specify these properties to override default values.  

__Try using Vega-Lite in the online [Vega Editor](http://vega.github.io/vega-editor/?mode=vega-lite)__.

The language and API are described in the [documentation](https://vega.github.io/vega-lite/docs/). The complete schema for specifications as [JSON schema](http://json-schema.org/) is at [vega-lite-schema.json](https://vega.github.io/vega-lite/vega-lite-schema.json).

Feel free to ask questions about Vega-Lite in the [Vega Discussion Group / Mailing List](https://groups.google.com/forum/?fromgroups#!forum/vega-js).

Contributions are also welcomed.  Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for contribution and development guidelines.

## Example specification: A simple bar chart

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

We have more example visualizations in our [gallery](https://vega.github.io/vega-lite/gallery.html), the [documentation](https://vega.github.io/vega-lite/docs/index.html), and the [online editor](https://vega.github.io/vega-editor/?mode=vega-lite&spec=trellis_barley).
