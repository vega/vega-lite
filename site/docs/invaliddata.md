---
layout: docs
menu: docs
title: Modes for Handling Invalid Data
permalink: /docs/invalid-data.html
---

This page discusses modes in Vega-Lite for handling invalid data (`null` and `NaN` in continuous scales).

Note: Vega-Lite does _not_ consider `null` and `NaN` in categorical scales and text encodings as invalid data:

- Categorical scales can treat nulls and NaNs as separate categories
- Similarly, text encodings can directly display nulls and NaNs.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Mark Invalid Mode

{:#mark}

You can set the invalid data mode via `mark.invalid` (or `config.mark.invalid`) to configure how Vega-Lite handles invalid data (`null` and `NaN` in continuous scales).

{% include table.html props="invalid" source="MarkDef" %}

### Examples

To understand how these modes affect common marks, see these examples below, which visualize this dataset:

```json
[
  {"a": null, "b": 100},
  {"a": -10, "b": null},
  {"a": -5, "b": -25},
  {"a": -1, "b": -20},
  {"a": 0, "b": null},
  {"a": 1, "b": 30},
  {"a": 5, "b": 40},
  {"a": 10, "b": null}
]
```

by assigning `"a"` to x-axis (as quantitative and ordinal fields) and `"b"` to y-axis.

<div class="vl-example code-only" data-name="test_invalid_filter"></div>

#### `"filter"`

The `"filter"` invalid mode _excludes_ all invalid values from the visualization's _marks_ and _scales_.

For path marks (for line, area, trail), this option will create paths that connect valid points, as if the points with invalid values do not exist.

<div class="vl-example example-only" data-name="test_invalid_filter"></div>

#### `"break-paths"`

Break path marks (for line, area, trail) at invalid values. For non-path marks, this is equivalent to `"filter"`. All _scale_ domains will _exclude_ these filtered data points.

<div class="vl-example example-only" data-name="test_invalid_break_paths"></div>

#### `"break-paths-keep-domains"`

This option is like `"break-paths"`, except that all _scale_ domains will instead _include_ these filtered data points.

<div class="vl-example example-only" data-name="test_invalid_break_paths_keep_domains"></div>

#### `include`

Include all data points in the marks and scale domains. Each scale will use the output for invalid values defined in `config.scale.invalid`

- or, if unspecified, by default invalid values will produce the same visual values as zero (if the scale includes zero) or the minimum value (if the scale does not include zero).

<div class="vl-example example-only" data-name="test_invalid_include"></div>

#### `break-paths-and-keep-path-domains` (Default)

For historical reasons, Vega-Lite 5 currently uses `"break-paths-and-keep-path-domains"` as the default invalid data mode (to avoid breaking changes). This is equivalent to `"break-path-keep-domains"` for path-based marks (line/area/trail) and `"filter"` for other marks.

<div class="vl-example example-only" data-name="test_invalid_break_paths_and_keep_path_domains"></div>

## Scale Output for Invalid Values

{:#scale}

You can use `config.scale.invalid` to defines scale outputs per channel for invalid values.

{% include table.html props="invalid" source="ScaleConfig" %}

### Example: Output Color and Size

A visualization with `"filter"` invalid data mode will not filter (not exclude) color and size encoding if `config.scale.invalid.color` and `config.scale.invalid.size` are specified.

<div class="vl-example" data-name="test_config_scale_invalid"></div>

Compare this with a similar spec, but without `config.scale.invalid`.

<div class="vl-example" data-name="test_config_scale_invalid_baseline_filter_only"></div>