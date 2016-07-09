---
layout: tutorials
menu: tutorials
title: Exploring Data
permalink: /tutorials/explore.html
---

In this tutorial, you'll learn a few more techniques for creating visualizations in Vega-Lite. If you are not familiar with Vega-Lite, please read the [getting started tutorial](/tutorials/getting_started.html) first.

For this tutorial, we will create visualizations to explore weather data for Seattle, taken from [NOAA](https://www.ncdc.noaa.gov/cdo-web/). The [dataset](/data/seattle-weather.csv) is a [CSV file](https://en.wikipedia.org/wiki/Comma-separated_values) with columns for the temperature (in Celsius), precipitation (in centimeter), wind (in meter/second), and weather type. We have one row for each day from January 1st, 2012 to December 31st, 2015.

To load the CSV file with Vega-Lite, we need to provide a URL and set the format type in the data section of the specification.

{: .suppress-error}
```json
"data": {"url": "data/seattle-weather.csv"}
```

Let's start by looking at the precipitation. Precipitation is a quantitative variable. Let's use a tick mark to show the distribution of precipitation.

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv"},
  "mark": "tick",
  "encoding": {
    "x": {"field": "precipitation", "type": "quantitative"}
  }
}
</div>

It looks as though precipitation is skewed towards lower values; that is, when it rains, it usually doesn't rain very much. To better see this, we can create a histogram of the precipitation data. For this, we have to add an encoding channel for `y` that uses a special field `*` that is aggregated with `count`. It is difficult to see patterns across continuous variables. You can therefore discretize temperature values by setting `"bin": true`.

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv"},
  "mark": "bar",
  "encoding": {
    "x": {
      "bin": true,
      "field": "precipitation",
      "type": "quantitative"
      },
    "y": {
      "aggregate": "count",
      "field": "*",
      "type": "quantitative"
    }
  }
}
</div>

Next, let's look at how precipitation in Seattle changes throughout the year. Vega-Lite natively supports dates and discretization of dates when we set the type to `temporal`. For example, in the following plot, we sum up the precipitation for each month. To discretize the data into months, we set `"timeUnit": "month"`.

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv"},
  "mark": "line",
  "encoding": {
    "x": {
      "timeUnit": "month",
      "field": "date",
      "type": "temporal"
    },
    "y": {
      "aggregate": "mean",
      "field": "precipitation",
      "type": "quantitative"
    }
  }
}
</div>

This chart shows that in Seattle the precipitation in the winter is, on average, much higher than summer. You can now create similar charts for the other variables on your own!

When looking at precipitation and temperature, we might want to aggregate by year and month (`yearmonth`) rather than just month. This allows us to see seasonal trends but for each year separately. You can find more about [time units in the documentation]({{site.baseurl}}/docs/timeUnit.html). We can also set the `aggregate` to `max` in order to see the maximum temperature in each month.

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv"},
  "mark": "line",
  "encoding": {
    "x": {
      "timeUnit": "yearmonth",
      "field": "date",
      "type": "temporal"
    },
    "y": {
      "aggregate": "max",
      "field": "temp_max",
      "type": "quantitative"
    }
  },
  "config": {
    "unit": { "width": 300 }
  }
}
</div>

In this chart, it looks as though the maximum temperature is increasing from year to year. To look closer into this, let's create a chart that shows the mean of the maximum daily temperatures.

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv"},
  "mark": "line",
  "encoding": {
    "x": {
      "timeUnit": "year",
      "field": "date",
      "type": "temporal"
    },
    "y": {
      "aggregate": "mean",
      "field": "temp_max",
      "type": "quantitative"
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
  "data": {"url": "data/seattle-weather.csv"},
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
      "timeUnit": "month",
      "field": "date",
      "type": "temporal"

    },
    "y": {
      "aggregate": "mean",
      "field": "temp_range",
      "type": "quantitative"
    }
  }
}
</div>

For the last visualization in this tutorial, we will explore the `weather` field. We might wish to know how different kinds of weather (e.g. sunny days or rainy days) are distributed throughout the year. To answer this, we discretize the `date` by month and then count the number of records on the y-Axis. We then break down the bars by the weather type by adding a color channel with nominal data. When a field is mapped to color for a bar mark, Vega-Lite automatically stacks the bars atop eachother.
<!-- TODO: link to stacking config once we finish moving it -->

<div class="vl-example">
{
  "data": {"url": "data/seattle-weather.csv"},
  "mark": "bar",
  "encoding": {
    "x": {
      "timeUnit": "month",
      "field": "date",
      "type": "temporal"
    },
    "y": {
      "aggregate": "count",
      "field": "*",
      "type": "quantitative"
    },
    "color": {
      "field": "weather",
      "type": "nominal"
    }
  }
}
</div>

However, the default color palette's semantics might not match our expectation. For example, we probably do not expect "sun" (sunny) to be purple. We can further tune the chart by providing a color [scale range]({{site.baseurl}}/docs/scale.html#range) that maps the values from the `weather` field to meaningful colors. In addition, we can customize the [axis]({{site.baseurl}}/docs/axis.html) and [legend]({{site.baseurl}}/docs/legend.html) titles.

<div class="vl-example" data-name="stacked_bar_weather"></div>

This is the end of this tutorial where you learned different ways to discretize and aggregate data, derive new fields, and customize your charts. You can find more visualizations in the [gallery]({{site.baseurl}}/examples/gallery.html). If you want to further customize your charts, please read the [documentation]({{site.baseurl}}/docs/).
