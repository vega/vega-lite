---
layout: docs
title: Data Transformation
permalink: /docs/transformation.html
---

This page lists all data transformation supported by Vega-Lite.  
When transformation are performed in the following order:

1. [Null Filter](#null-filter)
2. [Calculating new fields with provided formula](#calculate)
3. [Derive new time unit for temporal fields](#time-unit)
4. [Binning](#binning)
5. [Filter](#filter)
6. [Aggregation](#aggregation)
7. [Sort Order](#sort-order) for scale/axis and layer 

# Null Filter

# Derive New Fields

## Calculate

New fields can be calculated from from the existing data using `data.calculate` property, which contains an array of formula objects.  Each formula object has two properties:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | The field name in which to store the computed formula value. |
| expr          | String        | A string containing an expression for the formula. Use the variable `datum` to to refer to the current data object. |

<!-- provide example -->

## Time Unit

## Binning

# Filter

# Aggregation

# Sort Order

## Scale / Axis

## Layer
