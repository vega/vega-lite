---
layout: docs
menu: docs
title: Porting Guide from Vega-lite 1
permalink: /docs/porting-guide.html
---

This document describes the various changes needed to port Vega-Lite 1.x visualizations to the 2.0 specification. It also introduces a subset of the new features introduced in Vega-Lite 2. While the listing below is intended to cover the most salient differences between these major versions, readers are also encouraged to dive in and study the [example gallery](examples.html).

## Interaction and Composition

The key new features for Vega-Lite 2.0 are the [`selection`](selection.html) operator for specifying interactions and [view composition operators](composition.html) for creating multi-view and layered plots.

## General

- Now [`vl.compile`](../usage/compile.html) takes an `options` object as a second argument that can contain logger, field title formatter, and config object.

- There are now `width` and `height` properties at the top-level (of a single view and layered view specification).

- The top-level property `viewport` is removed.

### Vega Output

- We include vega's `$schema` in the output Vega specifications.
- Constant values in `scales` are now replaced with `signals`.


## [Transforms](transform.html)

- `transform` is re-designed to be an array of different transform objects (so the order of the transforms becomes clear).

  - Formula definitions for `calculate` transforms now use `as` property to specify output fields name instead of `field`.
  - `aggregate`, `bin`, and `timeUnit` now can also be expressed as a transform in the `transform` array (in addition to as a field transform in a encoding field definition).


- For `bin`, the `"max"` and `"min"` parameters have been removed.  Instead, users can provide `"extent"`, a two-element (`[min, max]`) array indicating the range of desired bin values.  Also, the `"div"` property has been renamed to `"divide"`.



## [Marks](mark.html)

