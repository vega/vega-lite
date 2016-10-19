---
layout: docs
menu: docs
title: Axis
permalink: /docs/axis.html
---

Axes provide axis lines, ticks and labels to convey how a spatial range represents a data range. Simply put, axes visualize scales.

By default, Vega-Lite automatically creates axes for `x`, `y`, `row`, and `column` channels when they are encoded. Axis can be customized via the `axis` property of a channel definition.

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": ... ,
  "encoding": {
    "x": {
      "field": ...,
      "type": ...,
      "axis": {                // Axis
        ...
      },
      ...
    },
    "y": ...,
    ...
  },
  ...
}
```

## Customizing Axis

The field's axis can be removed by setting `axis` to `false`. If `axis` is `true`, default axis properties are applied.

Axis properties can be customized by setting `axis` to an axis property object. The `axis` property object supports the following properties:

<!--TODO: add default behavior for each property -->

### General

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| axisColor     | Color         | Color of axis line. <span class="note-line">__Default value:__  (none, using Vega default). </span> |
| axisWidth     | Number        | Width of the axis line. <span class="note-line">__Default value:__  (none, using Vega default). </span> |
| layer         | String        | A string indicating if the axis (and any gridlines) should be placed above or below the data marks. One of `"front"` or `"back"`. <span class="note-line">__Default value:__ derived from  [axis config](config.html#facet-scale-config)'s `layer`. If the `layer` config is undefined, the default is `"back"` if `grid` is `true` and `"front"` otherwise. </span> |
| offset        | Number | The offset, in pixels, by which to displace the axis from the edge of the enclosing group or data rectangle. <span class="note-line">__Default value:__ derived from  [axis config](config.html#facet-scale-config)'s `offset` (`0` by default)</span>|
| orient        | String        | The orientation of the axis. One of `top` or `bottom` for `y` and `row` channels, and `left` or `right` for `x` and `column` channels. <span class="note-line">__Default value:__ `x` axis is placed on the bottom, `y` axis is placed on the left, `column`"s x-axis is placed on the top, `row`"s y-axis is placed on the right. </span> |

### Grid

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| grid          | Boolean       | A flag indicate if gridlines should be created in addition to ticks. <span class="note-line">__Default value:__  `true` for (1) quantitative fields that are not binned and (2) time fields;  otherwise, `false`.</span> |
| gridColor     | String        | Color of gridlines. |
| gridDash      | Number[]      | The offset (in pixels) into which to begin drawing with the grid dash array. |
| gridOpacity   | Number        | The stroke opacity of grid (value between [0,1]). <span class="note-line">__Default value:__ (`1` by default)</span>
| gridWidth		| Number 		| The grid width, in pixels. |


### Labels

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| labels        | Boolean       | Enable or disable labels <span class="note-line">__Default value:__  derived from [axis config](config.html#axis-config)'s `labels` (`true` by default). </span> |
| format        | String        | The formatting pattern for axis labels. This is D3's [number format pattern](https://github.com/mbostock/d3/wiki/Formatting) for quantitative axis and D3's [time format pattern](https://github.com/mbostock/d3/wiki/Time-Formatting) for time axis. <span class="note-line">__Default value:__  derived from [`numberFormat`](config.html#format) config for quantitative axis and from [`timeFormat`](config.html#format) config for time axis.</span>|
| labelAngle    | Number        | Rotation angle for axis labels. <span class="note-line">__Default value:__ `-45` for time or ordinal axis and `0` otherwise.</span> |
| labelMaxLength  | Integer       | Max length for axis labels. Longer labels are truncated. <span class="note-line">__Default value:__  derived from  [axis config](config.html#axis-config)'s `labelMaxLength` (`25` by default). </span> |
| shortTimeLabels | Boolean       | Whether month and day names should be abbreviated. <span class="note-line">__Default value:__  derived from [axis config](config.html#axis-config)'s `shortTimeLabels` (`false` by default). </span> |

### Ticks

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| subdivide     | Number        | If provided, sets the number of minor ticks between major ticks (the value 9 results in decimal subdivision). Only applicable for axes visualizing quantitative scales.|
| ticks         | Number        | A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale's range. <span class="note-line">__Default value:__  derived from [axis config](config.html#axis-config)'s `ticks`. If the `ticks` config is undefined (default),  `ticks` is `5` for x-scale without binning, and `10` otherwise.</span>  |
| tickColor		| String 		| The color of the axis's tick. |
| tickLabelColor| String 		| The color of the tick label. |
| tickLabelFont	| String 		| The font of tick label (e.g., `Helvetica Neue`). |
| tickLabelFontSize	| Number 		| The font size of label, in pixels. <span class="note-line">__Default value:__ 10. </span> |
| tickPadding   | Number        | The padding, in pixels, between ticks and text labels.|
| tickSize      | Number        | The size, in pixels, of major, minor and end ticks. <span class="note-line">__Default value:__  derived from [axis config](config.html#axis-config)'s `tickSize` (`6` by default). </span>|
| tickSizeMajor | Number        | The size, in pixels, of major ticks.|
| tickSizeMinor | Number        | The size, in pixels, of minor ticks.|
| tickSizeEnd   | Number        | The size, in pixels, of end ticks.|
| tickWidth   	| Number        | The width, in pixels, of ticks.|
| values        | Number[] &#124; [DateTime[]](transform.html#datetime) | Explicitly set the visible axis tick values. |

### Title

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| title         | String        | A title for the axis. <span class="note-line">__Default value:__  derived from the field's name and transformation function applied e.g, "field_name", "SUM(field_name)", "BIN(field_name)", "YEAR(field_name)".</span> |
| titleColor	| String 		| The color of the title. |
| titleFont		| String 		| The font of title (e.g., `Helvetica Neue`). |
| titleFontWeight	| Number 	 	|  The font weight of title (e.g., `bold`). |
| titleFontSize	| Number 		| The font size of title, in pixels. <span class="note-line">__Default value:__ 10. </span> |
| titleOffset   | Number        | The offset (in pixels) from the axis at which to place the title.|
| titleMaxLength  | Integer     | Max length for axis title when the title is automatically generated from the field\'s description. <span class="note-line">__Default value:__  automatically determined based on the cell size (`config.cell.width`, `config.cell.height`) and `characterWidth` property.</span> |
| characterWidth  | Integer       | Character width for automatically determining the value of `titleMaxLength`. <span class="note-line">__Default value:__  derived from [axis config](config.html#axis-config)'s `characterWidth` (`6` by default). </span> |
