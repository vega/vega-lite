---
layout: docs
menu: docs
title: Axis
permalink: /docs/axis.html
---

Axes provide axis lines, ticks and labels to convey how a spatial range represents a data range. Simply put, axes visualize scales.

By default, Vega-Lite automatically creates axes for `x`, `y`, `row`, and `column` channels when they are encoded.  Axis can be customized via the `axis` property of a channel definition.  

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

The field's axis can be removed by setting `axis` to `false`.
If `axis` is `true`, default axis properties are applied.

Axis properties can be customized by setting `axis` to an axis property object.
The `axis` property object supports the following properties:

<!--TODO: add default behavior for each property -->

### General

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| layer         | String        | A string indicating if the axis (and any gridlines) should be placed above or below the data marks. One of `"front"` or `"back"` (default).|
| offset        | Number | The offset, in pixels, by which to displace the axis from the edge of the enclosing group or data rectangle. |
| orient        | String        | The orientation of the axis. One of `top` or `bottom` for `y` and `row` channels, and `left` or `right` for `x` and `column` channels.  By default, `x` axis is placed on the bottom, `y` axis is placed on the left, `column`"s x-axis is placed on the top, `row`"s y-axis is placed on the right. |

### Grid

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| grid          | Boolean       | A flag indicate if gridlines should be created in addition to ticks.  If `grid` is unspecified for X and Y, the default value is `true` for (1) quantitative fields that are not binned and (2) time fields.  Otherwise, the default value is `false`. |


### Labels

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| format        | String        | The formatting pattern for axis labels. Vega uses [D3's format pattern](https://github.com/mbostock/d3/wiki/Formatting).|
| labelAngle    | Number        | Rotation angle for axis labels. |
| labelMaxLength  | Integer       | Max length for axis labels. Longer labels are truncated. (25 by default.) |
| offset        | Number | The offset, in pixels, by which to displace the axis from the edge of the enclosing group or data rectangle. |
| shortTimeLabels | Boolean       | Whether month and day names should be abbreviated. |


### Ticks

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| subdivide     | Number        | If provided, sets the number of minor ticks between major ticks (the value 9 results in decimal subdivision). Only applicable for axes visualizing quantitative scales.|
| ticks         | Number        | A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale's range.  |
| tickPadding   | Number        | The padding, in pixels, between ticks and text labels.|
| tickSize      | Number        | The size, in pixels, of major, minor and end ticks.|
| tickSizeMajor | Number        | The size, in pixels, of major ticks.|
| tickSizeMinor | Number        | The size, in pixels, of minor ticks.|
| tickSizeEnd   | Number        | The size, in pixels, of end ticks.|
| values        | Array         | Explicitly set the visible axis tick values.|

### Title

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| title         | String        | A title for the axis.  If `title` is unspecified, the default value is produced from the field's name and transformation function applied e.g, "field_name", "SUM(field_name)", "BIN(field_name)", "YEAR(field_name)". |
| titleOffset   | Number        | The offset (in pixels) from the axis at which to place the title.|
| titleMaxLength  | Integer     | Max length for axis title when the title is automatically generated from the field\'s description. By default, this is automatically based on cell size (`config.unit.width`, `config.unit.height`) and `characterWidth` property. |
| characterWidth  | Integer       | Character width for automatically determining the value of `titleMaxLength`. |


<!--
| properties    | Object        | Optional mark property definitions for custom axis styling. The input object can include sub-objects for `ticks` (both major and minor), `majorTicks`, `minorTicks`, `labels` and `axis` (for the axis line).  |
-->

<!--TODO: elaborate example for the properties group -->
