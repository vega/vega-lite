---
layout: docs
menu: docs
title: Scale
permalink: /docs/scale.html
---

Scales are functions that transform a domain of data values (numbers, dates, strings, etc) to a range of visual values (pixels, colors, sizes).

Vega-Lite automatically creates scales for fields that are [mapped to mark properties](#props-channels).  Default scale properties are determined based on a set of rules, but [`scale`](encoding.html#scale-and-guide) property of the channel definition can be provided to customize the scale's properties.

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

The rest of this page describes properties of a scale and their default behavior.  

* TOC
{:toc}

{:#type}
## Scale Type

Vega-Lite supports the following scales types:

Quantitative Scales
: Quantitative scales take continuous, quantitative data as their input domain.  There are multiple types of quantitative scales. `linear`, `power`, and `log` scales output continuous ranges.  Meanwhile `quantize` and `quantile` scales output discrete ranges.  

- `linear` scale expresses each range value _y_ as a linear function of the domain value _x_: _y = mx + b_.  This is the default scale for a quantitative field (field with `type` = `"quantitative"`).
- `pow` scale expresses each range value _y_ as a power (exponential) function of the domain value _x_: _y = mx^k + b_, where _k_ is the exponent value.  (_k_ can be customized using [`exponent`](#quant-props) property.)
- `log` scale expresses each range value _y_ as a logarithmic function of the domain value _x_: _y = mlog(x) + b_.  As _log(0) = -∞_, a log scale domain must be strictly-positive or strictly-negative; the domain must not include or cross zero.  Vega-Lite automatically filters zero values from the field mapped to a log scale.  
- `quantize` scale maps continuous value to a discrete range by dividing the domain into uniform segments based on the number of values in (i.e., the cardinality of) the output range.  Each range value _y_ can be expressed as a quantized linear function of the domain value _x_: _y = m round(x) + b_.  
- `quantile` scale maps a sampled input domain to a discrete range by sorting the domain and compute the quantiles.  The cardinality of the output range determines the number of quantiles that will be computed.

<!-- TODO: need to test if we support threshold scale correctly before writing about it-->

Time Scales
: A `time` scale is similar to a linear quantitative scale but takes date as input.  By default, a temporal field has `time` scale by default (except a temporal field with `hours`, `day`, `date`, `month` as time unit has ordinal scale by default).  
<br/>`utc` is a time scale that uses [Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) rather than local time.

Discrete Ordinal Scale
: A discrete ordinal scale (`ordinal`) take discrete domain as their input domain.    Ordinal (ordered) and nominal (unordered/categorical) data always use `ordinal` scale.
<!-- TODO: talk about discrete/continuous range (modified by `ramp` property). -->

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| type          | String        | The type of scale. <br/> •  For a _quantitative_ field, supported quantitative scale types  are `"linear"` (default), `"log"`, `"pow"`, `"sqrt"`, `"quantile"`, `"quantize"`, and `"threshold"`.  <br/> • For a _temporal_ field without `timeUnit`, the scale type should be `time` (default), `utc` or `ordinal`.  <br/>  • For _ordinal_ and _nominal_ fields, the type is always `ordinal`. <br/>Unsupported values will be ignored.  |

**Note:**
For more information about scale types, please see [d3 scale documentation](https://github.com/mbostock/d3/wiki/Quantitative-Scales) for more information.

#### Example: Log Scale

The following example has a logarithmic y-scale.

<div class="vl-example" data-name="scatter_log"></div>

<!-- TODO: refine log example -->

<!--
#### Example: UTC Scale
TODO: example utc scale with utc time unit (once implemented)
-->

{:#domain}
## Scale Domain

By default, a scale draws domain values directly from the channel field.  
Custom domain values can be specified via the scale's `domain` property.  

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| domain        | Array         | Custom domain values.  For quantitative data, this can take the form of a two-element array with minimum and maximum values. |

<!-- TODO:
- Decide if we should write about custom domain for ordinal scale.
- Write about default domain for `month`, `day`, `hour`, `minute`.  
- Piecewise scale.
- Quantize scale?
-->

**Note:**
To sort the order mapping between the domain values and range, please use the channel definition's [`sort`](sort.html) property.

<!--
#### Example: Custom Domain
TODO: Custom Domain for quantitative
-->

<!-- TODO: Explain default domain for month and (week)day -->

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


#### Example: Default Color Map based on Data Type

__TODO__
<!-- Example: nominal -->
<!-- Example: ordinal -->
<!-- Example: quantitative -->

#### Example: Custom Color Range

TODO: put bar_layered_transparent.json or its variation in mark.md here


## Other Scale Properties

### General Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| round         | Boolean       | If true, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid.|

{:#quant-props}
### Quantitative Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| clamp         | Boolean       | If true (default), values that exceed the data domain are clamped to either the minimum or maximum range value.  This property is not applicable for `quantile`, `quantize`, and `threshold` scales as they output discrete ranges. |
| exponent      | Number        | Sets the exponent of the scale transformation. For `pow` scale types only, otherwise ignored.|
| nice          | Boolean       | If true, modifies the scale domain to use a more human-friendly number range (e.g., 7 instead of 6.96).|
| zero          | Boolean       | If true, ensures that a zero baseline value is included in the scale domain. This option is ignored for non-quantitative scales.  If unspecified, zero is true by default. |

<!-- | useRawDomain<sup>1</sup>  | Boolean       | (For aggregate field only) If false (default), draw domain data the aggregate (`summary`) data table.  If true, use the raw data instead of summary data for scale domain.  This property only works with aggregate functions that produce values ranging in the domain of the source data (`"mean"`, `"average"`, `"stdev"`, `"stdevp"`, `"median"`, `"q1"`, `"q3"`, `"min"`, `"max"`).  Otherwise, this property is ignored.  If the scale's `domain` is specified, this property is also ignored. | -->

### Time Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| clamp         | Boolean       | If true (default), values that exceed the data domain are clamped to either the minimum or maximum range value.|
| nice          | String        | If specified, modifies the scale domain to use a more human-friendly value range. For `time` and `utc` scale types only, the nice value should be a string indicating the desired time interval; legal values are `"second"`, `"minute"`, `"hour"`, `"day"`, `"week"`, `"month"`, or `"year"`.|


### Ordinal Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| bandWidth     | Number        | Width for each ordinal band. |
| padding       | Number        | Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. <br/> • For `x` and `y`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. <br/> • For `row` and `column`, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the range band width will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).|

<!-- TODO: better explanation for bandWidth-->
<!-- TODO: add outerPadding -->

<!-- TODO: rewrite in "relationship to Vega"?
<small>
__<sup>1</sup>__ All Vega-Lite scale properties exist in Vega except `useRawDomain`, which is a special property in Vega-Lite.  Some Vega properties are excluded in Vega-Lite. For example,  `reverse` is excluded from Vega-Lite's `scale` to avoid conflicts with `sort` property.  Please use `sort` of a field definition to `"descending"` to get similar behavior to setting  `reverse` to `true` in Vega.  
</small>
-->
