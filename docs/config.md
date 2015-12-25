---
layout: docs
title: Config
permalink: /docs/config.html
---

## General Config




## Marks Config

`marks` property of the `config` is a marks config object, which can have the following properties:

### General Marks Config

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| filled        | Boolean        | Whether the shape\'s color should be used as fill color instead of stroke color.  This is only applicable for `bar`, `point`, and `area`.  All marks except `point` marks are filled by default. |
| opacity       | Number        | The overall opacity (value between [0,1]). |
| strokeWidth   | Number        | The stroke width, in pixels. |
| strokeDash    | Number[]      | An array of alternating stroke, space lengths for creating dashed or dotted lines.  |
| strokeDashOffset  | Number[]  | The offset (in pixels) into which to begin drawing with the stroke dash array. |

<!-- TODO: add fill, stroke, fillOpacity, strokeOpacity -->

### Marks Config for Bar, Line, and Area Marks

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| orient        | String        | The orientation of a non-stacked bar, area, and line charts.  The value is either `"horizontal"`, or `"vertical"` (default).  For area, this property determines the orient property of the Vega output.  For line, this property determines the sort order of the points in the line if `config.sortLineBy` is not specified.  For stacked charts, this is always determined by the orientation of the stack; therefore explicitly specified value will be ignored. |

### Marks Config for Line and Area Marks

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| interpolate   | String        | The line interpolation method to use. One of linear, step-before, step-after, basis, basis-open, basis-closed, bundle, cardinal, cardinal-open, cardinal-closed, monotone. |
| tension       | Number        | Depending on the interpolation type, sets the tension parameter. |

### Marks Config for Text Marks

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| align               | String  | The horizontal alignment of the text. One of `left`, `right`, `center`.|
| baseline            | String  | The vertical alignment of the text. One of `top`, `middle`, `bottom`.|
| dx                  | Number  | The horizontal offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the _angle_ property.|
| dy                  | Number  | The vertical offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the _angle_ property.|
| radius              | Number  | Polar coordinate radial offset, in pixels, of the text label from the origin determined by the `x` and `y` properties.|
| theta               | Number  | Polar coordinate angle, in radians, of the text label from the origin determined by the `x` and `y` properties. Values for `theta` follow the same convention of `arc` mark `startAngle` and `endAngle` properties: angles are measured in radians, with `0` indicating "north".|
| angle               | Number  | The rotation angle of the text, in degrees.|
| font                | String  | The typeface to set the text in (e.g., `Helvetica Neue`).|
| fontWeight          | String  | The font weight (e.g., `bold`).|
| fontStyle           | String  | The font style (e.g., `italic`).|
| format              | string  | The formatting pattern for text value.  If not defined, this will be determined automatically|

<!-- TODO: expand format detail -->


## Scene Config

`scene` property of the `config` is a scene config object, which can have the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| fill          | String        |  |
| fillOpacity   | Number        | The overall opacity (value between [0,1]). |
| strokeWidth   | Number        | The stroke width, in pixels. |
| strokeDash    | Number[]      | An array of alternating stroke, space lengths for creating dashed or dotted lines.  |
| strokeDashOffset  | Number[]  | The offset (in pixels) into which to begin drawing with the stroke dash array. |

## Stack  

When either `"bar"` or `"area"` mark type is used with either `"color"` or `"detail"`
channel, a stacked (bar or area) chart is automatically created.  
For a stacked chart, `stack` property can be used to custo

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| stack         | Boolean &#124; [StackConfig](#stack-config-object) |  If `"stack"` is `false`, stacking is disabled.  Otherwise, if `"stack"` is either `true` or a stack property object, stacking is enabled.|


#### Stack Config Object

A stack config object can contain the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| offset        | String        | The baseline offset style. One of `"zero"` (default), `"center"` <!--, or `"normalize"` -->. The `"center"` offset will center the stacks. The `"normalize"` offset will compute percentage values for each stack point; the output values will be in the range [0,1].|
| sort          | String &#124; Array<field> | Order of the stack.  This can be either a string (either "descending" or "ascending") or a list of fields to determine the order of stack layers.By default, stack uses descending order. |


## Other Config

__Coming Soon!__
