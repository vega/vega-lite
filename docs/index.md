---
layout: docs
title: Documentation
permalink: /docs/index.html
---

Vega-Lite provides a higher-level grammar for visual analysis, akin to ggplot or Tableau, that generates complete [Vega](https://vega.github.io/) specifications.

Vega-Lite specifications consist of simple mappings of variables in a data set to visual encoding channels such as position (`x`,`y`), `size`, `color` and `shape`. These mappings are then translated into detailed visualization specifications in the form of Vega specification language.  Vega-Lite produces default values for visualization components (e.g., scales, axes, and legends) in the output Vega specification using a rule-based approach, but users can explicit specify these properties to override default values.  
This documentation outlines the syntax of Vega-Lite specification, and how to embed Vega-Lite visualizations in your applications.

## Vega-Lite Specification

A Vega-Lite specification is a JSON object that describes data source (`data`),
a mark type (`mark`), key-value visual encodings of data variables (`encoding`),
and data transformations.

Vega-Lite assumes a tabular data model: each data source is a set of records,
where each record has values for the same set of variables.

In the current version, Vega-Lite specification is a JSON object
that contains the following top-level properties:

| Property             | Type          | Description    |
| :------------        |:-------------:| :------------- |
| [data](data.html)    | Object        | An object describing data source |
| [mark](mark.html)| String        | The mark type.  Currently Vega-Lite supports `bar`, `line`, `area`, `point`, and `text` (text table). |
| [encoding](encoding.html)| Object        | key-value mapping between encoding channels and encoding object |
| [config](config.html)   | Object        | Configuration object. |

## Using Vega-Lite

### Inline Data

Here is the bare minimum html file to get Vega-Lite with inline values working in a webpage.
Basically, Vega-Lite compiles a Vega-Lite specification into a Vega
specification and use Vega Runtime to display visualizations.

```html
<!DOCTYPE html>
<meta charset="utf-8">

<script src="../lib/d3.min.js"></script>
<script src="../lib/vega.js"></script>
<script src="../lib/vega-lite.js"></script>

<div id="vis"></div>

<script>

var vlSpec = {
      "data": {
        "values": [
          {"a":"A", "b":28}, {"a":"B", "b":55}, {"a":"C", "b":43},
          {"a":"D", "b":91}, {"a":"E", "b":81}, {"a":"F", "b":53},
          {"a":"G", "b":19}, {"a":"H", "b":87}, {"a":"I", "b":52}
        ]
      },
      "mark": "bar",
      "encoding": {
        "x": {"type": "ordinal","field": "a"},
        "y": {"type": "quantitative","field": "b"}
      }
    };

var vgSpec = vl.compile(vlSpec).spec;
vg.parse.spec(vgSpec, function(chart) {
  chart({el:"#vis"}).update(); });

</script>
```


### Data from URL

Here is the bare minimum html file to get Vega-Lite with data from url working in a webpage.

```html
<!DOCTYPE html>
<meta charset="utf-8">

<script src="../lib/d3.min.js"></script>
<script src="../lib/vega.js"></script>
<script src="../lib/vega-lite.js"></script>

<div id="vis"></div>

<script>

var vlSpec = {
      "data": {"url": "data/cars.json"},
      "mark": "point",
      "encoding": {
        "x": {"type": "ordinal","field": "Origin"},
        "y": {"type": "quantitative","field": "Acceleration"}
      }
    };
var vgSpec = vl.compile(vlSpec).spec;

vg.parse.spec(vgSpec, function(chart) {
  var view = chart({el: '#vis', renderer: 'svg'});
  view.update();
});
</script>
```


__Pending Revision__:
Vega-Lite Compile API is under revision.  A better tutorial is coming soon.
