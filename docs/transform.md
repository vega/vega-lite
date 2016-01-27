---
layout: docs
title: Data Transformation
permalink: /docs/transform.html
---

Data Transformation in Vega-Lite are described either via the `transform` property
or via inline transform inside each field definition.

## `transform` Property

The top-level `transform` object supports the following transformation properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| filterNull    | Boolean | Whether to filter null values from the data.  By default (`undefined`), only quantitative and temporal fields are filtered.  If set to `true`, all data items with null values are filtered. If `false`, all data items are included.  |
| [calculate](#calculate) | Array | An array of [formula object for deriving new calculated field](#calculate-field). |
| filter        | String | [Vega Expression](https://github.com/vega/vega/wiki/Expressions) for filtering data items (or rows).  Each datum object can be referred using bound variable `datum`.  For example, setting `filter` to `datum.Horsepower > 100` would make the output data includes only items that has Horsepower over 100. |

These transforms are executed in this order: `filterNull`, `calculate`, and then `filter`.
Since `calculate` is before `filter`, derived fields can be used in `filter`'s expression.

<!--
### filterNull
provide example for filter null
Show when filterNull is off and some "null" points will fall on the zero
-->

### Formula for `calculate`

`transform`'s '`calculate` property contains an array of formula object for deriving new fields in the dataset.  Each formula object has two properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | The field name in which to store the computed formula value. |
| expr          | String        | A string containing an expression for the formula. Use the variable `datum` to to refer to the current data object. |

---------

__Examples__

This example use `calculate` to derive a new field, then `filter` data based on the new field.  

```js
{
  "description": "A simple bar chart with embedded data that uses a filter and calculate.",
  "data": {
    "values": [
      {"a": "A","b": 28},
      {"a": "B","b": 55},
      {"a": "C","b": 43},
      {"a": "G","b": 19},
      {"a": "H","b": 87},
      {"a": "I","b": 52},
      {"a": "D","b": 91},
      {"a": "E","b": 81},
      {"a": "F","b": 53}
    ]
  },
  "transform": {
    "calculate": [{"field": "b2","expr": "2*datum.b"}],
    "filter": "datum.b2 > 60"
  },
  "mark": "bar",
  "encoding": {
    "y": {"field": "b2", "type": "quantitative"},
    "x": {"field": "a", "type": "ordinal"}
  }
}
```
<script>
vg.embed('#bar_filter_calc', {
  mode: 'vega-lite',
  spec: {
    "description": "A simple bar chart with embedded data that uses a filter and calculate.",
    "data": {
      "values": [
        {"a": "A","b": 28},
        {"a": "B","b": 55},
        {"a": "C","b": 43},
        {"a": "G","b": 19},
        {"a": "H","b": 87},
        {"a": "I","b": 52},
        {"a": "D","b": 91},
        {"a": "E","b": 81},
        {"a": "F","b": 53}
      ]
    },
    "transform": {
      "calculate": [{"field": "b2","expr": "2*datum.b"}],
      "filter": "datum.b2 > 60"
    },
    "mark": "bar",
    "encoding": {
      "y": {"field": "b2", "type": "quantitative"},
      "x": {"field": "a", "type": "ordinal"}
    }
  }
});
</script>
<div id="bar_filter_calc"></div>

<!-- TODO population use calc to derive Male / Female -->

<div id="inline"></div>
## Inline Transforms inside each `encoding` channel

To serve exploratory analysis, binning, time unit conversion and aggregation can be specified inline as a part of each channel's [field definition](encoding.html#field-definition).  
After the transforms inside the top-level `transform` are executed, binning, time unit conversion are then performed respectively.

## Binning (`bin`)

To group quantitative, continuous data values of a particular field into smaller number of "bins" (e.g., for a histogram), the field definition 's `bin` property can be specified.  

`bin` property can be either a boolean value or a bin property definition object.
If `bin` is `true`, default binning parameters will be applied.

The `bin` property definition object contains the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| maxbins       | Integer       | The maximum number of allowable bins.  If unspecified, this is 6 for `row`, `column` and `shape` and 10 for other channels.  See [Datalib's binning documentation](https://github.com/vega/datalib/wiki/Statistics#dl_bins) for more information. |
| min                 | Number              | The minimum bin value to consider. If unspecified, the minimum value of the specified field is used.|
| max                 | Number              | The maximum bin value to consider. If unspecified, the maximum value of the specified field is used.|
| base                | Number              | The number base to use for automatic bin determination (default is base 10).|
| step                | Number              | An exact step size to use between bins. If provided, options such as maxbins will be ignored.|
| steps               | Array               | An array of allowable step sizes to choose from.|
| minstep             | Number              | A minimum allowable step size (particularly useful for integer values).|
| div                 | Array               | Scale factors indicating allowable subdivisions. The default value is [5, 2], which indicates that for base 10 numbers (the default base), the method may consider dividing bin sizes by 5 and/or 2. For example, for an initial step size of 10, the method can check if bin sizes of 2 (= 10/5), 5 (= 10/2), or 1 (= 10/(5*2)) might also satisfy the given constraints.|

-----

#### Example

Histogram counts number of data in each `bin`.

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "bar",
  "encoding": {
    "x": {
      "bin": {"maxbins": 15},
      "field": "Horsepower",
      "type": "quantitative"
    },
    "y": {
      "aggregate": "count",
      "field": "*",
      "type": "quantitative",
      "displayName": "Number of Records"
    }
  }
}
```
<script>
vg.embed('#histogram', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/cars.json"},
    "mark": "bar",
    "encoding": {
      "x": {
        "bin": {"maxbins": 15}, "field": "Horsepower", "type": "quantitative"
      },
      "y": {
        "aggregate": "count", "field": "\*", "type": "quantitative",
        "displayName": "Number of Records"
      }
    }
  }
});
</script>
<div id="histogram"></div>

## Time Unit (`timeUnit`)

New time unit fields can be derived from existing temporal fields using each field definition's `timeUnit` property.  

Currently supported values are: `'year'`, `'month'`, `'day'`, `'date'`, `'hours'`, `'minutes'`, `'seconds'`, `'milliseconds'`, `'yearmonth'`, `'yearmonthday'`, `'yearmonthdate'`, `'yearday'`, `'yeardate'`, `'yearmonthdayhours'`, `'yearmonthdayhoursminutes'`, `'hoursminutes'`,
`'hoursminutesseconds'`, `'minutesseconds'`, `'secondsmilliseconds'`.

----
#### Example

This example shows temperature in seattle over the months.

```js
{
  "data": {"url": "data/seattle-temps.csv","formatType": "csv"},
  "mark": "line",
  "encoding": {
    "x": {
      "timeUnit": "month", "field": "date", "type": "temporal",
      "axis": {"shortTimeLabels": true}
    },
    "y": {"aggregate": "mean", "field": "temp", "type": "quantitative"}
  }
}
```
<script>
vg.embed('#temp_histogram', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/seattle-temps.csv","formatType": "csv"},
    "mark": "line",
    "encoding": {
      "x": {
        "field": "date",
        "type": "temporal",
        "timeUnit": "month",
        "axis": {"shortTimeLabels": true}
      },
      "y": {
        "aggregate": "mean",
        "field": "temp",
        "type": "quantitative"
      }
    }
  }
});
</script>
<div id="temp_histogram"></div>

<a id="aggregate"></a>

## Aggregation (`aggregate`)

Vega-Lite supports all [Vega aggregation operations](https://github.com/vega/vega/wiki/Data-Transforms#-aggregate) (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).

If at least one fields in the specified encoding channels contain `aggregate`,
the resulting visualization will show aggregate data.  
In this case, all fields without aggregation function specified are treated as dimensions; thus, the summary statistics are grouped by these dimensions.
Additional dimensions can be specified using the `detail` channel.  

Otherwise, if none of the specified encoding channel contains `aggregate`,
the resulting visualization shows raw data without aggregation.

-------

#### Example

The following bar chart aggregate mean of `Acceleration`, grouped by
`Cylinders` (number of cylinders).

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "bar",
  "encoding": {
    "x": {"field": "Cylinders", "type": "ordinal"},
    "y": {"aggregate": "mean", "field": "Acceleration", "type": "quantitative"}
  }
}
```
<script>
vg.embed('#bar_aggregate', {
  mode: 'vega-lite',
  spec: {
    "description": "A bar chart showing the average acceleration for cars with different numbers of cylinders.",
    "data": {"url": "../data/cars.json"},
    "mark": "bar",
    "encoding": {
      "x": {"field": "Cylinders", "type": "ordinal"},
      "y": {"field": "Acceleration", "type": "quantitative", "aggregate": "mean"}
    }
  }
});
</script>
<div id="bar_aggregate"></div>

<!-- TODO make scatter_aggregate_detail -->

## Sort (`sort`)

`sort` property of each channel's field definition determines the order of its field values.
For `x`, `y`, `row` and `column`, this determines the order of each value's position via the scale.
For `color`, `shape`, `size`, this determines the order of the channel's scale.
For `detail`, this determines the layer order of the output visualization.

<!-- TODO add `path` -->

`sort` property can be specified for sorting the field's values in two ways:

1. (Supported by all types of fields) as __String__ with the following values:
    - `"ascending"` –  the field is sort by the field's value in ascending order.  This is the default value when `sort` is not specified.
    - `"descending"` –  the field is sort by the field's value in descending order.
    - `"unsorted`" – The field is not sorted. (This is equivalent to specifying `sort:false` in [Vega's scales](https://github.com/vega/vega/wiki/Scales).)

2. (Supported by nominal and ordinal fields only) as a __sort field definition object__ - for sorting the field by an aggregate calculation over another sort field.  A sort field object has the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| _sort.field_  | Field         | The field name to aggregate over.|
| _sort.op_     | String        | A valid [aggregation operation](#aggregate) (e.g., `mean`, `median`, etc.).|
| _sort.order_  | String        | `"ascending"` or `"descending"` order. |

__TODO: Example -- sorting axis__

__TODO: Example -- sorting color mapping__
