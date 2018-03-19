---
layout: docs
menu: docs
title: Window
permalink: /docs/window.html
---

The window transform performs calculations over sorted groups of data objects. These calculations including ranking, lead/lag analysis, and aggregates such as running sums and averages. Calculated values are written back to the input data stream.

## Window Field Definition

{: .suppress-error}
```json
// A View Specification
{
  ...
  "transform": [
    {
      // Window Transform
      "window": [{
          "op": "...",
          "field": "...",
          "as": "..."
      }],
      "groupby": [
          "..."
      ],
      "frame": "..."
    }
     ...
  ],
  ...
}
```

## Window Transform Definition

{% include table.html props="window,frame,ignorePeers,groupBy,sort" source="WindowTransform" %}

### Window Sort Field Definition

{% include table.html props="field,order" source="WindowSortField" %}

### Window Transform Field Definition

{% include table.html props="op,param,field,as" source="WindowFieldDef" %}

## <a name="ops"></a> Window Only Operation Reference

The valid operations include all [valid aggregate operations](../aggregate/#ops) plus the following window operations.

| Operation    | Parameter | Description  |
| :----------- | :-------: | :------------|
| row_number   | _None_    | Assigns each data object a consecutive row number, starting from 1.|
| rank         | _None_    | Assigns a rank order value to each data object in a window, starting from 1. Peer values are assigned the same rank. Subsequent rank scores incorporate the number of prior values. For example, if the first two values tie for rank 1, the third value is assigned rank 3.|
| dense_rank   | _None_    | Assigns dense rank order values to each data object in a window, starting from 1. Peer values are assigned the same rank. Subsequent rank scores do not incorporate the number of prior values. For example, if the first two values tie for rank 1, the third value is assigned rank 2.|
| percent_rank | _None_    | Assigns a percentage rank order value to each data object in a window. The percent is calculated as _(rank - 1) / (group_size - 1)_. |
| cume_dist    | _None_    | Assigns a cumulative distribution value between 0 and 1 to each data object in a window.|
| ntile        | {% include type t="Number" %} | Assigns a quantile (e.g., percentile) value to each data object in a window. Accepts an integer parameter indicating the number of buckets to use (e.g., 100 for percentiles, 5 for quintiles).|
| lag          | {% include type t="Number" %} | Assigns a value from the data object that precedes the current object by a specified number of positions. If no such object exists, assigns `null`. Accepts an offset parameter (default `1`) that indicates the number of positions. This operation must have a corresponding entry in the _fields_ parameter array.|
| lead         | {% include type t="Number" %} | Assigns a value from the data object that follows the current object by a specified number of positions. If no such object exists, assigns `null`. Accepts an offset parameter (default `1`) that indicates the number of positions. This operation must have a corresponding entry in the _fields_ parameter array.|
| first_value  | _None_    | Assigns a value from the first data object in the current sliding window frame. This operation must have a corresponding entry in the _fields_ parameter array.|
| last_value   | _None_    | Assigns a value from the last data object in the current sliding window frame. This operation must have a corresponding entry in the _fields_ parameter array.|
| nth_value    | {% include type t="Number" %} | Assigns a value from the nth data object in the current sliding window frame. If no such object exists, assigns `null`. Requires a non-negative integer parameter that indicates the offset from the start of the window frame. This operation must have a corresponding entry in the _fields_ parameter array.|

## Examples

To replace any of the examples from total to `mean`, the operation just needs to be changed from `sum` to `mean`.

### Percent of Total

<div class="vl-example" data-name="window_transform_activities"></div>

```json
{
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
    "description": "A bar graph showing what activites consume what percentage of the day.",
    "width": 300,
    "height": 50,
    "data": {
        "values": [
            { "Activity": "Sleeping", "Time": 8 }, { "Activity": "Eating", "Time": 2 },
            { "Activity": "TV", "Time": 4 }, { "Activity": "Work", "Time": 8 },
            { "Activity": "Exercise", "Time": 2 }
        ]
    },
    "layer": [{
        "transform": [{
                "window": [{
                    "op": "sum",
                    "field": "Time",
                    "as": "TotalTime"
                }],
                "frame": [null, null]
            },
            {
                "calculate": "datum.Time/datum.TotalTime * 100",
                "as": "PercentOfTotal"
            }
        ],
        "mark": { "type": "bar", "clip": true },
        "encoding": {
            "x": {
                "field": "Activity",
                "type": "nominal",
                "scale": { "rangeStep": 12 },
                "axis": { "title": "" }
            },
            "y": {
                "field": "PercentOfTotal",
                "type": "quantitative",
                "axis": { "title": "% of total Time", "grid": false }
            }
        }
    }],
    "config": {
        "view": { "stroke": "transparent" },
        "axis": { "domainWidth": 1 }
    }
}
```


### Difference from Mean

<div class="vl-example" data-name="window_transform_movie_mean_difference"></div>

```json
{
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
    "description": "Bar graph showing how each movie is different from the average movie rating",
    "width": 300,
    "height": 50,
    "data": { "url": "data/movies.json" },
    "layer": [{
        "transform": [{
                "window": [{
                    "op": "mean",
                    "field": "IMDB_Rating",
                    "as": "AverageRating"
                }],
                "frame": [null, null]
            },
            {
                "calculate": "datum.IMDB_Rating - datum.AverageRating",
                "as": "DifferenceFromMean"
            },
            {
                "filter": "datum.DifferenceFromMean > 2.5"
            }
        ],
        "mark": { "type": "bar", "clip": true },
        "encoding": {
            "x": {
                "field": "Title",
                "type": "ordinal"
            },
            "y": {
                "field": "IMDB_Rating",
                "type": "quantitative",
                "scale": { "domain": [7, 10] },
                "axis": { "title": "IMDB rating" }
            }
        }
    }]
}
```

### Percent Difference from mean

The example above, could be adjusted to be the percent difference instead of the absolute difference, by adjusting the window transform to be in the format below.

```json
  {
    "window": [{
        "op": "mean",
        "field": "x",
        "as": "average"
    }],
    "frame": [null, null]
  },
  {
    "calculate": "(datum.total - datum.x)/dataum.average * 100",
    "as": "Percent difference from average"
  }
```

## Other examples

Here is an example where the window_transform can be used to get the average rating for a film during different years.

<div class="vl-example" data-name="window_transform_movie_mean_difference"></div>

```json
{
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
    "description": "Bar graph showing how each film differs from the average rating for that year",
    "width": 300,
    "height": 50,
    "data": {
        "values": [
            { "name": "Movie 1", "Rating": 9, "Year": 2016 },
            { "name": "Movie 2", "Rating": 3, "Year": 2016 },
            { "name": "Movie 3", "Rating": 5, "Year": 2015 },
            { "name": "Movie 4", "Rating": 2, "Year": 2015 }
        ]
    },
    "layer": [{
        "transform": [{
                "window": [{
                    "op": "mean",
                    "field": "Rating",
                    "as": "AverageYearRating"
                }],
                "groupby": [
                    "Year"
                ],
                "frame": [null, null]
            },
            {
                "calculate": "datum.Rating - datum.AverageYearRating",
                "as": "RatingDelta"
            }
        ],
        "mark": { "type": "bar", "clip": true },
        "encoding": {
            "x": {
                "field": "name",
                "type": "ordinal"
            },
            "y": {
                "field": "RatingDelta",
                "type": "quantitative",
                "scale": { "domain": [-10, 10] },
                "axis": { "title": "Rating Delta" }
            }
        }
    }]
}