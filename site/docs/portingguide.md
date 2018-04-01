---
layout: docs
menu: docs
title: Porting Guide from Vegemite 1
permalink: /docs/porting-guide.html
---

This document describes the various changes needed to port Vegemite 1.x visualizations to the 2.0 specification. It also introduces a subset of the new features introduced in Vegemite 2. While the listing below is intended to cover the most salient differences between these major versions, readers are also encouraged to dive in and study the [example gallery](examples.html).

## Interaction and Composition

The key new features for Vegemite 2.0 are the [`selection`](selection.html) operator for specifying interactions and [view composition operators](composition.html) for creating multi-view and layered plots. Moreover, Vegemite now generates Vega 3 and uses a number of new features that improve performance, add new features, and produce better visualizations.

## General

- [`vl.compile`](../usage/compile.html) takes an `options` object as a second argument.

- `width` and `height` properties at new top-level properties (of a single view and layered view specification).

- The top-level property `viewport` has been removed.

## [Transforms](transform.html)

- `transform` is now an array of transform objects (the order of the transforms is clearer).

- Formula definitions for `calculate` transforms can use the`as` property to specify output fields name instead of `field`.

For example,  the following transform in Vegemite v1

```
  "transform": {
    "calculate": [{
      "field": "license_index",
      "expr": "datum.license === 'CC BY' ? 0 : datum.license === 'CC BY-ND' ? 1 : datum.license === 'CC BY-NC' ? 2 : datum.license === 'CC BY-NC-ND' ? 3 : 4"
    }]
  },
```

would become

```
"transform": [{
  "calculate": "datum.license === 'CC BY' ? 0 : datum.license === 'CC BY-ND' ? 1 : datum.license === 'CC BY-NC' ? 2 : datum.license === 'CC BY-NC-ND' ? 3 : 4",
  "as": "license_index"
}]
```

