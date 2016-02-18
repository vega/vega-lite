---
layout: docs
menu: docs
title: Configuration
permalink: /docs/config.html
---

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": ... ,
  "config": {          // Configuration Object
    ...                // - Top-level Configuration
    "unit": { ... },   // - Unit Configuration
    "mark": { ... },   // - Mark Configuration
    "scale": { ... },  // - Scale Configuration
    "axis": { ... },   // - Axis Configuration
    "legend": { ... }, // - Legend Configuration
    "facet": { ... }   // - Facet Configuration
  }
}
```


Vega-Lite's `config` object lists configuration properties of a visualization.
This page outlines different types of config properties:

- [Top-level Configuration](#top-level-config)
- [Unit Configuration](#unit-config)
- [Mark Configuration](#mark-config)
- [Scale Configuration](#scale-config)
- [Axis Configuration](#axis-config)
- [Legend Configuration](#legend-config)
- [Facet Configuration](#facet-config)

## Top-level Configuration  (`config.*`)

A Vega-Lite `config` object can have the following top-level properties:

{:#format}

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| viewport      | Integer[]     | The width and height of the on-screen viewport, in pixels. If necessary, clipping and scrolling will be applied. |
| background    | String        | CSS color property to use as background of visualization. Default is `"transparent"`. |
| timeFormat    | String     | The default time format pattern for text and labels of axes and legends (in the form of [D3 time format pattern](https://github.com/mbostock/d3/wiki/Time-Formatting)). <span class="note-line">__Default value:__ `'%Y-%m-%d'`.</span>|
| numberFormat  | String      | The default number format pattern for text and labels of axes and legends (in the form of [D3 number format pattern](https://github.com/mbostock/d3/wiki/Formatting)). <span class="note-line">__Default value:__ `'s'`.</span>|

<!-- TODO: consider adding width, height, numberFormat, timeFormat  -->


## Unit Configuration  (`config.unit.*`)

The smallest unit in Vega-Lite visualization is a unit visualization or a single chart.  
Currently, the size

Each unit (non-trellis) chart contains one cell.  Thus, the width and height of the visualization is the `width` and `height` of the cell.  For trellis plots (also called small multiples), cell `width` and `height` determine the size of one plot inside the trellis plots.  The total width and height of the visualization are the product of the unit width cardinality of the `column` and `row` field

`unit` property of the `config` object can have the following properties:

### Unit Size Configuration

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| width         | Integer       | The width of the unit visualization (200 pixels by default).  This property is used only when `x` uses non-ordinal scale.  When `x` has an ordinal scale, the width is determined by x-scale's [`bandWidth`](scale.html#ordinal).  |
| height        | Integer       | The height of the visualization for a single cell (200 pixels by default).  This property is used only when `y` has a non-ordinal scale.  When `y` has an ordinal scale, the height is determined by y-scale's `bandWidth`. |

### Unit Style Configuration

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| fill          | Color         | The fill color. |
| fillOpacity   | Number        | The fill opacity (value between [0,1]). |
| stroke        | Color         | The stroke color. |
| strokeOpacity | Number        | The stroke opacity (value between [0,1]). |
| strokeWidth   | Number        | The stroke width, in pixels. |
| strokeDash    | Number[]      | An array of alternating stroke, space lengths for creating dashed or dotted lines.  |
| strokeDashOffset  | Number[]  | The offset (in pixels) into which to begin drawing with the stroke dash array. |


## Mark Configuration (`config.mark.*`)

`mark` property of the `config` is a mark config object, which sets the default properties of the visualization's marks.  Some of these properties will be overridden by data mapped to [mark properties channels](encoding.html#props-channels).  

A mark config object can have the following properties:

### General Marks Configuration

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| filled        | Boolean        | Whether the shape\'s color should be used as fill color instead of stroke color.  This is only applicable for `bar`, `point`, `circle`, `square`, and `area`.  All supported marks except `point` marks are filled by default. See [mark](mark.html#scatter_filled) for a usage example. |

#### Color

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| color         | color         | The color of the mark – either fill or stroke color based on the `filled` mark config.
| fill          | Color         | The fill color.  This config will be overridden by `color` channel's specified or mapped values if `filled` is `true`.   |
| stroke        | Color         | The stroke color.  This config will be overridden by `color` channel's specified or mapped values if `filled` is `false`. |

#### Opacity

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| opacity       | Number        | The overall opacity (value between [0,1]). |
| fillOpacity   | Number        | The fill opacity (value between [0,1]). |
| strokeOpacity | Number        | The stroke opacity (value between [0,1]). |

#### Stroke Style

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| strokeWidth   | Number        | The stroke width, in pixels. |
| strokeDash    | Number[]      | An array of alternating stroke, space lengths for creating dashed or dotted lines.  |
| strokeDashOffset  | Number[]  | The offset (in pixels) into which to begin drawing with the stroke dash array. |

<!-- one example for custom fill/stroke -->

<!-- Linked from another page.  Don't remove!-->
<a id="config.mark.filled"></a>
#### Example: `filled` Points

By default, `point` marks have filled borders and are transparent inside. Setting `config.mark.filled` to `true` creates filled marks instead.

<span class="vl-example" data-name="point_filled"></span>


### Marks Configuration for Bar

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| barWidth      | Number        | The width of the bars.  If unspecified, the default width for bars on an ordinal scale is  `bandWidth-1`, which provides 1 pixel offset between bars.  If the dimension has linear scale, the bar's default size will be `2` instead.   |

{:#orient}
### Marks Configuration for Bar, Tick, Line, and Area Marks


| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| orient        | String        | The orientation of a non-stacked bar, area, and line charts.  The value is either `"horizontal"`, or `"vertical"` (default).  For bar and tick, this determines whether the size of the bar and tick should be applied to x or y dimension.  For area, this property determines the orient property of the Vega output.  For line, this property determines the path order of the points in the line if `path` channel is not specified.  For stacked charts, this is always determined by the orientation of the stack; therefore explicitly specified value will be ignored. |

<!-- TODO: think about better example -->
<!--
#### Example: `"horizontal"` orient in the line.
```json
{
  "data": {"url": "data/cars.json"},
  "mark": "line",
  "encoding": {
    "x": {"field": "Horsepower","type": "quantitative"},
    "y": {"field": "Miles_per_Gallon","type": "quantitative"}
  },
  "config": {
    "mark": {"orient": "horizontal"}
  }
}

