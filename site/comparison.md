---
layout: page
title: Vega-Lite compared with other Languages
permalink: /comparison.html
---

## Vega and D3

Vega-Lite is a higher-level grammar for visual analysis. It supports common chart types (bar chart, line chart, area chart, scatter plot, heatmap, trellis plots, ...) and common data transformations (sorting, aggregation, faceting). Vega is much more expressive and also supports interactions. However, Vega does not provide as many defaults as Vega-Lite and thus more code is required for simple charts. The Vega wiki has a detailed [comparison of Vega and D3](https://github.com/vega/vega/wiki/Vega-and-D3).

## GGPlot

GGPlot and Vega-Lite both use a compositional approach to visualization design and are both grounded in the [Grammar of Graphics](http://www.amazon.com/The-Grammar-Graphics-Statistics-Computing/dp/0387245448). Vega-Lite adds common data analysis transformations such as aggregation. Moreover, Vega-Lite is implemented in Java-Script and thus available in all modern browsers.

## Tableau

[Tableau](https://www.tableau.com/) is a graphical interface. The underlying formalism ([VizQL](https://www.tableau.com/products/technology)) is similar to Vega-Lite. Vega-Lite and Tableau both provide smart defaults.

## Highcharts and plotly

[Highcharts](http://www.highcharts.com/) and [plotly](https://plot.ly/) use templates for common chart types rather than composing primitive marks. Templates make it easier to add a new chart type but limit expressiveness and makes it harder to change just a single aspect of a visualization.
