Vega-Lite's top-level `encoding` property is a key-value mapping between
encoding channels (`x`,`y`, `row`, `col`, `color`, `size`, `shape`, `text`,
`detail`) and encoding definitions.

Each encoding definition object contains:
- A field's definition
  - A field reference to the variable by `name` or a constant value `value`
  - The variable's data `type`
  - Its inline transformation including aggregation (`aggregate`), binning (`bin`), and time unit conversion (`timeUnit`).
- Optional configuration properties for `scale`, `axis`, and `legends`, `stack` of the encoding channel.

__TODO: add missing parameters (band, channel specific properties)__

# Encoding Properties

Here are the list of properties of the encoding property definition object:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| name __<sup>1</sup>__ | String        | Name of the field/variable from which to pull a data value.    |
| value         | String,Integer | A constant value |
| type          | String        | Data type of the field.  This property accepts both full type names (`'quantitative'`, `'temporal'`, `'ordinal'`,  and `'nominal'`), or an initial character (`'Q'`, `'T'`, `'O'`, `'N'`).  __<sup>2</sup>__ |
| [aggregate](#aggregate) | String        | Aggregation function for the field (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).  |
| [bin](#bin)          | Boolean \| Object        | Boolean flag / configuration object for binning.  See [Binning](#Binning) |
| [timeUnit](#timeunit)| String        | Property for converting time unit            |
| [sort](#sort)        | String \| Object        | Sort order for a particular field.  This can be string (`'ascending'`, `'descending'`, or `'unsorted'`) or a sort field definition object for sorting by an aggregate calculation of a specified sort field.  If unspecified, the default value is `ascending`.  See [Sort](#sort) section for more information. |
| [axis](#axis)        | Object        | Configuration object for the encoding's axis    |
| [legends](#legends)  | Object        | Configuration object for the encoding's legends |
| [scale](#scale)      | Object        | Configuration object for the encoding's scale   |
| [stack](#stack)      | Boolean \| Object        | Boolean flag / configuration object for stacking (only for bar and area marks). See [Stack](#stack).  |


__<sup>1</sup>__ __Pending Revision__
`name` properties will be renamed to `field` to be consistent with the rest of Vega projects.  [#480](/vega/vega-lite/issues/480)

__<sup>2</sup>__ __Pending Revision__
We are considering other properties of variables including specifying primitive type.

## bin

Each field can be binned by specifying a `bin` property definition object.
If `bin` is `undefined`, no binning is applied.

A quantitative field's `bin` property object contains the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| maxbins       | Integer       | The maximum number of allowable bins.  See [Datalib's binning documentation](https://github.com/vega/datalib/wiki/Statistics#dl_bins) for more information |

__Pending Revision__: We are revising how binning should be specified in Vega-Lite and properties for binning.  Other properties in [Datalib's binning ](https://github.com/vega/datalib/wiki/Statistics#dl_bins) such as `min`, `max`, `maxbins`, `step`, `steps`, `minstep`, `div` will be added once this is revised.

## timeUnit

`timeUnit` property can be specified for converting timeUnit for temporal field.  Current supported values for `timeUnit` are `year`, `month`, `day`, `date`, `hours`, `minutes`, `seconds`.

__In Roadmap__: Support for other values such as `year-month`, `year-month-day`, `hour-minute`.

__Pending Revision__: Time Unit Conversion might be consolidated with "calculated field" feature using vega/datalib's template syntax.

## aggregate

Vega-Lite supports all [Vega aggregation operations](https://github.com/vega/vega/wiki/Data-Transforms#-aggregate) (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).

If at least one of the specified encoding channel contains aggregation, a summary data table (`aggregate`) will be computed from the source data table (after binning and time unit have been derived) and the resulting visualization shows data from this summary table.  In this case, all fields without aggregation function specified are treated as dimensions.  The summary statistics are grouped by these dimensions.

If none of the specified encoding channel contains aggregation, no additional data table is created.

## scale

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

Moreover, Vega-Lite has the following additional scale properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| useRawDomain  | Boolean       | Use the raw data instead of summary data for scale domain (Only for aggregated field).  This property only works with aggregate functions that produce values ranging in the domain of the source data (`'mean'`, `'average'`, `'stdev'`, `'stdevp'`, `'median'`, `'q1'`, `'q3'`, `'min'`, `'max'`).  Otherwise, this property is ignored.  If the scale's `domain` is specified, this property is also ignored. |

__TODO: document default behavior for each properties__

__<sup>1</sup>__ `reverse` is excluded from Vega-Lite's `scale` to avoid conflicting with `sort` property.  Please use `sort='descending'` instead.


__<sup>2</sup>__
Vega-Lite automatically determines scale's `type` based on the field's data type.
By default, scales of nominal and ordinal fields are ordinal scales.
Scales of time fields are time scales if time unit conversion is not applied.
Scales of quantitative fields are linear scales by default, but users can specify `type` property to use other types of quantitative scale.



## axis

Vega-Lite's `axis` object supports the following [Vega axis properties](https://github.com/vega/vega/wiki/Axes#axis-properties):
`format`, `grid`<sup>1</sup>, `layer`, `orient`, `ticks`, `title` <sup>2</sup>, and `titleOffset`<sup>3,4</sup>.
See [Vega documentation](https://github.com/vega/vega/wiki/Axes#axis-properties) for more information.

Moreover, Vega-Lite supports the following additional axis properties.

| Property        | Type          | Description    |
| :------------   |:-------------:| :------------- |
| labelMaxLength  | Integer       | Max length for axis labels. Longer labels are truncated. (25 by default.) |
| labelAngle      | Integer       | Angle by which to rotate labels. Set to 0 to force horizontal.   |
| titleMaxLength  | Integer       | Max length for axis title when the title is automatically generated from the field\'s description.  If the   |
| titleOffset     | Integer       | Offset between the axis title and the axis.  |

<sup>1</sup>
If `grid` is unspecified, the default value is `true` for ROW and COL.
For X and Y, the default value is `true` for (1) quantitative fields that are not binned and (2) time fields.
Otherwise, the default value is `false`.

<sup>2</sup>
If `title` is unspecified, the default value is produced from the field's name and transformation function applied e.g, "field_name", "SUM(field_name)", "BIN(field_name)", "YEAR(field_name)".

<sup>3</sup>
If `titleOffset` is unspecified, the default value is automatically determined.
__TODO: add detail about default behavior__

<sup>4</sup> __In Roadmap__:
Other applicable Vega axis properties will be added. [#181](../../issues/181)


## legends

_(Coming Soon)_

__In Roadmap__:
Other applicable Vega legends properties will be added. [#181](../../issues/181)

For now please see [legends json schema in schema.js](https://github.com/uwdata/vega-lite/blob/master/src/schema/schema.js#L265)

## sort

Each encoding channel's values can be sorted using the `'sort'` property.  For
`x`, `y`, `row` and `col`, this determines the order of each value's position.
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




# Channel Specific Properties

## Stack

Stacked bar chart and stacked area chart can be specified using `'stack'`
property in the `'color'` encoding channel.
Stack is only applicable only for bar and area marks.  Otherwise, stack property is
ignored.

When applicable, `'stack'` property can be either boolean or a definition
object.  When specified as `'boolean'`, default properties are applied.
`'stack'` definition object has the following properties:



| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| _stack.offset_| String        | The baseline offset style. One of `"zero"` (default), `"center"`, or `"normalize"`. The `"center"` offset will center the stacks. The `"normalize"` offset will compute percentage values for each stack point; the output values will be in the range [0,1].|

__TODO: order or reverse?__



## Other

_(Coming Soon)_
