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

Vega-Lite's optional top-level `data` property describes the visualization's data source as part of the specification, which can be either [inline data](#inline) (`values`) or [a URL from which to load the data](#url) (`url`).  Alternatively, if the `data` property is not specified, the data source can be [bound at runtime](https://github.com/vega/vega/wiki/Runtime).

Here is a list of all properties describing `data` source:

{% include table.html props="url,format" source="UrlData" %}

{:#inline}
## Inline Data

Inline Data can be specified using `values` property.

{% include table.html props="values,format" source="InlineData" %}

For example, the following specification embeds an inline data table with two rows and two columns (`a` and `b`).

<span class="vl-example" data-name="bar"></span>

{:#url}
## Data from URL

Data can be loaded from a URL using the `url` property. In addition, the format of the input data can be specified using the `formatType` property. By default Vega-Lite will infer the type from the file extension.

{% include table.html props="feature,mesh,parse,property,type" source="DataUrlFormat" %}

For example, the following specification loads data from a relative `url`: `data/cars.json`. Note that the format type is implicitly json by default.

<span class="vl-example" data-name="scatter"></span>

## Format

The format object has the following properties:

{% include table.html props="type,parse,property,feature,mesh" source="DataUrlFormat" %}

-----
