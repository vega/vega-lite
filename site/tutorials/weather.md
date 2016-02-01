---
layout: tutorials
menu: tutorials
title: Create a Visualization of Weather Data
permalink: /tutorials/weather.html
---

In this tutorial, you'll learn a few more techniques for creating visualizations in Vega-Lite. If you are not familiar with Vega-Lite, read the [getting started tutorial]({{site.baseurl}}/tutorials/getting_started.html) first.

Let's say you have some dataset about weather data in Seattle that you want to visualize. The [dataset]({{site.baseurl}}/data/seattle-weather.csv) is a CSV file with columns for the temperature, precipitation, wind, and weather type.

**TODO**

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv","formatType": "csv"},
  "mark": "line",
  "encoding": {
    "x": {"field": "date","type": "temporal","timeUnit": "month"},
    "y": {
      "field": "precipitation",
      "type": "quantitative",
      "aggregate": "sum"
    }
  }
}
</div>

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv","formatType": "csv"},
  "mark": "line",
  "encoding": {
    "x": {"field": "date","type": "temporal","timeUnit": "yearmonth"},
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
  "data": {"url": "data/seattle-weather.csv","formatType": "csv"},
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
  "data": {"url": "data/seattle-weather.csv","formatType": "csv"},
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
  "data": {"url": "data/seattle-weather.csv","formatType": "csv"},
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
  "data": {"url": "data/seattle-weather.csv","formatType": "csv"},
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
