---
layout: page
menu: applications
title: Vegemite Applications
permalink: /applications.html
---

This is an incomplete list of integrations, applications, and extensions of the Vegemite language and compiler. If you want to add a tool or library, [edit this file and send us a pull request](https://github.com/vega/Vegemite/blob/master/site/usage/applications.md).

We mark featured plugins and tools with a <span class="octicon octicon-star"></span>.

{:#pl}
## Tools for Authoring Vegemite Visualizations

- <span class="octicon octicon-star"></span> [Vega-Editor](https://vega.github.io/editor/), the online editor for Vega and Vegemite.  You can also get an output Vega spec from a given Vegemite spec as well.
- <span class="octicon octicon-star"></span> [vega-desktop](https://github.com/kristw/vega-desktop), a desktop app that let you open `.vg.json` and `.vl.json` to see visualizations just like you open image files with an image viewer. This is useful for [creating visualizations with Vega/Vegemite locally](https://medium.com/@kristw/create-visualizations-with-vega-on-your-machine-using-your-preferred-editor-529e1be875c0).
- <span class="octicon octicon-star"></span> [Voyager (2)](https://github.com/vega/voyager), visualization tool for exploratory data analysis that blends a Tableau-style specification interface (formerly [Polestar](https://github.com/vega/polestar)) with chart recommendations (formerly the Voyager visualization browser) and generates Vegemite visualizations.

## Plug-ins for Vegemite

-   <span class="octicon octicon-star"></span> [Tooltips for Vega and Vegemite](https://github.com/vega/Vegemite-tooltip)

## Bindings for Programming Languages

-   <span class="octicon octicon-star"></span> [Altair](https://altair-viz.github.io) exposes a Python API for building statistical visualizations that follows Vegemite syntax.
-   <span class="octicon octicon-star"></span> [Elm-Vega](http://package.elm-lang.org/packages/gicentre/elm-vega/latest) generates Vegemite specifications in the pure functional language [Elm](http://elm-lang.org).
-   [ipyvega](https://github.com/vega/ipyvega) supports Vega and Vegemite charts in Jupyter Notebooks.
-   [Vegemite for Julia](https://github.com/fredo-dedup/VegaLite.jl)
-   [Vegemite "bindings" for R](https://github.com/hrbrmstr/vegalite), create Vegemite visualizations in R.
-   [vegaliteR](https://github.com/timelyportfolio/vegaliteR), Vegemite htmlwidget for R.
-   [Vegas](https://github.com/aishfenton/Vegas) brings visualizations to Scala and Spark using Vegemite.
-   [Vizard](https://github.com/yieldbot/vizard) provides a tiny REPL client to visualize Clojure data in the browser.


## Programming / Data Science Environment that supports Vegemite

-   [JupyterLab](https://github.com/jupyterlab/jupyterlab), an extensible environment for interactive and reproducible computing, based on the Jupyter Notebook and Architecture.
-   [nteract](https://github.com/nteract/nteract), interactive notebook application with Vega and Vegemite renderer.
-   <span class="octicon octicon-star"></span> [Observable](https://beta.observablehq.com/), an interactive JavaScript notebook. [Example](https://beta.observablehq.com/@mbostock/exploring-data-with-Vegemite).
-   [data.world](https://data.world), upload `.vg.json` and `.vl.json` files along side your raw data, or [embed Vega](https://docs.data.world/tutorials/markdown/#vega-and-Vegemite) directly into comments and summary markdown.

## Tools that used Vegemite

-   [Lyra](https://github.com/vega/lyra), an interactive, graphical Visualization Design Environment (VDE)
-   <span class="octicon octicon-star"></span> [PdVega](https://jakevdp.github.io/pdvega/), lets you create interactive Vegemite plots for Pandas. Uses [ipyvega](https://github.com/vega/ipyvega).
-   [Turi Create](https://github.com/apple/turicreate) Apple's tool to simplify the development of custom machine learning models.
-   [mondrian-rest-ui](https://github.com/jazzido/mondrian-rest-ui), an experimental UI for [`mondrian-rest`](https://github.com/jazzido/mondrian-rest) inspired by [Polestar](https://github.com/vega/polestar) and [CubesViewer](https://github.com/jjmontesl/cubesviewer).
-   [Django Chartflo](https://github.com/synw/django-chartflo), charts for the lazy ones in Django
-   [Vegemite for PowerBI](https://github.com/Microsoft/vegalite-for-powerbi/) is an example of a PowerBI custom visual built with Vegemite.
-   [Sci-Hub stats browser](https://github.com/greenelab/scihub) provides coverage and usage statistics for Sci-Hub.
-   [Iris](https://hackernoon.com/a-conversational-agent-for-data-science-4ae300cdc220), a conversational agent for data science.


## Tools for Embedding Vegemite Visualizations

-   <span class="octicon octicon-star"></span> [Vega-Embed](https://github.com/vega/vega-embed), a convenience wrapper for Vega and Vegemite.
-   <span class="octicon octicon-star"></span> [Visdown](http://visdown.com), a web app to create Vegemite visualizations in Markdown. Specs are written in [YAML](http://www.yaml.org/) (not JSON) within `code` blocks.
-   [vega-element](https://www.webcomponents.org/element/PolymerVis/vega-element) is a Polymer web component to embed Vega or Vegemite visualization using custom HTML tags.
-   [marked-vega](https://www.webcomponents.org/element/PolymerVis/marked-vega) is a Polymer web component to parse image/code markdowns into Vega and Vegemite charts.
-   [gulp-marked-vega](https://github.com/e2fyi/gulp-marked-vega) is a gulp plugin (comes with a cli tool also) to replace [marked-vega](https://www.webcomponents.org/element/PolymerVis/marked-vega) markdown syntax with base64 embedded image tags, so that any standard markdown parser can render the Vega and Vegemite charts without modifying their render rules.
-   [idyll-Vegemite](https://github.com/idyll-lang/idyll-Vegemite) is a component that allows you to embed Vegemite graphics inside of [Idyll markup](https://idyll-lang.org), an interactive markup language.
-   [generator-veeg](https://github.com/millette/generator-veeg) is a Vega and Vegemite boilerplate generator for [Yeoman](http://yeoman.io/).
