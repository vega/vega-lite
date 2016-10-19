---
layout: docs
menu: docs
title: Data
permalink: /docs/data.html
---

Akin to [Vega](https://www.github.com/vega/vega)'s [data model](https://www.github.com/vega/vega/wiki/Data), the basic data model used by Vega-Lite is *tabular* data, similar to a spreadsheet or a database table. Individual data sets are assumed to contain a collection of records, which may contain any number of named data fields.

{: .suppress-error}
```json
{
  "data": ... ,       // data
  "mark": ... ,
  "encoding": ... ,
  ...
}
```

Vega-Lite's optional top-level `data` property describes the visualization's data source as part of the specification, which can be either [inline data](#inline) (`values`) or [a URL from which to load the data](#url) (`url`).  Alternatively, if the `data` property is not specified, the data source can be [bound at runtime](#runtime).

Here is a list of all properties describing `data` source:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [values](#inline-data) | Array         | Array of object that maps field names to their values. |
| [url](#data-from-url) | String         | A URL from which to load the data set. Use the `format.type` property to ensure the loaded data is correctly parsed. |
| [format](#format)     | Object         | Type of input data: `"json"`, `"csv"`, `"tsv"`. The default format type is determined by the extension of the file url. If no extension is detected, `"json"` will be used by default. |

{:#inline}
## Inline Data

Inline Data can be specified using `values` property.
For example, the following specification embeds an inline data table with two rows and two columns (`a` and `b`).

<span class="vl-example" data-name="bar"></span>

{:#url}
## Data from URL

Data can be specified from url using the `url` property. In addition, format of the input data can be optionally specified using `formatType` property.

For example, the following specification loads data from a relative `url`: `data/cars.json`. Note that the format type is implicitly json by default.

<span class="vl-example" data-name="scatter"></span>

## Format

The format object has the following properties:

| Name          | Type          | Description    |
| :------------ |:-------------:| :------------- |
| type          | String        | Type of The currently supported formats are `json` (JavaScript Object Notation), `csv` (comma-separated values), `tsv` (tab-separated values), [`topojson`](https://github.com/mbostock/topojson/wiki). <br/> • For JSON file, Vega-Lite assumes row-oriented data, where each row is an object with named attributes. <br/> • For TSV/CSV, the properties of the loaded JSON object are taken from the values of the first row of the file. <br/> • For TopoJSON, the input file must contain valid TopoJSON data. The TopoJSON input is then converted into a GeoJSON format for use within Vega.  You can also configure `feature` and `mesh` properties for TopoJSON.  |
| parse         | Object | By default, Vega-lite automatically determines how to parse the input data based on encoded and filtered field.  This property provides name-value pairs, where the name is the name of the attribute, and the value is the desired data type (one of `"number"`, `"boolean"` or `"date"`) for customizing data parsing. For example, `"parse": {"modified_on":"date"}` ensures that the `modified_on` value in each row of the input data is parsed as a Date value. (See Datalib's [`dl.read.types` method](https://github.com/vega/datalib/wiki/Import#dl_read_types) for more information.) This property can be useful for defining data types for fields used in `calculate` or `filter` expression. |
| property      | String        | (JSON only) The JSON property containing the desired data. This parameter can be used when the loaded JSON file may have surrounding structure or meta-data. For example `"property": "values.features"` is equivalent to retrieving `json.values.features` from the loaded JSON object. |
| feature       | String        | (TopoJSON only) The name of the TopoJSON object set to convert to a GeoJSON feature collection. For example, in a map of the world, there may be an object set named `"countries"`. Using the feature property, we can extract this set and generate a GeoJSON feature object for each country. |
| mesh          | String        | (TopoJSON only) The name of the TopoJSON object set to convert to a mesh. Similar to the `feature` option, `mesh` extracts a named TopoJSON object set. Unlike the `feature` option, the corresponding geo data is returned as a single, unified mesh instance, not as individual GeoJSON features. Extracting a mesh is useful for more efficiently drawing borders or other geographic elements that you do not need to associate with specific regions such as individual countries, states or counties. |

-----
