---
layout: docs
title: Binning
permalink: /docs/bin.html
---

Binning discretizes numeric values into a set of bins. A common use case is to [create a histogram](#histogram).

There are two ways to define binning in Vega-Lite: [the `bin` property in encoding field definitions](#encoding) and [the `bin` transform](#transform).

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#encoding}

## Binning in Encoding Field Definition

```js
// A Single View or a Layer Specification
{
  ...,
  "mark/layer": ...,
  "encoding": {
    "x": {
      "bin": ..., // bin
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

{:#histogram-ordinal}

### Example: Histogram with Ordinal Scale

While binned field has `"quantitative"` type by default, setting the binned field's `type` to `"ordinal"` produces a histogram with an ordinal scale.

<div class="vl-example" data-name="histogram_ordinal"></div>

### Example: Binned color

You can use binning to discretize color scales. Vega-Lite automatically creates legends with range labels.

<div class="vl-example" data-name="point_binned_color"></div>

{:#binned}

### Example: Using Vega-Lite with Binned data

If you have data that is already binned outside of Vega-Lite, setting the `bin` property to `"binned"` will trigger Vega-Lite to render scales and axes similar to setting the `bin` property in encoding field definitions. Note that you have to specify field names that encode the start and end of each bin. To adjust the axis ticks based on the bin step, you can set `bin` to e.g. `{"binned": true, "step": 2}`.

<div class="vl-example" data-name="bar_binned_data"></div>

{:#transform}

## Bin Transform

```js
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

Instead of using the `bin` property of a field definition, you can also use a bin transform to derive a new field (e.g., `bin_IMDB_Rating`), and encode the new field with bin property of a field definition set to `binned` instead.

<div class="vl-example" data-name="histogram_bin_transform"></div>

While binning in `transform` is more verbose than in `encoding`, it can be useful if you want to perform additional calculation before encoding the data.

## Bin Parameters

If `bin` is `true`, default binning properties are used. To customize binning properties, you can set `bin` to a bin definition object, which can have the following properties:

{% include table.html props="anchor,base,divide,extent,maxbins,minstep,nice,step,steps" source="BinParams" %}

### Example: Customizing Max Bins

Setting the `maxbins` parameter changes the maximum number of output bins. There will often be fewer bins since the domain get sliced at "nicely-rounded" values.

<div class="vl-example" data-name="histogram_bin_change"></div>

## Ordinal Bin

Usually, you should set the type of binned encodings to be quantitative. Vega-Lite automatically creates axes and legends that best represent binned data. However, if you want to sort the bins or skip empty bins, you can set the type to ordinal.

For example, this following plot shows binned values sort by count.

<div class="vl-example" data-name="histogram_ordinal_sort"></div>
