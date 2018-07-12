---
layout: docs
menu: docs
title: Parameter Types
permalink: /docs/types.html
---

Reference documentation for common parameter **types** expected by Vega-Lite specification properties.

{:#reference}
## Parameter Type Reference

- [Any](#any)
- [Array](#array)
- [Boolean](#boolean)
- [Color](#color)
- [DateTime](#datetime)
- [Expression](#expression)
- [Number](#number)
- [Object](#object)
- [String](#string)
- [URL](#url)
{: .column-list }

## Literal Values

<a name="*"></a><a name="any" href="#any">#</a>
**Any** or **\***

Accepts any literal value, including a string, number, boolean, or `null`.

<br/><a name="array" href="#array">#</a>
**Array** or **Type[]**

Accepts array values. For example: `[]`, `[1, 2, 3]`, `["foo", "bar"]`. If individual array items must adhere to a specific type, bracket notation &ndash; such as `Number[]` or `String[]` &ndash; is used to indicate the item type.

In most cases, arrays may also have [signal references](#Signal) as items. For example: `[{"signal": "width"}, {"signal": "height"}]`.

<br/><a name="boolean" href="#boolean">#</a>
**Boolean**

Accepts boolean values. For example: `true`, `false`.

<br/><a name="color" href="#color">#</a>
**Color**

Accepts a valid CSS color string. For example: `#f304d3`, `#ccc`, `rgb(253, 12, 134)`, `steelblue`.

<br/><a name="datetime" href="#datetime">#</a>
**DateTime**

A DateTime object (in [filter transform](filter.html), [scale domain](scale.html#domain), and [axis](axis.html#ticks)/[legend](legend.html#properties) values) must have at least one of the following properties:

{% include table.html props="year,quarter,month,date,day,hours,minutes,seconds,milliseconds" source="DateTime" %}

For example `{"year": 2006, "month": "jan", "date": 1}` represents _Jan 1, 2006_.

<br/><a name="expression" href="#expression">#</a>
**Expression**

To enable custom calculations, Vega-Lite uses Vega's expression language for writing basic formulas. Each datum object can be referred using bound variable `datum`.

Please read the [Vega documentation for expressions](https://vega.github.io/vega/docs/expressions/) for details.

<br/><a name="number" href="#number">#</a>
**Number**

Accepts number values. For example: `1`, `3.14`, `1e5`.

<br/><a name="object" href="#object">#</a>
**Object**

Accepts object literals. For example: `{"left":5, "right":30, "top":5, "bottom":50}`. The valid object property names and types will vary across parameters; read the individual parameter descriptions for more information.

<br/><a name="string" href="#string">#</a>
**String**

Accepts string values. For example: `"bold"`, `"step-before"`, `""`.

<br/><a name="url" href="#url">#</a>
**URL**

Accepts a valid URL string linking to external site or resource. For example: `"data/stocks.csv"`, `"images/logo.png"`, `"https://vega.github.io/"`.
