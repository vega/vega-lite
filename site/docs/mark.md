---
layout: docs
menu: docs
title: Mark
permalink: /docs/mark.html
---

Marks are the basic visual building block of a visualization.
In a bar chart, the marks are bars. In a scatterplot, the marks might be circles or squares.

```js
{
  "data": ... ,       
  "mark": ... ,       // mark
  "encoding": ... ,
  ...
}
```


The `mark` property in a Vega-Lite specification defines the visualization's mark type.
Each mark type supports different [encoding channels](encoding.html#mark-channel),
which can be mapped either to a field (a variable in your data) or to a constant value.  

<!-- Replace the following list with a table listing mark types and their supported channels. -->

Vega-Lite supports the following `mark` types:
[`point`](#point-mark),
[`circle`](#circle-and-square-marks),
[`square`](#circle-and-square-marks),
[`tick`](#tick-mark),
[`bar`](#bar-mark),
[`line`](#line-mark),
[`area`](#area), and
[`text`](#text).

## Point Mark

`point` mark represents each data point with a symbol.  

Mapping a field to either only `x` (or only `y`) of `point` mark creates a dot plot.

<span class="render-vl" data-name="point_1d" data-dir="docs"></span>

Mapping fields to both the `x` and `y` dimensions creates a scatter plot.

<span class="render-vl" data-name="scatter"></span>

By mapping a third field to the `size` channel in the [scatter plot](#scatter), we can create a bubble plot instead.

<span class="render-vl" data-name="scatter_bubble"></span>


<span class="render-vl" data-name="scatter_color_shape"></span>

Fields can also be encoded in the [scatter plot](#scatter) using the `color` or `shape` channels.
For example, this specification encodes the field `Origin` with both `color` and `shape`.


<span class="render-vl" data-name="scatter_colored_with_shape"></span>


Note that `point` marks have a border but no fill by default.
See [this section for an example with filled `point` marks](config.html#config.mark.filled).

## Circle and Square Marks

`circle` and `square` marks are similar to `point` mark, except:
(1) the `shape` value is always set to `circle` or `square`,
(2) they are filled by default.

Here are some examples:

<span class="render-vl" data-name="circle" data-dir="docs"></span>

<span class="render-vl" data-name="square" data-dir="docs"></span>


## Tick Mark

The `tick` mark represents each data point as a short line.
This is a useful mark for displaying the distribution of values in a field.

The following strip-plot use `tick` mark to represent its data.

<span class="render-vl" data-name="tick"></span>

__TODO__ Colored Tick with adjusted size and thickness

## Bar Mark

The `bar` mark represents each data point as a rectangle, where the length is mapped to a quantitative scale.

Mapping a quantitative field to either `x` or `y` of the `bar` mark produces a single bar.
In the following example, note that the `x` channel encodes the sum of the populations.


<span class="render-vl" data-name="bar_1d" data-dir="docs"></span>


If we map a different ordinal field to the `y` channel, we can produce a horizontal bar chart.
Specifying `scale.bandWidth` of an ordinal field will adjust the [ordinal scale's band width](https://github.com/mbostock/d3/wiki/Ordinal-Scales#ordinal_rangeBands).
By default, there will be a 1 pixel offset between bars.  (See [an example that customizes size of the bars](encoding.html#ex-bar-size).)

<!-- TODO: Need to update docs our and Vega's scale.bandWidth property and link there instead -->

<span class="render-vl" data-name="bar_aggregate"></span>

Adding color to the bar chart (by using the `color` attribute) creates a stacked bar chart by default.  Here we also customize the color's scale range to make the color a little nicer.
(See [`config.stack` for more detail about customizing stack](config.html#stack-config).)


<span class="render-vl" data-name="stacked_bar_population" data-dir="docs"></span>


To disable stacking, you can alternatively set `config.stack` to `false`.
This produces a layered bar chart.
To make it clear that bars are layered, we can make marks semi-transparent by setting the `opacity` to 0.6.

<span class="render-vl" data-name="bar_layered_transparent"></span>

<!-- [Faceting](#encoding.md) a bar chart can produce a grouped bar chart. -->
<!--
- Heat Map
- How orientation is determined
- (Future -- once we have tooltip) -- playing bar's trick with `detail` channel
-->

## Line Mark

The `line` mark represents the data points stored in a field with a line connecting all of these points.
Using `line` with one dimension (typically on `x`) and one measure (typically on `y`) produces a simple line chart with a single line.

<span class="render-vl" data-name="line"></span>


We can add create multiple lines by grouping along different attributes, such as `color` or `detail`.

In the example below, we group points using a new field mapped to `color`. This produces a line chart with different colors for each line.

<span class="render-vl" data-name="line_color"></span>


Alternatively, we can map the same field to `detail`, creating multiple lines, but with the same color instead.

<span class="render-vl" data-name="line_detail"></span>


By default, the line's path (order of points in the line) is determined by data values on the dimension axis (x or y) like shown in previous examples.
However, a field can be mapped to `path` channel for determining custom path.
For example, the following specification creates a connected scatterplot.  

__TODO__: Example - Connected Scatterplot using "driving.json" data

## Area

Similar to `line`, using `area` mark with one dimension (typically on `x`)
and one measure (typically on `y`) produces an area chart.  


Adding color to area chart creates stacked area chart by default.


<!-- normalized area chart -->

To further customize stack, please look at [`config.stack`](config.html#stack-config) for more detail.


## Text

__TODO__
