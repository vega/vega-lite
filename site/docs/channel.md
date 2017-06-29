---
layout: docs
menu: docs
title: Channel
permalink: /docs/channel.html
---

{:#channels}
## Encoding Channels

The keys in the encoding object are encoding channels. This section lists supported encoding channels in Vega-Lite.

{:#props-channels}
### Position Channels

Position channels determine the position of the marks.

{% include table.html props="x,x2,y,y2" source="Encoding" %}

### Mark Properties Channels

Mark properties channels map data fields directly to visual properties of the marks. Unlike other channel types, they can be mapped to [constant values](#value) as well. Here are the supported mark properties:

{% include table.html props="color,opacity,shape,size,text,tooltip" source="Encoding" %}

### Additional Level of Detail Channel

Grouping data is another important operation in visualizing data. For [aggregated plots](aggregate.html), all encoded fields without `aggregate` functions are used as grouping fields in the aggregation (similar to fields in `GROUP BY` in SQL). For line and area marks, mapping a data field to color or shape channel will group the lines and stacked areas by the field.

`detail` channel allows providing an additional grouping field (level) for grouping data in aggregation without mapping data to a specific visual channel.

{% include table.html props="detail" source="Encoding" %}

**Note**: Since `detail` represents an actual data field in the aggregation, it cannot encode a constant `value`.

#### Examples

Here is a scatterplot showing average horsepower and displacement for cars from different origins. We map `Origin` to `detail` channel to use the field as a group-by field without mapping it to visual properties of the marks.

<div class="vl-example" data-name="scatter_aggregate_detail"></div>


Here is a line chart showing stock prices of 5 tech companies over time.
We map `symbol` variable (stock market ticker symbol) to `detail` to use them to group lines.

<div class="vl-example" data-name="line_detail"></div>

<!-- TODO Need to decide if we want to keep the two examples above since they look bad with labels / tooltips -->


### Mark Order Channels

`order` channel sorts the layer order or stacking order (for stacked charts) of the marks while `path` channel sorts the order of data points in line marks.

{% include table.html props="order" source="Encoding" %}

**Note**: Since `order` and `path` represent actual data fields that are used to sort the data, they cannot encode the constant `value`. In addition, in aggregate plots, they should have `aggregate` function specified.

{:#ex-order}
#### Example: Sorting Stack Order

Given a stacked bar chart:

<div class="vl-example" data-name="stacked_bar_h"></div>

By default, the stacked bar are sorted by the stack grouping fields (`color` in this example).

Mapping the sum of yield to `order` channel will sort the layer of stacked bar by the sum of yield instead.

<div class="vl-example" data-name="stacked_bar_h_order"></div>

Here we can see that site with higher yields for each type of barley are put on the top of the stack (rightmost).

{:#ex-path}
#### Example: Sorting Line Order

By default, line marks order their points in their paths by the field of channel x or y. However, to show a pattern of data change over time between gasoline price and average miles driven per capita we use `order` channel to sort the points in the line by time field (`year`).

<div class="vl-example" data-name="scatter_connected"></div>

{:#facet}
### Facet Channels

`row` and `column` are special encoding channels that facets single plots into [trellis plots (or small multiples)](https://en.wikipedia.org/wiki/Small_multiple).

{% include table.html props="row,column" source="EncodingWithFacet" %}

For more information, please see [facet page](facet.html).

**Note**: Since `row` and `column` represent actual data fields that are used to partition the data, they cannot encode the constant `value`. In addition, in aggregate plots, they should not have `aggregate` function specified.
