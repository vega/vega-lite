---
layout: docs
title: Data Transformation
permalink: /docs/transformation.html
---

This page lists all data transformation supported by Vega-Lite.  
Transformations are performed in the following order:

1. [Null Filter](#null-filter)
2. [Deriving New Fields](#derive-new-fields)
2.1 [Calculating new fields with provided formula](#calculate)
2.2 [Derive new time unit for temporal fields](#time-unit)
2.3 [Binning](#binning)
3. [Filter](#filter)
4. [Aggregation](#aggregation)
5. [Sort Order](#sort-order) for scale/axis and layer

# Null Filter

__Coming Soon!__

# Derive New Fields

## Calculate

New fields can be calculated from from the existing data using `data.calculate` property, which contains an array of formula objects.  Each formula object has two properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | The field name in which to store the computed formula value. |
| expr          | String        | A string containing an expression for the formula. Use the variable `datum` to to refer to the current data object. |

<!-- provide example -->

## Time Unit

New time unit fields can be derived from existing temporal fields using each field definition's `timeUnit` property.

## Binning

To group quantitative, continuous data values of a particular field into smaller number of "bins" (e.g., for a histogram), the field definition 's `bin` property can be specified.  

# Filter

Besides filtering null data, Vega-lite supports using the [Vega Expression](https://github.com/vega/vega/wiki/Expressions) to filter data items (or rows).  Each datum object can be referred using bound variable `datum`.

# Aggregation

Vega-Lite supports all [Vega aggregation operations](https://github.com/vega/vega/wiki/Data-Transforms#-aggregate) (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).

If at least one fields in the specified encoding channel contains `aggregate`,
a summary data table is computed from the source data table.
The resulting visualization shows data from this summary table.  
In this case, all fields without aggregation function specified are treated as dimensions; thus, the summary statistics are grouped by these dimensions.
Additional dimensions that are not directly mapped to visual encodings can be specified using the `detail` channel.  

If none of the specified encoding channel contains aggregation, no additional data table is created.

# Sort Order

## Scale / Axis

## Layer
