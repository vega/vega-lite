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
  "encoding": ... ,
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

{:#top-level-config}
## Top-level Configuration  (`config.*`)

A Vega-Lite `config` object can have the following top-level properties:

{:#format}

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| viewport      | Integer[]     | The width and height of the on-screen viewport, in pixels. If necessary, clipping and scrolling will be applied. <span class="note-line">__Default value:__ (none)</span> |
| background    | String        | CSS color property to use as background of visualization.  <span class="note-line">__Default value:__ (none)</span> |
| timeFormat    | String     | The default time format pattern for text and labels of axes and legends (in the form of [D3 time format pattern](https://github.com/mbostock/d3/wiki/Time-Formatting)). <span class="note-line">__Default value:__ `'%Y-%m-%d'`.</span>|
| numberFormat  | String      | The default number format pattern for text and labels of axes and legends (in the form of [D3 number format pattern](https://github.com/mbostock/d3/wiki/Formatting)). <span class="note-line">__Default value:__ `'s'`.</span>|

<!-- TODO: consider adding width, height, numberFormat, timeFormat  -->

{:#unit-config}
## Unit Configuration  (`config.unit.*`)

At its core, a Vega-Lite specification describes a single plot, or a _unit visualization_.  
When a [facet channel](encoding.html#facet) is added, the visualization is faceted into a trellis plot, which contains multiple repeated sub-units.  Unit configuration allows us to customize an individual single plot and each unit of a trellis plot.  

### Unit Size Configuration

`width` and `height` property of the unit configuration determine the width of a visualization with a non-ordinal x-scale and the height of a visualization with a non-ordinal y-scale respectively.  

**For more information about visualization's size, please ["Customizing Size"](size.html) page.**

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| width         | Integer       | The width of the unit visualization when the visualization has non-ordinal x-scale.  |
| height        | Integer       | The height of the unit visualization when the visualization has non-ordinal y-scale. |

### Unit Style Configuration

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| fill          | Color         | The fill color. <span class="note-line">__Default value:__ (none)</span> |
| fillOpacity   | Number        | The fill opacity (value between [0,1]). <span class="note-line">__Default value:__ (none)</span>|
| stroke        | Color         | The stroke color. <span class="note-line">__Default value:__ (none)</span>|
| strokeOpacity | Number        | The stroke opacity (value between [0,1]). <span class="note-line">__Default value:__ (none)</span>|
| strokeWidth   | Number        | The stroke width, in pixels. <span class="note-line">__Default value:__ (none)</span>|
| strokeDash    | Number[]      | An array of alternating stroke, space lengths for creating dashed or dotted lines.  <span class="note-line">__Default value:__ (none)</span>|
| strokeDashOffset  | Number[]  | The offset (in pixels) into which to begin drawing with the stroke dash array. <span class="note-line">__Default value:__ (none)</span>|


## Mark Configuration (`config.mark.*`)

`mark` property of the `config` is a mark config object, which sets the default properties of the visualization's marks.  Some of these properties will be overridden by data mapped to [mark properties channels](encoding.html#props-channels).  

A mark config object can have the following properties:

#### Color

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| filled        | Boolean        | Whether the shape\'s color should be used as fill color instead of stroke color.  See [mark](mark.html#scatter_filled) for a usage example.  <span class="note-line">__Default value:__ `true` for all marks except `point` and `false` for `point`.</span><span class="note-line">__Applicable for:__ `bar`, `point`, `circle`, `square`, and `area` marks.</span> |
| color         | color         | The color of the mark – either fill or stroke color based on the `filled` mark config. <span class="note-line">__Default value:__ <span style="color: #4682b4;">&#9632;</span> blue (`""#4682b4"`)</span>  |
| fill          | Color         | The fill color.  This config will be overridden by `color` channel's specified or mapped values if `filled` is `true`.  <span class="note-line">__Default value:__ (None) </span>  |
| stroke        | Color         | The stroke color.  This config will be overridden by `color` channel's specified or mapped values if `filled` is `false`. <span class="note-line">__Default value:__ (None) </span> |

<!-- Linked from another page.  Don't remove!-->

{:#config.mark.filled}
##### Example: `filled` Points

By default, `point` marks have filled borders and are transparent inside. Setting `config.mark.filled` to `true` creates filled marks instead.

<span class="vl-example" data-name="point_filled"></span>


#### Opacity

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| opacity       | Number        | The overall opacity (value between [0,1]). <span class="note-line">__Default value:__ `0.7` for non-aggregate plots with `point`, `tick`, `circle`, or `square` marks and `1` otherwise.  </span>|
| fillOpacity   | Number        | The fill opacity (value between [0,1]). <span class="note-line">__Default value:__ `1` </span>|
| strokeOpacity | Number        | The stroke opacity (value between [0,1]). <span class="note-line">__Default value:__ `1` </span> |

#### Stroke Style

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| strokeWidth   | Number        | The stroke width, in pixels. |
| strokeDash    | Number[]      | An array of alternating stroke, space lengths for creating dashed or dotted lines.  |
| strokeDashOffset  | Number[]  | The offset (in pixels) into which to begin drawing with the stroke dash array. |

<!-- one example for custom fill/stroke -->

{:#stacked}
### Stacking (for Bar and Area)

<!-- TODO: -->

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| stacked       | string        | Stacking modes for `bar` and `area` marks.  <br/> • `zero` - stacking with baseline offset at zero value of the scale (for creating typical stacked [bar](mark.html#stacked-bar-chart) and [area](mark.html#stacked-area-chart) chart).  <br/> • `normalize` - stacking with normalized domain (for creating normalized stacked [bar](mark.html#normalized-stacked-bar-chart) and [area](mark.html#normalized-stacked-area-chart) chart).  <br/> • `center` - stacking with center baseline (for [streamgraph](mark.html#streamgraph)). <br/> • `none` - No-stacking.  This will produces layered [bar](mark.html#layered-bar-chart) and area chart.  <span class="note-line">__Default value:__ `zero` if applicable.</span>|

{:#interpolate}
### Interpolation (for Line and Area Marks)

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| interpolate   | String        | The line interpolation method to use. One of `"linear"`, `"step-before"`, `"step-after"`, `"basis"`, `"basis-open"`, `"basis-closed"`, `"bundle"`, `"cardinal"`, `"cardinal-open"`, `"cardinal-closed"`, `"monotone"`.  For more information about each interpolation method, please see [D3's line interpolation](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate). |
| tension       | Number        | Depending on the interpolation type, sets the tension parameter.  (See [D3's line interpolation](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate).) |

#### Example: interpolate with `monotone`

<span class="vl-example" data-name="line_monotone"></span>

#### Example: interpolate with `line-step` (Step-Chart)

<span class="vl-example" data-name="line_step"></span>


{:#orient}
### Orientation (for Bar, Tick, Line, and Area Marks)

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| orient        | String        | The orientation of a non-stacked bar, area, and line charts.  The value is either `"horizontal"`, or `"vertical"` (default).  For bar and tick, this determines whether the size of the bar and tick should be applied to x or y dimension.  For area, this property determines the orient property of the Vega output.  For line, this property determines the path order of the points in the line if `path` channel is not specified.  For stacked charts, this is always determined by the orientation of the stack; therefore explicitly specified value will be ignored. |

<!-- TODO: write better explanation for default behavior -->

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

### Bar Config

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| barWidth      | Number        | The width of the bars. <span class="note-line">__Default value:__  `bandWidth-1` for the bar's dimension is an ordinal scale. (This provides 1 pixel offset between bars.) and `2` for if bar's dimension has linear scale.  </span>  |


### Point Config

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| shape               | Number              | The symbol shape to use. One of `"circle"`, `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`, or `"triangle-down"`<span class="note-line">__Default value:__ `"circle"` </span> |


### Point Size Config (for Point, Circle, and Square Marks)

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| size                | Number              | The pixel area each the point. For example: in the case of circles, the radius is determined in part by the square root of the size value.<span class="note-line">__Default value:__ `30` </span> |


### Tick Config

<div id="thickness"></div>

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| tickWidth           | Number        | The width of the ticks. <span class="note-line">__Default value:__ `2/3*bandWidth` (This will provide offset between band equals to the width of the tick.) </span>|
| thickness           | Number              | Thickness of the tick mark. <span class="note-line">__Default value:__ `1` </span> |

<!--TODO: Example - make tick mark thicker-->

### Text Config

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

#### Text Value and Format

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| text                | String |  Placeholder text if the `text` channel is not specified (`"Abc"` by default). |
| format              | String  | The formatting pattern for text value.  If not defined, this will be determined automatically |
| shortTimeLabels     | Boolean | Whether month names and weekday names should be abbreviated. |


<!-- TODO: expand format detail -->
<!-- TODO: example of customized text -->

{:#scale-config}
## Scale Configuration  (`config.scale.*`)

Scale configuration determines default properties for all [scales](scale.html) except for `row` and `column` (which are determined by [facet scale configuration](#facet-scale-config) instead).  

<span class="note-line">__See Code:__
For a full list of scale configuration and their default values, please see the `ScaleConfig` interface and `defaultScaleConfig` in [scale.schema.ts](https://github.com/vega/vega-lite/blob/master/src/schema/scale.schema.ts).
</span>

{:#axis-config}
## Axis Configuration  (`config.axis.*`)

Axis configuration determines default properties for `x` and `y` [axes](axis.html). (For `row` and `column` axes, see [facet axis configuration](#facet-axis-config)).  

<span class="note-line">__See Code:__
For a full list of axis configuration and their default values, please see the `AxisConfig` interface and `defaultAxisConfig` in [axis.schema.ts](https://github.com/vega/vega-lite/blob/master/src/schema/axis.schema.ts).
</span>

{:#legend-config}
## Legend Configuration  (`config.legend.*`)

Legend configuration determines default properties for [legends](axis.html).

<span class="note-line">__See Code:__
For a full list of legend configuration and their default values, please see the `LegendConfig` interface and `defaultLegendConfig` in [legend.schema.ts](https://github.com/vega/vega-lite/blob/master/src/schema/legend.schema.ts).
</span>


## Facet Configuration  (`config.facet.*`)

### Facet Grid Configuration (`config.facet.grid`)

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| gridColor     | Color         | Color of the grid between facets. |
| gridOpacity   | Number        | Opacity of the grid between facets. |
| gridOffset    | Number        | Offset for grid between facets.  |


{:#facet-scale-config}
### Facet Scale Configuration (`config.facet.scale.*`)

Facet scale configuration determines default properties for `row` and `column` [scales](scale.html).
<span class="note-line">__See Code:__
For a full list of scale configuration and their default values, please see the `FacetScaleConfig` interface and `defaultFacetScaleConfig` in [scale.schema.ts](https://github.com/vega/vega-lite/blob/master/src/schema/scale.schema.ts).


{:#facet-axis-config}
### Facet Axis Configuration (`config.facet.axis.*`)

Facet axis configuration determines default properties for `row` and `column` [axes](axis.html).
<span class="note-line">__See Code:__
For a full list of facet axis configuration and their default values, please see the `AxisConfig` interface and `defaultFacetAxisConfig` in [axis.schema.ts](https://github.com/vega/vega-lite/blob/master/src/schema/axis.schema.ts).
</span>
