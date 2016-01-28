---
layout: docs
title: Data
permalink: /docs/data.html
---

Akin to [Vega](/vega/vega)'s [data model](vega/vega/wiki/Data), the basic data model used by Vega is _tabular_ data, similar to a spreadsheet or database table. Individual data sets are assumed to contain a collection of records, which may contain any number of named data fields.

Vega-Lite's top-level `data` property describes a visualization's data source, which can be either inline data or a URL from which to load the data.

Here is a list of all properties describing `data` source:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [values](#inline-data) | Array         | Array of object that maps field names to their values. |
| [url](#data-from-url) | String         | A URL from which to load the data set. Use the _formatType_ property to ensure the loaded data is correctly parsed. |
| [formatType](#data-from-url) | String  | Type of input data: `json`(default), `csv` |

## Inline Data

Inline Data can be specified using `values` property.
For example, a data table with two rows and two columns (`a` and `b`) in a spec might look like this:

```json
{
  "data": {
    "values": [{"a":0, "b":3}, {"a":1, "b":5}, {"a":3, "b":1}, {"a":4, "b":2}]
  },
  "mark": "point",
  "encoding": {
    "x": {"field": "a", "type": "quantitative"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
```

## Data from URL

Data can be specified from url using the `url` property.  
Format of the input data can be specified using `formatType` property.  

__TODO: Example or Link Back to Tutorial Page__


## Binding Data at Run-time

__TODO: Example__
