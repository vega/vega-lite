Vega-lite provides a higher-level grammar for visual analysis, comparable to ggplot or Tableau, that generates complete Vega specifications.

Vega-lite specifications consist of simple mappings of variables in a data set to visual encoding channels such as position (x,y), size, color and shape. These mappings are then translated into full visualization specifications using the Vega visualization grammar. These resulting visualizations can then be exported or further modified to customize the display.

This documentation outlines the syntax of Vega-lite specification, and how to
embed Vega-lite visualizations in your applications.

## Vega-lite Specification

A Vega-lite specification is a JSON object that describes a
single data source (`data`), a mark type (`marktype`), key-value
visual encodings of data variables (`encoding`), and data transformations.

Vega-lite assumes a tabular data model: each data source is a set of records,
where each record has values for the same set of variables.

In the current version, Vega-lite specification<sup>1</sup> is a JSON object
that contains the following top-level properties:

| Property             | Type          | Description    |
| :------------        |:-------------:| :------------- |
| [data](Data)         | Object        | An object describing data source |
| marktype             | String        | The mark type.  Currently Vega-lite supports `bar`, `line`, `area`, `point`, and `text` (text table). |
| [encoding](Encoding Mapping)| Object        | key-value mapping between encoding channels and encoding object |
| config   | Object        | Configuration object.  (__Documentation Coming Soon__ -- for now please see [config json schema in schema.js](https://github.com/uwdata/vega-lite/blob/master/src/schema/schema.js#L573)) |

<sup>1</sup>
Vega-lite is currently an alpha software.  The specification syntax is subject
to change and will become more stable once we reach 1.0. See our  [[Roadmap]]
page for our development plan.  We also note in this documentation that are
likely to change are annotated with  __"Pending Revision"__ notes.

## Using Vega-lite

Here is the bare minimum html file to get vega-lite working in a webpage.
Basically, Vega-lite compiles a Vega-lite specification into a Vega
specification and use Vega Runtime to display visualizations.

```html
<!DOCTYPE html>
<meta charset="utf-8">

<script src="../lib/d3.min.js"></script>
<script src="../lib/vega1.5.js"></script>
<script src="../lib/vega-lite.js"></script>

<div id="vis"></div>

<script>

function parse(spec) {
  vg.parse.spec(spec, function(chart) {
    chart({el:"#vis"}).update(); });
}

var vlspec = {
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
    };

var vgspec = vl.compile(vlspec);
parse(vgspec);

</script>
```

__Pending Revision__:
Vega-lite Compile API is under revision.  A better tutorial is coming soon.