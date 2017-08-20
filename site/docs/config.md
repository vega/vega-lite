---
layout: docs
menu: docs
title: Configuration
permalink: /docs/config.html
---

{: .suppress-error}
```json
{
  ...,
  "config": {          // Configuration Object
    ...                // - Top-level Configuration
    "cell": { ... },   // - Cell Configuration
    "mark": { ... },   // - Mark Configuration
    "scale": { ... },  // - Scale Configuration
    "range": { ... },  // - Scale Range Configuration
    "axis": { ... },   // - Axis Configuration
    "legend": { ... }, // - Legend Configuration
    "facet": { ... },  // - Facet Configuration
    "title": { ... }   // - title Configuration
  }
}
```

Vega-Lite's `config` object lists configuration properties of a visualization.
This page outlines different types of config properties:

- [Top-level Configuration](#top-level-config)
- [Cell Configuration](#cell-config)
- [Mark Configuration](#mark-config)
- [Scale Configuration](#scale-config)
- [Scale Range Configuration](#scale-range-config)
- [Axis Configuration](#axis-config)
- [Legend Configuration](#legend-config)
- [Facet Configuration](#facet-config)
- [Title Configuration](#title-config)

{:#top-level-config}
## Top-level Configuration  (`config.*`)

A Vega-Lite `config` object can have the following top-level properties:

{:#format}

{% include table.html props="background,countTitle,invalidValues,numberFormat,padding,range,timeFormat" source="Config" %}

<!-- TODO: consider adding width, height, numberFormat, timeFormat  -->
<!-- TODO: move range to its own section -->

{:#cell-config}
## Cell Configuration  (`config.cell.*`)

At its core, a Vega-Lite specification describes a single plot. When a [facet channel](encoding.html#facet) is added, the visualization is faceted into a trellis plot, which contains multiple plots.
Each plot in either a single plot or a trellis plot is called a _cell_. Cell configuration allows us to customize each single plot and each plot in a trellis plot.

### Cell Size Configuration

`width` and `height` property of the cell configuration determine the width of a visualization with a continuous x-scale and the height of a visualization with a continuous y-scale respectively.

{% include table.html props="width,height" source="CellConfig" %}

**For more information about visualization's size, please see [Customizing Size](size.html) page.**

### Cell Style Configuration

{% include table.html props="clip,fill,fillOpacity,stroke,strokeOpacity,strokeWidth,strokeDash,strokeDashOffset" source="CellConfig" %}


{:#mark-config}
## Mark Configuration (`config.mark.*`)

`mark` property of the `config` is a mark config object, which sets the default properties of the visualization's marks. Some of these properties will be overridden by data mapped to [mark properties channels](encoding.html#props-channels).

A mark config object can have the following properties:

#### Color

{% include table.html props="filled,color,fill,stroke" source="MarkConfig" %}

<!-- Linked from another page. Don't remove!-->

{:#config.mark.filled}
##### Example: `filled` Points

By default, `point` marks have filled borders and are transparent inside. Setting `config.mark.filled` to `true` creates filled marks instead.

<span class="vl-example" data-name="point_filled"></span>


#### Opacity

{% include table.html props="opacity,fillOpacity,strokeOpacity" source="MarkConfig" %}


#### Stroke Style

{% include table.html props="strokeWidth,strokeDash,strokeDashOffset" source="MarkConfig" %}

<!-- one example for custom fill/stroke -->

{:#interpolate}
### Interpolation (for Line and Area Marks)

{% include table.html props="interpolate,tension" source="MarkConfig" %}

#### Example: interpolate with `monotone`

<span class="vl-example" data-name="line_monotone"></span>

#### Example: interpolate with `line-step` (Step-Chart)

<span class="vl-example" data-name="line_step"></span>


{:#orient}
### Orientation (for Bar, Tick, Line, and Area Marks)

{% include table.html props="orient" source="MarkConfig" %}

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

{% include table.html props="binSpacing,continuousBandSize,discreteBandSize" source="BarConfig" %}


#### Example: Histogram without Spacing between bars

<span class="vl-example" data-name="histogram_no_spacing"></span>

### Point Config

{% include table.html props="shape" source="MarkConfig" %}


### Point Size Config (for Point, Circle, and Square Marks)

{% include table.html props="size" source="MarkConfig" %}


### Tick Config

{:#tick-thickness}

{% include table.html props="bandSize,thickness" source="TickConfig" %}


#### Example Customizing Tick's Size and Thickness

<span class="vl-example" data-name="tick_dot_thickness"></span>

### Text Config

<div id="text"></div>

#### Text Position

{% include table.html props="angle,align,baseline,dx,dy,radius,theta" source="MarkConfig" %}


#### Font Style

{% include table.html props="font,fontSize,fontStyle,fontWeight" source="MarkConfig" %}

#### Text Value

{% include table.html props="text" source="MarkConfig" %}


<!-- TODO: expand format detail -->
<!-- TODO: example of customized text -->

{:#scale-config}
## Scale Configuration  (`config.scale.*`)

Scale configuration determines default properties for all [scales](scale.html).
For a full list of scale configuration, please see the [Scale Config section in the scale page](scale.html#config).

{:#scale-range-config}
## Scale Range Configuration  (`config.range.*`)

Scale range configuration defines default range array or scheme for using with scales. For a full list of scale range configuration, please see the [Range Config section in the scale page](scale.html#config).

{:#axis-config}
## Axis Configuration  (`config.axis.*`)

Axis configuration determines default properties for `x` and `y` [axes](axis.html).
For a full list of axis configuration, please see the [Axis Config section in the axis page](axis.html#axis-config).

{:#legend-config}
## Legend Configuration  (`config.legend.*`)

Legend configuration determines default properties for [legends](legend.html). Please see [legend config](legend.html#legend-config) for each property name and default values.
<!--
{:#title-config}
## Title Configuration  (`config.title.*`)

{% include table.html props="anchor,angle,baseline,color,font,fontSize,fontWeight,limit,offset,orient" source="VgTitleConfig" %} -->
