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

Vega-Lite's optional top-level `data` property describes the visualization's data source as part of the specification, which can be either [inline data](#inline) (`values`) or [a URL from which to load the data](#url) (`url`).   Alternatively, if the `data` property is not specified, the data source can be [bound at runtime](#runtime).

Here is a list of all properties describing `data` source:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [values](#inline-data) | Array         | Array of object that maps field names to their values. |
| [url](#data-from-url) | String         | A URL from which to load the data set. Use the _formatType_ property to ensure the loaded data is correctly parsed. |
| [formatType](#data-from-url) | String  | Type of input data: `"json"`, `"csv"`, `"tsv"`.  The default format type is determined by the extension of the file url.  If no extension is detected, `"json"` will be used by default.  |

{:#inline}
## Inline Data

Inline Data can be specified using `values` property.
For example, the following specification embeds an inline data table with two rows and two columns (`a` and `b`).

<span class="vl-example" data-name="bar"></span>

{:#url}
## Data from URL

Data can be specified from url using the `url` property.  In addition, format of the input data can be optionally specified using `formatType` property.

For example, the following specification loads data from a relative `url`: `data/cars.json`.  Note that the format type is implicitly json by default.

<span class="vl-example" data-name="scatter"></span>

<!---

{:#runtime}
## Binding Data at Run-time

__TODO: Example__
---->
