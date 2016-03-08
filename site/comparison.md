---
layout: page
title: Vega-Lite compared with other Languages
permalink: /comparison.html
---

## Vega and D3

Vega-Lite is a higher-level grammar for visual analysis. It supports common chart types (bar chart, line chart, area chart, scatter plot, heatmap, trellis plots, ...) and common data transformations (sorting, aggregation, faceting). In Vega, you have to manually construct axis and legends and you have to decide how to map the data to visual properties. Vega-Lite automates the construction of axes, legends, and scales from a high level encoding specification. This makes Vega-Lite specifications significantly shorter (about 1/10th). Vega-Lite is compiled to Vega and some Visualizations that are expressible in Vega cannot be expressed in Vega-Lite. For instance, as of now Vega-Lite does not support interactions.

Vega-Lite and Vega are visualization specification languages in JSON. The Vega wiki has a detailed [comparison of Vega and D3](https://github.com/vega/vega/wiki/Vega-and-D3).


## Grammar of Graphics, GGPlot and Tableau

GGPlot and Vega-Lite both use a compositional approach to visualization design and are both grounded in the [Grammar of Graphics](http://www.amazon.com/The-Grammar-Graphics-Statistics-Computing/dp/0387245448). Vega-Lite adds common data analysis transformations such as aggregation. GGPlot is embedded in R so that data can be transformed outside of the visualization specification. Vega-Lite is implemented in Java-Script and thus available in all modern browsers.

[Tableau](https://www.tableau.com/) is a graphical interface. The underlying formalism ([VizQL](https://www.tableau.com/products/technology)) heavily influenced the design of Vega-Lite. Vega-Lite and Tableau both provide smart defaults.


## Highcharts and plotly

[Highcharts](http://www.highcharts.com/) and [plotly](https://plot.ly/) use templates for common chart types rather than composing primitive marks. Templates make it easier to add a new chart type but limit expressiveness and makes it harder to change just a single aspect of a visualization.
