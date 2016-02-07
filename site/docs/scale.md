---
layout: docs
menu: docs
title: Scale
permalink: /docs/scale.html
---

Scales are functions that transform a domain of data values (numbers, dates, strings, etc) to a range of visual values (pixels, colors, sizes). A scale function takes a single data value as input and returns a visual value.  

By default, Vega-Lite creates default scales for fields that are mapped to visual channels.  To customize properties of a scale, the following properties can be specified as part of the [channel definition's `scale` property](encoding.html#def).

{: .suppress-error}
```json
{
  "data": ... ,       
  "mark": ... ,       
  "encoding": {     
    "x": {
      "field": ...,
      "type": "quantitative",
      "scale": {                // scale
        "type": ...
      },
      ...
    },
    "y": ...,
    ...
  },
  ...
}
```

## Scale Type

<!-- TODO: explain what are these types of scale.  Maybe look at D3 docs for inspiration -->

Vega-Lite automatically determines scale type based on the data type of a field.

- For *ordinal* and *nominal* fields, the scale type is always ordinal.  
- For a *quantitative* field, the scale type is `"linear"` by default.
<!-- TODO: write default scale type for timeUnit -->


| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| type          | String        | The type of scale. This is only customizable for quantitative and temporal fields. <br/> •  Supported quantitative scale types  are `"linear"`, `"log"`, `"pow"`, `"sqrt"`, `"quantile"`, `"quantize"`, and `"threshold"`.  <br/> • For a _temporal_ field without time unit, the scale type should be `time` (default) or `utc` (for UTC time).  For temporal fields with time units, the scale type can also be `ordinal` (default for `hours`, `day`, `date`, `month`) or `linear` (default for `year`, `second`, `minute`). <br/> See [d3 scale documentation](https://github.com/mbostock/d3/wiki/Quantitative-Scales) for more information. |

{:#domain}
## Scale Domain

By default, Vega-Lite's scale draw domain values directly from the field's values.  Custom domain values can be specified via the scale's `domain` property.  

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| domain        | Array         | Custom domain values.  For quantitative data, this can take the form of a two-element array with minimum and maximum values. For ordinal/categorical data, this may be an array of valid input values. |

{:#range}
## Scale Range

By default, Vega-Lite provides the following default values:
- For `x` and `y`, the range covers the chart's cell width and cell height respectively.  
- For `color`, the default range is `"category10"` for nominal fields, and a green ramp (`["#AFC6A3", "#09622A"]`) for other types of fields.
- For `shape`, the default is [Vega's `"shape"` preset](https://github.com/vega/vega/wiki/Scales#scale-range-literals).
<!-- what is the implication of this -->
- For `row` and `column`, the default range is `width` and `height` respectively.  

Custom range values can be specified via the scale's `range` property.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| range        | Array &#124; String  | For numeric values, the range can take the form of a two-element array with minimum and maximum values. For ordinal or quantized data, the range may be an array of desired output values, which are mapped to elements in the specified domain. [See Vega's documentation on range literals for more options](https://github.com/vega/vega/wiki/Scales#scale-range-literals). |

## Other Scale Properties

### General Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| round         | Boolean       | If true, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid.|

<!-- TODO default for size size -->
<!-- TODO: Explain default domain for month and (week)day -->

### Ordinal Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| bandWidth     | Number        | Width for each ordinal band. |
| padding       | Number        | Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. <br/> • For `x` and `y`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. <br/> • For `row` and `column`, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the range band width will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).|

<!-- TODO: better explanation for bandWidth-->
<!-- TODO: add outerPadding -->

### Time Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| clamp         | Boolean       | If true (default), values that exceed the data domain are clamped to either the minimum or maximum range value.|
| nice          | String        | If specified, modifies the scale domain to use a more human-friendly value range. For `time` and `utc` scale types only, the nice value should be a string indicating the desired time interval; legal values are `"second"`, `"minute"`, `"hour"`, `"day"`, `"week"`, `"month"`, or `"year"`.|

### Quantitative Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| clamp         | Boolean       | If true (default), values that exceed the data domain are clamped to either the minimum or maximum range value.|
| exponent      | Number        | Sets the exponent of the scale transformation. For `pow` scale types only, otherwise ignored.|
| nice          | Boolean       | If true, modifies the scale domain to use a more human-friendly number range (e.g., 7 instead of 6.96).|
| zero          | Boolean       | If true, ensures that a zero baseline value is included in the scale domain. This option is ignored for non-quantitative scales.  If unspecified, zero is true by default. |

<!-- | useRawDomain<sup>1</sup>  | Boolean       | (For aggregate field only) If false (default), draw domain data the aggregate (`summary`) data table.  If true, use the raw data instead of summary data for scale domain.  This property only works with aggregate functions that produce values ranging in the domain of the source data (`"mean"`, `"average"`, `"stdev"`, `"stdevp"`, `"median"`, `"q1"`, `"q3"`, `"min"`, `"max"`).  Otherwise, this property is ignored.  If the scale's `domain` is specified, this property is also ignored. | -->

<!-- TODO: rewrite in "relationship to Vega"?
<small>
__<sup>1</sup>__ All Vega-Lite scale properties exist in Vega except `useRawDomain`, which is a special property in Vega-Lite.  Some Vega properties are excluded in Vega-Lite. For example,  `reverse` is excluded from Vega-Lite's `scale` to avoid conflicts with `sort` property.  Please use `sort` of a field definition to `"descending"` to get similar behavior to setting  `reverse` to `true` in Vega.  
</small>
-->

-------

<!-- TODO: should example be here or separate in each section above? -->

#### Example: Log Scale

TODO: put scatter_log.json here

#### Example: Default Color Map based on Data Type

__TODO__
<!-- Example: nominal -->
<!-- Example: ordinal -->
<!-- Example: quantitative -->


#### Example: Custom Color Range

TODO: put bar_layered_transparent.json or its variation in mark.md here

#### Example: Custom Domain

TODO: Custom Domain
