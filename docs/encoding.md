---
layout: docs
title: Encoding
permalink: /docs/encoding.html
---

Vega-Lite's top-level `encoding` property describes a mapping between
encoding channels (such as `x`,`y`, and `color`) and field definitions.
Each field definition object describes
a constant `value` or a reference to the `field` name and its data `type` and inline transformation (`aggregate`, `bin`, `sort` and `timeUnit`).
Each field definition object can also optionally include configuration properties for `scale`, `axis`, and `legend`
<!-- [Additional visual properties for each encoding channel](#Channel-Specific-Properties) -->

Vega-Lite supports the following encoding channels: `x`,`y`, `row`, `column`, `color`, `size`, `shape`, `text`, `detail`.
These channels are properties for the top-level `encoding` definition object.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| x, y          | [FieldDef](#field-definition)| Description of a field mapped to x or y coordinates (or to width or height for `bar` and `area` marks). |
| row, column   | [FieldDef](#field-definition)| Description of a field that is used to facet data into vertical and horizontal [trellis plots](https://en.wikipedia.org/wiki/Small_multiple) respectively. |
| color | [FieldDef](#field-definition)| Description of a field mapped to color or a constant value for color.  The values are mapped to hue if the field is nominal, and mapped to saturation otherwise.  |
| shape  | [FieldDef](#field-definition)| Description of a field mapped to shape encoding or a constant value for shape.   `shape` is only applicable for `point` marks.  |
| size  | [FieldDef](#field-definition)| Description of a field mapped to size encoding or a constant value for size.  `size` is not applicable for `line` and `area`. |
| detail | [FieldDef](#field-definition)| Description of a field that serves as an additional dimension for aggregate views without mapping to a specific visual channel.  `detail` does not affect raw plots. |

<!-- # Faceting
TODO: add visual examples for both row and column
-->

<!-- # Color
TODO: visual examples for hue, saturation
 -->

<!-- # Size
TODO: example: bubble plots
-->

<!-- # Detail
TODO: explain more about detail  
-->

<!-- TODO: tooltips, labels -->

# Field Definition

Here is a list of properties for the field definition object:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | Name of the field from which to pull a data value.    |
| value         | String &#124; Integer | A constant value. |
| type          | String        | Data type of the field.  This property accepts both a full type name (`'quantitative'`, `'temporal'`, `'ordinal'`,  and `'nominal'`), or an initial character of the type name (`'Q'`, `'T'`, `'O'`, `'N'`).  This property is case insensitive.|
| [aggregate](#Aggregate) | String        | Aggregation function for the field (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).  |
| [bin](#bin)          | Boolean &#124; Object        | Boolean flag / configuration object for binning.  See [Binning](#Bin) |
| [sort](#sort)        | String &#124; Object        | Sort order for a particular field.  This can be string (`'ascending'`, `'descending'`, or `'unsorted'`) or a sort field definition object for sorting by an aggregate calculation of a specified sort field.  If unspecified, the default value is `ascending`.  See [Sort](#sort) section for more information. |
| [timeUnit](#timeunit)| String        | Property for converting time unit.            |
| [axis](#axis)        | Object        | Configuration object for the encoding's axis.    |
| [legend](#legend)    | Boolean &#124; Object  | Boolean flag for showing legend (`true` by default), or a configuration object for the encoding's legends. |
| [scale](#scale)      | Object        | Configuration object for the encoding's scale.   |

<!-- ## Data Type -->
<!-- TODO: add description about each data type, describe how nominal and ordinal are treated differently -->

## Field Transformations

### ▸ `aggregate`

Vega-Lite supports all [Vega aggregation operations](https://github.com/vega/vega/wiki/Data-Transforms#-aggregate) (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).

If at least one of the specified encoding channel contains aggregation, a summary data table (`aggregate`) will be computed from the source data table (after binning and time unit have been derived) and the resulting visualization shows data from this summary table.  In this case, all fields without aggregation function specified are treated as dimensions.  The summary statistics are grouped by these dimensions.

If none of the specified encoding channel contains aggregation, no additional data table is created.

----

### ▸ `bin`

To group raw data values of a particular field into bins (e.g., for a histogram),
the field should have `bin` property specified.  
`bin` property can be either a boolean value or a bin property definition object.
If `bin` is `true`, default binning parameters will be applied.

The `bin` property definition object contains the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| maxbins       | Integer       | The maximum number of allowable bins.  See [Datalib's binning documentation](https://github.com/vega/datalib/wiki/Statistics#dl_bins) for more information. |

__Pending Revision__: We are revising how binning should be specified in Vega-Lite and properties for binning.  Other properties in [Datalib's binning ](https://github.com/vega/datalib/wiki/Statistics#dl_bins) such as `min`, `max`, `maxbins`, `step`, `steps`, `minstep`, `div` will be added once this is revised.

----

### ▸ `sort`

Order of a field's values can be specified using the `'sort'` property.  
For `x`, `y`, `row` and `column`, this determines the order of each value's position.
For `color`, `shape`, `size` and `detail`, this determines the layer order
(z-position) of each value.

`sort` property can be specified for sorting the field's values in two ways:

1. (Supported by all types of fields) as __String__ with the following values:
    - `'ascending'` –  the field is sort by the field's value in ascending order.  This is the default value when `sort` is not specified.
    - `'descending'` –  the field is sort by the field's value in descending order.
    - `'unsorted`' – The field is not sorted. (This is equivalent to specifying `sort:false` in [Vega's scales](https://github.com/vega/vega/wiki/Scales).)

2. (Supported by nominal and ordinal fields only) as a __sort field definition object__ - for sorting the field by an aggregate calculation over another sort field.  A sort field object has the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| _sort.field_  | Field         | The field name to aggregate over.|
| _sort.op_     | String        | A valid [aggregation operation](Data-Transforms#-aggregate) (e.g., `mean`, `median`, etc.).|
| _sort.order_  | String        | `'ascending'` or `'descending'` order. |

----

### ▸ `timeUnit`

`timeUnit` property can be specified for converting timeUnit for temporal field.  
Therefore, `timeUnit` is only applied when the `type` is "`temporal`".
Current supported values for `timeUnit` are `year`, `month`, `day`, `date`, `hours`, `minutes`, `seconds`.

__In Roadmap__: Support for other values such as `year-month`, `year-month-day`, `hour-minute`.

## Scale, Axis, and Legend

### ▸ `scale`

Vega-Lite's `scale` object supports the following Vega scale properties:

- [Common Scale Properties](https://github.com/vega/vega/wiki/Scales#common-scale-properties)__<sup>1</sup>__:
`type`__<sup>2</sup>__, `domain`, `range`, and `round`.

- [Quantitative Scale Properties](https://github.com/vega/vega/wiki/Scales#quantitative-scale-properties):
`clamp`, `exponent`, `nice`, and `zero`.

- [Time Scale Properties](https://github.com/vega/vega/wiki/Scales#time-scale-properties):
`clamp` and `nice`.

- [Ordinal Scale Properties](https://github.com/vega/vega/wiki/Scales#ordinal-scale-properties):
`bandWidth`, `padding` and `points`.

See [Vega's documentation](https://github.com/vega/vega/wiki/Scales#common-scale-properties) for more information about these properties.

<!-- TODO: add a table here instead of pointing to Vega-->

Moreover, Vega-Lite has the following additional scale properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| useRawDomain  | Boolean       | Use the raw data instead of summary data for scale domain (Only for aggregated field).  This property only works with aggregate functions that produce values ranging in the domain of the source data (`'mean'`, `'average'`, `'stdev'`, `'stdevp'`, `'median'`, `'q1'`, `'q3'`, `'min'`, `'max'`).  Otherwise, this property is ignored.  If the scale's `domain` is specified, this property is also ignored. |

<!-- TODO: document default behavior for each properties__ -->

__<sup>1</sup>__ `reverse` is excluded from Vega-Lite's `scale` to avoid conflicts with `sort` property.  Please use `sort='descending'` to get a `reverse=true`.

__<sup>2</sup>__
Vega-Lite automatically determines scale's `type` based on the field's data type.
By default, scales of nominal and ordinal fields are ordinal scales.
Scales of time fields are time scales if time unit conversion is not applied.
Scales of quantitative fields are linear scales by default, but users can specify `type` property to use other types of quantitative scale.


----

### ▸ `axis`

Axes provide axis lines, ticks and labels to convey how a spatial range represents a data range. Simply put, axes visualize scales.

Vega-Lite's `axis` object supports the following [Vega axis properties](https://github.com/vega/vega/wiki/Axes#axis-properties):
`format`, `grid`<sup>1</sup>, `layer`, `orient`, `ticks`, `title` <sup>2</sup>, and `titleOffset`<sup>3,4</sup>.
See [Vega documentation](https://github.com/vega/vega/wiki/Axes#axis-properties) for more information.

<!-- TODO: add a table here instead of pointing to Vega-->

Moreover, Vega-Lite supports the following additional axis properties.

| Property        | Type          | Description    |
| :------------   |:-------------:| :------------- |
| labelMaxLength  | Integer       | Max length for axis labels. Longer labels are truncated. (25 by default.) |
| labelAngle      | Integer       | Angle by which to rotate labels. Set to 0 to force horizontal.   |
| titleMaxLength  | Integer       | Max length for axis title when the title is automatically generated from the field\'s description. |
| titleOffset     | Integer       | Offset between the axis title and the axis.  |

<sup>1</sup>
If `grid` is unspecified for X and Y, the default value is `true` for (1) quantitative fields that are not binned and (2) time fields.  Otherwise, the default value is `false`.

<sup>2</sup>
If `title` is unspecified, the default value is produced from the field's name and transformation function applied e.g, "field_name", "SUM(field_name)", "BIN(field_name)", "YEAR(field_name)".

<sup>3</sup>
If `titleOffset` is unspecified, the default value is automatically determined.
<!-- TODO: add detail about default behavior -->

----

### ▸ `legend`

<!-- TODO: add support for turning legends off -->

Similar to axes, legends visualize scales. However, whereas axes aid interpretation of scales with spatial ranges, legends aid interpretation of scales with ranges such as colors, shapes and sizes.

By default, Vega-Lite automatically creates legends for `color`, `size`, and `shape` channels when they are encoded.
The field's legend can be removed by setting `legend` to `false`.
If `legend` is `true`, default legend properties are applied.
Legend properties can be overridden by setting `legend` to a legend property object.
The `legend` property object supports the following [Vega legend properties](https://github.com/vega/vega/wiki/Legends#legend-properties):
`orient`, `title`, `format`, `values`, and `properties`.

See [Vega documentation](https://github.com/vega/vega/wiki/Legends#legend-properties) for more information about each property.

<!-- TODO: add a table here instead of pointing to Vega-->

----

## Channel Specific Properties

_(More Detail Coming Soon)_
