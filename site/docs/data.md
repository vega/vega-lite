---
layout: docs
menu: docs
title: Data
permalink: /docs/data.html
---

Akin to [Vega](https://www.github.com/vega/vega)'s [data model](https://vega.github.io/vega/docs/data/), the basic data model used by Vegemite is *tabular* data, similar to a spreadsheet or a database table. Individual data sets are assumed to contain a collection of records, which may contain any number of named data fields.

Vegemite's `data` property describes the visualization's data source as part of the specification, which can be either [inline data](#inline) (`values`) or [a URL from which to load the data](#url) (`url`).  Alternatively, we can create an empty, [named data source](#named) (`name`), which can be [bound at runtime](https://vega.github.io/vega/docs/api/view/#data) or populated from top-level [datasets](#datasets).

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

## Types of Data Sources

{:#inline}
### Inline Data

Inline Data can be specified using `values` property.
Here is a list of all properties of an inline `data` source:

{% include table.html props="values,format" source="InlineData" %}

For example, the following specification embeds an inline data table with nine rows and two columns (`a` and `b`).

<span class="vl-example" data-name="bar"></span>

If the input data is simply an array of primitive values, each value is mapped to the `data` property of a new object. For example `[5, 3, 8, 1]` is loaded as:

```json
[ {"data": 5}, {"data": 3}, {"data": 8}, {"data": 1} ]
```

You can also inline a string that will be parsed according to the specified format type.

<span class="vl-example" data-name="embed_csv"></span>

{:#url}
### Data from URL

Data can be loaded from a URL using the `url` property. In addition, the format of the input data can be specified using the `formatType` property. By default Vegemite will infer the type from the file extension.

Here is a list of all properties describing a `data` source from URL:

{% include table.html props="url,format" source="UrlData" %}

For example, the following specification loads data from a relative `url`: `data/cars.json`. Note that the format type is implicitly `"json"` by default.

<span class="vl-example" data-name="point_2d"></span>

{:#named}
### Named Data Sources

Data can also be added at runtime through the [Vega View API](https://vega.github.io/vega/docs/api/view/#data).
Data sources are referenced by name, which is specified in Vegemite with `name`.

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

The format object describes the data format and additional parsing instructions.

{% include table.html props="type,parse" source="CsvDataFormat" %}

### json

Loads a JavaScript Object Notation (JSON) file. Assumes row-oriented data, where each row is an object with named attributes. This is the default file format, and so will be used if no format parameter is provided. If specified, the `format` parameter should have a type property of `"json"`, and can also accept the following:

{% include table.html props="property" source="JsonDataFormat" %}

### csv

Load a comma-separated values (CSV) file. This format type does not support any additional properties.

### tsv

Load a tab-separated values (TSV) file. This format type does not support any additional properties.

### topojson

Load a JavaScript Object Notation (JSON) file using the TopoJSON format. The input file must contain valid TopoJSON data. The TopoJSON input is then converted into a GeoJSON format. There are two mutually exclusive properties that can be used to specify the conversion process:

{% include table.html props="feature,mesh" source="TopoDataFormat" %}

## Datasets

Vegemite supports a top-level `datasets` property. This can be useful when the same data should be inlined in different places in the spec. Instead of setting values inline, specify datasets at the top level and then refer to the [named](#named) datasource in the rest of the spec. `datasets` is a mapping from name to an [inline](#inline) dataset.

{: .suppress-error}
```json
```
    "datasets": {
      "somedata": [1,2,3]
    },
    "data": {
      "name": "somedata"
    }
```
