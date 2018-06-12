---
layout: docs
menu: docs
title: Encoding
permalink: /docs/encoding.html
---
An integral part of the data visualization process is encoding data with visual properties of graphical marks.
The `encoding` property of a single view specification represents the mapping between [encoding channels](#channels) (such as `x`, `y`, or `color`) and [data fields](#field-def) or [constant values](#value-def).

{: .suppress-error}
```json
// Specification of a Single View
{
  "data": ... ,
  "mark": ... ,
  "encoding": {     // Encoding
    // Position Channels
    "x": ...,
    "y": ...,
    "x2": ...,
    "y2": ...,

    // Geographic Position Channels
    "longtitude": ...,
    "latitude": ...,
    ...

    // Mark Properties Channels
    "color": ...,
    "opacity": ...,
    "size": ...,
    "shape": ...,

    // Text and Tooltip Channels
    "text": ...,
    "tooltip": ...,

    // Hyperlink Channel
    "href": ...,

    // Key Channel
    "key": ...,

    // Order Channel
    "order": ...,

    // Level of Detail Channel
    "detail": ...,

    // Facet Channels
    "row": ...,
    "column": ...
  },
  ...
}
```

{:#channels}
## Encoding Channels

The keys in the `encoding` object are encoding channels.  Vega-lite supports the following groups of encoding channels

- [Position Channels](#position): `x`, `y`, `x2`, `y2`
- [Geographic Position Channels](#geo): `longitude`, `latitude`, `longitude2`, `latitude2`
- [Mark Property Channels](#mark-prop): `color`, `opacity`, `shape`, `size`
- [Text and Tooltip Channels](#text): `text`, `tooltip`
- [Hyperlink Channel](#href): `href`
- [Level of Detail Channel](#detail): `detail`
- [Key Channel](#key): `key`
- [Order Channel](#order): `order`
- [Facet Channels](#facet): `row`, `column`

## Channel Definition

Each channel definition object is either a [field definition]((#field-def)), which describes
the data field encoded by the channel, or a [value definition](#value-def), which describes
an encoded constant value.

{:#field-def}
### Field Definition

{: .suppress-error}
```json
// Specification of a Single View
{
  ...,
  "encoding": {     // Encoding
    ...: {
      "field": ...,
      "type": ...,
      ...
    },
    ...
  },
  ...
}
```

To encode a particular field in the data set with an encoding channel, the channel's field definition must describe the [`field`](field.html) name and its data [`type`](type.html).  To facilitate data exploration, Vega-Lite also provides inline field transforms ([`aggregate`](aggregate.html), [`bin`](bin.html), [`sort`](sort.html), [`stack`](stack.html), and [`timeUnit`](timeunit.html)) as a part of a field definition in addition to the top-level [`transform`](transform.html).

All field definitions support the following properties:

{% include table.html props="field,type,bin,timeUnit,aggregate,title" source="FieldDef" %}

In addition, field definitions for different encoding channels may support the following properties:

- [`scale`](scale.html) - The function that transforms values in the data domain (numbers, dates, strings, etc) to visual values (pixels, colors, sizes) for [position](#position) and [mark property](#mark-prop) channels.

- [`axis`](axis.html) - The guiding visualization to aid interpretation of scales for [position channels](#position).

- [`legend`](legend.html) - The guiding visualization to aid interpretation of [mark property channels](#mark-prop).

- [`format`](format.html) - The formatting pattern for text value for [text channels](#text).

- [`stack`](stack.html) - Type of stacking offset if a [position field](#position) with continuous domain should be stacked.

- [`sort`](sort.html) - Sort order for a field for [position](#position) and [mark property](#mark-prop) channels.

- [`condition`](condition.html) - The conditional encoding rule for [mark property](#mark-prop) and [text](#text) channels.

To see a list of additional properties for each type of encoding channels, please see the specific sections
for [position](#position), [mark property](#mark-prop), [text and tooltip](#text), [detail](#detail), [order](#order), and [facet](#facet) channels.

{:#value-def}
### Value Definition

{: .suppress-error}
```json
// Specification of a Single View
{
  ...,
  "encoding": {     // Encoding
    ...: {
      "value": ...
    },
    ...
  },
  ...
}
```

To map a constant value to an encoding channel, the channel's value definition must describe the `value` property.
(See the [`value`](value.html) page for more examples.)

{% include table.html props="value" source="ValueDef" %}

{:#position}
## Position Channels

`x` and `y` position channels determine the position of the marks, or width/height of horizontal/vertical `"area"` and `"bar"`.
In addition, `x2` and `y2` can specify the span of ranged [`area`](area.html#ranged), [`bar`](bar.html#ranged), [`rect`](rect.html#ranged), and [`rule`](rule.html#ranged).

By default, Vega-Lite automatically generates a [scale](scale.html) and an [axis](axis.html) for each field mapped to a position channel. If unspecified, properties of scales and axes are determined based on a set of rules by the compiler. `scale` and `axis` properties of the field definition can be used to customize their properties.

{% include table.html props="x,y,x2,y2" source="Encoding" %}

{:#position-field-def}
### Position Field Definition

In addition to [`field`](field.html), [`type`](type.html), [`bin`](bin.html), [`timeUnit`](timeunit.html) and [`aggregate`](aggregate.html),
[field definitions](#field-def) for `x` and `y` channels may also include these properties:

{% include table.html props="scale,axis,sort,stack" source="PositionFieldDef" %}

__Note:__ `x2` and `y2` do not have their own definitions for `scale`, `axis`, `sort`, and `stack` since they share the same scales and axes with `x` and `y` respectively.


{:#geo}
## Geographic Position Channels

`longitude` and `latitude` channels can be used to encode geographic coordinate data via a [projection](projection.html).
In addition, `longitude2` and `latitude2` can specify the span of geographically projected ranged [`area`](area.html#ranged), [`bar`](bar.html#ranged), [`rect`](rect.html#ranged), and [`rule`](rule.html#ranged).

{% include table.html props="longitude,latitude,longitude2,latitude2" source="Encoding" %}

See [an example that uses `longitude` and `latitude` channels in a map](https://vega.github.io/vega-lite/examples/geo_circle.html) or [another example that draws line segments (`rule`s) between points in a map](https://vega.github.io/vega-lite/examples/geo_rule.html).


{:#mark-prop}
## Mark Property Channels

Mark properties channels map data fields to visual properties of the marks.
By default, Vega-Lite automatically generates a scale and a legend for each field mapped to a mark property channel. If unspecified, properties of scales and legends are determined based on a set of rules by the compiler. `scale` and `legend` properties of the field definition can be used to customize their properties.
In addition, definitions of mark property channels can include the `condition` property to specify conditional logic.

Here are the list of mark property channels:

{% include table.html props="color,fill,stroke,opacity,shape,size" source="Encoding" %}

{:#mark-prop-field-def}
### Mark Property Field Definition

In addition to [`field`](field.html), [`type`](type.html), [`bin`](bin.html), [`timeUnit`](timeunit.html) and [`aggregate`](aggregate.html),
[field definitions](#field-def) for mark property channels may also include these properties:

{% include table.html props="scale,legend,condition" source="MarkPropFieldDefWithCondition" %}

{:#mark-prop-value-def}
### Mark Property Value Definition

In addition to the constant `value`, [value definitions](#value-def) of mark properties channels can include the `condition` property to specify conditional logic.

{% include table.html props="condition" source="MarkPropValueDefWithCondition" %}


See [the `condition`](condition.html) page for examples how to specify condition logic.

{:#text}
## Text and Tooltip Channels

Text and tooltip channels directly encode text values of the data fields.
By default, Vega-Lite automatically determines appropriate format for quantitative and temporal values.  Users can set `format` property to customize text and time format.
Similar to mark property channels, definitions of text and tooltip channels can include the `condition` property to specify conditional logic.

{% include table.html props="text,tooltip" source="Encoding" %}

{:#text-field-def}
### Text and Tooltip Field Definition

In addition to [`field`](field.html), [`type`](type.html), [`bin`](bin.html), [`timeUnit`](timeunit.html) and [`aggregate`](aggregate.html),
[field definitions](#field-def) for `text` and `tooltip` channels may also include these properties:

{% include table.html props="format,condition" source="TextFieldDefWithCondition" %}

{:#text-value-def}
### Text and Tooltip Value Definition

In addition to the constant `value`, [value definitions](#value-def) of `text` and `tooltip` channels can include the `condition` property to specify conditional logic.

{% include table.html props="condition" source="TextValueDefWithCondition" %}

### Multiple Field Definitions for Tooltips

Similar to [`detail`](#detail), you can use an array of field definitions. Vega-Lite will display a tooltip with multiple fields. [Vega tooltip](https://github.com/vega/vega-tooltip/) will display a table that shows the name of the field and its value. See the [tooltip](tooltip.html) page for details.

{:#href}
## Hyperlink Channel

By setting the `href` channel, a mark becomes a hyperlink. The specified URL is loaded upon a mouse click. When the `href` channel is specified, the [`cursor` mark property](mark.html#hyperlink) is set to `pointer` to serve as affordance for hyperlinks.

{% include table.html props="href" source="Encoding" %}

{:#href-field-def}
### Hyperlink Field Definition

In addition to [`field`](field.html), [`type`](type.html), [`bin`](bin.html), [`timeUnit`](timeunit.html) and [`aggregate`](aggregate.html),
[field definitions](#field-def) for the `href` channel can include the `condition` property to specify conditional logic.

{% include table.html props="condition" source="FieldDefWithCondition" %}

The example below show how the href channel can be used to provide links to external resources with more details.

<span class="vl-example" data-name="point_href"></span>

{:#href-value-def}
### Hyperlink Value Definition

In addition to the constant `value`, [value definitions](#value-def) of the `href` channel can include the `condition` property to specify conditional logic.

{% include table.html props="condition" source="ValueDefWithCondition" %}


{:#detail}
## Level of Detail Channel

Grouping data is another important operation in data visualization.
For line and area marks, mapping a unaggregate data field (field without `aggregate` function) to any non-[position](#position) channel will group the lines and stacked areas by the field.
For [aggregated plots](aggregate.html), all unaggregated fields encoded are used as grouping fields in the aggregation (similar to fields in `GROUP BY` in SQL).

`detail` channel specify an additional grouping field (or fields) for grouping data without mapping the field(s) to any visual properties.

{% include table.html props="detail" source="Encoding" %}

#### Examples

Here is a scatterplot showing average horsepower and displacement for cars from different origins. We map `Origin` to `detail` channel to use the field as a group-by field without mapping it to visual properties of the marks.

<div class="vl-example" data-name="point_aggregate_detail"></div>


Here is a line chart showing stock prices of 5 tech companies over time.
We map `symbol` variable (stock market ticker symbol) to `detail` to use them to group lines.

<div class="vl-example" data-name="line_detail"></div>

Here is a ranged dot plot showing life expectancy change in the five largest countries
between 1955 and 2000. We use `detail` here to group the lines such that they range only
from one year to another within a country (as opposed to jumping between countries as well).

<div class="vl-example" data-name="layer_ranged_dot"></div>

<!-- TODO Need to decide if we want to keep the two examples above since they look bad with labels / tooltips -->

{:#key}
## Key Channel

The key channel can enable object constancy for transitions over dynamic data. When a visualization’s data is updated (via [Vega's View API](https://vega.github.io/vega/docs/api/view/#data)), the key value will be used to match data elements to existing mark instances.

{% include table.html props="key" source="Encoding" %}

{:#order}
## Order Channel

`order` channel can define a data field (or a ordered list of data fields) that are used to
 sorts stacking order for stacked charts (see [an example in the `stack` page](stack.html#order)) and the order of data points in line marks for connected scatterplots (see [an example in the `line` page](line.html#connected-scatter-plot)).

{% include table.html props="order" source="Encoding" %}

### Order Field Definition

In addition to [`field`](field.html), [`type`](type.html), [`bin`](bin.html), [`timeUnit`](timeunit.html) and [`aggregate`](aggregate.html),
[field definitions](#field-def) for the `order` channel can include `sort`.

{% include table.html props="sort" source="OrderFieldDef" %}

{:#facet}
## Facet Channels

`row` and `column` are special encoding channels that facets single plots into [trellis plots (or small multiples)](https://en.wikipedia.org/wiki/Small_multiple).

{% include table.html props="row,column" source="EncodingWithFacet" %}

For more information, read the [facet documentation](facet.html).

{:#def}
