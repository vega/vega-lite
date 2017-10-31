---
layout: docs
menu: docs
title: Parameter Types
permalink: /docs/types.html
---

Reference documentation for common parameter **types** expected by Vega specification properties.

{:#reference}
## Parameter Type Reference

- [Any](#Any)
- [Array](#Array)
- [Boolean](#Boolean)
- [Color](#Color)
- [Number](#Number)
- [Object](#Object)
- [String](#String)
- [URL](#URL)
- [DateTime](#DateTime)
- [Field](#Field)
- [Signal](#Signal)
- [Compare](#Compare)
- [Expr](#Expr)
- [Value](#Value)
- [ColorValue](#ColorValue)
- [FieldValue](#FieldValue)
{: .column-list }

## Literal Values

<a name="*"></a><a name="Any" href="#Any">#</a>
**Any** or **\***

Accepts any literal value, including a string, number, boolean, or `null`.

<br/><a name="Array" href="#Array">#</a>
**Array** or **Type[]**

Accepts array values. For example: `[]`, `[1, 2, 3]`, `["foo", "bar"]`. If individual array items must adhere to a specific type, bracket notation &ndash; such as Number[] or String[] &ndash; is used to indicate the item type.

In most cases, arrays may also have [signal references](#Signal) as items. For example: `[{"signal": "width"}, {"signal": "height"}]`.

<br/><a name="Boolean" href="#Boolean">#</a>
**Boolean**

Accepts boolean values. For example: `true`, `false`.

<br/><a name="Color" href="#Color">#</a>
**Color**

Accepts a valid CSS color string. For example: `#f304d3`, `#ccc`, `rgb(253, 12, 134)`, `steelblue`.

<br/><a name="Number" href="#Number">#</a>
**Number**

Accepts number values. For example: `1`, `3.14`, `1e5`.

<br/><a name="Object" href="#Object">#</a>
**Object**

Accepts object literals. For example: `{"left":5, "right":30, "top":5, "bottom":50}`. The valid object property names and types will vary across parameters; read the individual parameter descriptions for more information.


<br/><a name="String" href="#String">#</a>
**String**

Accepts string values. For example: `"bold"`, `"step-before"`, `""`.


<br/><a name="URL" href="#URL">#</a>
**URL**

Accepts a valid URL string linking to external site or resource. For example: `"data/stocks.csv"`, `"images/logo.png"`, `"https://vega.github.io/"`.


<br/><a name="datetime" href="#datetime">#</a>
**DateTime**

A DateTime object (in [filter transform](filter.html), [scale domain](scale.html#domain), and [axis](axis.html#ticks)/[legend](legend.html#properties) values) must have at least one of the following properties:

{% include table.html props="year,quarter,month,date,day,hours,minutes,seconds,milliseconds" source="DateTime" %}

For example `{"year": 2006, "month": "jan", "date": 1}` represents _Jan 1, 2006_.
