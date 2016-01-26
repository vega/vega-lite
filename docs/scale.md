---
layout: docs
title: Scale
permalink: /docs/scale.html
---

<!-- TODO: intro -- what is a scale + by default vega produces scale based on field type.  -->

Vega-Lite's `scale` definition supports the following properties<sup>1</sup>:

## Common Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| type          | String        | The type of scale. This is only customizable for quantitative and temporal fields. <br/> For a quantitative field, the default value is `linear`. Other supported quantitative scale types  are `linear`, `log`, `pow`, `sqrt`, `quantile`, `quantize`, and `threshold`.  <br/> For a temporal field without time unit, the scale type should be `time` (default) or `utc` (for UTC time).  For temporal fields with time units, the scale type can also be `ordinal` (default for `hours`, `day`, `date`, `month`) or `linear` (default for `year`, `second`, `minute`). <br/> See [d3 scale documentation](https://github.com/mbostock/d3/wiki/Quantitative-Scales) for more information.|
| domain        | Array  | By default, the field's scale draw domain values directly from the field's values.  Custom domain values can be specified.  For quantitative data, this can take the form of a two-element array with minimum and maximum values. For ordinal/categorical data, this may be an array of valid input values. |
| range        | Array &#124; String  | For `x` and `y`, the range covers the chart's cell width and cell height respectively by default.  For `color`, the default range is `"category10"` for nominal fields, and a green ramp (`['#AFC6A3', '#09622A']`) for other types of fields.  <!-- TODO default for size size -->  For `shape`, the default is [Vega's `"shape"` preset](https://github.com/vega/vega/wiki/Scales#scale-range-literals).  For `row` and `column`, the default range is `width` and `height` respectively.  <br/> Custom domain values can be specified. For numeric values, the range can take the form of a two-element array with minimum and maximum values. For ordinal or quantized data, the range may by an array of desired output values, which are mapped to elements in the specified domain. [See Vega's documentation on range literals for more options](https://github.com/vega/vega/wiki/Scales#scale-range-literals). |
| round         | Boolean       | If true, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid.|

## Ordinal Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| bandWidth     | Number        | Width for each ordinal band.  <!--TODO need to write better explanation --> |
| padding       | Number        | Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. For `x` and `y`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. For `row` and `column`, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the range band width will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).|

<!-- TODO: add outperPadding -->

## Time Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| clamp         | Boolean       | If true (default), values that exceed the data domain are clamped to either the minimum or maximum range value.|
| nice          | String        | If specified, modifies the scale domain to use a more human-friendly value range. For `time` and `utc` scale types only, the nice value should be a string indicating the desired time interval; legal values are `"second"`, `"minute"`, `"hour"`, `"day"`, `"week"`, `"month"`, or `"year"`.|

## Quantitative Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| clamp         | Boolean       | If true (default), values that exceed the data domain are clamped to either the minimum or maximum range value.|
| exponent      | Number        | Sets the exponent of the scale transformation. For `pow` scale types only, otherwise ignored.|
| nice          | Boolean       | If true, modifies the scale domain to use a more human-friendly number range (e.g., 7 instead of 6.96).|
| zero          | Boolean       | If true, ensures that a zero baseline value is included in the scale domain. This option is ignored for non-quantitative scales.  If unspecified, zero is true by default. |
| useRawDomain<sup>1</sup>  | Boolean       | (For aggregate field only) If false (default), draw domain data the aggregate (`summary`) data table.  If true, use the raw data instead of summary data for scale domain.  This property only works with aggregate functions that produce values ranging in the domain of the source data (`"mean"`, `"average"`, `"stdev"`, `"stdevp"`, `"median"`, `"q1"`, `"q3"`, `"min"`, `"max"`).  Otherwise, this property is ignored.  If the scale's `domain` is specified, this property is also ignored. |

<small>
__<sup>1</sup>__ All Vega-Lite scale properties exist in Vega except `useRawDomain`, which is a special property in Vega-Lite.  Some Vega properties are excluded in Vega-Lite. For example,  `reverse` is excluded from Vega-Lite's `scale` to avoid conflicts with `sort` property.  Please use `sort` of a field definition to `"descending"` to get similar behavior to setting  `reverse` to `true` in Vega.  
</small>
