---
layout: page
menu: ecosystem
title: Vega-Lite Ecosystem
permalink: /ecosystem.html
redirect_from: /applications.html
---

This is an incomplete list of integrations, applications, and extensions of the Vega-Lite language and compiler. If you want to add a tool or library, [edit this file and send us a pull request](https://github.com/vega/vega-lite/blob/master/site/usage/ecosystem.md).

We mark featured plugins and tools with a <span class="octicon octicon-star"></span>.

{:#pl}

## Tools for Authoring Vega-Lite Visualizations

- <span class="octicon octicon-star"></span> [Vega-Editor](https://vega.github.io/editor/), the online editor for Vega and Vega-Lite. You can also get an output Vega spec from a given Vega-Lite spec as well.
- <span class="octicon octicon-star"></span> [vega-desktop](https://github.com/kristw/vega-desktop), a desktop app that lets you open `.vg.json` and `.vl.json` to see visualizations just like you open image files with an image viewer. This is useful for [creating visualizations with Vega/Vega-Lite locally](https://medium.com/@kristw/create-visualizations-with-vega-on-your-machine-using-your-preferred-editor-529e1be875c0).
- <span class="octicon octicon-star"></span> [Voyager (2)](https://github.com/vega/voyager), visualization tool for exploratory data analysis that blends a Tableau-style specification interface (formerly [Polestar](https://github.com/vega/polestar)) with chart recommendations (formerly the Voyager visualization browser) and generates Vega-Lite visualizations.
- [data.world Chart Builder](https://data.world/integrations/chart-builder), a chart builder that imports data from queries in data.world. The generated specs can be saved locally or uploaded back to data.world. Project is [open source](https://github.com/datadotworld/chart-builder).
- [Vega Viewer](https://github.com/RandomFractals/vscode-vega-viewer) and [Vega Preview](https://marketplace.visualstudio.com/items?itemName=mdk.vega-preview), Visual Studio Code extensions for viewing Vega and Vega-Lite visualizations.

## Plug-ins for Vega-Lite

- <span class="octicon octicon-star"></span> [Tooltips for Vega and Vega-Lite](https://github.com/vega/vega-lite-tooltip)
- <span class="octicon octicon-star"></span> [Leaflet Tile Map integration for Vega and Vega-Lite](https://github.com/nyurik/leaflet-vega)

## Bindings for Programming Languages

- <span class="octicon octicon-star"></span> [Altair](https://altair-viz.github.io) exposes a Python API for building statistical visualizations that follows Vega-Lite syntax.
- <span class="octicon octicon-star"></span> [Elm-Vega](https://package.elm-lang.org/packages/gicentre/elm-vega/latest) generates Vega-Lite specifications in the pure functional language [Elm](https://elm-lang.org).
- [Altair wrapper in R](https://vegawidget.github.io/altair/)
- [ipyvega](https://github.com/vega/ipyvega) supports Vega and Vega-Lite charts in Jupyter Notebooks.
- <span class="octicon octicon-star"></span> [VegaLite.jl](https://github.com/fredo-dedup/VegaLite.jl) are Julia bindings to Vega-Lite
- [Vega-Lite "bindings" for R](https://github.com/hrbrmstr/vegalite), create Vega-Lite visualizations in R.
- [vegaliteR](https://github.com/timelyportfolio/vegaliteR), vega-lite htmlwidget for R.
- [Vegas](https://github.com/aishfenton/Vegas) brings visualizations to Scala and Spark using Vega-Lite.
- [vegawidget](https://vegawidget.github.io/vegawidget), low-level interface in R to render Vega and Vega-Lite specifications as htmlwidgets, including functions to interact with data, events, and signals in [Shiny](https://shiny.rstudio.com).
- [Hanami](https://github.com/jsa-aerial/hanami) A Clojure(Script) library for creating domain specific interactive visualization applications. Exposes a parameterized template system that uses recursive transformation to finished Vega-Lite and Vega specs. Built with [reagent](https://reagent-project.github.io/) (react) and [re-com](https://github.com/Day8/re-com) enabled.
- [Vizard](https://github.com/yieldbot/vizard) tiny REPL client to visualize Clojure data in browser w/ Vega-Lite.
- [Oz](https://github.com/metasoarous/oz) is a Vega & Vega-Lite based visualization and scientific document toolkit for Clojure & ClojureScript (Reagent). Originally a fork of Vizard, Oz adds support for Vega, publishing/sharing, markdown & hiccup extensions for embedding Vega-Lite & Vega visualizations in html documents, static html output, and Jupyter notebooks.
- [Vizsla](https://github.com/gjmcn/vizsla) is a simple JavaScript API for Vega-Lite.
- [Vega node for Node-RED Dashboard](https://flows.nodered.org/node/node-red-node-ui-vega) supports Vega and Vega-Lite visualization on [Node-RED](https://nodered.org/) flow based programming tool.

## Programming / Data Science Environment that supports Vega-Lite

- <span class="octicon octicon-star"></span> [JupyterLab](https://github.com/jupyterlab/jupyterlab), an extensible environment for interactive and reproducible computing, based on the Jupyter Notebook and Architecture.
- [nteract](https://github.com/nteract/nteract), interactive notebook application with Vega and Vega-Lite renderer.
- <span class="octicon octicon-star"></span> [Observable](https://beta.observablehq.com/), an interactive JavaScript notebook. [Embed example](https://beta.observablehq.com/@domoritz/hello-vega-embed) and [exploration example](https://beta.observablehq.com/@mbostock/exploring-data-with-vega-lite).
- [data.world](https://data.world), upload `.vg.json` and `.vl.json` files along side your raw data, or [embed Vega](https://docs.data.world/tutorials/markdown/#vega-and-vega-lite) directly into comments and summary markdown.
- [nextjournal](https://nextjournal.com/), scientific computing environment with support for data visualizations including [Vega-Lite](https://nextjournal.com/blog/plotting-with-vega-lite-in-nextjournal)

## Tools that use Vega-Lite

- [Lyra](https://github.com/vega/lyra), an interactive, graphical Visualization Design Environment (VDE)
- [Saite](https://github.com/jsa-aerial/saite) Interactive exploratory graphics and ad hoc visualization application for Clojure(Script). Built on top of [Hanami](https://github.com/jsa-aerial/hanami).
- <span class="octicon octicon-star"></span> [PdVega](https://jakevdp.github.io/pdvega/), lets you create interactive Vega-Lite plots for Pandas. Uses [ipyvega](https://github.com/vega/ipyvega).
- [Turi Create](https://github.com/apple/turicreate) Apple's tool to simplify the development of custom machine learning models.
- [mondrian-rest-ui](https://github.com/jazzido/mondrian-rest-ui), an experimental UI for [`mondrian-rest`](https://github.com/jazzido/mondrian-rest) inspired by [Polestar](https://github.com/vega/polestar) and [CubesViewer](https://github.com/jjmontesl/cubesviewer).
- [Django Chartflo](https://github.com/synw/django-chartflo), charts for the lazy ones in Django
- [Vega-Lite for PowerBI](https://github.com/Microsoft/vegalite-for-powerbi/) is an example of a PowerBI custom visual built with Vega-Lite.
- [Sci-Hub stats browser](https://github.com/greenelab/scihub) provides coverage and usage statistics for Sci-Hub.
- [Iris](https://hackernoon.com/a-conversational-agent-for-data-science-4ae300cdc220), a conversational agent for data science.
- [dashcard](https://github.com/scottcame/dashcard): a simple [Bootstrap](https://getbootstrap.com/)-based UI for dynamic dashboarding using Vega-Lite and [Mondrian](https://community.hds.com/docs/DOC-1009853) via a [REST API](https://github.com/ojbc/mondrian-rest).
- [histbook](https://github.com/diana-hep/histbook), a versatile, high-performance histogram toolkit for Numpy.
- [Olmsted](https://github.com/matsengrp/olmsted): a web application for biologists to explore and visualize the adapative immune system using deep sequenced B-cell receptor data. The app uses Vega's interactive capabilities in the context of a React/Redux application to allow users to drill down into the data at multiple levels of granularity, and is currently being used by HIV researchers in the quest for a vaccine. [Demo available here](https://olmstedviz.org).
- [Lens.org](https://www.lens.org/): Provides free search and analysis for millions of patents and scholarly works. Simplified interface for creating Vega-Lite data visualisations.

## Tools for Embedding Vega-Lite Visualizations

- <span class="octicon octicon-star"></span> [Vega-Embed](https://github.com/vega/vega-embed), a convenience wrapper for Vega and Vega-Lite.
- <span class="octicon octicon-star"></span>[Flourish](https://flourish.studio/2018/05/29/vega-lite-in-flourish/) - Visualization and Storytelling Platform
- [Visdown](http://visdown.com), a web app to create Vega-Lite visualizations in Markdown. Specs are written in [YAML](http://www.yaml.org/) (not JSON) within `code` blocks.
- [vega-element](https://www.webcomponents.org/element/PolymerVis/vega-element) is a Polymer web component to embed Vega or Vega-Lite visualization using custom HTML tags.
- [marked-vega](https://www.webcomponents.org/element/PolymerVis/marked-vega) is a Polymer web component to parse image/code markdowns into Vega and Vega-Lite charts.
- [gulp-marked-vega](https://github.com/e2fyi/gulp-marked-vega) is a gulp plugin (comes with a cli tool also) to replace [marked-vega](https://www.webcomponents.org/element/PolymerVis/marked-vega) markdown syntax with base64 embedded image tags, so that any standard markdown parser can render the Vega and Vega-Lite charts without modifying their render rules.
- [idyll-vega-lite](https://github.com/idyll-lang/idyll-vega-lite) is a component that allows you to embed Vega-Lite graphics inside of [Idyll markup](https://idyll-lang.org), an interactive markup language.
- [generator-veeg](https://github.com/millette/generator-veeg) is a Vega and Vega-Lite boilerplate generator for [Yeoman](https://yeoman.io/).
