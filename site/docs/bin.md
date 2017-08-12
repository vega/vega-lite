---
layout: docs
title: Binning
permalink: /docs/bin.html
---

Binning discretizes numeric values into a set of bins. A common use case is to [create a histogram](#example).

There are two ways to define binning in Vega-Lite: [the `bin` property in encoding field definitions](#encoding) and [the `bin` transform](#transform).

{:#encoding}
## Binning Encoding Field

{: .suppress-error}
```json
// A Single View Specification
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

You can directly bin an `encoding` field by using the `bin` property in a [field definition](encoding.html#field).

{% include table.html props="bin" source="PositionFieldDef" %}

{:#histogram}
### Example: Histogram

Mapping binned values and its count to a `bar` mark produces a histogram.

<div class="vl-example" data-name="histogram"></div>

{:#transform}
## Bin Transform

{: .suppress-error}
```json
// Any View Specification
{
  ...
  "transform": [
    {"bin": ..., "field": ..., "as" ...} // Bin Transform
     ...
  ],
  ...
}
```

The `bin` transform in the `transform` array has the following properties:

{% include table.html props="bin,field,as" source="BinTransform" %}

### Example: Histogram with Bin Transform

Instead of using the `bin` property of a field definition, you can also a bin transform
to derive a new field (e.g., `bin_IMDB_Rating`), and encode the new field instead.

**TODO: example**

<!--
Add this back once https://github.com/vega/vega-lite/issues/2839 is fixed
<div class="vl-example" data-name="histogram_bin_transform"></div>
-->

<!-- While binning in `transform` is more verbose than in `encoding`, it can be useful if you want to perform additional
calculation before encoding the data.

**TODO: example** -->

## Bin Parameters

If `bin` is `true`, default binning parameters are used. To customize binning parameters, you can set `bin` to a bin definition object, which can have the following properties:


{% include table.html props="maxbins,base,step,steps,minstep,divide,extent,nice" source="BinParams" %}

### Example: Customizing Max Bins

Setting the `maxbins` parameter changes the number of output bins.

<div class="vl-example" data-name="histogram_bin_change"></div>
