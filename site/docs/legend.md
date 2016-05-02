---
layout: docs
menu: docs
title: Legend
permalink: /docs/legend.html
---

Similar to [axes](axis.html), legends visualize scales. However, whereas axes aid interpretation of scales with spatial ranges, legends aid interpretation of scales with ranges such as colors, shapes and sizes.

By default, Vega-Lite automatically creates legends for `color`, `size`, and `shape` channels when they are encoded. Legend can be further customized via the channel definition's `legend` property.

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": ... ,
  "encoding": {
    "x": ...,
    "y": ...,
    "color": {
      "field": ...,
      "type": ...,
      "legend": {                // legend
        ...
      },
      ...
    },
    ...
  },
  ...
}
```

## Customizing Legend

The field's legend can be removed by setting `legend` to `false`.
If `legend` is `true`, default legend properties are applied.

Legend properties can be overridden by setting `legend` to a legend property object.
The `legend` property object supports the following properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| orient        | String        | The orientation of the legend. One of `"left"` or `"right"`. This determines how the legend is positioned within the scene. <span class="note-line">__Default value:__  derived from [legend config](config.html#legend-config)'s `orient` (`"right"` by default).</span>|
| offset        | Number        | The offset, in pixels, by which to displace the legend from the edge of the enclosing group or data rectangle. <span class="note-line">__Default value:__  derived from [legend config](config.html#legend-config)'s `offset` (`0` by default).</span> |
| title         | String        | The title for the legend. <span class="note-line">__Default value:__  derived from the field's name and transformation function applied e.g, "field_name", "SUM(field_name)", "BIN(field_name)", "YEAR(field_name)".</span> |
| format        | String        | The formatting pattern for axis labels. This is D3's [number format pattern](https://github.com/mbostock/d3/wiki/Formatting) for quantitative axis and D3's [time format pattern](https://github.com/mbostock/d3/wiki/Time-Formatting) for time axis. <span class="note-line">__Default value:__  derived from [`numberFormat`](config.html#format) config for quantitative axis and from [`timeFormat`](config.html#format) config for time axis.</span>. |
| labelAlign    | String        | The alignment of the legend label. One of `"left"`, `"right"` or `"center"`. |
| labelBaseline | String        | The position of the baseline of legend label. One of `"top"`, `"middle"` or `"bottom"`. |
| labelColor    | String        | The color of the legend label. |
| labelFont     | String        | The font of the label (e.g., `Helvetica Neue`). |
| labelFontSize | Number        | The font size of the label, in pixels. The default value is 10. |
| shortTimeLabels | Boolean       | Whether month and day names should be abbreviated. <span class="note-line">__Default value:__  derived from [legend config](config.html#legend-config)'s `shortTimeLabels` (`false` by default).</span>|
| symbolColor   | String        | The color of the symbol. |
| symbolShape   | String        | The shape of the legend symbol. One of `"circle"`, `"square"`, `"cross"`, `"diamond"`, `"triangle-up"` or `"triangle-down"` |
| symbolSize    | Number        | The size of the symbol, in pixels.  |
| symbolStrokeWidth   | Number      | The width of the symbol's stroke. |
| titleColor    | String        | The color of the title. |
| titleFont     | String        | The font of the title (e.g., `Helvetica Neue`). |
| titleFontSize | Number        | The font size of the title. |
| titleFontWeight   | String        | The font weight of the title (e.g., `bold`). | 
| values        | Array         | Explicitly set the visible legend values.|
