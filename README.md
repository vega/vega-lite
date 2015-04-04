# Vegalite

Provides a higher-level grammar for visual analysis, comparable to ggplot or Tableau, that generates complete Vega specifications.

Vegalite specifications consist of simple mappings of variables in a data set to visual encoding channels such as position (`x`,`y`), `size`, `color` and `shape`. These mappings are then translated into full visualization specifications using the Vega visualization grammar. These resulting visualizations can then be exported or further modified to customize the display.

The complete schema for specifications as [JSON schema](http://json-schema.org/) is at [spec.json](https://uwdata.github.io/vegalite/spec.json).

## Example specification

```json
{
  "marktype": "point",
  "enc": {
    "x": {"type": "Q","name": "yield","aggr": "avg"},
    "y": {
      "sort": [{"name": "yield","aggr": "avg","reverse": false}],
      "type": "O",
      "name": "variety"
    },
    "row": {"type": "O","name": "site"},
    "color": {"type": "O","name": "year"}
  },
  "cfg": {"dataUrl": "data/barley.json"}
}
```

## Deployment

```sh
gitsha=$(git rev-parse HEAD)
git add vegalite* -f
git add spec.json -f
git commit -am "release $gitsha"
```
