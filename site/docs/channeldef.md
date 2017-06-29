---
layout: docs
title: Channel Definition
permalink: /docs/channeldef.html
---

{:#def}
## Channel Definition

Each channel definition object **must** describe the [data field encoded by the channel](#channel.html) and its [data type](#type), or a [constant value directly mapped to the mark properties](#value). In addition, it can describe the mapped field's [transformation](#inline) and [properties for its scale and guide](#components).


{:#field}
### Encoded Data

To encode a particular field in the data set with a particular channel, the channel must specify the field's name with `field` property.

{% include table.html props="field" source="FieldDef" %}

{:#type}
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

{% include table.html props="type" source="FieldDef" %}

**Note**:
Data `type` here describes semantic of the data rather than primitive data types in programming language sense (`number`, `string`, etc.). The same primitive data type can have different types of measurement. For example, numeric data can represent quantitative, ordinal, or nominal data.

{:#inline}
### Field Transforms

To facilitate data exploration, Vega-Lite provides inline field transforms as a part of the channel definition. If a `field` is provided, the channel definition supports the following transformations:

{% include table.html props="bin,timeUnit,aggregate,stack,sort" source="PositionFieldDef" %}

#### Example: Stack
Here is an example of stack area with `normalize`:
<div class="vl-example" data-name="stacked_area_normalize"></div>

And this example has a stack value of `center`:
<div class="vl-example" data-name="stacked_area_stream"></div>

Another example is to have a stack value of `none`:
<div class="vl-example" data-name="bar_layered_transparent"></div>


<!-- TODO: re-explain sort + make it clear that text does not support sorting -->

For more information about these field transforms, please see the following pages: [`bin`](bin.html), [`timeUnit`](timeUnit.html), [`aggregate`](aggregate.html), and [`sort`](sort.html).


**Notes**:

<sup>1</sup>  Inline field transforms are executed after the top-level `transform`s are executed, and are executed in this order: `bin`, `timeUnit`, `aggregate`, and `sort`.

<sup>2</sup> `detail` does not support `aggregate` and `sort`. When using `path` and `detail`, with non-grouping variables in aggregate plots, they should be aggregated to prevent additional groupings.

{:#value}
### Constant Value

For [mark properties channels](channel.html#props-channels), if a `field` is not specified, constant values for the properties (e.g., color, size) can also be set directly with the channel definition's `value` property.

{% include table.html props="value" source="ValueDef<number>" %}

**Note**: `detail`, `path`, `order`, `row`, and `column` channels cannot encode the constant `value`.

#### Example

For example, you can set `color` and `shape` of a scatter plot to constant values. Note that as the value is set directly to the color and shape values, there is no need to specify a data `type`. In fact, the data `type` will be ignored if specified.

<span class="vl-example" data-name="scatter_color_shape_constant"></span>


{:#ex-bar-size}

Similarly, `value` for `size` channel of bar marks will adjust the bar's size. By default, there will be 1 pixel offset between bars. The following example sets the size to 10 to add more offset between bars.

<span class="vl-example" data-name="bar_aggregate_size"></span>



### Scale and Guide

For encoding channels that map data directly to visual properties of the marks, they must provide [scales](scale.html), or functions that transform values in the data domain (numbers, dates, strings, etc) to visual values (pixels, colors, sizes).

In addition, visualizations typically provide guides to aid interpretation of scales. There are two types of guides: [axes](axis.html) and [legends](legend.html). Axes produce lines, ticks, and labels to convey how a spatial range represent a data range in position channel (`x` and `y`).   Meanwhile, legends aid interpretation of `color`, `size`, and `shape`'s scales.

By default, Vega-Lite automatically generates a scale and a guide for each field. If no properties are specified, scale, axis, and legend's properties are determined based on a set of rules by the compiler. `scale`, `axis`, `legend` properties of the channel definition can be used to customize their properties.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [scale](scale.html)      | Object        | A property object for a scale of a [mark property channel](channel.html#props-channels). |
| [axis](axis.html)        | Boolean &#124; Object  | Boolean flag for showing an axis (`true` by default), or a property object for an axis of a position channel (`x` or `y`) or a facet channel (`row` or `column`). |
| [legend](legend.html)    | Boolean &#124; Object  | Boolean flag for showing a legend (`true` by default), or a config object for a legend of a non-position mark property channel (`color`, `size`, or `shape`). |

For more information about [`scale`](scale.html), [`axis`](axis.html), and [`legend`](legend.html), please look at the respective pages.
