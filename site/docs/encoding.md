---
layout: docs
menu: docs
title: Encoding
permalink: /docs/encoding.html
---
An integral part of the data visualization process is encoding data with visual properties of graphical marks. Vega-Lite's top-level `encoding` property represents key-value mappings between [encoding channels](#channels) (such as `x`, `y`, or `color`) and its [definition object](#def), which describes the encoded [data field](#field-def) or [constant value](#value-def), and the channel's [scale and guide (axis or legend)](#scale-and-guide).

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": ... ,
  "encoding": {     // Encoding
    "column": ...,
    "row": ...,
    "x": ...,
    "y": ...,
    "color": ...,
    "opacity": ...,
    "size": ...,
    "shape": ...,
    "text": ...,
    "tooltip": ...,
    "detail": ...
  },
  ...
}
```

* TOC
{:toc}

{:#channels}
## Encoding Channels

The keys in the encoding object are encoding channels. This section lists supported encoding channels in Vega-Lite.

{:#props-channels}
### Position Channels

Position channels determine the position of the marks.

{% include table.html props="x,x2,y,y2" source="Encoding" %}

### Mark Properties Channels

Mark properties channels map data fields directly to visual properties of the marks. Unlike other channel types, they can be mapped to [constant values](#value) as well. Here are the supported mark properties:

{% include table.html props="color,opacity,shape,size,text,tooltip" source="Encoding" %}

### Additional Level of Detail Channel

Grouping data is another important operation in visualizing data. For [aggregated plots](aggregate.html), all encoded fields without `aggregate` functions are used as grouping fields in the aggregation (similar to fields in `GROUP BY` in SQL). For line and area marks, mapping a data field to color or shape channel will group the lines and stacked areas by the field.

`detail` channel allows providing an additional grouping field (level) for grouping data in aggregation without mapping data to a specific visual channel.

{% include table.html props="detail" source="Encoding" %}

**Note**: Since `detail` represents an actual data field in the aggregation, it cannot encode a constant `value`.

#### Examples

Here is a scatterplot showing average horsepower and displacement for cars from different origins. We map `Origin` to `detail` channel to use the field as a group-by field without mapping it to visual properties of the marks.

<div class="vl-example" data-name="scatter_aggregate_detail"></div>


Here is a line chart showing stock prices of 5 tech companies over time.
We map `symbol` variable (stock market ticker symbol) to `detail` to use them to group lines.

<div class="vl-example" data-name="line_detail"></div>

<!-- TODO Need to decide if we want to keep the two examples above since they look bad with labels / tooltips -->


### Mark Order Channels

`order` channel sorts the layer order or stacking order (for stacked charts) of the marks while `path` channel sorts the order of data points in line marks.

{% include table.html props="order" source="Encoding" %}

**Note**: Since `order` and `path` represent actual data fields that are used to sort the data, they cannot encode the constant `value`. In addition, in aggregate plots, they should have `aggregate` function specified.

{:#ex-path}
#### Example: Sorting Line Order

By default, line marks order their points in their paths by the field of channel x or y. However, to show a pattern of data change over time between gasoline price and average miles driven per capita we use `order` channel to sort the points in the line by time field (`year`).

<div class="vl-example" data-name="scatter_connected"></div>

{:#facet}
### Facet Channels

`row` and `column` are special encoding channels that facets single plots into [trellis plots (or small multiples)](https://en.wikipedia.org/wiki/Small_multiple).

{% include table.html props="row,column" source="EncodingWithFacet" %}

For more information, read the [facet documentation](facet.html).

{:#def}
## Channel Definition

Each channel definition object is either a [field definition]((#field-def)), which describes
the data field encoded by the channel, or a [value definition](#value-def), which describes
or a constant value directly mapped to the mark properties.
Field definitions may also describe the mapped field's [transformation](#inline) and [properties for its scale and guide](#components).

{:#field}
### Field Definition

#### Field and Type

To encode a particular field in the data set with an encoding channel, the channel's field definition must describe the following properties:

{% include table.html props="field,type" source="FieldDef" %}

{:#inline}
#### Field Transforms

To facilitate data exploration, Vega-Lite provides inline field transforms as a part of a field definition. If a `field` is provided, the channel definition supports the following transformations:

{% include table.html props="bin,timeUnit,aggregate,stack,sort" source="PositionFieldDef" %}


<!-- TODO: re-explain sort + make it clear that text does not support sorting -->

For more information about these field transforms, please see the following pages: [`bin`](bin.html), [`timeUnit`](timeUnit.html), [`aggregate`](aggregate.html), [`stack`](stack.html), and [`sort`](sort.html).

**Notes**:

<sup>1</sup>  Inline field transforms are executed after the top-level `transform`s are executed, and are executed in this order: `bin`, `timeUnit`, `aggregate`, and `sort`.

<sup>2</sup> `detail` does not support `aggregate` and `sort`. When using `path` and `detail`, with non-grouping variables in aggregate plots, they should be aggregated to prevent additional groupings.

#### Scale and Guide

For encoding channels that map data directly to visual properties of the marks, they must provide [scales](scale.html), or functions that transform values in the data domain (numbers, dates, strings, etc) to visual values (pixels, colors, sizes).

In addition, visualizations typically provide guides to aid interpretation of scales. There are two types of guides: [axes](axis.html) and [legends](legend.html). Axes produce lines, ticks, and labels to convey how a spatial range represent a data range in position channel (`x` and `y`).   Meanwhile, legends aid interpretation of `color`, `size`, and `shape`'s scales.

By default, Vega-Lite automatically generates a scale and a guide for each field. If no properties are specified, scale, axis, and legend's properties are determined based on a set of rules by the compiler. `scale`, `axis`, `legend` properties of the channel definition can be used to customize their properties.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [scale](scale.html)      | Object        | A property object for a scale of a [mark property channel](#props-channels). |
| [axis](axis.html)        | Boolean &#124; Object  | Boolean flag for showing an axis (`true` by default), or a property object for an axis of a position channel (`x` or `y`) or a facet channel (`row` or `column`). |
| [legend](legend.html)    | Boolean &#124; Object  | Boolean flag for showing a legend (`true` by default), or a config object for a legend of a non-position mark property channel (`color`, `size`, or `shape`). |

For more information about [`scale`](scale.html), [`axis`](axis.html), and [`legend`](legend.html), please look at the respective pages.


{:#value-def}
### Value Definition

For [mark properties channels](#props-channels)<sup>3</sup>, if a `field` is not specified, constant values for the properties (e.g., color, size) can also be set directly with the channel definition's `value` property.  (See the [`value`](value.html) page for more examples.)

{% include table.html props="value" source="ValueDef<number>" %}

<sup>3</sup> `detail`, `path`, `order`, `row`, and `column` channels cannot be used with a channel definition.
