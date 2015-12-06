---
layout: docs
title: Encoding
permalink: /docs/encoding.html
---

Vega-Lite's top-level `encoding` property describes a mapping between
encoding channels (such as `x`,`y`, and `color`) and [field definitions](#field-definition).
Each field definition object describes
a constant `value` or a reference to the `field` name and its data `type` and inline transformation (`aggregate`, `bin`, `sort` and `timeUnit`).
Each field definition object can also optionally include configuration properties for `scale`, `axis`, and `legend`.

# Encoding Channels

Vega-Lite supports the following encoding channels: `x`,`y`, `row`, `column`, `color`, `size`, `shape`, `text`, `detail`.
These channels are properties for the top-level `encoding` definition object.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| x, y          | [FieldDef](#field-definition)| Description of a field mapped to x or y coordinates (or to width or height for `bar` and `area` marks). |
| row, column   | [FieldDef](#field-definition)| Description of a field that facets data into vertical and horizontal [trellis plots](https://en.wikipedia.org/wiki/Small_multiple) respectively. |
| color | [FieldDef](#field-definition)| Description of a field mapped to color or a constant value for color.  The values are mapped to hue if the field is nominal, and mapped to saturation otherwise.  |
| shape  | [FieldDef](#field-definition)| Description of a field mapped to shape encoding or a constant value for shape.   `shape` channel is only applicable for `point` marks.  |
| size  | [FieldDef](#field-definition)| Description of a field mapped to size encoding or a constant value for size.  `size` channel is currently not applicable for `line` and `area`. |
| detail | [FieldDef](#field-definition)| Description of a field that serves as an additional dimension for aggregate views without mapping to a specific visual channel.  `detail` channel is  not applicable raw plots (plots without aggregation). |

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
| maxbins       | Integer       | The maximum number of allowable bins.  If unspecified, this is 6 for `row`, `column` and `shape` and 10 for other channels.  See [Datalib's binning documentation](https://github.com/vega/datalib/wiki/Statistics#dl_bins) for more information. |
| min                 | Number              | The minimum bin value to consider. If unspecified, the minimum value of the specified field is used.|
| max                 | Number              | The maximum bin value to consider. If unspecified, the maximum value of the specified field is used.|
| base                | Number              | The number base to use for automatic bin determination (default is base 10).|
| step                | Number              | An exact step size to use between bins. If provided, options such as maxbins will be ignored.|
| steps               | Array               | An array of allowable step sizes to choose from.|
| minstep             | Number              | A minimum allowable step size (particularly useful for integer values).|
| div                 | Array               | Scale factors indicating allowable subdivisions. The default value is [5, 2], which indicates that for base 10 numbers (the default base), the method may consider dividing bin sizes by 5 and/or 2. For example, for an initial step size of 10, the method can check if bin sizes of 2 (= 10/5), 5 (= 10/2), or 1 (= 10/(5*2)) might also satisfy the given constraints.|

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

Vega-Lite's `scale` definition supports the following properties<sup>1</sup>:

#### Common Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| type          | String        | The type of scale. This is only customizable for quantitative and temporal fields. <br/> For a quantitative field, the default value is `linear`. Other supported quantitative scale types  are `linear`, `log`, `pow`, `sqrt`, `quantile`, `quantize`, and `threshold`.  <br/> For a temporal field without time unit, the scale type should be `time` (default) or `utc` (for UTC time).  For temporal fields with time units, the scale type can also be `ordinal` (default for `hours`, `day`, `date`, `month`) or `linear` (default for `year`, `second`, `minute`). <br/> See [d3 scale documentation](https://github.com/mbostock/d3/wiki/Quantitative-Scales) for more information.|
| domain        | Array  | By default, the field's scale draw domain values directly from the field's values.  Custom domain values can be specified.  For quantitative data, this can take the form of a two-element array with minimum and maximum values. For ordinal/categorical data, this may be an array of valid input values. |
| range        | Array &#124; String  | For `x` and `y`, the range covers the chart's cell width and cell height respectively by default.  For `color`, the default range is `'category10'` for nominal fields, and a green ramp (`['#AFC6A3', '#09622A']`) for other types of fields.  <!-- TODO default for size size -->  For `shape`, the default is [Vega's `"shape"` preset](https://github.com/vega/vega/wiki/Scales#scale-range-literals).  For `row` and `column`, the default range is `width` and `height` respectively.  <br/> Custom domain values can be specified. For numeric values, the range can take the form of a two-element array with minimum and maximum values. For ordinal or quantized data, the range may by an array of desired output values, which are mapped to elements in the specified domain. [See Vega's documentation on range literals for more options](https://github.com/vega/vega/wiki/Scales#scale-range-literals). |
| round         | Boolean       | If true, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid.|

#### Ordinal Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| bandWidth     | Number        | Width for each ordinal band.  <!--TODO need to write better explanation --> |
| points        | Boolean       | If true (default), distributes the ordinal values over a quantitative range at uniformly spaced points. The spacing of the points can be adjusted using the _padding_ property. If false, the ordinal scale will construct evenly-spaced bands, rather than points.  |
| padding       | Number        | Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. If the __points__ parameter is `true`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. Otherwise, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the range band width will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).|


#### Time Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| clamp         | Boolean       | If true (default), values that exceed the data domain are clamped to either the minimum or maximum range value.|
| nice          | String        | If specified, modifies the scale domain to use a more human-friendly value range. For `time` and `utc` scale types only, the nice value should be a string indicating the desired time interval; legal values are `"second"`, `"minute"`, `"hour"`, `"day"`, `"week"`, `"month"`, or `"year"`.|

#### Quantitative Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| clamp         | Boolean       | If true (default), values that exceed the data domain are clamped to either the minimum or maximum range value.|
| exponent      | Number        | Sets the exponent of the scale transformation. For `pow` scale types only, otherwise ignored.|
| nice          | Boolean       | If true, modifies the scale domain to use a more human-friendly number range (e.g., 7 instead of 6.96).|
| zero          | Boolean       | If true, ensures that a zero baseline value is included in the scale domain. This option is ignored for non-quantitative scales.  If unspecified, zero is true by default. |
| useRawDomain<sup>1</sup>  | Boolean       | (For aggregate field only) If false (default), draw domain data the aggregate (`summary`) data table.  If true, use the raw data instead of summary data for scale domain.  This property only works with aggregate functions that produce values ranging in the domain of the source data (`'mean'`, `'average'`, `'stdev'`, `'stdevp'`, `'median'`, `'q1'`, `'q3'`, `'min'`, `'max'`).  Otherwise, this property is ignored.  If the scale's `domain` is specified, this property is also ignored. |

<small>
__<sup>1</sup>__ All Vega-Lite scale properties exist in Vega except `useRawDomain`, which is a special property in Vega-Lite.  Some Vega properties are excluded in Vega-Lite. For example,  `reverse` is excluded from Vega-Lite's `scale` to avoid conflicts with `sort` property.  Please use `sort` of a field definition to `'descending'` to get similar behavior to setting  `reverse` to `true` in Vega.  
</small>
----

### ▸ `axis`

Axes provide axis lines, ticks and labels to convey how a spatial range represents a data range. Simply put, axes visualize scales.

Vega-Lite's `axis` object supports the following [Vega axis properties](https://github.com/vega/vega/wiki/Axes#axis-properties):

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| orient        | String        | The orientation of the axis. One of `top` or `bottom` for `y` and `row` channels, and `left` or `right` for `x` and `column` channels.  By default, `x` axis is placed on the bottom, `y` axis is placed on the left, `column`'s x-axis is placed on the top, `row`'s y-axis is placed on the right. |
| title         | String        | A title for the axis.  If `title` is unspecified, the default value is produced from the field's name and transformation function applied e.g, "field_name", "SUM(field_name)", "BIN(field_name)", "YEAR(field_name)". |
| titleOffset   | Number        | The offset (in pixels) from the axis at which to place the title.|
| format        | String        | The formatting pattern for axis labels. Vega uses [D3's format pattern](https://github.com/mbostock/d3/wiki/Formatting).|
| ticks         | Number        | A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale's range.  |
| layer         | String        | A string indicating if the axis (and any gridlines) should be placed above or below the data marks. One of `"front"` or `"back"` (default).|
| grid          | Boolean       | A flag indicate if gridlines should be created in addition to ticks.  If `grid` is unspecified for X and Y, the default value is `true` for (1) quantitative fields that are not binned and (2) time fields.  Otherwise, the default value is `false`. |
| properties    | Object        | Optional mark property definitions for custom axis styling. The input object can include sub-objects for `ticks` (both major and minor), `majorTicks`, `minorTicks`, `labels` and `axis` (for the axis line).  These mark property definitions can make value references to their scale domain data via `data` property like so: `{field: "data"}`. This is a shorthand for `{field: {datum: "data"}}`. The template follows suite: `{template: "datum.data"}`. |


<!--TODO: elaborate example for the properties group -->

<!--TODO: what's the default behavior for format, `ticks,  default values for `axis` and `labels` properties groups -->


<!--TODO: Add this part of table once we support these properties
| values        | Array         | Explicitly set the visible axis tick values.|
| subdivide     | Number        | If provided, sets the number of minor ticks between major ticks (the value 9 results in decimal subdivision). Only applicable for axes visualizing quantitative scales.|
| tickPadding   | Number        | The padding, in pixels, between ticks and text labels.|
| tickSize      | Number        | The size, in pixels, of major, minor and end ticks.|
| tickSizeMajor | Number        | The size, in pixels, of major ticks.|
| tickSizeMinor | Number        | The size, in pixels, of minor ticks.|
| tickSizeEnd   | Number        | The size, in pixels, of end ticks.|
| offset        | Number &#124; Object| If a number, then the value is the offset, in pixels, by which to displace the axis from the edge of the enclosing group or data rectangle. The offset can also be specified as an object with `scale` and `value` properties in which `scale` refers to the name of a scale and `value` is a value in the domain of the scale. The resulting value will be a number in the range of the scale.| -->

Moreover, Vega-Lite supports the following additional axis properties.

| Property        | Type          | Description    |
| :------------   |:-------------:| :------------- |
| labelMaxLength  | Integer       | Max length for axis labels. Longer labels are truncated. (25 by default.) |
| labelAngle      | Integer       | Angle by which to rotate labels. Set to 0 to force horizontal.   |
| titleMaxLength  | Integer       | Max length for axis title when the title is automatically generated from the field\'s description. |
| titleOffset     | Integer       | Offset between the axis title and the axis.  |


----

### ▸ `legend`

Similar to axes, legends visualize scales. However, whereas axes aid interpretation of scales with spatial ranges, legends aid interpretation of scales with ranges such as colors, shapes and sizes.

By default, Vega-Lite automatically creates legends for `color`, `size`, and `shape` channels when they are encoded.
The field's legend can be removed by setting `legend` to `false`.
If `legend` is `true`, default legend properties are applied.

Legend properties can be overridden by setting `legend` to a legend property object.
The `legend` property object supports the following [Vega legend properties](https://github.com/vega/vega/wiki/Legends#legend-properties):

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| orient        | String        | The orientation of the legend. One of `"left"` or `"right"`. This determines how the legend is positioned within the scene. The default is `"right"`.|
| title         | String        | The title for the legend.  If `title` is unspecified, the default value is produced from the field's name and transformation function applied e.g, "field_name", "SUM(field_name)", "BIN(field_name)", "YEAR(field_name)". |
| format        | String        | An optional formatting pattern for legend labels. Vega uses [D3's format pattern](https://github.com/mbostock/d3/wiki/Formatting).|
| values        | Array         | Explicitly set the visible legend values.|
| properties    | Object        | Optional mark property definitions for custom legend styling. The input object can include sub-objects for `title`, `labels`, `symbols` (for discrete legend items), `gradient` (for a continuous color gradient) and `legend` (for the overall legend group).  These mark property definitions can make value references to their scale domain data via `data` property like so: `{field: "data"}`. This is a shorthand for `{field: {datum: "data"}}`. The template follows suite: `{template: "datum.data"}`. |

<!--TODO: elaborate example for the properties group -->
