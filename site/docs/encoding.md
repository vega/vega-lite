---
layout: docs
menu: docs
title: Encoding
permalink: /docs/encoding.html
---

An integral part of the data visualization process is encoding data with visual properties of graphical marks. Vega-Lite's top-level `encoding` property represents key-value mappings between [encoding channels](#channels) (such as `x`, `y`, or `color`) and its [definition object](#def), which describes the data encoded by the channel (the [`field`](#field) name and [`type`](#type) and its [transformation](#inline)) and [properties for its inherent components including scales, axes, and legends](#components).

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

Mark properties channels map data directly to visual properties of the marks.  Here are the supported mark properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| x, y          | [ChannelDef](#def)| X and Y coordinates for `point`, `circle`, `square`, `line`, `text`, and `tick`. (or to width and height for `bar` and `area` marks). |
| color         | [ChannelDef](#def)| Color of the marks – either fill or stroke color based on mark type. (By default, fill color for `area`, `bar`, `tick`, `text`, `circle`, and `square` /   stroke color for `line` and `point`.)  |
| shape  | [ChannelDef](#def)| The symbol's shape (only for `point` marks).  The supported values are `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`, or `"triangle-down"`. |
| size  | [ChannelDef](#def)| Size of the mark.  <br/>     • For `point`, `square` and `circle` – the symbol size, or pixel area of the mark.  <br/> • For `bar` and `tick` – the bar and tick width respectively.  <br/>      • For `text` – the text's font size. |

### Additional Level of Detail Channel

For [aggregated plots](aggregate.html), all encoded fields without `aggregate` functions are used as grouping fields in the aggregation (fields in `GROUP BY` in SQL).  `detail` is a special encoding channel that provides an additional grouping field (level) for grouping data in aggregation.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| detail | [ChannelDef](#def)| Additional levels of detail for grouping data in aggregate views without mapping data to a specific visual channel.  ([Example](#ex-detail).) |

### Mark Order Channels

`order` channel sorts the layer order or stacking order (for stacked charts) of the marks while `path` channel sorts the order of data points in line marks.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| order | [ChannelDef](#def)| Layer order for non-stacked marks, or stack order for stacked marks. ([Example](#ex-order).) |
| path   | [ChannelDef](#def)| Order of data points in line marks.  ([Example](#ex-path).) |

### Facet Channels

`row` and `column` are special encoding channels that facets single plots into [trellis plots (or small multiples)](https://en.wikipedia.org/wiki/Small_multiple).

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| row, column   | [ChannelDef](#def)| Vertical and horizontal facets for vertical and horizontal [trellis plots](https://en.wikipedia.org/wiki/Small_multiple). |

<!-- TODO: describe more about color's behavior -- For a nominal field, the field value is mapped to `hue` by default.  For other fields, the field value is mapped to saturation by default.-- possibly link to the scale page -->

<!--
### Supported Encoding Channels for each Mark Type

The following table lists supported channels for each mark type.  

|        | x,y | color | size | shape |  text  | path | detail | row, column |
|--------|:---:|:-----:|:----:|:-----:|:------:|:----:|:------:|:-----------:|
| point  |  ✓  |   ✓   |  ✓   |   ✓   |        |      |    ✓   |      ✓      |
| circle |  ✓  |   ✓   |  ✓   |       |        |      |    ✓   |      ✓      |
| square |  ✓  |   ✓   |  ✓   |       |        |      |    ✓   |      ✓      |
| tick   |  ✓  |   ✓   |  ✓   |       |        |      |    ✓   |      ✓      |
| bar    |  ✓  |   ✓   |  ✓   |       |        |      |    ✓   |      ✓      |
| line   |  ✓  |   ✓   |      |       |        |   ✓  |    ✓   |      ✓      |
| area   |  ✓  |   ✓   |      |       |        |      |    ✓   |      ✓      |
| text   |  ✓  |   ✓   |  ✓   |       |    ✓   |      |    ✓   |      ✓      |
-->

{:#def}
## Channel Definition

Each channel definition object **must** describe the [data encoded by the channel](#field) and its [data type](#type).  In addition, it can describe the mapped field's [transformation](#inline) and [properties for its inherent components including scales, and axes or legends](#components).


{:#field}
### Encoded Data

A channel definition object **must** describe the data encoded by the encoding channel, either a field (or a variable) in the dataset or a constant value.  

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | Name of the field from which to pull a data value.    |
| value         | String &#124; Number | A constant value in visual domain. |

**Note**: `detail`, `path`, `order`, `row`, and `column` channels cannot encode constant `value`.

{:#type}
#### Data Type

In addition, the channel definition **must** describe the encoded data's [type of measurement (level of measurement)](https://en.wikipedia.org/wiki/Level_of_measurement).
Supported data types are:

Quantitative
: Quantitative data expresses some kind of quantity. Typically this is numerical data. For example `7.3`, `42.0`, `12.1`.

Temporal
: Temporal data supports datetimes and times. For example `2015-03-07 12:32:17`, `17:01`, `2015-03-16`.

Ordinal
: Ordinal data represents ranked order (1st, 2nd, ...) by which the data can be sorted. However, as opposed to quantitative data, there is no notion of *relative degree of difference* between them. For illustration, a "size" variable might have the following values `small`, `medium`, `large`, `extra-large`.  We know that medium is larger than small and same for extra-large larger than large.  However, we cannot claim that compare the magnitude of difference, for example, between (1) small and medium and (2) medium and large.

Nominal
: Nominal data, also known as categorical data, differentiates between values based only on their names or categories.  For example, gender, nationality, music genre, names are all nominal data.  Numbers maybe used to represent the variables but the number do not determines magnitude or ordering.  For example, if a nominal variable contains three values 1, 2, and 3.  We cannot claim that 1 is less than 2 nor 3.  

Note that data `type` here describes semantic of the data rather than primitive data types in programming language sense (`number`, `string`, etc.).  The same primitive data type can have different type of measurement.  For example, numeric data can represent quantitative, ordinal, and nominal data.  

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| type          | String        | The encoded field's [type of measurement ](https://en.wikipedia.org/wiki/Level_of_measurement).  This can be either a full type name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`) or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).  This property is case insensitive. |

{:#inline}
### Field Transforms

To facilitate data exploration, Vega-Lite provides inline field transforms as a part of the channel definition. If a `field` is provided, the channel definition supports the following transformations:

<!--TODO: revise description in this table-->

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [bin](bin.html)<sup>1</sup> | Boolean &#124; Object | Boolean flag / configuration object for binning.    |
| [timeUnit](timeunit.html)<sup>1</sup>| String        | Property for converting time unit.            |
| [aggregate](aggregate.html)<sup>1,2</sup> | String        | Aggregation function for the field (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).  |
| [sort](sort.html)<sup>1,2</sup> | String &#124; Object        | Sort order for a particular field.  This can be string (`"ascending"`, `"descending"`, or `"unsorted"`) or a sort field definition object for sorting by an aggregate calculation of a specified sort field.  If unspecified, the default value is `ascending`. |

For more information about inline transforms, please see the following pages: [`bin`](bin.html), [`timeUnit`](timeUnit.html), [`aggregate`](aggregate.html), and [`sort`](sort.html).


**Notes**:

<sup>1</sup>  Inline field transforms are executed after the top-level `transform`s are executed, and are executed in this order: `bin`, `timeUnit`, `aggregate`, and `sort`.

<sup>2</sup> `detail` does not support `aggregate` and `sort`.  When using `path` and `detail`, with non-grouping variables in aggregate plots, they should be aggregated to prevent additional groupings.  



{:components}
### Inherent Components: Scale, Axis, and Legend

For encoding channels that map data directly to visual properties of the marks, they must provide scales, or functions that transform values in the data domain (numbers, dates, strings, etc) to visual values (pixels, colors, sizes).  

In addition, visualizations typically provide guides to aid interpretation of scales. Axes produces lines, ticks, and labels to convey how a spatial range represent a data range.    Meanwhile, legends aid interpretation of scales of color, size, and shape.

By default, Vega-Lite automatically generates a scale and a guide (axis or legend) for each field.  If no properties are specified, scale, axis, and legend's properties are determined based on a set of rules by the compiler.  `scale`, `axis`, `legend` properties of the channel definition can be used to customize their properties.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [scale](scale.html)      | Object        | Property object for the scale of a [mark property channel](#props-channels).  |
| [axis](axis.html)        | Boolean &#124; Object        | Boolean flag for showing axis (`true` by default), or a property object for the channel's axis. (Only for `x`, `y`, `row`, and `column`.) |
| [legend](legend.html)    | Boolean &#124; Object  | Boolean flag for showing legend (`true` by default), or a config object for the encoding's legends. (Only for `color`, `size`, and `shape`.) |

For more information about scale, axis, and legend, please look at the [`scale`](scale.html), [`axis`](axis.html), and [`legend`](legend.html) pages.

<!--
### Supported Properties for each Channel's Field Definition

|            | x,y | color | size | shape | text | path | detail | row, column |
|------------|:---:|:-----:|:----:|:-----:|:----:|:----:|:------:|:-----------:|
| field      |  ✓  |   ✓   |  ✓   |   ✓   |  ✓   |  ✓   |    ✓   |      ✓      |
| type       |  ✓  |   ✓   |  ✓   |   ✓   |  ✓   |  ✓   |    ✓   |      ✓      |
| value      |  ✓  |   ✓   |  ✓   |   ✓   |  ✓   |      |        |             |
| bin        |  ✓  |   ✓   |  ✓   |   ✓   |  ✓   |  ✓   |    ✓   |      ✓      |
| timeUnit   |  ✓  |   ✓   |  ✓   |   ✓   |  ✓   |  ✓   |    ✓   |      ✓      |
| aggregate  |  ✓  |   ✓   |  ✓   |       |  ✓   |  ✓   |    ✓   |             |
| sort       |  ✓  |   ✓   |  ✓   |   ✓   |      |  ✓   |    ✓   |      ✓      |
| scale      |  ✓  |   ✓   |  ✓   |   ✓   |      |      |        |      ✓      |
| axis       |  ✓  |       |      |       |      |      |        |      ✓      |
| legend     |     |   ✓   |  ✓   |   ✓   |      |      |    ✓   |             |
-->

--------

#### Example: Setting Color and Shape of a Scatter Plot

You can set `color` and `shape` of a scatter plot to constant values.

<span class="vl-example" data-name="scatter_color_shape_constant" data-dir="docs"></span>

Also, see [this example for mapping fields to color and shape](mark.html#ex-scatter_color_shape).

<!-- linked from another page do not remove this "a" tag-->
<a id="ex-bar-size"></a>

#### Example: Setting Bar's size

By default, there will be 1 pixel offset between bars.  
Specifying `size`' `value` will adjust the bar's width.  
The following example sets the width to 10 to add more offset between bars.  

<span class="vl-example" data-name="bar_aggregate_size" data-dir="docs"></span>

{:#ex-detail}
#### Example: Detail

TODO: Grouping for line and area
<!-- Additional measure / groupby for aggregation -->
<!-- Layer order -->


{:#ex-order}
#### Example: Order


{:#ex-path}
#### Example: Path

<!-- TODO: tooltips, labels -->
