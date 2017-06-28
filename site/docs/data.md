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

Vega-Lite's `data` property describes the visualization's data source as part of the specification, which can be either [inline data](#inline) (`values`) or [a URL from which to load the data](#url) (`url`).  Alternatively, we can create an empty, [named data source](#named) (`name`), which can be [bound at runtime](https://vega.github.io/vega/docs/api/view/#data).

* TOC
{:toc}

## Types of Data Sources

{:#inline}
### Inline Data

Inline Data can be specified using `values` property.
Here is a list of all properties describing an line `data` source:

{% include table.html props="values,format" source="InlineData" %}

For example, the following specification embeds an inline data table with nine rows and two columns (`a` and `b`).

<span class="vl-example" data-name="bar"></span>

{:#url}
### Data from URL

Data can be loaded from a URL using the `url` property. In addition, the format of the input data can be specified using the `formatType` property. By default Vega-Lite will infer the type from the file extension.

Here is a list of all properties describing a `data` source from URL:

{% include table.html props="url,format" source="UrlData" %}

For example, the following specification loads data from a relative `url`: `data/cars.json`. Note that the format type is implicitly json by default.

<span class="vl-example" data-name="scatter"></span>

{:#named}
### Named Data Sources

Data can also be added at runtime through the [Vega View API](https://vega.github.io/vega/docs/api/view/#data).
Data sources are referenced by name, which is specified in Vega-Lite with `name`.

Here is a list of all properties describing a named `data` source:

{% include table.html props="name,format" source="NamedData" %}

For example, to create a data source named `myData`, use the following data

{: .suppress-error}
```json
{
    "name": "myData"
}
```

## Format

The format object has the following properties:

{% include table.html props="type,parse,property,feature,mesh" source="DataUrlFormat" %}

**TODO: Please help split the table above into sections like in https://vega.github.io/vega/docs/data/**
