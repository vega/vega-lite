---
layout: docs
title: Binning
permalink: /docs/bin.html
---

There are two ways to define binning. One is the bin transform and the other is a channel's definition of bin in encoding. Both are described on this page.

Table of Contents
- [Transform](#transform)
- [Encoding](#encoding)

{:#transform}
### Transform

{: .suppress-error}
```json
{
  ...
  "transform": [
    {"bin": ..., "field": ..., "as" ...} // Bin Transform
     ...
  ],
  ...
}
```

`bin` transform in the `transform` array has the following properties:

{% include table.html props="bin,field,as" source="BinTransform" %}


### Encoding

The channel definition's `bin` property is for grouping quantitative, continuous data values of a particular field into a smaller number of "bins" (e.g., for a histogram).

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

<div class="vl-example" data-name="point_1d"></div>

Setting `bin` groups the values into a smaller number of bins.

<div class="vl-example" data-name="point_1d_bin"></div>

Mapping binned values and its count to a `bar` mark produces a histogram.

<div class="vl-example" data-name="histogram"></div>


Setting the `maxbins` parameter changes the number of output bins.

<div class="vl-example" data-name="histogram_bin_change"></div>