- The `mark` property now can be either a mark type or (new) a [mark definition object](mark.html#mark-def).

- A new [`rect` mark](rect.html) can create arbitrary rectangles and table heat map.

- The `rule` mark type now supports arbitrary line segments, and reliably draws a line from point `"x"`, `"y"` to point `"x2"`, `"y2"`.

## [Encodings](encoding.html#channels)

- [`row` and `column` encodings](encoding.html#facet) are now shortcuts for creating a faceted plot using the [`facet`](facet.html) operator.

- `path` channel is removed. You can now use `order` channel for sorting line orders instead. Meanwhile, the `order` channel no longer affects layer order for marks.

- A new `tooltip` channel is added.

- We now support `"aggregate": "count"` without `"field": "*"`.

### [Scale](scale.html)

- Following D3 4.0 and Vega 3 's design, the `"ordinal"` scale type has now been broken up into three different scale types: `"ordinal"` (for strict lookup tables), `"band"` (for spatial ordinal scales) and `"point"` (spatial ordinal scales with no padding, similar to `{"point": true}` in Vega 2).

- Following Vega 3, Vega-Lite now includes D3 4.0's `"sequential"` scale type and corresponding color scales. Use the [`"scheme"`](scale.html#scheme) property to set the range to a named color scale (e.g., `"viridis"`, `"plasma"`, or `"magma"`).

- The `"category10"`, `"category20"` and similar color palettes are no longer available as built-in range names. Instead, they are available using the scale `"scheme"` property, which can be specified instead of a scale range for `"ordinal"` and `"sequential"` scales. However,Vega-lite 2 (and the underlying Vega 3) does support a built-in `"category"` short-hand for ordinal scale ranges, which can be re-defined as part of the theme configuration.

- Following Vega 3, a new `"index"` scale type maps an ordinal domain to a quantitative range (e.g., as supported by `"linear"` or `"sequential"` scales). This is particularly useful for creating ordered color ramps for ordinal data.

- Similar to Vega 3, `bandSize` is now renamed to `rangeStep`.  Also, `"rangeStep": null` now makes range step fits the width or height. The original value `"fit"` for `rangeStep` (formerly `bandSize`) is removed.

- Better default scale types of binned fields.

- scale's `zero` is now `true` by default when using a quantitative field with `size`.

### [Sort](sort.html)

- `"sort": "none"` is no longer supported. Instead, please use `"sort": null`.


### [Stack](stack.html)

- A new [`stack`](stack.html) property is added to x and y encoding channel.
- `config.mark.stacked` is renamed to `config.stack`.
- Most mark types (except `rect`) are [stackable](stack.html). (For example, points can be stacked to serve as markers for line and area.)
- You can now stack unaggregate plots.


### [Axis](axis.html) and [Legend](legend.html)

- Better axis styles (grey lines instead of black).

- The `"ticks"` parameter for suggesting the approximate number of axis ticks has been renamed `"tickCount"`.

- The axis line previously stylable as `"axis"` is now referred to as the axis `"domain"`. For example, use `"domain": false` to hide the axis line.  All relevant properties have also been renamed accordingly (e.g., `axisWidth` to `domainWidth`).

- Axis properties with the `tickLabel` prefix is shortened to just have `label` as prefix. For example, `tickLabelColor` is renamed to `labelColor`.

- To hide ticks and labels, you can now use `ticks` and `labels` properties instead of the old `tick` and `label`.  (We change them to be plural for consistency.)

- The following axis properties are removed: `characterWidth`, `labelAlign`, `labelBaseline`, `subdivide`, `tickSizeMajor`, `tickSizeMinor`, `tickSizeEnd`.

- Axis now no longer has `layer` property. Instead, there is a `zindex` property (default `0`). By default, axes should be drawn behind all chart elements. To put them in front, use `"zindex": 1`.

- Legends now include an optional `"type"` property.

<!-- The following one is not included in the official release yet -->
<!-- - The `properties` directive for custom `axis` and `legend` style are removed. Instead please use the `encoding` directive. -->


## Layering

- `layer` operator is now a verb, not a plural noun (`layers`) -- consistent with `facet`, `repeat`, and `concat`.


## [Faceting](facet.html)

- Facet now generates `header` instead of `axis`.

## [Configuration](config.html)

The `config` property in Vega-Lite 2 has been updated to be a superset of [Vega Config](https://vega.github.io/vega/docs/config/).

- Change config's `filterInvalid: boolean` to `invalidValues: "filter"`
- `config.cell` is renamed to `config.view`.


### Mark Config

- Add mark specific config for all marks. Basically, each mark config (e.g., `config.bar.*`) has all properties similar to mark config. This way you can make line's default color be green while bar's default is blue if desired.

- In addition, [mark style config](mark.html#style-config) can also be applied to marks with `style` property defined.

- Remove old mark specific config from `config.mark`
  - `config.mark.barBinSpacing/barThinSize/barSize` => `config.bar.binSpacing/continuousBandSize/discreteBandSize`
  - `config.mark.lineSize` => `config.line.strokeWidth`
  - `config.mark.shape` => `config.point.shape`
  - `config.mark.size` => `config.point/circle/square.size`
  - `config.mark.ruleSize` => `config.rule.strokeWidth`
  - `config.mark.tickSize,tickThickness` => `config.tick.bandSize/thickness`
  - `config.mark.*` (text properties) => `config.text.*`

- Change the default `config.bar.continuousBandSize` to 5

- `config.text.applyColorToBackground`, which adds background to text mark, is removed.

- `config.text.format` is removed. You can now format via the [`format`](format.html) property of the text channel or via the `numberFormat` and `timeFormat` config.

### Scale Config

- `config.scale.round` is now only supported for `x` and `y` channels (and ignored for other channels).

- Split scale range config from `config.scale` into separate min and max properties. For example:
  - `config.scale.opacityRange` => `config.scale.min/maxOpacity`
  - `config.scale.barSizeRange` => `config.scale.min/maxBandSize`

-  `config.scale.shapeRange` is replace by range config for symbols `config.range.symbol`

