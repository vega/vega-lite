---
layout: docs
menu: docs
title: Parameter Types
permalink: /docs/types.html
---

Reference documentation for common property **types** expected by Vega-Lite specification properties.

{:#reference}

<!--prettier-ignore-start-->

## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

## Primitive Types

### Any

Accepts any literal value, including a string, number, boolean, or `null`.

### Array

Accepts array values. For example: `[]`, `[1, 2, 3]`, `["foo", "bar"]`. If individual array items must adhere to a specific type, bracket notation &ndash; such as `Number[]` or `String[]` &ndash; is used to indicate the item type.

In most cases, arrays may also have [signal references](#Signal) as items. For example: `[{"signal": "width"}, {"signal": "height"}]`.

### Boolean

Accepts boolean values. For example: `true`, `false`.

### Color

Accepts a [valid CSS color string](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). For example: `#f304d3`, `#ccc`, `rgb(253, 12, 134)`, `steelblue`.

{:#exprref}

### Expression Reference (ExprRef)

An object with an `expr` property defining a Vega [Expression](#expression).

For example, we can set mark `color` to be `{expr: "lab(50,10,30)"}`.

{:#expression}

### Expression

To enable custom calculations, Vega-Lite uses Vega's expression language for writing basic formulas. Each datum object can be referred using bound variable `datum`.

Please read the [Vega documentation for expressions](https://vega.github.io/vega/docs/expressions/) for details.

### Number

Accepts number values. For example: `1`, `3.14`, `1e5`.

### Object

Accepts general object literals. For example: `{"left":5, "right":30, "top":5, "bottom":50}`. The valid object property names and types will vary across properties; read the individual property descriptions for more information.

### String

Accepts general string values. For example: `"bold"`, `"step-before"`, `""`. The valid object property names and types may vary across properties; read the individual property descriptions for more information.

### Text

Accepts string values or arrays of strings (for multi-line text).

### URL

Accepts a valid URL string linking to external site or resource. For example: `"data/stocks.csv"`, `"images/logo.png"`, `"https://vega.github.io/"`.

## Special Object Types

Please see the following pages for other special object types:

- [Date Time](datetime.html)
- [Gradient](gradient.html)
- [Predicate](predicate.html)
