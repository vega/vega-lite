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
: For continuous `x` and `y` scales (quantitative and time), the range are always `[0, cellWidth]` and  `[0, cellHeight]` (See [config.cell](config.html#cell-config) for customizing cell width and height). For ordinal `x` and `y` scales, the maximum range is a product of the field's cardinality and [`bandSize`](#ordinal).
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
<br/> • for `bar`: derived from [scale config](config.html#scale-config)'s `barSizeRange`. If both scale's `range` and the scale config's `barSizeRange` are unspecified (default), the default size range is a range from [mark config](config.mark.html)'s `thinBarWidth` to the scale's `bandSize`.
<br/> • for  `point`, `square`, and `circle`: derived from [scale config](config.html#scale-config)'s `pointSizeRange`. If both scale's `range` and the scale config's `pointSizeRange` are unspecified (default), the default size range is a range from 9 to the square of the scale's `bandSize` (_bandSize^2_).
<br/> • for  `text`: derived from [scale config](config.html#scale-config)'s `fontSizeRange` (`[8, 40]` by default).
<br/> • for  `tick`: derived from [scale config](config.html#scale-config)'s `tickSizeRange` (`[1, 20]` by default).
</span>

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| range        | Array &#124; String  | Customized scale range. |

{:#color-palette}
### Built-in Color Palettes

The following built-in palettes can be used as a customized categorical color  `range` value.

| Name          | Description  |
| :------------ | :------------|
| `"category10"`    | Set the scale range to a 10-color categorical palette: <br><br> ![1f77b4](https://raw.githubusercontent.com/wiki/mbostock/d3/1f77b4.png) #1f77b4 ![ff7f0e](https://raw.githubusercontent.com/wiki/mbostock/d3/ff7f0e.png) #ff7f0e ![2ca02c](https://raw.githubusercontent.com/wiki/mbostock/d3/2ca02c.png) #2ca02c ![d62728](https://raw.githubusercontent.com/wiki/mbostock/d3/d62728.png) #d62728 ![9467bd](https://raw.githubusercontent.com/wiki/mbostock/d3/9467bd.png) #9467bd<br> ![8c564b](https://raw.githubusercontent.com/wiki/mbostock/d3/8c564b.png) #8c564b ![e377c2](https://raw.githubusercontent.com/wiki/mbostock/d3/e377c2.png) #e377c2 ![7f7f7f](https://raw.githubusercontent.com/wiki/mbostock/d3/7f7f7f.png) #7f7f7f ![bcbd22](https://raw.githubusercontent.com/wiki/mbostock/d3/bcbd22.png) #bcbd22 ![17becf](https://raw.githubusercontent.com/wiki/mbostock/d3/17becf.png) #17becf|
| `"category20"`    | Set the scale range to a 20-color categorical palette: <br><br> ![1f77b4](https://raw.githubusercontent.com/wiki/mbostock/d3/1f77b4.png) #1f77b4 ![aec7e8](https://raw.githubusercontent.com/wiki/mbostock/d3/aec7e8.png) #aec7e8 ![ff7f0e](https://raw.githubusercontent.com/wiki/mbostock/d3/ff7f0e.png) #ff7f0e ![ffbb78](https://raw.githubusercontent.com/wiki/mbostock/d3/ffbb78.png) #ffbb78 ![2ca02c](https://raw.githubusercontent.com/wiki/mbostock/d3/2ca02c.png) #2ca02c<br> ![98df8a](https://raw.githubusercontent.com/wiki/mbostock/d3/98df8a.png) #98df8a ![d62728](https://raw.githubusercontent.com/wiki/mbostock/d3/d62728.png) #d62728 ![ff9896](https://raw.githubusercontent.com/wiki/mbostock/d3/ff9896.png) #ff9896 ![9467bd](https://raw.githubusercontent.com/wiki/mbostock/d3/9467bd.png) #9467bd ![c5b0d5](https://raw.githubusercontent.com/wiki/mbostock/d3/c5b0d5.png) #c5b0d5<br> ![8c564b](https://raw.githubusercontent.com/wiki/mbostock/d3/8c564b.png) #8c564b ![c49c94](https://raw.githubusercontent.com/wiki/mbostock/d3/c49c94.png) #c49c94 ![e377c2](https://raw.githubusercontent.com/wiki/mbostock/d3/e377c2.png) #e377c2 ![f7b6d2](https://raw.githubusercontent.com/wiki/mbostock/d3/f7b6d2.png) #f7b6d2 ![7f7f7f](https://raw.githubusercontent.com/wiki/mbostock/d3/7f7f7f.png) #7f7f7f<br> ![c7c7c7](https://raw.githubusercontent.com/wiki/mbostock/d3/c7c7c7.png) #c7c7c7 ![bcbd22](https://raw.githubusercontent.com/wiki/mbostock/d3/bcbd22.png) #bcbd22 ![dbdb8d](https://raw.githubusercontent.com/wiki/mbostock/d3/dbdb8d.png) #dbdb8d ![17becf](https://raw.githubusercontent.com/wiki/mbostock/d3/17becf.png) #17becf ![9edae5](https://raw.githubusercontent.com/wiki/mbostock/d3/9edae5.png) #9edae5|
| `"category20b"`    | Set the scale range to a 20-color categorical palette: <br><br> ![393b79](https://raw.githubusercontent.com/wiki/mbostock/d3/393b79.png) #393b79 ![5254a3](https://raw.githubusercontent.com/wiki/mbostock/d3/5254a3.png) #5254a3 ![6b6ecf](https://raw.githubusercontent.com/wiki/mbostock/d3/6b6ecf.png) #6b6ecf ![9c9ede](https://raw.githubusercontent.com/wiki/mbostock/d3/9c9ede.png) #9c9ede ![637939](https://raw.githubusercontent.com/wiki/mbostock/d3/637939.png) #637939<br> ![8ca252](https://raw.githubusercontent.com/wiki/mbostock/d3/8ca252.png) #8ca252 ![b5cf6b](https://raw.githubusercontent.com/wiki/mbostock/d3/b5cf6b.png) #b5cf6b ![cedb9c](https://raw.githubusercontent.com/wiki/mbostock/d3/cedb9c.png) #cedb9c ![8c6d31](https://raw.githubusercontent.com/wiki/mbostock/d3/8c6d31.png) #8c6d31 ![bd9e39](https://raw.githubusercontent.com/wiki/mbostock/d3/bd9e39.png) #bd9e39<br> ![e7ba52](https://raw.githubusercontent.com/wiki/mbostock/d3/e7ba52.png) #e7ba52 ![e7cb94](https://raw.githubusercontent.com/wiki/mbostock/d3/e7cb94.png) #e7cb94 ![843c39](https://raw.githubusercontent.com/wiki/mbostock/d3/843c39.png) #843c39 ![ad494a](https://raw.githubusercontent.com/wiki/mbostock/d3/ad494a.png) #ad494a ![d6616b](https://raw.githubusercontent.com/wiki/mbostock/d3/d6616b.png) #d6616b<br> ![e7969c](https://raw.githubusercontent.com/wiki/mbostock/d3/e7969c.png) #e7969c ![7b4173](https://raw.githubusercontent.com/wiki/mbostock/d3/7b4173.png) #7b4173 ![a55194](https://raw.githubusercontent.com/wiki/mbostock/d3/a55194.png) #a55194 ![ce6dbd](https://raw.githubusercontent.com/wiki/mbostock/d3/ce6dbd.png) #ce6dbd ![de9ed6](https://raw.githubusercontent.com/wiki/mbostock/d3/de9ed6.png) #de9ed6|
| `"category20c"`    | Set the scale range to a 20-color categorical palette: <br><br> ![3182bd](https://raw.githubusercontent.com/wiki/mbostock/d3/3182bd.png) #3182bd ![6baed6](https://raw.githubusercontent.com/wiki/mbostock/d3/6baed6.png) #6baed6 ![9ecae1](https://raw.githubusercontent.com/wiki/mbostock/d3/9ecae1.png) #9ecae1 ![c6dbef](https://raw.githubusercontent.com/wiki/mbostock/d3/c6dbef.png) #c6dbef ![e6550d](https://raw.githubusercontent.com/wiki/mbostock/d3/e6550d.png) #e6550d<br> ![fd8d3c](https://raw.githubusercontent.com/wiki/mbostock/d3/fd8d3c.png) #fd8d3c ![fdae6b](https://raw.githubusercontent.com/wiki/mbostock/d3/fdae6b.png) #fdae6b ![fdd0a2](https://raw.githubusercontent.com/wiki/mbostock/d3/fdd0a2.png) #fdd0a2 ![31a354](https://raw.githubusercontent.com/wiki/mbostock/d3/31a354.png) #31a354 ![74c476](https://raw.githubusercontent.com/wiki/mbostock/d3/74c476.png) #74c476<br> ![a1d99b](https://raw.githubusercontent.com/wiki/mbostock/d3/a1d99b.png) #a1d99b ![c7e9c0](https://raw.githubusercontent.com/wiki/mbostock/d3/c7e9c0.png) #c7e9c0 ![756bb1](https://raw.githubusercontent.com/wiki/mbostock/d3/756bb1.png) #756bb1 ![9e9ac8](https://raw.githubusercontent.com/wiki/mbostock/d3/9e9ac8.png) #9e9ac8 ![bcbddc](https://raw.githubusercontent.com/wiki/mbostock/d3/bcbddc.png) #bcbddc<br> ![dadaeb](https://raw.githubusercontent.com/wiki/mbostock/d3/dadaeb.png) #dadaeb ![636363](https://raw.githubusercontent.com/wiki/mbostock/d3/636363.png) #636363 ![969696](https://raw.githubusercontent.com/wiki/mbostock/d3/969696.png) #969696 ![bdbdbd](https://raw.githubusercontent.com/wiki/mbostock/d3/bdbdbd.png) #bdbdbd ![d9d9d9](https://raw.githubusercontent.com/wiki/mbostock/d3/d9d9d9.png) #d9d9d9|


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
| round         | Boolean       | If `true`, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid (only available for `x`, `y`, `size`, `row`, and `column` scales). <span class="note-line">__Default value:__ derived from [scale config](config.html#scale-config) (`true` by default).</span> |

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
### Ordinal Scale Properties

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| bandSize      | Integer &#124; String | Width for each `x` or `y` ordinal band.  This can be an integer value or a string `"fit"`.  For `"fit"`, the band size will be automatically adjusted to fit the scale for the specified width (for x-axis) or height (for y-axis). <span class="note-line">__Default value:__ for `x` ordinal scale of a `text` mark, derived from [scale config](config.html#scale-config)'s `textBandWidth`; otherwise, derived from [scale config](config.html#scale-config)'s `bandSize`.</span> <span class="note-line">__Warning__: <br/> 1) Numeric `bandSize` will be applied only if the top-level `width` (for x-scale) or `height` (for y-scale) is not specified.  If `width` (for x-scale) or `height` (for y-scale) is specified, `bandWidth` will always be `"fit"`. <br/> 2) If the cardinality of the scale domain is too high, the bandSize might become less than one pixel and the mark might not appear correctly. </span>|
| padding       | Number        | • For `x` and `y` channels, the padding is a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. (See D3's [`ordinalRangePoints()`](https://github.com/mbostock/d3/wiki/Ordinal-Scales#ordinal_rangePoints) for illustration.) <span class="note-line">&nbsp;&nbsp; • __Default value:__ derived from [scale config](config.html#scale-config)'s `padding`</span> <br/> • For `row` and `column`, padding is a pixel value for padding between cells in the trellis plots. <span class="note-line">&nbsp;&nbsp; •__Default value:__ derived from  [facet scale config](config.html#facet-scale-config)'s `padding`.</span>  |

{:#ex-bandwidth}
#### Example: Custom Band Width

Given a bar chart:

<div class="vl-example" data-name="bar"></div>

We can make the band for each bar smaller by providing `scale`'s `bandSize`.

<span class="vl-example" data-name="bar_size_bandsize_small"></span>

For more information about adjusting size of a visualization, please see [this page](size.html).
