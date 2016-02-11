---
layout: docs
menu: docs
title: Legend
permalink: /docs/legend.html
---

Similar to [axes](axis.html), legends visualize scales. However, whereas axes aid interpretation of scales with spatial ranges, legends aid interpretation of scales with ranges such as colors, shapes and sizes.

By default, Vega-Lite automatically creates legends for `color`, `size`, and `shape` channels when they are encoded.  Legend can be further customized via the channel definition's `legend` property.  

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
| orient        | String        | The orientation of the legend. One of `"left"` or `"right"`. This determines how the legend is positioned within the scene. The default is `"right"`.|
| title         | String        | The title for the legend.  If `title` is unspecified, the default value is produced from the field's name and transformation function applied e.g, "field_name", "SUM(field_name)", "BIN(field_name)", "YEAR(field_name)". |
| format        | String        | An optional formatting pattern for legend labels. Vega uses [D3's format pattern](https://github.com/mbostock/d3/wiki/Formatting).|
| shortTimeLabels | Boolean       | Whether month and day names should be abbreviated. |
| values        | Array         | Explicitly set the visible legend values.|
