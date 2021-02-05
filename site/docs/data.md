---
layout: docs
menu: docs
title: Data
permalink: /docs/data.html
---

Akin to [Vega](https://www.github.com/vega/vega)'s [data model](https://vega.github.io/vega/docs/data/), the basic data model used by Vega-Lite is _tabular_ data, similar to a spreadsheet or a database table. Individual data sets are assumed to contain a collection of records, which may contain any number of named data fields.

Vega-Lite's `data` property describes the visualization's data source as part of the specification, which can be either [inline data](#inline) (`values`) or [a URL from which to load the data](#url) (`url`). Or, we can create an empty, [named data source](#named) (`name`), which can be [bound at runtime](https://vega.github.io/vega/docs/api/view/#data) or populated from top-level [`datasets`](#datasets).

In addition, Vega-Lite includes _data generators_ which can generate data sets such as numerical sequences or geographic reference elements such as GeoJSON graticule or sphere objects.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Types of Data Sources

{:#inline}

### Inline Data

Inline Data can be specified using `values` property. Here is a list of all properties of an inline `data` source:

{% include table.html props="values,name,format" source="InlineData" %}

For example, the following specification embeds an inline data table with nine rows and two columns (`a` and `b`).

<span class="vl-example" data-name="bar"></span>

If the input data is simply an array of primitive values, each value is mapped to the `data` property of a new object. For example `[5, 3, 8, 1]` is loaded as:

```json
[{"data": 5}, {"data": 3}, {"data": 8}, {"data": 1}]
```

You can also inline a string that will be parsed according to the specified format type.

<span class="vl-example" data-name="embedded_csv"></span>

{:#url}

### Data from URL

Data can be loaded from a URL using the `url` property. In addition, the format of the input data can be specified using the `formatType` property. By default Vega-Lite will infer the type from the file extension.

Here is a list of all properties describing a `data` source from URL:

{% include table.html props="url,name,format" source="UrlData" %}

For example, the following specification loads data from a relative `url`: `data/cars.json`. Note that the format type is implicitly `"json"` by default.

<span class="vl-example" data-name="point_2d"></span>

{:#named}

### Named Data Sources

Data can also be added at runtime through the [Vega View API](https://vega.github.io/vega/docs/api/view/#data). Data sources are referenced by name, which is specified in Vega-Lite with `name`.

Here is a list of all properties describing a named `data` source:

{% include table.html props="name,format" source="NamedData" %}

For example, to create a data source named `myData`, use the following data

```json
{
  "name": "myData"
}
```

You can use the [Vega view API](https://vega.github.io/vega/docs/api/view/#data) to load data at runtime and update the chart. Here is an example using [Vega-Embed](https://github.com/vega/vega-embed):

```js
vegaEmbed('#vis', spec).then(res =>
  res.view
    .insert('myData', [
      /* some data array */
    ])
    .run()
);
```

You can also use a [changeset](https://github.com/vega/vega-view#view_change) to modify the data on the chart as done on this [data streaming demo]({{ site.baseurl }}/tutorials/streaming.html)

## Format

The format object describes the data format and additional parsing instructions.

{% include table.html props="type,parse" source="CsvDataFormat" %}

### json

Loads a JavaScript Object Notation (JSON) file. Assumes row-oriented data, where each row is an object with named attributes. This is the default file format, and so will be used if no format property is provided. If specified, the `format` property should have a type property of `"json"`, and can also accept the following:

{% include table.html props="property" source="JsonDataFormat" %}

### csv

Load a comma-separated values (CSV) file. This format type does not support any additional properties.

### tsv

Load a tab-separated values (TSV) file. This format type does not support any additional properties.

### dsv

Load a delimited text file with a custom delimiter. This is a general version of CSV and TSV.

{% include table.html props="delimiter" source="DsvDataFormat" %}

### topojson

Load a JavaScript Object Notation (JSON) file using the TopoJSON format. The input file must contain valid TopoJSON data. The TopoJSON input is then converted into a GeoJSON format. There are two mutually exclusive properties that can be used to specify the conversion process:

{% include table.html props="feature,mesh" source="TopoDataFormat" %}

## Data Generators

{:#sequence}

### Sequence Generator

The sequence generator creates a set of numeric values based on given start, stop, and (optional) step properties. By default, new objects with a single field named `data` are generated; use the `as` property to change the field name.

{% include table.html props="start,stop,step,as" source="SequenceParams" %}

For example, the following specification generates a domain of number values and then uses calculate transforms to draw a sine curve:

<span class="vl-example" data-name="sequence_line"></span>

{:#graticule}

### Graticule Generator

A graticule is a grid formed by lines of latitude and longitude. The graticule generator creates a geographic grid (as [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) data) to serve as a guiding element to include in maps. The graticule generator can be specified with either a boolean `true` value (indicating the default graticule) or a graticule property object:

{% include table.html props="extent,extentMajor,extentMinor,precision,step,stepMajor,stepMinor" source="GraticuleParams" %}

The following example generates a custom graticule and visualizes it using an orthographic projection:

<span class="vl-example" data-name="geo_graticule_object"></span>

{:#sphere}

### Sphere Generator

A [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) sphere represents the full globe. The sphere generator injects a dataset whose contents are simply `[{"type": "Sphere"}]`. The resulting sphere can be used as a background layer within a map to represent the extent of the Earth. The sphere generator requires either a boolean `true` value or an empty object `{}` as its sole property.

The following example generates a layered base map containing a sphere (light blue fill) and a default graticule (black strokes):

<span class="vl-example" data-name="geo_sphere"></span>

## Datasets

Vega-Lite supports a top-level `datasets` property. This can be useful when the same data should be inlined in different places in the spec. Instead of setting values inline, specify datasets at the top level and then refer to the [named](#named) datasource in the rest of the spec. `datasets` is a mapping from name to an [inline](#inline) dataset.

```json
    "datasets": {
      "somedata": [1,2,3]
    },
    "data": {
      "name": "somedata"
    }
```
