Vega-lite's top-level `encoding` property is a key-value mapping between
encoding channels (`x`,`y`, `row`, `col`, `color`, `size`, `shape`, `text`,
`detail`) and encoding property definitions.

Each encoding property definition object contains:
- a field reference to the variable by `name` or a constant value `value`
- the variable's data `type`
- its inline transformation including aggregation (`aggregate`), binning (`bin`), and time unit conversion (`timeUnit`).
- optional configuration properties for `scale`, `axis`, and `legends` of the encoding channel.

__TODO: add missing parameters (band, channel specific properties)__


# Common Encoding Properties

Here are the list of common properties of the encoding property definition object:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| name          | String        | A field/variable from which to pull a data value.  __<sup>1</sup>__  |
| value         | String,Integer |                                            |
| type          | String        | Data Type (`Q` for quantitative, `O` for ordinal, `T` for temporal, and `N` for nominal).  __<sup>2</sup>__ |
| [axis](#axis)        | Object        | Configuration object for the encoding's axis    |
| [legends](#legends)  | Object        | Configuration object for the encoding's legends |
| [scale](#scale)      | Object        | Configuration object for the encoding's scale   |
| [sort](#sort)        | String \| Object        | For all types of fields, if specified to `ascending` or `descending`, the domain values are sorted in based on the field's value in ascending or descending order. For nominal and ordinal fields, if set to an object, the values in the scale domain will be sorted based on an aggregate calculation over a specified sort field.  <!--  TODO say what happen when sort is unspecified. -->  See [Sort](#sort) section for more information.  |
| [aggregate](#aggregate) | String        | Aggregation function for the field (`mean`, `sum`, `median`, `min`, `max`, `count`)  |

| [bin](#bin)          | Object        | Binning properties.  See [Binning](#Binning) |
| [timeUnit](#timeunit)| String        | Property for converting time unit            |


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

__Pending Revision__: We are revising how binning should be specified in Vega-lite and properties for binning.  Other properties in [Datalib's binning ](https://github.com/vega/datalib/wiki/Statistics#dl_bins) such as `min`, `max`, `maxbins`, `step`, `steps`, `minstep`, `div` will be added once this is revised.

## timeUnit

`timeUnit` property can be specified for converting timeUnit for temporal field.  Current supported values for `timeUnit` are `year`, `month`, `day`, `date`, `hours`, `minutes`, `seconds`.

__In Roadmap__: Support for other values such as `year-month`, `year-month-day`, `hour-minute`.

__Pending Revision__: Time Unit Conversion might be consolidated with "calculated field" feature using vega/datalib's template syntax.

## aggregate

Vega-lite supports all [Vega aggregation operations](https://github.com/vega/vega/wiki/Data-Transforms#-aggregate).

If at least one of the specified encoding channel contains aggregation, a summary data table (`aggregate`) will be computed from the source data table (after binning and time unit have been derived) and the resulting visualization shows data from this summary table.  In this case, all fields without aggregation function specified are treated as dimensions.  The summary statistics are grouped by these dimensions.

If none of the specified encoding channel contains aggregation, no additional data table is created.

## scale

Vega-lite's `scale` object supports the following Vega scale properties:


- [Vega Common Scale Properties](https://github.com/vega/vega/wiki/Scales#common-scale-properties)__<sup>2</sup>__: `type`__<sup>1,2</sup>__.


- [Vega Quantitative Scale Properties](https://github.com/vega/vega/wiki/Scales#quantitative-scale-properties)__<sup>3</sup>__: `nice` and `zero`


See [Vega's documentation](https://github.com/vega/vega/wiki/Scales#common-scale-properties) for more information about these properties.


Moreover, Vega-lite has the following additional scale properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| useRawDomain  | Boolean       | Use the raw data instead of summary data for scale domain (Only for aggregated field).  Note that this option does not work with sum or count aggregate as they could have a substantially larger scale range. |


__<sup>1</sup>__ `reverse` is excluded from Vega-lite's `scale` to avoid conflicting with `sort` property.  Please use `sort='descending'` instead.

__<sup>2</sup>__ __In Roadmap__:
Other applicable Vega scale properties will be added. [#181](../../issues/181)

__<sup>3</sup>__
Vega-lite automatically determines scale's `type` based on the field's data type.
By default, scales of nominal and ordinal fields are ordinal scales.
Scales of time fields are time scales if time unit conversion is not applied.
Scales of quantitative fields are linear scales by default, but users can specify `type` property to use other types of quantitative scale.



## axis

Vega-lite's `axis` object supports the following [Vega axis properties](https://github.com/vega/vega/wiki/Axes#axis-properties):
`format`, `grid`<sup>1</sup>, `layer`, `orient`, `ticks`, `title` <sup>2</sup>, and `titleOffset`<sup>3,4</sup>.
See [Vega documentation](https://github.com/vega/vega/wiki/Axes#axis-properties) for more information.

Moreover, Vega-lite supports the following additional axis properties.

| Property        | Type          | Description    |
| :------------   |:-------------:| :------------- |
| maxLabelLength  | Integer       | Max length for axis labels. Longer labels are truncated. (25 by default.) |
| labelAngle      | Integer       | Angle by which to rotate labels. Set to 0 to force horizontal.   |
| titleMaxLength  | Integer       | Max length for axis title when the title is automatically generated from the field\'s description.  If the   |
| titleOffset     | Integer       | Offset between the axis title and the axis.  |

<sup>1</sup>
If `grid` is unspecified, the default value is `true` for ROW and COL. For X
and Y, the default value is `true` for quantitative and time fields and `false`
otherwise.

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

`sort` property can be specify for sorting the field's values in multiple ways:

- `undefined` - the field is unsorted.
- (as __String__) `'ascending'` or `'descending'` – the field is sort by the field's value in ascending or descending order.
- (as __Object__) A sort field object - for sorting the field by an aggregate calculation over a specified sort field.  A sort field object has the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| _sort.field_  | Field         | The field name to aggregate over.|
| _sort.op_     | String        | A valid [aggregation operation](Data-Transforms#-aggregate) (e.g., `mean`, `median`, etc.).|
| _sort.order_  | String        | (Optional) `'ascending'` or `'descending'` order. |




# Channel Specific Properties

_(Coming Soon)_