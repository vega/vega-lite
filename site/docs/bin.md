---
layout: docs
title: Binning
permalink: /docs/bin.html
---

The channel definition's `bin` property is for grouping quantitative, continuous data values of a particular field into smaller number of "bins" (e.g., for a histogram).

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": ... ,
  "encoding": {
    "x": {
      "bin": ...,               // bin
      "field": ...,
      "type": "quantitative",
      ...
    },
    "y": ...,
    ...
  },
  ...
}
```

If `bin` is `true`, default binning parameters are used. To customize binning parameters, you can set `bin` to a bin definition object, which can have the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| maxbins       | Integer       | The maximum number of allowable bins. <span class="note-line">__Default value:__ `6` for `row`, `column` and `shape` channels; `10` for other channels.</span> |
| min                 | Number              | The minimum bin value to consider. <span class="note-line">__Default value:__ the minimum value of the specified field </span>|
| max                 | Number              | The maximum bin value to consider. <span class="note-line">__Default value:__ the maximum value of the specified field is used.</span>|
| base                | Number              | The number base to use for automatic bin determination. <span class="note-line">__Default value:__ `10`</span> |
| step                | Number              | An exact step size to use between bins. <span class="note-line">__Note:__ If provided, options such as maxbins will be ignored. </span>|
| steps               | Array               | An array of allowable step sizes to choose from.|
| minstep             | Number              | A minimum allowable step size (particularly useful for integer values).|
| div                 | Array               | Scale factors indicating allowable subdivisions. The default value is [5, 2], which indicates that for base 10 numbers (the default base), the method may consider dividing bin sizes by 5 and/or 2. For example, for an initial step size of 10, the method can check if bin sizes of 2 (= 10/5), 5 (= 10/2), or 1 (= 10/(5*2)) might also satisfy the given constraints. <span class="note-line">__Default value:__ `[5,2]`</span> |

#### Examples

Given a field with quantitative continuous data values

<div class="vl-example">
{
  "data": {"url": "data/movies.json"},
  "mark": "point",
  "encoding": {
    "x": {
      "field": "IMDB_Rating",
      "type": "quantitative"
    }
  }
}
</div>


Setting `bin` groups the values into a smaller number of bins.

<div class="vl-example">
{
  "data": {"url": "data/movies.json"},
  "mark": "point",
  "encoding": {
    "x": {
      "bin": {"maxbins": 10},
      "field": "IMDB_Rating",
      "type": "quantitative"
    }
  }
}
</div>


Mapping binned values and its count to a `bar` mark produces a histogram.

<span class="vl-example" data-name="histogram"></span>


Setting the `maxbins` parameter changes the number of output bins.

<div class="vl-example">
{
  "data": {"url": "data/movies.json"},
  "mark": "bar",
  "encoding": {
    "x": {
      "bin": {"maxbins": 30},
      "field": "IMDB_Rating",
      "type": "quantitative"
    },
    "y": {
      "aggregate": "count",
      "field": "*",
      "type": "quantitative"
    }
  }
}
</div>
