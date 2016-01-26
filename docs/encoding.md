---
layout: docs
title: Encoding
permalink: /docs/encoding.html
---

Vega-Lite's top-level `encoding` property describes a mapping between
encoding channels (such as `x`,`y`, and `color`) and [field definitions](#field-definition).
Each field definition object describes
a constant `value` or a reference to the `field` name and its data `type` and inline transformation (`aggregate`, `bin`, `sort` and `timeUnit`).
Each field definition object can also optionally include configuration properties for `scale`, `axis`, and `legend`.

## Encoding Channels

Vega-Lite supports the following encoding channels: `x`,`y`, `row`, `column`, `color`, `size`, `shape`, `text`, `detail`.
These channels are properties for the top-level `encoding` definition object.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| x, y          | [FieldDef](#field-definition)| Description of a field mapped to x or y coordinates (or to width or height for `bar` and `area` marks). |
| row, column   | [FieldDef](#field-definition)| Description of a field that facets data into vertical and horizontal [trellis plots](https://en.wikipedia.org/wiki/Small_multiple) respectively. |
| color | [FieldDef](#field-definition)| Description of a field mapped to color or a constant value for color.  The values are mapped to hue if the field is nominal, and mapped to saturation otherwise.  |
| shape  | [FieldDef](#field-definition)| Description of a field mapped to shape encoding or a constant value for shape.   `shape` channel is only applicable for `point` marks.  |
| size  | [FieldDef](#field-definition)| Description of a field mapped to size encoding or a constant value for size.  `size` channel is currently not applicable for `line` and `area`. If `size` is not mapped to a field, the default value is 10 for `text` mark, `bandWidth-1` for `bar` with ordinal dimension scale and 2 for `bar` with linear dimension scale, `2/3*bandWidth` for `tick`, and 30 for other marks. |
| detail | [FieldDef](#field-definition)| Description of a field that serves as an additional dimension for aggregate views without mapping to a specific visual channel.  `detail` channel is  not applicable raw plots (plots without aggregation). |

### X and Y

### Color

### Faceting

### Size


### Detail

<!--
- grouping for line and area
- additional measure / groupby for aggregation
-->

<!-- TODO: tooltips, labels -->

## Field Definition

Here is a list of properties for the field definition object:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | Name of the field from which to pull a data value.    |
| value         | String &#124; Integer | A constant value. |
| type          | String        | Data type of the field.  This property accepts both a full type name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`), or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).  This property is case insensitive.|
| [aggregate](transform.html#aggregate) | String        | Aggregation function for the field (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).  |
| [bin](transform.html#bin) | Boolean &#124; Object        | Boolean flag / configuration object for binning.   |
| [sort](transform.html#sort) | String &#124; Object        | Sort order for a particular field.  This can be string (`"ascending"`, `"descending"`, or `"unsorted"`) or a sort field definition object for sorting by an aggregate calculation of a specified sort field.  If unspecified, the default value is `ascending`.  See [Sort](#sort) section for more information. |
| [timeUnit](transform.html#timeunit)| String        | Property for converting time unit.            |
| [axis](#axis)        | Object        | Configuration object for the encoding's axis.    |
| [legend](#legend)    | Boolean &#124; Object  | Boolean flag for showing legend (`true` by default), or a configuration object for the encoding's legends. |
| [scale](#scale)      | Object        | Configuration object for the encoding's scale.   |

<!-- ## Data Type -->
<!-- TODO: add description about each data type, describe how nominal and ordinal are treated differently -->







<!--TODO: elaborate example for the properties group -->


