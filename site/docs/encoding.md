---
layout: docs
menu: docs
title: Encoding
permalink: /docs/encoding.html
---

{: .suppress-error}
```json
{
  "data": ... ,       
  "mark": ... ,       
  "encoding": {     // encoding
    "x": ...,
    "y": ...,
    "color": ...,
    ...
  },
  ...
}
```

Vega-Lite's top-level `encoding` property describes a mapping between
encoding channels (such as `x`, `y`, or `color`) and fields (or variables in the data).

Each field definition object describes (1) a reference to the `field` name and its data `type` or a constant value (2) the field's [inline transforms](transform.html#inline) (`aggregate`, `bin`, `sort` and `timeUnit`), and (3) properties for the field's `scale`, `axis`, and `legend`.

## Encoding Channels

Vega-Lite supports the following encoding channels: `x`,`y`, `color`, `size`, `shape`, `text`, `detail`, `path`, `row`, and `column`.
These channels are properties for the top-level `encoding` definition object.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| x, y          | [FieldDef](#field-definition)| Mapping data fields to x and y coordinates (or to width and height for `bar` and `area` marks). |
| color         | [FieldDef](#field-definition)| Mapping a field to color.  This channel automatically maps the assigned field to fill or stroke color based on mark type. (Fill color for `area`, `bar`, `tick`, `text` and filled point, circle, and square.,  Stroke color for `line` and unfilled point, circle, and square.)  |
| shape  | [FieldDef](#field-definition)| Mapping a field to the symbol's shape. |
| size  | [FieldDef](#field-definition)| Mapping a field to size of the mark.  This channel automatically maps the assigned field to different visual properties based on mark type.   <br/>     • For `point`, `square` and `circle`, this channel determines the symbol size, or pixel area of the mark.  <br/> • For `bar` and `tick`, this channel determines the bar and tick width respectively.  <br/>      • For `text`, this channel determines the font size of the text. |
| detail | [FieldDef[]](#field-definition)| Mapping fields as (a) additional levels of detail for aggregate views without mapping to a specific visual channel or (2) determining layer or stack order. |
| path   | [FieldDef[]](#field-definition)| Mapping a field or fields for sorting the order of data points in line mark.  For more information, please look at [line mark](mark.html#line). |
| row, column   | [FieldDef](#field-definition)| Faceting the visualization into into vertical and horizontal [trellis plots](https://en.wikipedia.org/wiki/Small_multiple) with a given field. |

<!-- TODO: Need to expand on "(or to width or height for `bar` and `area` marks)." for x,y -->
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
## Field Definition

Here is a list of properties for the field definition object:

### Field, Value and Type

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | Name of the field from which to pull a data value.    |
| value         | String &#124; Number | A constant value in visual domain. |
| type          | String        | Data type of the field.  This property accepts both a full type name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`), or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).  This property is case insensitive.|

{:#types}
#### Data Types

Quantitative
: Quantitative data expresses some kind of quantity. Typically this is numerical data. For example `7.3`, `42.0`, `12.1`.

Temporal
: Information about times or time spans. For example `2015-03-07 12:32:17`.

Ordinal
: Ordinal data can be ranked (1st, 2nd, ...) by which the data can be sorted. However, as opposed to quantitative data, there is no notion of *difference* between them. For example `small`, `medium`, `large`, `extra-large`.

Nominal
: Also known as categorical data, nominal data like ordinal data has no notion of difference. Nominal data also has no notion of order. For example `apple`, `banana`, `kiwi`.

Note that data types describe the more than just the raw data type (e.g. `number`, `string`, `date`) as for example a field with only numbers can be quantitative but also ordinal when the numbers encode a category.

{:#inline}
### Inline Transforms

To facilitate data exploration, Vega-Lite provides the following inline transforms as a part of the field definition: binning (`bin`), time unit conversion (`timeUnit`), aggregation (`aggregate`), sort (`sort`).  

After the specified top-level `transform`s are executed, inline transforms are executed in this order: binning, time unit conversion, aggregation, and sorting.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [bin](bin.html) | Boolean &#124; Object        | Boolean flag / configuration object for binning.   |
| [timeUnit](timeunit.html)| String        | Property for converting time unit.            |
| [aggregate](aggregate.html) | String        | Aggregation function for the field (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).  |
| [sort](sort.html) | String &#124; Object        | Sort order for a particular field.  This can be string (`"ascending"`, `"descending"`, or `"unsorted"`) or a sort field definition object for sorting by an aggregate calculation of a specified sort field.  If unspecified, the default value is `ascending`. |

For more information about inline transforms, please see the following pages: [`bin`](bin.html), [`timeUnit`](timeUnit.html), [`aggregate`](aggregate.html), and [`sort`](sort.html).


### Scale, Axis and Legend

Vega-Lite automatically creates a scale and an axis or a legend for each field by default.   


| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [scale](scale.html)      | Object        | Configuration object for the encoding's scale. (Only for `x`, `y`, `color`, `size`, `shape`, `row`, and `column`.) |
| [axis](axis.html)        | Boolean &#124; Object        | Boolean flag for showing axis (`true` by default), or a config object for the encoding's axis. (Only for `x`, `y`, `row`, and `column`.) |
| [legend](legend.html)    | Boolean &#124; Object  | Boolean flag for showing legend (`true` by default), or a config object for the encoding's legends. (Only for `color`, `size`, and `shape`.) |

For more information about scale, axis, and legend, please look at the [scale](scale.html), [axis](axis.html), and [legend](legend.html) pages.

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

#### Example: Detail

TODO: Grouping for line and area
<!-- Additional measure / groupby for aggregation -->
<!-- Layer order -->


<!-- TODO: tooltips, labels -->
