---
layout: docs
title: Type
permalink: /docs/type.html
---

If a field is specified, the channel definition **must** describe the encoded data's [type of measurement (level of measurement)](https://en.wikipedia.org/wiki/Level_of_measurement).
The supported data types are: `"quantitative"`, `"temporal"`, `"ordinal"`, `"nominal"`, `"latitude"`, `"longitude"`, and `"geojson"`.

{% include table.html props="type" source="FieldDef" %}

**Note**:
Data `type` here describes semantic of the data rather than primitive data types in programming language sense (`number`, `string`, etc.). The same primitive data type can have different types of measurement. For example, numeric data can represent quantitative, ordinal, or nominal, latitude, or longitude data.

## Quantitative

Quantitative data expresses some kind of quantity. Typically this is numerical data. For example `7.3`, `42.0`, `12.1`.

## Temporal

Temporal data supports date-times and times. For example `2015-03-07 12:32:17`, `17:01`, `2015-03-16`.

Note that when a `"temporal"` type is used for a field, Vega-Lite will treat it as a continuous field and thus will use a [`time` scale](scale.html#time) to map its data to visual values. For example, the following bar chart shows the mean precipitation for different months.

<span class="vl-example" data-name="bar_month_temporal"></span>

### Casting a Temporal Field as an Ordinal Field

To treat a date-time field as a discrete field, you can cast it be an `"ordinal"` field.
This casting strategy can be useful for time units with low cardinality such as `"month"`.

<span class="vl-example" data-name="bar_month"></span>

## Ordinal

Ordinal data represents ranked order (1st, 2nd, ...) by which the data can be sorted. However, as opposed to quantitative data, there is no notion of *relative degree of difference* between them. For illustration, a "size" variable might have the following values `small`, `medium`, `large`, `extra-large`. We know that medium is larger than small and same for extra-large larger than large. However, we cannot compare the magnitude of relative difference, for example, between (1) `small` and `medium` and (2) `medium` and `large`. Similarly, we cannot say that `large` is two times as large as `small`.

## Nominal

Nominal data, also known as categorical data, differentiates between values based only on their names or categories. For example, gender, nationality, music genre, and name are nominal data. Numbers maybe used to represent the variables but the number do not determine magnitude or ordering. For example, if a nominal variable contains three values 1, 2, and 3. We cannot claim that 1 is less than 2 nor 3.

## Latitude

Latitude data represents geographic north-south position for use in map projections. This is always numerical data ranging between -90.0 (at the south pole) and 90.0 (at the north pole).

## Longitude

Longitude data represents geographic east-west position for use in map projections. This is always numerical data ranging between -180.0 (in the west) and 180.0 (in the east).

## GeoJSON

GeoJSON data represents geographic shapes specified as [GeoJSON](http://geojson.org/).