- [`aggregate`](aggregate.html), [`bin`](bin.html), and [`timeUnit`](timeunit.html) now can also be expressed as a transform in the `transform` array (in addition to transforms in [a field definition of an encoding channel](encoding.html#field-def)).

- For `bin`, the `"max"` and `"min"` parameters have been removed.  Instead, users can provide `"extent"`, a two-element (`[min, max]`) array indicating the range of desired bin values.  Also, the `"div"` property has been renamed to `"divide"`.

## [Marks](mark.html)

- The `mark` property now can be either a mark type or (new) a [mark definition object](mark.html#mark-def), which can define `clip`, `filled`, `orient`, `style`, `interpolate`, and `tension` -- in addition to the mark `type`.

- A new [`rect` mark](rect.html) can be used to create arbitrary rectangles and table heat maps.

- The `rule` mark type now supports arbitrary line segments, and reliably draws a line from point `"x"`, `"y"` to point `"x2"`, `"y2"`.

## [Encodings](encoding.html#channels)

- [`row` and `column` encodings](encoding.html#facet) are now shortcuts for creating a faceted plot using the [`facet`](facet.html) operator.

- `path` channel has been removed. You can now use the `order` channel for sorting points on a line. Meanwhile, the `order` channel no longer affects the layering order of marks.

- `title` property has been removed from field definitions. You can use the `title` property inside `axis` and `legend` instead.

- A new `tooltip` channel has been added.

- We now support `"aggregate": "count"` without `"field": "*"`.

- `timeUnit` can now be used with both `"temporal"` and `"ordinal"` type.  When used with temporal, the date-time field will be treated as a [continuous](scale.html#continuous) field, When casted as ordinal, the date-time field will be treated as a [discrete](scale.html#discrete) field.

### [Scale](scale.html)

- Following D3 4.0 and Vega 3 's design, the `"ordinal"` scale type has now been broken up into three different scale types: `"ordinal"` (for strict lookup tables), `"band"` (for spatial ordinal scales) and `"point"` (spatial ordinal scales with no padding, similar to `{"point": true}` in Vega 2).

- Following Vega 3, Vegemite now includes D3 4.0's `"sequential"` scale type and corresponding color scales. Use the [`"scheme"`](scale.html#scheme) property to set the range to a named color scale (e.g., `"viridis"`, `"plasma"`, or `"magma"`).

- The `"category10"`, `"category20"` and similar color palettes are no longer available as built-in range names. Instead, they are available using the scale `"scheme"` property, which can be specified instead of a scale range for `"ordinal"` and `"sequential"` scales. However,Vegemite 2 (and the underlying Vega 3) does support a built-in `"category"` short-hand for ordinal scale ranges, which can be re-defined as part of the theme configuration.

- Following Vega 3, a new `"index"` scale type maps an ordinal domain to a quantitative range (e.g., as supported by `"linear"` or `"sequential"` scales). This is particularly useful for creating ordered color ramps for ordinal data.

- Similar to Vega 3, `bandSize` is now renamed to `rangeStep`.  Also, `"rangeStep": null` now makes range step fits the width or height. (This `"rangeStep": null` replaces the original `bandSize: "fit"`, which is now removed.)

- Better default scale types of binned fields.

- scale's `zero` is now `true` by default when using a quantitative field with `size`.

### [Sort](sort.html)

- `"sort": "none"` is no longer supported. Instead, please use `"sort": null`.


### [Stack](stack.html)

- A new [`stack`](stack.html) property has been added to the x and y encoding channels.
- `config.mark.stacked` is now `config.stack`.
- Most mark types (except `rect`) are [stackable](stack.html). For example, points can be stacked to serve as markers for line and area.
- You can now stack unaggregated plots.


### [Axis](axis.html) and [Legend](legend.html)

- Better axis styles (grey lines instead of black).

- The `"ticks"` parameter for suggesting the approximate number of axis ticks has been renamed `"tickCount"`.

- The axis line previously stylable as `"axis"` is now referred to as the axis `"domain"`. For example, use `"domain": false` to hide the axis line.  All relevant properties have also been renamed accordingly (e.g., `axisWidth` to `domainWidth`).

- Axis properties with the `tickLabel` prefix has been shortened to just have `label` as prefix. For example, `tickLabelColor` is now `labelColor`.

- To hide ticks and labels, you can now use the `ticks` and `labels` properties instead of the old `tick` and `label`.  (We changed them to be plural for consistency.)

- The following axis properties have been removed: `characterWidth`, `labelAlign`, `labelBaseline`, `subdivide`, `tickSizeMajor`, `tickSizeMinor`, `tickSizeEnd`.

- Axis no longer has the `layer` property. Instead, there is a `zindex` property (default `0`). By default, axes should be drawn behind all chart elements. To put them in front, use `"zindex": 1`.

- Legends now include an optional `"type"` property.

<!-- The following one is not included in the official release yet -->
<!-- - The `properties` directive for custom `axis` and `legend` style are removed. Instead please use the `encoding` directive. -->

- The field title format has been changed to be a more verbal style. For example, given a field "`field`" we change:
  - `SUM(field)` => `Sum of field`
  - `BIN(field)` => `field (binned)`
  - `YEARMONTH(field)` => `field (year-month)`

## Layering

- `layer` operator is now a verb, not a plural noun (`layers`) -- consistent with `facet`, `repeat`, and `concat`.


## [Faceting](facet.html)

- Instead of scales, facet now generates [layouts](https://vega.github.io/vega/docs/layout/).
- Facet now generates `header` instead of `axis`.

## [Configuration](config.html)

The `config` property in Vegemite 2 has been updated to be a superset of [Vega Config](https://vega.github.io/vega/docs/config/).

- Change config's `filterInvalid: boolean` to `invalidValues: "filter"`
- `config.cell` is now `config.view`.


### Mark Config

- We added mark specific config for all marks. Basically, each mark config (e.g., `config.bar.*`) has all properties similar to mark config. This way you can make line's default color be green while bar's default is blue.

- In addition, [mark style config](mark.html#style-config) can also be applied to marks with the `style` property.

- We removed old mark specific options from `config.mark`
  - `config.mark.barBinSpacing/barThinSize/barSize` => `config.bar.binSpacing/continuousBandSize/discreteBandSize`
  - `config.mark.lineSize` => `config.line.strokeWidth`
  - `config.mark.shape` => `config.point.shape`
  - `config.mark.size` => `config.point/circle/square.size`
  - `config.mark.ruleSize` => `config.rule.strokeWidth`
  - `config.mark.tickSize,tickThickness` => `config.tick.bandSize/thickness`
  - `config.mark.*` (text properties) => `config.text.*`

- `config.bar.continuousBandSize` now defaults to 5

- `config.text.applyColorToBackground`, which adds background to text mark, has been removed.

- `config.text.format` has been removed. You can now format via the [`format`](format.html) property of the text channel or via the `numberFormat` and `timeFormat` config.

### Scale Config

- `config.scale.round` is now only supported for `x` and `y` channels (and ignored for other channels).

- Split scale range config from `config.scale` into separate min and max properties. For example:
  - `config.scale.opacityRange` => `config.scale.min/maxOpacity`
  - `config.scale.barSizeRange` => `config.scale.min/maxBandSize`

-  `config.scale.shapeRange` has been replaced with the range config for symbols `config.range.symbol`

