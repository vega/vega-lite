---
layout: docs
menu: docs
title: Scale
permalink: /docs/scale.html
---

Scales are functions that transform a domain of data values (numbers, dates, strings, etc) to a range of visual values (pixels, colors, sizes).

Vega-Lite automatically creates scales for fields that are [mapped to mark properties](#props-channels). Supported [scale types](#type) are quantitative, time, and ordinal. Default scale properties are determined based on a set of rules for each scale type, but [`scale`](encoding.html#scale-and-guide) property of the channel definition can be provided to customize the scale's properties.

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": ... ,
  "encoding": {
    "x": {
      "field": ...,
      "type": ...,
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

Vega-Lite supports the following scale types:

Quantitative Scale
: A quantitative scales takes continuous, quantitative data as its input domain. There are multiple types of quantitative scales. `linear`, `power`, and `log` scales output continuous ranges. Meanwhile `quantize` and `quantile` scales output discrete ranges.

- `linear` scale expresses each range value _y_ as a linear function of the domain value _x_: _y = mx + b_. This is the default scale for a quantitative field (field with `type` = `"quantitative"`).
- `pow` scale expresses each range value _y_ as a power (exponential) function of the domain value _x_: _y = mx^k + b_, where _k_ is the exponent value. (_k_ can be customized using [`exponent`](#quant-props) property.)
- `log` scale expresses each range value _y_ as a logarithmic function of the domain value _x_: _y = mlog(x) + b_. As _log(0) = -∞_, a log scale domain must be strictly-positive or strictly-negative; the domain must not include or cross zero. Vega-Lite automatically filters zero values from the field mapped to a log scale.
- `quantize` scale maps continuous value to a discrete range by dividing the domain into uniform segments based on the number of values in (i.e., the cardinality of) the output range. Each range value _y_ can be expressed as a quantized linear function of the domain value _x_: _y = m round(x) + b_.
- `quantile` scale maps a sampled input domain to a discrete range by sorting the domain and compute the quantiles. The cardinality of the output range determines the number of quantiles that will be computed.

<!-- TODO: need to test if we support threshold scale correctly before writing about it-->

Time Scale
: A `time` scale is similar to a linear quantitative scale but takes date as input. In general, a temporal field has `time` scale by default. The exceptions are temporal fields with `hours`, `day`, `date`, `month` as time unit; they have `ordinal` scales by default.
<!-- <br/>`utc` is a time scale that uses [Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) rather than local time. -->

Ordinal Scale
: An ordinal scale (`ordinal`) takes discrete domain as their input domain.   Ordinal (ordered) and nominal (unordered/categorical) data always use `ordinal` scale.

- An ordinal `color` scale with `nominal` data outputs categorical color palette while an ordinal `color` scale with `ordinal` data outputs sequential color ramp. ([See example](#ex-color-range).)
- An ordinal `shape` scale always produces a categorical range since shape cannot convey order.
- Ordinal scales for other channels (`x`, `y`, `size`) always output sequential range. The default order for nominal data is determined by Javascript's natural order. For example, `"a"` < `"b"`.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| type          | String        | The type of scale. <br/> •  For a _quantitative_ field, supported quantitative scale types  are `"linear"` (default), `"log"`, `"pow"`, `"sqrt"`, `"quantile"`, `"quantize"`, and `"threshold"`. <br/> • For a _temporal_ field without `timeUnit`, the scale type should be `time` (default) or `ordinal`. <br/>  • For _ordinal_ and _nominal_ fields, the type is always `ordinal`. <br/>Unsupported values will be ignored. |

<!-- TODO: add utc to the above table for temporal field -->

**Note:** For more information about scale types, please see [d3 scale documentation](https://github.com/mbostock/d3/wiki/Quantitative-Scales).

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
| domain        | Array         | Custom domain values. <br/> • For _quantitative_ data, this can take the form of a two-element array with minimum and maximum values. <br/> • For _temporal_ data, this can, this can be a two-element array with minimum and maximum values in the form of either timestamp numbers or the [DateTime](transform.html#datetime) definition object.  <br/> • For _ordinal_ or _nominal_ data, this is an array representing all values and their orders.   |

<!-- TODO:
- Decide if we should write about custom domain for ordinal scale.
- Write about default domain for `month`, `day`, `hour`, `minute`.
- Piecewise scale.
- Quantize scale?
-->

**Note:** To sort the order mapping between the domain values and range, please use the channel definition's [`sort`](sort.html) property.

<!--
#### Example: Custom Domain
TODO: Custom Domain for quantitative
-->

<!-- TODO: Explain default domain for month and (week)day -->

{:#range}
## Scale Range

The range of the scale represents the set of output visual values. Vega-Lite automatically determines appropriate range based on the scale's channel and type, but `range` property can be provided to customize range values.

`x` and `y` Scales
: For continuous `x` and `y` scales (quantitative and time), the range are always `[0, cellWidth]` and  `[0, cellHeight]` (See [config.cell](config.html#cell-config) for customizing cell width and height). For ordinal `x` and `y` scales, the maximum range is a product of the field's cardinality and [`rangeStep`](#ordinal).
<span class="note-line">
__Not Customizable__: specified `range` will be ignored.
</span>

Nominal `color` Scales
: A `color` scale of a nominal field has a categorical color palette as its range. Customized categorical color `range` can be either a [string literal for a palette name](#color-palette) or an array of desired output values.
<span class="note-line">
__Default value:__ derived from [scale config](config.html#scale-config)'s `nominalColorRange` (`"category10"` by default).
</span>

Sequential `color` Scales
: A `color` scale for ordinal, temporal, and quantitative fields have a sequential color ramp as its range. Currently, Vega-Lite only supports color ramp that interpolate between two color values. Customized sequential color `range` takes a two-element array of color values for interpolation.
<span class="note-line">
__Default value:__ derived from [scale config](config.html#scale-config)'s `sequentialColorRange` (green ramp between `["#AFC6A3", "#09622A"]` by default).
</span>

`shape` Scales
: A `shape` scale has a list of shape type names as its range. A customized shape  `range` is an array of supported shapes.
<span class="note-line">
__Default value:__ derived from [scale config](config.html#scale-config)'s `shapeRange` This is, by default, the `"shape"` palette, which is equivalent to`["circle", "cross", "diamond", "square", "triangle-down", "triangle-up"]`.
</span>

`size` Scales
: A `size` scale has a sequential range. Customized size `range` can be either a two-element array of size values for the interpolation or (for ordinal size scale only) an array of desired output size for each domain value.
<span class="note-line">
__Default value:__
<br/> • for `bar`: derived from [scale config](config.html#scale-config)'s `barSizeRange`. If both scale's `range` and the scale config's `barSizeRange` are unspecified (default), the default size range is a range from [mark config](config.mark.html)'s `thinBarWidth` to the scale's `rangeStep`.
<br/> • for  `point`, `square`, and `circle`: derived from [scale config](config.html#scale-config)'s `pointSizeRange`. If both scale's `range` and the scale config's `pointSizeRange` are unspecified (default), the default size range is a range from 9 to the square of the scale's `rangeStep` (_rangeStep^2_).
<br/> • for  `text`: derived from [scale config](config.html#scale-config)'s `fontSizeRange` (`[8, 40]` by default).
<br/> • for  `tick`: derived from [scale config](config.html#scale-config)'s `tickSizeRange` (`[1, 20]` by default).
</span>

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| range        | Array &#124; String  | Customized scale range. |

{:#color-palette}

### Built-in Color Scheme

<!-- FIXME link to Vega heatmap example or a similar Vega-lite version-->
We support all color schemes provided by the D3 4.0 [d3-scale](https://github.com/d3/d3-scale) and
[d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic) modules.

### Example: Default Color Ranges based on Data Types

A color scale of a nominal field outputs a categorical color palette.

<div class="vl-example" data-name="scatter_color"></div>

Meanwhile, a color scale an ordinal field and a quantitative field outputs a sequential color ramp.

<div class="vl-example" data-name="scatter_color_ordinal"></div>
<div class="vl-example" data-name="scatter_color_quantitative"></div>

### Example: Custom Color Range

We can customize the color range of the scatterplot above by providing `scale`'s `range` property. For a nominal color field, `range` can be an array describing the desired palette.

<div class="vl-example" data-name="scatter_color_custom"></div>

For ordinal, quantitative, and time fields, `range` can be a two-element array describing the two colors for interpolation.

<div class="vl-example" data-name="scatter_color_ordinal_custom"></div>

### Piecewise Scale Example: Diverging Color Scale

We can also create diverging color graph by specify `range` with multiple elements. Number of elements of `range` should match with the number of elements in `domain`. Though continuous scale normally contains 2 elements in both `domain` and `range`, having 3 or more elements will create a piecewise scale. For more detail about a piecewise scale, please refer to [D3 documentation](https://github.com/d3/d3-scale#continuous_domain).

<div class="vl-example" data-name="diverging_color_points"></div>


## Other Scale Properties

### General Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| round         | Boolean       | If `true`, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid. <span class="note-line">__Default value:__ True for `"x"`, `"y"`, `"row"`, `"column"` channels if scale config's `round` is `true`; false otherwise.</span> |

{:#quant-props}

### Quantitative Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| clamp         | Boolean       | If `true`, values that exceed the data domain are clamped to either the minimum or maximum range value. <span class="note-line">__Default value:__ derived from [scale config](config.html#scale-config) (`true` by default)<br/>__Supported types:__ only `linear`, `pow`, `sqrt`, and `log`</span> |
| exponent      | Number        | Sets the exponent of the scale transformation. (For `pow` scale types only, otherwise ignored.) |
| nice          | Boolean       | If `true`, modifies the scale domain to use a more human-friendly number range (e.g., 7 instead of 6.96). <span class="note-line">__Default value:__ `true` only for quantitative x and y scales and `false` otherwise.</span> |
| zero          | Boolean       | If `true`, ensures that a zero baseline value is included in the scale domain. <span class="note-line">__Default value:__ `true` for `x` and `y` channel if the quantitative field is not binned and no custom `domain` is provided; `false` otherwise.</span><span class="note-line">__Note:__  This property is always `false` for log scale.</span> |
| useRawDomain  | Boolean       | If `true`, set scale domain to the raw data domain. If `false`, use the aggregated data domain for scale. <span class="note-line">__Default value:__ `false`<br/>__Only valid for certain aggregations:__ This property only works with aggregate functions that produce values within the raw data domain (`"mean"`, `"average"`, `"stdev"`, `"stdevp"`, `"median"`, `"q1"`, `"q3"`, `"min"`, `"max"`). For other aggregations that produce values outside of the raw data domain (e.g. `"count"`, `"sum"`), this property is ignored. <br/>__Note:__ This property is ignored when the scale's `domain` is specified.</span>|

### Time Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| clamp         | Boolean       | If `true`, values that exceed the data domain are clamped to either the minimum or maximum range value. (Not applicable for `quantile`, `quantize`, and `threshold` scales as they output discrete ranges.) |
| nice          | String        | If specified, modifies the scale domain to use a more human-friendly value range. For `time` and `utc` scale types only, the nice value should be a string indicating the desired time interval; legal values are `"second"`, `"minute"`, `"hour"`, `"day"`, `"week"`, `"month"`, or `"year"`.|

{:#ordinal}
### Discrete Scale Properties

<!-- TODO revise -->

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| rangeStep      | Integer &#124; String | TODO: use description in code instead! |
| scheme        |  String | Color scheme that determines output color of a color scale. <span class="note-line">__Default value:__ [scale config](config.html#scale-config)'s `nominalColorScheme` for nominal field and `sequentialColorScheme` for other types of fields.</span>|
| padding       | Number        | Behavior depends on scale types.  (This doc is a **WORK-IN-PROGRESS**.  For now, Please refer to [d3-scale documentation](https://github.com/d3/d3-scale) for more information.) <span class="note-line">&nbsp;&nbsp; • __Default value:__ The default from `x` and `y` channels are derived from [scale config](config.html#scale-config)'s `pointPadding` for `point` scale and `bandPadding` for `band` scale.  Other channels has `0` padding by default. </span> <br/> <span class="note-line">For `row` and `column`, `padding` is ignored. Please use `spacing` instead! </span> |
| spacing       | Integer        | (For `row` and `column` only) A pixel value for padding between cells in the trellis plots. <span class="note-line">&nbsp;&nbsp; •__Default value:__ derived from [scale config](config.html#scale-config)'s `facetSpacing`</span>


{:#ex-bandwidth}
#### Example: Custom Range Step

Given a bar chart:

<div class="vl-example" data-name="bar"></div>

We can make the band for each bar smaller by providing `scale`'s `rangeStep`.

<span class="vl-example" data-name="bar_size_rangestep_small"></span>

For more information about adjusting size of a visualization, please see [this page](size.html).
