---
layout: docs
menu: docs
title: Encoding
permalink: /docs/encoding.html
---

An integral part of the data visualization process is encoding data with visual properties of graphical marks. Vega-Lite's top-level `encoding` property represents key-value mappings between [encoding channels](#channels) (such as `x`, `y`, or `color`) and its [definition object](#def), which describes the
[encoded data field](#field) or a [constant value](#value), and the channel's [inherent components including a scale and a guide (an axis or a legend)](#components).

{: .suppress-error}
```json
{
  "data": ... ,       
  "mark": ... ,       
  "encoding": {     // Encoding
    "x": ...,
    "y": ...,
    "color": ...,
    "size": ...,
    "shape": ...,
    "text": ...,
    "detail": ...
  },
  ...
}
```


{:#channels}
## Encoding Channels

The keys in the encoding object are encoding channels. This section lists supported encoding channels in Vega-Lite.  

{:#props-channels}
### Mark Properties Channels

Mark properties channels map data fields directly to visual properties of the marks.  Unlike other channel types, they can be mapped to constant values as well. Here are the supported mark properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| x, y          | [ChannelDef](#def)| X and Y coordinates for `point`, `circle`, `square`, `line`, `text`, and `tick`. (or to width and height for `bar` and `area` marks). |
| color         | [ChannelDef](#def)| Color of the marks – either fill or stroke color based on mark type. (By default, fill color for `area`, `bar`, `tick`, `text`, `circle`, and `square` /   stroke color for `line` and `point`.) (See [scale range](scale.html#range) for more detail about color palettes.)  |
| shape  | [ChannelDef](#def)| The symbol's shape (only for `point` marks).  The supported values are `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`, or `"triangle-down"`. |
| size  | [ChannelDef](#def)| Size of the mark.  <br/>     • For `point`, `square` and `circle` – the symbol size, or pixel area of the mark.  <br/> • For `bar` and `tick` – the bar and tick width respectively.  <br/>      • For `text` – the text's font size. <br/>      • Size is currently unsupported for `line` and `area`.|
| text  | [ChannelDef](#def)| Text of the `text` mark. |

### Additional Level of Detail Channel

For [aggregated plots](aggregate.html), all encoded fields without `aggregate` functions are used as grouping fields in the aggregation (fields in `GROUP BY` in SQL).  `detail` is a special encoding channel that provides an additional grouping field (level) for grouping data in aggregation.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| detail | [ChannelDef](#def)| Additional levels of detail for grouping data in aggregate views without mapping data to a specific visual channel.  ([Example](#ex-detail).) |

**Note**: Since `detail` represents an actual data field in the aggregation, it cannot encode a constant `value`.

#### Example

<!-- TODO: Aggregate Scatterplot with detail -->

<!-- TODO: Line with detail -->

### Mark Order Channels

`order` channel sorts the layer order or stacking order (for stacked charts) of the marks while `path` channel sorts the order of data points in line marks.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| order | [ChannelDef](#def)| Layer order for non-stacked marks, or stack order for stacked marks. ([Example](#ex-order).) |
| path   | [ChannelDef](#def)| Order of data points in line marks.  ([Example](#ex-path).) |

**Note**: Since `order` and `path` represent actual data fields that are used to sort the data, they cannot encode constant `value`.  In addition, in aggregate plots, they should have `aggregate` function specified.  

#### Example

<!-- sorting order color of raw scatterplot -->

<!-- sorting stack order -->

<!-- connected scatterplot -->


### Facet Channels

`row` and `column` are special encoding channels that facets single plots into [trellis plots (or small multiples)](https://en.wikipedia.org/wiki/Small_multiple).  For more information, please see [facet](facet.html) page.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| row, column   | [ChannelDef](#def)| Vertical and horizontal facets for vertical and horizontal [trellis plots](https://en.wikipedia.org/wiki/Small_multiple). |

**Note**: Since `row` and `column` represent actual data fields that are used to partition the data, they cannot encode constant `value`.  In addition, in aggregate plots, they should not have `aggregate` function specified.  

{:#def}
## Channel Definition

Each channel definition object **must** describe the [data field encoded by the channel](#field) and its [data type](#type), or a [constant value directly mapped to the mark properties](#value).  In addition, it can describe the mapped field's [transformation](#inline) and [properties for its inherent components including scales, and axes or legends](#components).


{:#field}
### Field

To encode a particular field in the data set with a particular channel, the channel must specify the field's name with `field` property.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | Name of the field from which to pull a data value.    |

### Type

If a field is specified, the channel definition **must** describe the encoded data's [type of measurement (level of measurement)](https://en.wikipedia.org/wiki/Level_of_measurement).
The supported data types are:

Quantitative
: Quantitative data expresses some kind of quantity. Typically this is numerical data. For example `7.3`, `42.0`, `12.1`.

Temporal
: Temporal data supports date-times and times. For example `2015-03-07 12:32:17`, `17:01`, `2015-03-16`.

Ordinal
: Ordinal data represents ranked order (1st, 2nd, ...) by which the data can be sorted. However, as opposed to quantitative data, there is no notion of *relative degree of difference* between them. For illustration, a "size" variable might have the following values `small`, `medium`, `large`, `extra-large`.  We know that medium is larger than small and same for extra-large larger than large.  However, we cannot claim that compare the magnitude of difference, for example, between (1) small and medium and (2) medium and large.

Nominal
: Nominal data, also known as categorical data, differentiates between values based only on their names or categories.  For example, gender, nationality, music genre, names are all nominal data.  Numbers maybe used to represent the variables but the number do not determines magnitude or ordering.  For example, if a nominal variable contains three values 1, 2, and 3.  We cannot claim that 1 is less than 2 nor 3.  

Note that data `type` here describes semantic of the data rather than primitive data types in programming language sense (`number`, `string`, etc.).  The same primitive data type can have different type of measurement.  For example, numeric data can represent quantitative, ordinal, or nominal data.  

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| type          | String        | The encoded field's type of measurement.  This can be either a full type name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`) or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).  This property is case insensitive. |


{:#inline}
### Field Transforms

To facilitate data exploration, Vega-Lite provides inline field transforms as a part of the channel definition. If a `field` is provided, the channel definition supports the following transformations:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [bin](bin.html)<sup>1</sup> | Boolean &#124; Object | Boolean flag for binning a `quantitative` field (`false` by default), or a bin property object for binning parameters. |
| [timeUnit](timeunit.html)<sup>1</sup>| String        | Time unit for a `temporal` field  (e.g., `year`, `yearmonth`, `month`, `hour`). |
| [aggregate](aggregate.html)<sup>1,2</sup> | String        | Aggregation function for the field (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).  |
| [sort](sort.html)<sup>1,2</sup> | String &#124; Object        | Sort order for a particular field.  This can be string (`"ascending"`, `"descending"`, or `"unsorted"`) or a sort field definition object for sorting by an aggregate calculation of a specified sort field.  If unspecified, the default value is `ascending`. |

<!-- TODO: re-explain sort + make it clear that text does not support sorting -->

For more information about these field transforms, please see the following pages: [`bin`](bin.html), [`timeUnit`](timeUnit.html), [`aggregate`](aggregate.html), and [`sort`](sort.html).


**Notes**:

<sup>1</sup>  Inline field transforms are executed after the top-level `transform`s are executed, and are executed in this order: `bin`, `timeUnit`, `aggregate`, and `sort`.

<sup>2</sup> `detail` does not support `aggregate` and `sort`.  When using `path` and `detail`, with non-grouping variables in aggregate plots, they should be aggregated to prevent additional groupings.  

{:#value}
### Constant Value

For [mark properties channels](#props-channels), if a `field` is not specified, constant values for the properties (e.g., color, size) can be also set directly with the channel definition's `value` property.  

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| value         | String &#124; Number | A constant value in visual domain. |

**Note**: `detail`, `path`, `order`, `row`, and `column` channels cannot encode constant `value`.

#### Example

For example, you can set `color` and `shape` of a scatter plot to constant values.  Note that as the value is set directly to the color and shape values, there is no need to specify data `type`.  In fact, the data `type` will be ignored if specified.

<span class="vl-example" data-name="scatter_color_shape_constant" data-dir="docs"></span>


{:#ex-bar-size}

Similarly, `value` for `size` channel of bar marks will adjust the bar's width.  By default, there will be 1 pixel offset between bars.  The following example sets the width to 10 to add more offset between bars.  

<span class="vl-example" data-name="bar_aggregate_size" data-dir="docs"></span>



{:components}
### Inherent Components: Scale, Axis, and Legend

For encoding channels that map data directly to visual properties of the marks, they must provide [scales](scale.html), or functions that transform values in the data domain (numbers, dates, strings, etc) to visual values (pixels, colors, sizes).  

In addition, visualizations typically provide guides to aid interpretation of scales. There are two types of guides: [axes](axis.html) and [legends](legend.html). Axes produces lines, ticks, and labels to convey how a spatial range represent a data range in position channel (`x` and `y`).    Meanwhile, legends aid interpretation of `color`, `size`, and `shape`'s scales.

By default, Vega-Lite automatically generates a scale and a guide for each field.  If no properties are specified, scale, axis, and legend's properties are determined based on a set of rules by the compiler.  `scale`, `axis`, `legend` properties of the channel definition can be used to customize their properties.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [scale](scale.html)      | Object        | A property object for a scale of a [mark property channel](#props-channels).  |
| [axis](axis.html)        | Boolean &#124; Object  | Boolean flag for showing an axis (`true` by default), or a property object for an axis of a position channel (`x` or `y`) or a facet channel (`row` or `column`). |
| [legend](legend.html)    | Boolean &#124; Object  | Boolean flag for showing a legend (`true` by default), or a config object for a legend of a non-position mark property channel (`color`, `size`, or `shape`). |

For more information about [`scale`](scale.html), [`axis`](axis.html), and [`legend`](legend.html), please look at the respective pages.
