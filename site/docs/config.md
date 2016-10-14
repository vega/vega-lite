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
    ...               // - Top-level Configuration
    "cell": { ... },   // - Cell Configuration
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
- [Cell Configuration](#cell-config)
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
| background    | String        | CSS color property to use as background of visualization. <span class="note-line">__Default value:__ (none)</span> |
| countTitle    | String      | The default title for count field (`{field:'*', aggregate:'count', type: 'QUANTITATIVE'}`). <span class="note-line">__Default value:__ `'Number of Records'`.</span>|
| numberFormat  | String      | The default number format pattern for text and labels of axes and legends (in the form of [D3 number format pattern](https://github.com/mbostock/d3/wiki/Formatting)). <span class="note-line">__Default value:__ `"s"` (except for text marks that encode a count field, the default value is `"d"`).</span>|
| timeFormat    | String     | The default time format pattern for temporal field without time unit in the text mark and labels of axes and legends (in the form of [D3 time format pattern](https://github.com/mbostock/d3/wiki/Time-Formatting)). <span class="note-line">__Default value:__ `'%b %d, %Y'`.</span>|

<!-- TODO: consider adding width, height, numberFormat, timeFormat  -->

{:#cell-config}
## Cell Configuration  (`config.cell.*`)

At its core, a Vega-Lite specification describes a single plot. When a [facet channel](encoding.html#facet) is added, the visualization is faceted into a trellis plot, which contains multiple plots.
Each plot in either a single plot or a trellis plot is called a _cell_. Cell configuration allows us to customize each individual single plot and each plot in a trellis plot.

### Cell Size Configuration

`width` and `height` property of the cell configuration determine the width of a visualization with a continuous x-scale and the height of a visualization with a continuous y-scale respectively.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| width         | Integer       | The default width of the single plot or each plot in a trellis plot when the visualization has a continuous (non-ordinal) x-scale or ordinal x-scale with `bandSize` = `"fit"`. <span class="note-line">__Default value:__ `200`</span> |
| height        | Integer       | The default height of the single plot or each plot in a trellis plot when the visualization has a continuous (non-ordinal) y-scale with `bandSize` = `"fit"`. <span class="note-line">__Default value:__ `200`</span> |

**For more information about visualization's size, please see [Customizing Size](size.html) page.**

### Cell Style Configuration

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| clip          | boolean       | Whether the view should be clipped. |
| fill          | Color         | The fill color. <span class="note-line">__Default value:__ (none)</span> |
| fillOpacity   | Number        | The fill opacity (value between [0,1]). <span class="note-line">__Default value:__ (none)</span>|
| stroke        | Color         | The stroke color. <span class="note-line">__Default value:__ (none)</span>|
| strokeOpacity | Number        | The stroke opacity (value between [0,1]). <span class="note-line">__Default value:__ (none)</span>|
| strokeWidth   | Number        | The stroke width, in pixels. <span class="note-line">__Default value:__ (none)</span>|
| strokeDash    | Number[]      | An array of alternating stroke, space lengths for creating dashed or dotted lines. <span class="note-line">__Default value:__ (none)</span>|
| strokeDashOffset  | Number    | The offset (in pixels) into which to begin drawing with the stroke dash array. <span class="note-line">__Default value:__ (none)</span>|


{:#mark-config}
## Mark Configuration (`config.mark.*`)

`mark` property of the `config` is a mark config object, which sets the default properties of the visualization's marks. Some of these properties will be overridden by data mapped to [mark properties channels](encoding.html#props-channels).

A mark config object can have the following properties:

#### Color

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| filled        | Boolean        | Whether the shape\'s color should be used as fill color instead of stroke color. See [mark](mark.html#scatter_filled) for a usage example. <span class="note-line">__Default value:__ `true` for all marks except `point` and `false` for `point`.</span><span class="note-line">__Applicable for:__ `bar`, `point`, `circle`, `square`, and `area` marks.</span> |
| color         | color         | The color of the mark – either fill or stroke color based on the `filled` mark config. <span class="note-line">__Default value:__ <span style="color: #4682b4;">&#9632;</span> blue (`""#4682b4"`)</span>  |
| fill          | Color         | The fill color. This config will be overridden by `color` channel's specified or mapped values if `filled` is `true`. <span class="note-line">__Default value:__ (None) </span>  |
| stroke        | Color         | The stroke color. This config will be overridden by `color` channel's specified or mapped values if `filled` is `false`. <span class="note-line">__Default value:__ (None) </span> |

<!-- Linked from another page. Don't remove!-->

{:#config.mark.filled}
##### Example: `filled` Points

By default, `point` marks have filled borders and are transparent inside. Setting `config.mark.filled` to `true` creates filled marks instead.

<span class="vl-example" data-name="point_filled"></span>


#### Opacity

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| opacity       | Number        | The overall opacity (value between [0,1]). <span class="note-line">__Default value:__ `0.7` for non-aggregate plots with `point`, `tick`, `circle`, or `square` marks or [layered `bar` charts](http://vega.github.io/vega-editor/?mode=vega-lite&spec=bar_layered_transparent&showEditor=1) and `1` otherwise. </span>|
| fillOpacity   | Number        | The fill opacity (value between [0,1]). <span class="note-line">__Default value:__ `1` </span>|
| strokeOpacity | Number        | The stroke opacity (value between [0,1]). <span class="note-line">__Default value:__ `1` </span> |

#### Stroke Style

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| strokeWidth   | Number        | The stroke width, in pixels. |
| strokeDash    | Number[]      | An array of alternating stroke, space lengths for creating dashed or dotted lines. |
| strokeDashOffset  | Number    | The offset (in pixels) into which to begin drawing with the stroke dash array. |

<!-- one example for custom fill/stroke -->

{:#stacked}
### Stacking (for Bar and Area)

<!-- TODO: -->

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| stacked       | string        | Modes for stacking marks. <br/> • `zero` - stacking with baseline offset at zero value of the scale (for creating typical stacked [bar](mark.html#stacked-bar-chart) and [area](mark.html#stacked-area-chart) chart). <br/> • `normalize` - stacking with normalized domain (for creating normalized stacked [bar](mark.html#normalized-stacked-bar-chart) and [area](mark.html#normalized-stacked-area-chart) chart). <br/> • `center` - stacking with center baseline (for [streamgraph](mark.html#streamgraph)). <br/> • `none` - No-stacking. This will produce layered [bar](mark.html#layered-bar-chart) and area chart. <span class="note-line">__Default value:__ `zero` for plots with all of the following conditions: (1) `bar` or `area` marks (2) `color`, `opacity`, `size`, or `detail` channel mapped to a group-by field (3) One ordinal or nominal axis, and (4) one quantitative axis with linear scale and summative aggregation function (e.g., `sum`, `count`).</span>|

{:#interpolate}
### Interpolation (for Line and Area Marks)

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| interpolate   | String        | The line interpolation method to use. One of `"linear"`, `"step-before"`, `"step-after"`, `"basis"`, `"basis-open"`, `"basis-closed"`, `"bundle"`, `"cardinal"`, `"cardinal-open"`, `"cardinal-closed"`, `"monotone"`. For more information about each interpolation method, please see [D3's line interpolation](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate). |
| tension       | Number        | Depending on the interpolation type, sets the tension parameter. (See [D3's line interpolation](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate).) |

#### Example: interpolate with `monotone`

<span class="vl-example" data-name="line_monotone"></span>

#### Example: interpolate with `line-step` (Step-Chart)

<span class="vl-example" data-name="line_step"></span>


{:#orient}
### Orientation (for Bar, Tick, Line, and Area Marks)

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| orient        | String        | The orientation of a non-stacked bar, area, and line charts. The value is either `"horizontal"`, or `"vertical"` (default). For bar and tick, this determines whether the size of the bar and tick should be applied to x or y dimension. For area, this property determines the orient property of the Vega output. For line, this property determines the path order of the points in the line if `path` channel is not specified. For stacked charts, this is always determined by the orientation of the stack; therefore explicitly specified value will be ignored. |

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
| barSize      | Number        | The size of the bars (width for vertical bar charts and height for horizontal bar chart). <span class="note-line">__Default value:__  `bandSize-1` if  the bar's x or y axis is an ordinal scale. (This provides 1 pixel offset between bars.) and `2` for if both x and y scales have linear scales. </span>  |


### Point Config

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| shape               | Number              | The symbol shape to use. One of `"circle"`, `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`, or `"triangle-down"`, or else a custom SVG path string.<span class="note-line">__Default value:__ `"circle"` </span> |


### Point Size Config (for Point, Circle, and Square Marks)

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| size                | Number              | The pixel area each the point. For example: in the case of circles, the radius is determined in part by the square root of the size value.<span class="note-line">__Default value:__ `30` </span> |


### Tick Config

{:#tick-thickness}

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| tickSize           | Number        | The size of the ticks  (height of the ticks for horizontal dot plots and strip plots and width of the ticks for vertical dot plots and strip plots). <span class="note-line">__Default value:__ `2/3*bandSize` (This will provide offset between band equals to the width of the tick.) </span>|
| tickThickness           | Number              | Thickness of the tick mark. <span class="note-line">__Default value:__ `1` </span> |

#### Example Customizing Tick's Size and Thickness

<span class="vl-example" data-name="tick_dot_thickness"></span>

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
| fontSize            | Number  | The font size, in pixels. The default value is 10. |
| fontStyle           | String  | The font style (e.g., `italic`).|
| fontWeight          | String  | The font weight (e.g., `bold`).|

#### Text Value and Format

| Property            | Type                | Description  |
| :------------------ |:-------------------:| :------------|
| text                | String |  Placeholder text if the `text` channel is not specified (`"Abc"` by default). |
| format              | String  | The formatting pattern for text value. If not defined, this will be determined automatically |
| shortTimeLabels     | Boolean | Whether year, month names, and weekday names should be abbreviated.  <span class="note-line">__Default Behavior:__ Only month is shortened by default.</span>  |

<!-- TODO: expand format detail -->
<!-- TODO: example of customized text -->

{:#scale-config}
## Scale Configuration  (`config.scale.*`)

Scale configuration determines default properties for all [scales](scale.html) except for `row` and `column` (which are determined by [facet scale configuration](#facet-scale-config) instead).

<span class="note-line">__See Code:__
For a full list of scale configuration and their default values, please see the `ScaleConfig` interface and `defaultScaleConfig` in [scale.ts](https://github.com/vega/vega-lite/blob/master/src/scale.ts).
</span>

{:#axis-config}
## Axis Configuration  (`config.axis.*`)

Axis configuration determines default properties for `x` and `y` [axes](axis.html). (For `row` and `column` axes, see [facet axis configuration](#facet-axis-config)).

<span class="note-line">__See Code:__
For a full list of axis configuration and their default values, please see the `AxisConfig` interface and `defaultAxisConfig` in [axis.ts](https://github.com/vega/vega-lite/blob/master/src/axis.ts).
</span>

{:#legend-config}
## Legend Configuration  (`config.legend.*`)

Legend configuration determines default properties for [legends](axis.html).

<span class="note-line">__See Code:__
For a full list of legend configuration and their default values, please see the `LegendConfig` interface and `defaultLegendConfig` in [legend.ts](https://github.com/vega/vega-lite/blob/master/src/legend.ts).
</span>

{:#facet-config}
## Facet Configuration  (`config.facet.*`)

{:#facet-cell-config}
### Cell Configuration (`config.facet.cell.*`)

Facet cell configuration overrides [cell config](#cell-config) for faceted (trellis) plots. Please see [cell config](#cell-config) for each property name and default values.

{:#facet-grid-config}
### Facet Grid Configuration (`config.facet.grid.*`)

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| color         | Color         | Color of the grid between facets. |
| opacity       | Number        | Opacity of the grid between facets. |
| offset        | Number        | Offset for grid between facets. |


{:#facet-scale-config}
### Facet Scale Configuration (`config.facet.scale.*`)

Facet scale configuration determines default properties for `row` and `column` [scales](scale.html).
<span class="note-line">__See Code:__
For a full list of scale configuration and their default values, please see the `FacetScaleConfig` interface and `defaultFacetScaleConfig` in [scale.ts](https://github.com/vega/vega-lite/blob/master/src/scale.ts).


{:#facet-axis-config}
### Facet Axis Configuration (`config.facet.axis.*`)

Facet axis configuration determines default properties for `row` and `column` [axes](axis.html).
<span class="note-line">__See Code:__
For a full list of facet axis configuration and their default values, please see the `AxisConfig` interface and `defaultFacetAxisConfig` in [axis.ts](https://github.com/vega/vega-lite/blob/master/src/axis.ts).
</span>
