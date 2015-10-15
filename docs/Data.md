# Data

Data in Vega-lite can be specified in the `data` property definition.

Akin to [Vega](/vega/vega)'s [data model](vega/vega/wiki/Data), the basic data model used by Vega is _tabular_ data, similar to a spreadsheet or database table. Individual data sets are assumed to contain a collection of records (or "rows"), which may contain any number of named data attributes (variables, or "columns").

## Data Source

Vega-lite currently supports single data source.  The data set can be specified either through including the data inline or providing a URL from which to load the data.

### Inline Data

Inline Data can be specified using `values` property.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| values        | Array         | Array of object that maps variable names to their values. |

For example, a data table with two rows and two columns (`a` and `b`) in a spec might look like this:

```js
{
  data: {
    values: [{"a":0, "b":3}, {"a":1, "b":5}]]
  },
  encoding: …,
  …
}
```

### Data from URL

Alternatively, data can be specified from url using the following properties.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| url           | String        | A URL from which to load the data set. Use the _formatType_ property to ensure the loaded data is correctly parsed. |

| formatType    | String        | Type of input data: `json`(default), `csv` |
| filter        | String        | Vega Expression for filtering data.  Each datum object can be referred using bound variable `datum`. |


__Pending Revision__: We are considering to support a subset of Vega transformations – notably map-based transforms for new value derivation [#37](https://github.com/vega/issues/37).

## Data Transformation

Filter and calculated field can be specified using `filter` and `formula` properties.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| filter        | String        | A string containing the filter Vega expression. Use `datum` to refer to the current data object. |
| formulas       | Array         | Array of [formula object for deriving new calculated field](#calculate-field). |

### Calculated Field

Each formula object has two properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | The property name in which to store the computed formula value. |
| expire        | String        | A string containing an expression for the formula. Use the variable `datum` to to refer to the current data object. |

### Binning, Time Unit Conversion, Aggregation

Some transformation including binning and aggregation are specified as part of [encoding definitions](Encoding-Mapping.md)


