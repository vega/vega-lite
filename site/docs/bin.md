---
layout: docs
title: Binning
permalink: /docs/bin.html
---

To group quantitative, continuous data values of a particular field into smaller number of "bins" (e.g., for a histogram), the field definition's `bin` property can be specified.  

```js
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

Field definition's `bin` property can be either a boolean value or a bin property definition object.
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

#### Example

<!-- TODO: just show binning alone with dot-plot to get the idea first -->

The following specification creates a Histogram.
Basically, the bar marks show count of the number of data in each `bin`.

<span class="render-vl" data-name="histogram"></span>
