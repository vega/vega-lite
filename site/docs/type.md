---
layout: docs
title: Type
permalink: /docs/type.html
---
<!-- TODO: Intro for type -->


### Data Type

If a field is specified, the channel definition **must** describe the encoded data's [type of measurement (level of measurement)](https://en.wikipedia.org/wiki/Level_of_measurement).
The supported data types are:

Quantitative
: Quantitative data expresses some kind of quantity. Typically this is numerical data. For example `7.3`, `42.0`, `12.1`.

Temporal
: Temporal data supports date-times and times. For example `2015-03-07 12:32:17`, `17:01`, `2015-03-16`.

Ordinal
: Ordinal data represents ranked order (1st, 2nd, ...) by which the data can be sorted. However, as opposed to quantitative data, there is no notion of *relative degree of difference* between them. For illustration, a "size" variable might have the following values `small`, `medium`, `large`, `extra-large`. We know that medium is larger than small and same for extra-large larger than large. However, we cannot claim that compare the magnitude of difference, for example, between (1) small and medium and (2) medium and large.

Nominal
: Nominal data, also known as categorical data, differentiates between values based only on their names or categories. For example, gender, nationality, music genre, names are all nominal data. Numbers maybe used to represent the variables but the number do not determine magnitude or ordering. For example, if a nominal variable contains three values 1, 2, and 3. We cannot claim that 1 is less than 2 nor 3.

{% include table.html props="type" source="FieldDef" %}

**Note**:
Data `type` here describes semantic of the data rather than primitive data types in programming language sense (`number`, `string`, etc.). The same primitive data type can have different types of measurement. For example, numeric data can represent quantitative, ordinal, or nominal data.
