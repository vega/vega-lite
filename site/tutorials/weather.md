---
layout: tutorials
menu: tutorials
title: Visualizing Weather Data
permalink: /tutorials/weather.html
---

In this tutorial, you'll learn a few more techniques for creating visualizations in Vega-Lite. If you are not familiar with Vega-Lite, read the [getting started tutorial](/tutorials/getting_started.html) first.

Let's say you have some dataset about weather data in Seattle that you want to visualize. The [dataset](/data/seattle-weather.csv) is a [CSV file](https://en.wikipedia.org/wiki/Comma-separated_values) with columns for the temperature (in Celsius), precipitation (in Centimeter), wind (in Meter/Second), and weather type. We have one row for each day from January 1st, 2012 to December 31st, 2015.

To load the CSV file with Vega-Lite, we need to provide a URL and set the format type in the data section of the specification.

```json
"data": {"url": "data/seattle-weather.csv", "formatType": "csv"}
```

So the first thing we might want to do is look at the variables precipitation, wind, and temperature. Let's start with the precipitation. This first visualization uses a tick mark to show the distribution of the precipitation. Precipitation is a quantitative variable.

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv", "formatType": "csv"},
  "mark": "tick",
  "encoding": {
    "x": {"field": "precipitation", "type": "quantitative"}
  }
}
</div>

It looks as though precipitation is skewed towards lower precipitations. To better see this, we can create a histogram of the precipitation data. For this, we have to add an encoding channel for `y` that uses a special field `*` that is aggregated with `count`. just showing how often a a certain value was measured is not very helpful because they are continuous. To discretize the temperature values, set `"bin": true`.

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv", "formatType": "csv"},
  "mark": "bar",
  "encoding": {
    "x": {
      "field": "precipitation",
      "type": "quantitative",
      "bin": true
      },
    "y": {
      "field": "*",
      "type": "quantitative",
      "aggregate": "count"
    }
  }
}
</div>

Great. You can now create similar charts for the other variables on your own.

Next, let's look at how precipitation in Seattle changes throughout the year. Vega-Lite natively supports dates and discretization of dates when we set the type to `temporal`. For example, in the following plot, we sum up the precipitation for each month. To discretize the data into months, we set `"timeUnit": "month"`. Vega-Lite automatically sets the right axis format.

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv", "formatType": "csv"},
  "mark": "line",
  "encoding": {
    "x": {"field": "date", "type": "temporal", "timeUnit": "month"},
    "y": {
      "field": "precipitation",
      "type": "quantitative",
      "aggregate": "sum"
    }
  }
}
</div>

this chart shows that the precipitation in the winter months is much higher than during the summer.

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv", "formatType": "csv"},
  "mark": "line",
  "encoding": {
    "x": {"field": "date","type": "temporal", "timeUnit": "yearmonth"},
    "y": {
      "field": "temp_max",
      "type": "quantitative",
      "aggregate": "mean"
    }
  },
  "config": {
    "cell": { "width": 300 }
  }
}
</div>

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv", "formatType": "csv"},
  "mark": "line",
  "encoding": {
    "x": {"field": "date","type": "temporal","timeUnit": "year"},
    "y": {
      "field": "temp_max",
      "type": "quantitative",
      "aggregate": "mean"
    }
  }
}
</div>

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv", "formatType": "csv"},
  "transform": {
    "calculate": [
      {
        "field": "temp_range",
        "expr": "datum.temp_max - datum.temp_min"
      }
    ]
  },
  "mark": "line",
  "encoding": {
    "x": {
      "field": "date",
      "type": "temporal",
      "timeUnit": "month"
    },
    "y": {
      "field": "temp_range",
      "type": "quantitative",
      "aggregate": "mean"
    }
  }
}
</div>


<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv", "formatType": "csv"},
  "mark": "bar",
  "encoding": {
    "x": {"field": "date","type": "temporal","timeUnit": "month"},
    "y": {
      "field": "*",
      "type": "quantitative",
      "aggregate": "count"
    },
    "color": {"field": "weather","type": "ordinal"}
  }
}
</div>

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv", "formatType": "csv"},
  "mark": "bar",
  "encoding": {
    "x": {
      "field": "date",
      "type": "temporal",
      "timeUnit": "month",
      "axis": {"title": "Month of the year"}
    },
    "y": {
      "field": "*",
      "type": "quantitative",
      "aggregate": "count"
    },
    "color": {
      "field": "weather",
      "type": "ordinal",
      "scale": {
        "domain": ["sun","fog","drizzle","rain","snow"],
        "range": ["#e7ba52","#c7c7c7","#aec7e8","#1f77b4","#9467bd"]
      }
    }
  }
}
</div>
