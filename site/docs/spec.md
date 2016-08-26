---
layout: docs
menu: docs
title: Vega-Lite Specification
permalink: /docs/spec.html
---

{:#spec}
## Vega-Lite Specifications

At its core, Vega-Lite specifications are JSON objects that describe visualizations as [mappings](encoding.html) from data to properties of [graphical marks](mark.html) (e.g., points or bars). By simply providing a mark type and a mapping, Vega-Lite automatically produces other visualization components including axes, legends, and scales. Unless explicitly specified, Vega-Lite determines properties of these components based on a set of carefully designed rules. This approach allows Vega-Lite specifications to be succinct and expressive, but also provide user control.

As it is designed for analysis, Vega-Lite also supports data transformation such as [aggregation](aggregate.html), [binning](bin.html), [time unit conversion](timeunit.html), [filtering](transform.html), and [sorting](sort.html). In addition, it also supports faceting a single plot into [trellis plots or small multiples](https://en.wikipedia.org/wiki/Small_multiple).

{: .suppress-error}
```json
{
  "description": ... ,
  "data": ... ,
  "mark": ... ,
  "transform": ...,
  "encoding": {
    "x": {
      "field": ...,
      "type": ...,
      ...
    },
    "y": ...,
    "color": ...,
    ...
  },
  "config": ...
}
```

In Vega-Lite, a specification can have the following top-level properties.

| Property             | Type          | Description    |
| :------------        |:-------------:| :------------- |
| description          | String     | An _optional_ description of this mark for commenting purpose. This property has no effect on the output visualization. |
| [width](size.html)   | Integer       | Width of a single visualization.  (For faceted plot, this represents the width of a single cell.)  If not specified (`undefined`), this will be determined by the following rules: <br/>  • For x-axis with a continuous (non-ordinal) scale, the width will be the value of [`config.cell.width`](config.html#cell-config). <br/>  • For x-axis with an ordinal scale: if [`bandSize`](scale.html#ordinal) is a numeric value (default), the width is determined by the value of `bandSize` and the cardinality of the field mapped to x-channel.   Otherwise, if the `bandSize` is `"fit"`, the width will be the value of [`config.cell.width`](config.html#cell-config). <br/>  • If no field is mapped to `x` channel, the `width` will be the value of `textBandWidth` for `text` mark and the value of `bandSize` for other marks. <span class="note-line"> __Default value:__ `undefined` .</span><span class="note-line">__Examples:__ Please see [Customizing Size](size.html) page.</span> |
| [height](size.html)  | Integer       | Height of a single visualization.  (For faceted plot, this represents the height of a single cell.)  If not specified (`undefined`), this will be determined by the following rules: <br/>  • For y-axis with a continuous (non-ordinal) scale, the height will be the value of [`config.cell.height`](config.html#cell-config). <br/>  • For y-axis with an ordinal scale: if [`bandSize`](scale.html#ordinal) is a numeric value (default), the height is determined by the value of `bandSize` and the cardinality of the field mapped to y-channel.   Otherwise, if the `bandSize` is `"fit"`, the height will be the value of [`config.cell.height`](config.html#cell-config). <br/>  • If no field is mapped to `x` channel, the `height` will be the value of `bandSize`. <span class="note-line"> __Default value:__ `undefined` .</span><span class="note-line">__Examples:__ Please see [Customizing Size](size.html) page.</span> |
| [data](data.html)    | Object        | An object describing the data source. |
| [transform](transform.html) | Object | An object describing filter and new field calculation. |
| [mark](mark.html)    | String        | The mark type. One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`, `"area"`, `"point"`, and `"text"`. |
| [encoding](encoding.html) | Object   | A key-value mapping between encoding channels and definition of fields. |
| [config](config.html)   | Object     | Configuration object. |

