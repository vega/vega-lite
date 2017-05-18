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
: Time scales (`time` and `utc`) are [quantitative scales](#quantitative) with a temporal domain: values in the input domain are assumed to be [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) objects or timestamps. The `time` scale type uses the current local timezone setting. UTC scales (`utc`) instead use [Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time). Both `time` and `utc` scales use a default _domain_ of [2000-01-01, 2000-01-02], and a default unit _range_ [0, 1]. See more about [UTC time](timeunit.html#utc)

Ordinal Scale
: An ordinal scale (`ordinal`) takes discrete domain as their input domain.   Ordinal (ordered) and nominal (unordered/categorical) data always use `ordinal` scale.

- An ordinal `color` scale with `nominal` data outputs categorical color palette while an ordinal `color` scale with `ordinal` data outputs sequential color ramp. ([See example](#ex-color-range).)
- An ordinal `shape` scale always produces a categorical range since shape cannot convey order.
- Ordinal scales for other channels (`x`, `y`, `size`) always output sequential range. The default order for nominal data is determined by Javascript's natural order. For example, `"a"` < `"b"`.

{% include table.html props="type" source="Scale" %}

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

{% include table.html props="domain" source="Scale" %}

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
: For continuous `x` and `y` scales (quantitative and time), the range is always `[0, cellWidth]` and  `[0, cellHeight]` (See [config.cell](config.html#cell-config) for customizing cell width and height). For ordinal `x` and `y` scales, the maximum range is a product of the field's cardinality and [`rangeStep`](#ordinal).
<span class="note-line">
__Not Customizable__: specified `range` will be ignored.
</span>

Nominal `color` Scales
: A `color` scale of a nominal field has a categorical color palette as its range. The customized categorical color `range` can be either a [string literal for a palette name](#color-palette) or an array of desired output values.
<span class="note-line">
__Default value:__ derived from [scale config](config.html#scale-config)'s `nominalColorRange` (`"category10"` by default).
</span>

Sequential `color` Scales
: A `color` scale for ordinal, temporal, and quantitative fields have a sequential color ramp as its range. Currently, Vega-Lite only supports color ramp that interpolates between two color values. The customized sequential color `range` takes a two-element array of color values for interpolation.
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


{% include table.html props="range" source="Scale" %}


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

We can also create a diverging color graph by specify `range` with multiple elements. The number of elements of `range` should match with the number of elements in `domain`. Though continuous scale normally contains 2 elements in both `domain` and `range`, having 3 or more elements will create a piecewise scale. For more detail about a piecewise scale, please refer to [D3 documentation](https://github.com/d3/d3-scale#continuous_domain).

<div class="vl-example" data-name="diverging_color_points"></div>


## Other Scale Properties

### General Scale Properties

{% include table.html props="round,paddingInner,paddingOuter" source="Scale" %}

{:#quant-props}

### Quantitative Scale Properties

{% include table.html props="clamp,exponent,nice,zero," source="Scale" %}


### Time Scale Properties

{% include table.html props="clamp,nice" source="Scale" %}


{:#ordinal}
### Discrete Scale Properties

<!-- TODO revise -->

{% include table.html props="rangeStep,scheme,padding" source="Scale" %}

{:#ex-bandwidth}
#### Example: Custom Range Step

Given a bar chart:

<div class="vl-example" data-name="bar"></div>

We can make the band for each bar smaller by providing `scale`'s `rangeStep`.

<span class="vl-example" data-name="bar_size_rangestep_small"></span>

For more information about adjusting size of a visualization, please see [this page](size.html).
