---
layout: docs
title: Encoding
permalink: /docs/encoding.html
---

Vega-Lite's top-level `encoding` property describes a mapping between
encoding channels (such as `x`,`y`, and `color`) and [field definitions](#field-definition).
Each field definition object describes (1) a reference to the `field` name and its data `type` or a constant value (2) the field's [inline transforms](transform.html#inline) (`aggregate`, `bin`, `sort` and `timeUnit`), and (3) properties for the field's `scale`, `axis`, and `legend`.

## Encoding Channels

Vega-Lite supports the following encoding channels: `x`,`y`, `row`, `column`, `color`, `size`, `shape`, `text`, `detail`.
These channels are properties for the top-level `encoding` definition object.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| x, y          | [FieldDef](#field-definition)| Description of a field mapped to x or y coordinates (or to width or height for `bar` and `area` marks). |
| color | [FieldDef](#field-definition)| Description of a field or a constant value mapped to color.  The values are mapped to hue if the field is nominal, and mapped to saturation otherwise.  |
| shape  | [FieldDef](#field-definition)| Description of a field or a constant value mapped to shape. `shape` channel is only applicable for `point` marks.  |
| size  | [FieldDef](#field-definition)| Description of a field or a constant value mapped to size.  `size` channel is currently applicable for all marks except `line` and `area`. If `size` is not mapped to a field, the default value is 10 for `text` mark, `bandWidth-1` for `bar` with ordinal dimension scale and 2 for `bar` with linear dimension scale, `2/3*bandWidth` for `tick`, and 30 for other marks. |
| detail | [FieldDef](#field-definition)| Description of a field or fields for (a) adding extra level of detail for aggregate views without mapping to a specific visual channel or (2) determining layer or stack order.  |
| row, column   | [FieldDef](#field-definition)| Description of a field that facets data into vertical and horizontal [trellis plots](https://en.wikipedia.org/wiki/Small_multiple). |


<div id="def"></div>
## Field Definition

Here is a list of properties for the field definition object:

### Field, Value and Type

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | Name of the field from which to pull a data value.    |
| value         | String &#124; Integer | A constant value. |
| type          | String        | Data type of the field.  This property accepts both a full type name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`), or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).  This property is case insensitive.|

<!-- type affect scale-->

### Inline Transforms

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [bin](transform.html#bin) | Boolean &#124; Object        | Boolean flag / configuration object for binning.   |
| [timeUnit](transform.html#timeunit)| String        | Property for converting time unit.            |
| [aggregate](transform.html#aggregate) | String        | Aggregation function for the field (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).  |
| [sort](transform.html#sort) | String &#124; Object        | Sort order for a particular field.  This can be string (`"ascending"`, `"descending"`, or `"unsorted"`) or a sort field definition object for sorting by an aggregate calculation of a specified sort field.  If unspecified, the default value is `ascending`.  See [Sort](#sort) section for more information. |

For more information about these transforms, please look at [inline transforms section in the transformation page](transform.html#inline).


### Scale, Axis and Legend

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [scale](#scale)      | Object        | Configuration object for the encoding's scale.   |
| [axis](#axis)        | Object        | Configuration object for the encoding's axis.    |
| [legend](#legend)    | Boolean &#124; Object  | Boolean flag for showing legend (`true` by default), or a configuration object for the encoding's legends. |

--------
#### Examples: Color

__TODO__
<!-- Example: nominal -->
<!-- Example: ordinal -->
<!-- Example: quantitative -->

<!-- ## Data Type -->

#### Examples: Size

__TODO__
<!-- Example: bubble_chart -->

#### Examples: Shape

<!-- Example: scatter plot with shape -->
<!-- Example: shape on line -->


#### Example: Detail

<!-- Grouping for line and area -->
<!-- Additional measure / groupby for aggregation -->
<!-- Layer order -->


<!-- TODO: tooltips, labels -->
