---
layout: docs
menu: docs
title: Tooltip
permalink: /docs/tooltip.html
---

Tooltips can provide details of a particular data point on demand. Tooltips for each single-view in Vega-Lite can be (1) [generated based on the `encoding`](#encoding), (2) [generated based on the underlying data point](#data), or (3) [directly specified via the `tooltip` channel](#channel).

By default, the renderer will generate tooltips via native HTML ["title" attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/title). The [Vega Tooltip plugin](#plugin) can generate nice HTML tooltips.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#encoding}

## Tooltip Based on Encoding

Setting the `tooltip` property of the [mark definition]({{site.baseurl}}/docs/mark.html#mark-def) (or config) to `true` enables the default tooltip, which is based on all fields specified in the `encoding`.

<div class="vl-example" data-name="point_2d_tooltip"></div>

**Note:** This is equivalent to setting the `tooltip` property of the mark definition to `{"content": "encoding"}`.

{:#data}

## Tooltip Based on Underlying Data Point

Setting mark's `tooltip` to `{"content": "data"}` will produce tooltips based on all fields in the underlying data.

<div class="vl-example" data-name="point_2d_tooltip_data"></div>

{:#channel}

## Tooltip channel

To create a tooltip, Vega-Lite's [`tooltip`](encoding.html#mark-properties-channels) channel can be mapped to a data field. For example, this bar chart supports tooltips for field `b`. Hover over the bar and notice the simple tooltip that displays the value of field `b` for each bar.

<div class="vl-example" data-name="bar_tooltip"></div>

To show more than one field, you can provide an array of field definitions. [Vega tooltip](https://github.com/vega/vega-tooltip/) will display a table that shows the name of the field and its value. Here is an example.

<div class="vl-example" data-name="bar_tooltip_multi"></div>

Alternatively, you can [calculate](calculate.html) a new field that concatenates multiple fields (and use a single field definition).

To give the fields in the tooltip a label that is different from the field name, set the `title` parameter.

<div class="vl-example" data-name="bar_tooltip_title"></div>

Note that encoding a field without an [aggregate](aggregate.html) as a tooltip means that the field will be used to group aggregates by.

In the example below, adding the tooltip for b means that b becomes part of the fields to group by. Therefore, there is one tick per unique date value.

<div class="vl-example" data-name="bar_tooltip_groupby"></div>

To avoid that the tooltips groups the data, add an aggregate to the tooltip encoding.

<div class="vl-example" data-name="bar_tooltip_aggregate"></div>

## Tooltip image

To display an image in a tooltip you need to be using the [Vega Tooltip plugin](#plugin). Vega Tooltip requires the special field name `image` to be used to indicate that the field values should be rendered as images instead of displayed as text in the tooltip. The image tooltip can be specified either by setting the `tooltip` property of the mark definition (as detailed above) or by passing the field *as an array* to the tooltip encoding channel, as in the example below:

<div class="vl-example" data-name="text_tooltip_image"></div>

In addition to providing the path to an image, the Vega Tooltip plugin can also render base64 encoded images prefixed with `data:image/png;base64,` [similarly to how these are rendered inside HTML image tags](https://www.w3docs.com/snippets/html/how-to-display-base64-images-in-html.html). To change the maximum size of the rendered tooltip images, you can adjust the `max-width` and `max-height` properties of the CSS selector `#vg-tooltip-element img`.

## Disable tooltips

To disable tooltips for a particular single view specification, you can set the `"tooltip"` property of a mark definition block to `null`.

```js
{
  "mark": {"type": ..., "tooltip": null, ...},
  "encoding": ...,
  ...
}
```

Alternatively, you can also set the `"tooltip"` encoding to `null`:

```js
{
  "mark": ...,
  "encoding": {
    "tooltip": null
  },
  ...
}
```

To disable all tooltips, disable it in the [config](config.html) with

```js
"config": {
  "mark": {"tooltip": null}
}
```

{:#plugin}

## Vega Tooltip plugin

You can further customize the tooltip by specifying a custom event handler via [`tooltipHandler`](https://vega.github.io/vega/docs/api/view/#view_tooltipHandler) of the [`Vega View API`](https://vega.github.io/vega/docs/api/view/). Vega invokes the handler every time a tooltip is shown.

We provide [Vega Tooltip](https://github.com/vega/vega-tooltip/), a tooltip handler that creates a customizable HTML tooltip. Below is an example of Vega-Lite visualization with [Vega Tooltip](https://github.com/vega/vega-tooltip/) plugin. Vega Tooltip comes with [Vega Embed](https://github.com/vega/vega-embed) so you might already be using it.

<div class="vl-example" data-name="bar_tooltip"></div>

Without the tooltip plugin, Vega-Lite will generate tooltips via native HTML ["title" attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/title). Move your cursor over one of the bars to see it (you might have to wait for a little bit for the tooltip to appear).

<div class="vl-example no-tooltip" data-name="bar_tooltip"></div>
