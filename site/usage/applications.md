---
layout: page
menu: applications
title: Vega-Lite Applications
permalink: /applications.html
---

This is an incomplete list of integrations, applications, and extensions of the Vega-Lite language and compiler. If you want to add a tool or library, [edit this file and send us a pull request](https://github.com/vega/vega-lite/blob/master/site/usage/applications.md).

We mark featured plugins and tools with a <span class="octicon octicon-star"></span>.

{:#pl}

## Bindings for Programming Languages

-   <span class="octicon octicon-star"></span> [Altair](https://altair-viz.github.io) exposes a Python API for building statistical visualizations that follows Vega-Lite syntax.
-   <span class="octicon octicon-star"></span> [Elm-Vega](http://package.elm-lang.org/packages/gicentre/elm-vega/latest) generates Vega-Lite specifications in the pure functional language [Elm](http://elm-lang.org).
-   [ipyvega](https://github.com/vega/ipyvega) supports Vega and Vega-Lite charts in Jupyter Notebooks.
-   [Vega-Lite for Julia](https://github.com/fredo-dedup/VegaLite.jl)
-   [Vega-Lite "bindings" for R](https://github.com/hrbrmstr/vegalite), create Vega-Lite visualizations in R.
-   [vegaliteR](https://github.com/timelyportfolio/vegaliteR), vega-lite htmlwidget for R.
-   [Vegas](https://github.com/aishfenton/Vegas) brings visualizations to Scala and Spark using Vega-Lite.
-   [Vizard](https://github.com/yieldbot/vizard) provides a tiny REPL client to visualize Clojure data in the browser.

## Tools where you can use Vega-Lite

-   [JupyterLab](https://github.com/jupyterlab/jupyterlab), an extensible environment for interactive and reproducible computing, based on the Jupyter Notebook and Architecture.
-   [nteract](https://github.com/nteract/nteract), interactive notebook application with Vega and Vega-Lite renderer.
-   <span class="octicon octicon-star"></span> [Observable](https://beta.observablehq.com/), an interactive JavaScript notebook. [Example](https://beta.observablehq.com/@mbostock/exploring-data-with-vega-lite).
-   [data.world](https://data.world), upload `.vg.json` and `.vl.json` files along side your raw data, or [embed Vega](https://docs.data.world/tutorials/markdown/#vega-and-vega-lite) directly into comments and summary markdown.
-   <span class="octicon octicon-star"></span> [vega-desktop](https://github.com/kristw/vega-desktop), a desktop app that let you open `.vg.json` and `.vl.json` to see visualizations just like you open image files with an image viewer. Can also be used for [creating visualizations with Vega/Vega-Lite locally](https://medium.com/@kristw/create-visualizations-with-vega-on-your-machine-using-your-preferred-editor-529e1be875c0).

## Authoring Tools

-   <span class="octicon octicon-star"></span> [Vega-Editor](https://vega.github.io/editor/), the editor for Vega and Vega-Lite.

## Tools that use Vega-Lite

-   <span class="octicon octicon-star"></span> [Voyager (2)](https://github.com/vega/voyager), visualization tool for exploratory data analysis that blends a Tableau-style specification interface (formerly [Polestar](https://github.com/vega/polestar)) with chart recommendations (formerly the Voyager visualization browser).
-   [Lyra](https://github.com/vega/lyra), an interactive, graphical Visualization Design Environment (VDE)
-   <span class="octicon octicon-star"></span> [PdVega](https://jakevdp.github.io/pdvega/), lets you create interactive Vega-Lite plots for Pandas. Uses [ipyvega](https://github.com/vega/ipyvega).
-   [Turi Create](https://github.com/apple/turicreate) Apple's tool to simplify the development of custom machine learning models.
-   [mondrian-rest-ui](https://github.com/jazzido/mondrian-rest-ui), an experimental UI for [`mondrian-rest`](https://github.com/jazzido/mondrian-rest) inspired by [Polestar](https://github.com/vega/polestar) and [CubesViewer](https://github.com/jjmontesl/cubesviewer).
-   [Django Chartflo](https://github.com/synw/django-chartflo), charts for the lazy ones in Django
-   [Vega-Lite for PowerBI](https://github.com/Microsoft/vegalite-for-powerbi/) is an example of a PowerBI custom visual built with Vega-Lite.
-   [Sci-Hub stats browser](https://github.com/greenelab/scihub) provides coverage and usage statistics for Sci-Hub.
-   [Iris](https://hackernoon.com/a-conversational-agent-for-data-science-4ae300cdc220), a conversational agent for data science.

## Libraries

-   <span class="octicon octicon-star"></span> [Tooltips for Vega and Vega-Lite](https://github.com/vega/vega-lite-tooltip)

## Embed Vega-Lite Visualizations

-   <span class="octicon octicon-star"></span> [Vega-Embed](https://github.com/vega/vega-embed), a convenience wrapper for Vega and Vega-Lite.
-   <span class="octicon octicon-star"></span> [Visdown](http://visdown.com), a web app to create Vega-Lite visualizations in Markdown. Specs are written in [YAML](http://www.yaml.org/) (not JSON) within `code` blocks.
-   [vega-element](https://www.webcomponents.org/element/PolymerVis/vega-element) is a Polymer web component to embed Vega or Vega-Lite visualization using custom HTML tags.
-   [marked-vega](https://www.webcomponents.org/element/PolymerVis/marked-vega) is a Polymer web component to parse image/code markdowns into Vega and Vega-Lite charts.
-   [gulp-marked-vega](https://github.com/e2fyi/gulp-marked-vega) is a gulp plugin (comes with a cli tool also) to replace [marked-vega](https://www.webcomponents.org/element/PolymerVis/marked-vega) markdown syntax with base64 embedded image tags, so that any standard markdown parser can render the Vega and Vega-Lite charts without modifying their render rules.
