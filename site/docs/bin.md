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


{% include table.html props="maxbins,base,step,steps,minstep,divide,extent,nice" source="Bin" %}


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