```
<script>
vg.embed('#horizontal_line', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/cars.json"},
    "mark": "point",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"}
    },
    "config": {
      "mark": {"filled": true}
    }
  }
});
</script>
<div id="horizontal_line"></div>
---->

{:#interpolate}
### Marks Configuration for Line and Area Marks

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| interpolate   | String        | The line interpolation method to use. One of `"linear"`, `"step-before"`, `"step-after"`, `"basis"`, `"basis-open"`, `"basis-closed"`, `"bundle"`, `"cardinal"`, `"cardinal-open"`, `"cardinal-closed"`, `"monotone"`.  For more information about each interpolation method, please look at [D3's line interpolation document](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate). |
| tension       | Number        | Depending on the interpolation type, sets the tension parameter.  [D3's line interpolation document](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate) |

#### Example: interpolate with `monotone`

<span class="vl-example" data-name="line_monotone"></span>

#### Example: interpolate with `line-step` (Step-Chart)

<span class="vl-example" data-name="line_step"></span>

### Marks Configuration for Point Mark

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| shape               | Number              | The symbol shape to use. One of `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`, or `"triangle-down"` |


### Marks Configuration for Point, Circle, and Square Marks

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| size                | Number              | The pixel area each the point (30 by default). For example: in the case of circles, the radius is determined in part by the square root of the size value. |


### Marks Configuration for Tick Marks

<div id="thickness"></div>

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| tickWidth           | Number        | The width of the ticks.  If unspecified, the default value is `2/3*bandWidth`. This will provide offset between band equals to the width of the tick. |
| thickness           | Number              | Thickness of the tick mark. |

__TODO: Example - make tick mark thicker__

### Marks Configuration for Text Marks

<div id="text"></div>

#### Text Position

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| angle               | Number  | The rotation angle of the text, in degrees.|
| align               | String  | The horizontal alignment of the text. One of `left`, `right`, `center`.|
| baseline            | String  | The vertical alignment of the text. One of `top`, `middle`, `bottom`.|
| dx                  | Number  | The horizontal offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the _angle_ property.|
| dy                  | Number  | The vertical offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the _angle_ property.|
| radius              | Number  | Polar coordinate radial offset, in pixels, of the text label from the origin determined by the `x` and `y` properties.|
| theta               | Number  | Polar coordinate angle, in radians, of the text label from the origin determined by the `x` and `y` properties. Values for `theta` follow the same convention of `arc` mark `startAngle` and `endAngle` properties: angles are measured in radians, with `0` indicating "north".|

#### Font Style

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| font                | String  | The typeface to set the text in (e.g., `Helvetica Neue`).|
| fontSize            | Number  | The font size, in pixels.  The default value is 10. |
| fontStyle           | String  | The font style (e.g., `italic`).|
| fontWeight          | String  | The font weight (e.g., `bold`).|

#### Text

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| text                | String |  Placeholder text if the `text` channel is not specified (`"Abc"` by default). |
| format              | String  | The formatting pattern for text value.  If not defined, this will be determined automatically |
| shortTimeLabels     | Boolean | Whether month names and weekday names should be abbreviated. |


<!-- TODO: expand format detail -->
<!-- TODO: example of customized text -->

## Stack Configuration  (`config.stack.*`)

When either `"bar"` or `"area"` mark type is used with either `"color"` or `"detail"`
channel, a stacked (bar or area) chart is automatically created.  
For a stacked chart, `stack` property can be used to customize the stacking.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| stack         | Boolean &#124; StackConfig |  If `"stack"` is `false`, stacking is disabled.  Otherwise, if `"stack"` is either `true` or a stack property object, stacking is enabled.|

A stack config object can contain the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| offset        | String        | The baseline offset style. One of `"zero"` (default), `"center"` <!--, or `"normalize"` -->. The `"center"` offset will center the stacks. The `"normalize"` offset will compute percentage values for each stack point; the output values will be in the range [0,1].|

#### Example: Normalized Stacked Bar Chart

__TODO__

#### Example: Streamgraph

__TODO__

<!--| sort          | String &#124; Array<field> | Order of the stack.  This can be either a string (either "descending" or "ascending") or a list of fields to determine the order of stack layers.By default, stack uses descending order. |-->
