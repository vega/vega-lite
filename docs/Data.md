Akin to [Vega](/vega/vega)'s [data model](vega/vega/wiki/Data), the basic data model used by Vega is _tabular_ data, similar to a spreadsheet or database table. Individual data sets are assumed to contain a collection of records (or "rows"), which may contain any number of named data attributes (variables, or "columns").

Vega-lite currently supports single data source.  The data set can be specified either through including the data inline or providing a URL from which to load the data.

## Data Source

### Inline Data

Inline Data can be specified using `values` property, which is an array of javascript Object that maps variable names to their values.  
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


__Pending Revision__: We are considering to support a subset of Vega transformations – notably map-based transforms for new value derivation [#37](https://github.com/vega/issues/37). 

## Data Transformation

### Filter

Vega-lite’s top-level<sup>1</sup> `filter` property is an array of predicate objects for filtering data.
Each predicate object contains the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| operator      | String        | Operator `>`, `>=`, `=`, `!=`, `<`, `<=`, `notNull` |
| operands      | Array         | Array of operands for the operator (containing two operands for binary operator and one operand for unary operator). |


<sup>1</sup> __Pending Revision__: 
We might replace Vega-lite's predicate objects with vega expression.  


### Binning, Time Unit Conversion, Aggregation