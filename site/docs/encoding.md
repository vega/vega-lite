---
layout: docs
menu: docs
title: Encoding
permalink: /docs/encoding.html
---

An integral part of the data visualization process is encoding data with visual properties of graphical marks. Vega-Lite's top-level `encoding` property represents key-value mappings between [encoding channels](#channels) (such as `x`, `y`, or `color`) and its [definition object](#def), which describes the encoded [data field](#field) or [constant value](#value), and the channel's [scale and guide (axis or legend)](#scale-and-guide).

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
### Mark Properties Channels

Mark properties channels map data fields directly to visual properties of the marks. Unlike other channel types, they can be mapped to [constant values](#value) as well. Here are the supported mark properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| x, y          | [ChannelDef](#def)| X and Y coordinates for `point`, `circle`, `square`, `line`, `text`, and `tick`. (or to width and height for `bar` and `area` marks). |
| color         | [ChannelDef](#def)| Color of the marks – either fill or stroke color based on mark type. By default, fill color for `area`, `bar`, `tick`, `text`, `circle`, and `square` /   stroke color for `line` and `point`.  Supported color values include hex-color (e.g., `#0099ff`) and [standard HTML/CSS color names](http://www.w3schools.com/colors/colors_names.asp) (e.g., `"goldenrod"`).  Please see [scale range](scale.html#range) for more detail about color palettes.  |
| opacity         | [ChannelDef](#def)| Opacity of the marks – either can be a value or in a range. <span class="note-line"> __Default value:__ `[0.3, 0.8]` </span>.)  |
| shape  | [ChannelDef](#def)| The symbol's shape (only for `point` marks). The supported values are `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`, `"triangle-down"`, or else a custom SVG path string. |
| size  | [ChannelDef](#def)| Size of the mark. <br/>     • For `point`, `square` and `circle` – the symbol size, or pixel area of the mark. <br/> • For `bar` and `tick` – the bar and tick's size. <br/>      • For `text` – the text's font size. <br/>      • Size is currently unsupported for `line` and `area`.|
| text  | [ChannelDef](#def)| Text of the `text` mark. |
| column, row  | [ChannelDef](#def)| `row` and `column` are special encoding channels for [faceting](#facet). |


### Additional Level of Detail Channel

Grouping data is another important operation in visualizing data. For [aggregated plots](aggregate.html), all encoded fields without `aggregate` functions are used as grouping fields in the aggregation (similar to fields in `GROUP BY` in SQL). For line and area marks, mapping a data field to color or shape channel will group the lines and stacked areas by the field.

`detail` channel allows providing an additional grouping field (level) for grouping data in aggregation without mapping data to a specific visual channel.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| detail | [ChannelDef](#def)| Additional levels of detail for grouping data in aggregate views and in line and area marks without mapping data to a specific visual channel. ([Example](#ex-detail).) |

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

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| order | [ChannelDef](#def)| Layer order for non-stacked marks, or stack order for stacked marks. |
| path   | [ChannelDef](#def)| Order of data points in line marks. |

**Note**: Since `order` and `path` represent actual data fields that are used to sort the data, they cannot encode constant `value`. In addition, in aggregate plots, they should have `aggregate` function specified.

{:#ex-order}
#### Example: Sorting Layer Order

Given a colored scatterplot.

<div class="vl-example" data-name="scatter_color"></div>

By default, layer order of the data points are determined by original order of the data.

Mapping the field `Origin` to `order` channel will sort the layer of data points by the field.

<div class="vl-example" data-name="scatter_color_order"></div>

Here we can see that data points from Origin A appear on the top.

#### Example: Sorting Stack Order

Given a stacked bar chart:

<div class="vl-example" data-name="stacked_bar_h"></div>

By default, the stacked bar are sorted by the stack grouping fields (`color` in this example).

Mapping the sum of yield to `order` channel will sort the layer of stacked bar by sum of yield instead.

<div class="vl-example" data-name="stacked_bar_h_order"></div>

Here we can see that site with higher yields for each type of barley are put on the top of the stack (rightmost).

{:#ex-path}
#### Example: Sorting Line Order

By default, line marks order their points in their paths by the field of channel x or y. However, to show a pattern of data change over time between gasoline price and average miles driven per capita we use `path` channel to sort the points in the line by time field (`year`).

<div class="vl-example" data-name="scatter_connected"></div>

{:#facet}
### Facet Channels

`row` and `column` are special encoding channels that facets single plots into [trellis plots (or small multiples)](https://en.wikipedia.org/wiki/Small_multiple).

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| row, column   | [ChannelDef](#def)| Vertical and horizontal facets for vertical and horizontal [trellis plots](https://en.wikipedia.org/wiki/Small_multiple). |

For more information, please see [facet page](facet.html).

**Note**: Since `row` and `column` represent actual data fields that are used to partition the data, they cannot encode constant `value`. In addition, in aggregate plots, they should not have `aggregate` function specified.

{:#def}
## Channel Definition

Each channel definition object **must** describe the [data field encoded by the channel](#field) and its [data type](#type), or a [constant value directly mapped to the mark properties](#value). In addition, it can describe the mapped field's [transformation](#inline) and [properties for its scale and guide](#components).


{:#field}
### Encoded Data

To encode a particular field in the data set with a particular channel, the channel must specify the field's name with `field` property.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | Name of the field from which to pull a data value.   |

### Data Type

If a field is specified, the channel definition **must** describe the encoded data's [type of measurement (level of measurement)](https://en.wikipedia.org/wiki/Level_of_measurement).
The supported data types are:

Quantitative
: Quantitative data expresses some kind of quantity. Typically this is numerical data. For example `7.3`, `42.0`, `12.1`.

Temporal
: Temporal data supports date-times and times. For example `2015-03-07 12:32:17`, `17:01`, `2015-03-16`.

Ordinal
: Ordinal data represents ranked order (1st, 2nd, ...) by which the data can be sorted. However, as opposed to quantitative data, there is no notion of *relative degree of difference* between them. For illustration, a "size" variable might have the following values `small`, `medium`, `large`, `extra-large`. We know that medium is larger than small and same for extra-large larger than large. However, we cannot claim that compare the magnitude of difference, for example, between (1) small and medium and (2) medium and large.

Nominal
: Nominal data, also known as categorical data, differentiates between values based only on their names or categories. For example, gender, nationality, music genre, names are all nominal data. Numbers maybe used to represent the variables but the number do not determine magnitude or ordering. For example, if a nominal variable contains three values 1, 2, and 3. We cannot claim that 1 is less than 2 nor 3.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| type          | String        | The encoded field's type of measurement. This can be either a full type name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`) or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`). This property is case insensitive. |

**Note**:
Data `type` here describes semantic of the data rather than primitive data types in programming language sense (`number`, `string`, etc.). The same primitive data type can have different type of measurement. For example, numeric data can represent quantitative, ordinal, or nominal data.

{:#inline}
### Field Transforms

To facilitate data exploration, Vega-Lite provides inline field transforms as a part of the channel definition. If a `field` is provided, the channel definition supports the following transformations:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [bin](bin.html)<sup>1</sup> | Boolean &#124; Object | Boolean flag for binning a `quantitative` field, or a bin property object for binning parameters. <span class="note-line"> __Default value:__ `false`</span>|
| [timeUnit](timeunit.html)<sup>1</sup>| String        | Time unit for a `temporal` field  (e.g., `year`, `yearmonth`, `month`, `hour`). <span class="note-line"> __Default value:__ `undefined` (None) </span> |
| [aggregate](aggregate.html)<sup>1,2</sup> | String        | Aggregation function for the field (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`). <span class="note-line"> __Default value:__ `undefined` (None) </span> |
| [sort](sort.html)<sup>1,2</sup> | String &#124; Object        | Sort order for a particular field. <br/> • For quantitative or temporal fields, this can be either `"ascending"` or , `"descending"` <br/> • For quantitative or temporal fields, this can be `"ascending"`, `"descending"`, `"none"`, or a [sort field definition object](sort.html#sort-field) for sorting by an aggregate calculation of a specified sort field. <span class="note-line"> __Default value:__ `"ascending"` </span> |

<!-- TODO: re-explain sort + make it clear that text does not support sorting -->

For more information about these field transforms, please see the following pages: [`bin`](bin.html), [`timeUnit`](timeUnit.html), [`aggregate`](aggregate.html), and [`sort`](sort.html).


**Notes**:

<sup>1</sup>  Inline field transforms are executed after the top-level `transform`s are executed, and are executed in this order: `bin`, `timeUnit`, `aggregate`, and `sort`.

<sup>2</sup> `detail` does not support `aggregate` and `sort`. When using `path` and `detail`, with non-grouping variables in aggregate plots, they should be aggregated to prevent additional groupings.

{:#value}
### Constant Value

For [mark properties channels](#props-channels), if a `field` is not specified, constant values for the properties (e.g., color, size) can be also set directly with the channel definition's `value` property.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| value         | String &#124; Number | A constant value in visual domain. |

**Note**: `detail`, `path`, `order`, `row`, and `column` channels cannot encode constant `value`.

#### Example

For example, you can set `color` and `shape` of a scatter plot to constant values. Note that as the value is set directly to the color and shape values, there is no need to specify data `type`. In fact, the data `type` will be ignored if specified.

<span class="vl-example" data-name="scatter_color_shape_constant"></span>


{:#ex-bar-size}

Similarly, `value` for `size` channel of bar marks will adjust the bar's size. By default, there will be 1 pixel offset between bars. The following example sets the size to 10 to add more offset between bars.

<span class="vl-example" data-name="bar_aggregate_size"></span>



### Scale and Guide

For encoding channels that map data directly to visual properties of the marks, they must provide [scales](scale.html), or functions that transform values in the data domain (numbers, dates, strings, etc) to visual values (pixels, colors, sizes).

In addition, visualizations typically provide guides to aid interpretation of scales. There are two types of guides: [axes](axis.html) and [legends](legend.html). Axes produces lines, ticks, and labels to convey how a spatial range represent a data range in position channel (`x` and `y`).   Meanwhile, legends aid interpretation of `color`, `size`, and `shape`'s scales.

By default, Vega-Lite automatically generates a scale and a guide for each field. If no properties are specified, scale, axis, and legend's properties are determined based on a set of rules by the compiler. `scale`, `axis`, `legend` properties of the channel definition can be used to customize their properties.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [scale](scale.html)      | Object        | A property object for a scale of a [mark property channel](#props-channels). |
| [axis](axis.html)        | Boolean &#124; Object  | Boolean flag for showing an axis (`true` by default), or a property object for an axis of a position channel (`x` or `y`) or a facet channel (`row` or `column`). |
| [legend](legend.html)    | Boolean &#124; Object  | Boolean flag for showing a legend (`true` by default), or a config object for a legend of a non-position mark property channel (`color`, `size`, or `shape`). |

For more information about [`scale`](scale.html), [`axis`](axis.html), and [`legend`](legend.html), please look at the respective pages.
