---
layout: tutorials
menu: tutorials
title: Visualizing Weather Data
permalink: /tutorials/weather.html
---

In this tutorial, you'll learn a few more techniques for creating visualizations in Vega-Lite. If you are not familiar with Vega-Lite, please read the [getting started tutorial](/tutorials/getting_started.html) first.

For this tutorial, we will create visualizations to explore a dataset about weather in Seattle. The [dataset](/data/seattle-weather.csv) is a [CSV file](https://en.wikipedia.org/wiki/Comma-separated_values) with columns for the temperature (in Celsius), precipitation (in centimeter), wind (in meter/second), and weather type. We have one row for each day from January 1st, 2012 to December 31st, 2015.

To load the CSV file with Vega-Lite, we need to provide a URL and set the format type in the data section of the specification.

```json
"data": {"url": "data/seattle-weather.csv", "formatType": "csv"}
```

Let's start by looking at the precipitation. Precipitation is a quantitative variable.  Let's use a tick mark to show the distribution of the precipitation.

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

Next, let's look at how precipitation in Seattle changes throughout the year. Vega-Lite natively supports dates and discretization of dates when we set the type to `temporal`. For example, in the following plot, we sum up the precipitation for each month. To discretize the data into months, we set `"timeUnit": "month"`.

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

This chart shows that in Seattle the precipitation in the winter  is much higher than during the summer. You can now create similar charts for the other variables on your own!

When looking at precipitation and temperature, we might want to aggregate by year and month rather than just month. This allows us to see seasonal trends but for each year separately. You can find more about [time units in the documentation]({{site.baseurl}}/docs/timeUnit.html). Note that we set the aggregation to `max`so that we see the maximum temperature in each month.

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv", "formatType": "csv"},
  "mark": "line",
  "encoding": {
    "x": {
      "field": "date",
      "type": "temporal",
      "timeUnit": "yearmonth"
    },
    "y": {
      "field": "temp_max",
      "type": "quantitative",
      "aggregate": "max"
    }
  },
  "config": {
    "unit": { "width": 300 }
  }
}
</div>

In this chart it looks as though the maximum temperature is increasing from year to year. To confirm this, let's create a chart that shows the mean of the maximum daily temperatures.

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv", "formatType": "csv"},
  "mark": "point",
  "encoding": {
    "x": {"field": "date", "type": "temporal", "timeUnit": "year"},
    "y": {
      "field": "temp_max",
      "type": "quantitative",
      "aggregate": "mean"
    }
  }
}
</div>

And yes, this chart shows that it is in fact increasing. You can observe a similar change for the minimum daily temperatures. Considering minimum and maximum temperatures, you might wonder how the variability of the temperatures changes throughout the year. For this, we have to add a computation to derive a new field.

```json
"transform": {
  "calculate": [
    {
      "field": "temp_range",
      "expr": "datum.temp_max - datum.temp_min"
    }
  ]
}
```

We can use the new field `temp_range` just like any other field. You can find more [data transformation operations in the docs]({{site.baseurl}}/docs/transform.html).

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

For the last visualization in this tutorial, we will explore the `weather` field. One interesting question is how do different kinds of weather distribute throughout the year.  To answer this, we discretize the `date` by month and then count the number of records on the y-Axis. We then break down the bars by the weather type by adding a color channel with nominal data.  When a field is mapped to color for a bar mark, Vega-Lite automatically generates stacking.  
<!-- TODO: link to stacking config once we finish moving it -->

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv", "formatType": "csv"},
  "mark": "bar",
  "encoding": {
    "x": {"field": "date", "type": "temporal", "timeUnit": "month"},
    "y": {
      "field": "*",
      "type": "quantitative",
      "aggregate": "count"
    },
    "color": {"field": "weather", "type": "nominal"}
  }
}
</div>

However, the default color palette's semantics might not match our expectation.  For example, we probably do not expect "sun" (sunny) to be purple.  We can further tune the chart by  providing a color [scale range](../docs/scale.html#range) that maps the values from the `weather` field to meaningful colors.  In addition, we can customize the [axis](../docs/axis.html) and [legend](../docs/legend.html) titles.  

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
      "type": "nominal",
      "scale": {
        "domain": ["sun","fog","drizzle","rain","snow"],
        "range": ["#e7ba52","#c7c7c7","#aec7e8","#1f77b4","#9467bd"]
      },
      "legend": {
        "title": "Weather type"
      }
    }
  }
}
</div>

This is the end of this tutorial. You can find more visualizations in the [gallery]({{site.baseurl}}/gallery.html).
