---
layout: tutorials
menu: tutorials
title: Create Figures for Papers
permalink: /tutorials/figures.html
---

In this tutorial you will learn how to use Vega-Lite to create charts for figures and embed them in a paper written with LaTeX. The overall workflow includes (1) opening a chart in the online editor, (2) exporting a chart as SVG, (3) converting the SVG to PDF, (4) cropping the PDF to remove excessive whitespace, and (5) embedding a chart in a LaTeX paper.

## Create a Chart in Vega-Lite

First, you need a chart. To export charts as figures, you can start with specifications from the online editor, use [examples from the Vega-Lite website]({{ site.baseurl}}/examples/), copy charts created in [Altair](https://altair-viz.github.io/), or use charts from [Observable](https://beta.observablehq.com/@domoritz/hello-vega-embed). To export the chart, copy the Vega-Lite specification into the [Vega-Lite editor](https://vega.github.io/editor/).

For this tutorial, we will use the example chart below, which you can view in the editor [here](https://vega.github.io/editor/#/url/vega-lite/N4KABGBEAkDODGALApgWwIaQFxUQFzwAdYsB6UgN2QHN0A6agSz0QFcAjOxge1IRQyUa6ALQAbZskoBmOgCtY3AHaQANOCgB3RgBMW2MABYADMfURIKRtXwGATKfNRkS+Nx2Ml1A6AgWAHj4aflAAZozIYjoGkABO3JpqwX6QeACehMgxAI6s6Ep4zOiFVEkhFoV4Ylk4kAAqsYzoYmXlkAjNNWDAkEqM8F2hzbDIAL5OIZDo-oywPpDUjdE4Q2Ijo8kQ48mQaUHlYRFRMaHErZPpmTl5BUUlWRMpldUxAGKx6KjIsGAACsixMAAZWQbiUOjAAApTrAAJTnFLTWbzRa6AyrdaPCwdF44HqXLqQMTcbwbELbSZuYmxfZtcKRZZQWBpWB4NAIioZQlKbioTzNDlQZ6EoEstmoQVEmguRm+A5QbiNFx4GLsbgEXkiRo2FWbMBkvwUlKwRgALy6PQozVYXQAjAajUT0GkAQYANpyiw6YqYPF63qfQmrMGQZJGiofJSwUKKiU4N16nracEJd09biEGLxTQAfSUrFQ7Fdqig6DmtWzkFGAF1w34evBmvBWGJioTbaZjKRvXgC3Qe5gS1Ny2EznWIA2my22zEAOSvJvKWdqUsj9pi9kGiDVx6QDCxADWMQkSiyGiNnqgA9pkyUgZisFy6FiZ-Ju7wkejsfdicgyZ0qbxummYVgkeYFkWNJDmWWapjW47dJAjZiM2rZsjEHamN2xR9te0FrjCVZYohyGoTOtSzkCT4vmAADC8SwNGjBiGygKQtIACysLLvhD4bhKW5gDuOz7ketQnq++rCV6PojHgI6XpAwbKO6toAGx0AAHLaACcek6WpOmGJpdiGHYdiqLpdAAOwAKz6Zp0h2LatnSE5xjSJZGnGNZ+l6XY0jWcYanGLZtmWTpdC2b5fkBUFIVhV5dBmZ2pjWWpdg6dIRnhepdAOKl6WZdlhiuUlxgFaYpXWel0hqdZFkuXQWV+bZmkeY5nl5XY7WdmpmlqWppW2cYmlJbaul6ZpWW2ppmmGOlanjfZDkLYYtrOba42TTp03SLN82LeN2X6dI01DfNZ3jalHW2oYhkNdZSWVWlGUtaVXUaXYIWduZc3aY5S1WdIK27UF0imMVEU2TdRXvWVTUtfpbUdW50O2idelnQZxmGFd3Ww29JUIxpE0OTNc0LYN0O2S91W1fVjWRUFhVEzln35YTxXs6oDjNTFem2WZAVqU5Y3dX5OlxcFoULUlKWs9zpVJdpfmGcZpnmUluUabZP3GBj1lOTpHbqeNvWmBDtm2nZ1ni95Av+YFMuJd1mM6TVE2zephjlSYnYm2FdhG4YvsS7FzsJXLwOS2ps2uRVRuWbZdCGX57VS2p1uBc97uexN2lDcnzUvT5bPK91oOOc5rnuRzzl+ftblC4YUva3T0UMw18ugzpo2hw1WdAxpdWpXHHnW3rjUp9ZO0zc3odt3lMumIbxum0DKcGalemzc5PU6fLjtC+ZdVi0l+uW9p90e8Hz3+wb9XzYNvlPXlRmpa5JjRXHb9fZVG0HDgw2rlLevd+4LW+nrYu001bxwhsHDmC1WrCzPj1JK+01ZGRMsLYudlYp2SAbTYuksM5QIxvVc2qUrY22ivbfKc8m4g0XtPLSN1dI+WkMZUWx1G7nVxvjL6ktpZRz-nQUefUOwgxchlZ6l8-pzVmnVEh4D5qQKHiQ92KMzpozyq5PyphtJ21nrw06-DLr0LsFXJyLk3IOHrlzeGXUU6wP0nHTSCdEHlUdlLSOoUdZ0B8sIvxrsU5pwcsYTO2c35hMvu1DsA0zLDzoBjPhOMLG81kJhTsZ07oPTvnlS+t0b6PXlqXOGxNyodxqqLRmxc47pw8WFPuJkMFV3BpDLKeDGEY2Ya3VhUtOwdkygZEysimp61SutAy6kxFcNSi5Kxmk7aH3MlpABIVnINQ8fUuJBtRpDW+sXSZnZplx0oWbS5Li57qxwQ3DBsd4GJyQZfXeJkNqH2Xr3e69kzI6Nzn5fO3si5NQtqvPuIcBocxcunNaG0JoYMvuPaRU9oYs07BUnmeVskVR6oowGpisbmLxuLa5WCNZmV0vLTGA1vpBWmvNQlWViWCMCdUrurCBpjykZPcZ3lvlZyMgFRyVSpmd1qd3RG5Ty6gK0jc7BmsqV6J8SI-xMCwUTVDiYE29DorBPimqpq4SpqRPITnYGFsOz9QmrTLh0MAqAtngXH2XkSFgtbvZK1FcwEGLUYPaBBNFZOLdVMnSnrgoVxHg-A2tM2orIwfKilWturyLxQDZRUrHGVImdGwOtMQ5h1Ju7bGF0SU919QPKByT5lDNjcs6aMDE13KVczHpC9+l4N7sHWmPliF5VbhEqJFCYk2TbX0peDt9UuwCXjByGV6qjV2oWzmQbibOOaqoytGjLmkxurkkpBTIqYLcQq3B2K93X3yWI2a1DQq0Ltioit6joFrNFmk0t+MXGPI8QgpO3UBbLN8plfqdlrrUMvbfEdgzV05W8VOhKATvqpQUemzeWlv2eL-S4jZFUbY9T7WE0hpqs6GxIQBtqHiMoG0aiPS1wVtKLLtcvXNLl81cLDpFBWGKZWaNau1HR0Le6HXWptEhrydX7wbZXByNja72LwWC-qg1hqjXVQsu6odImzRDacsNJsI0BJXgbQK69H7bXJvtSmR0ApsrFTUuqkqwlzzmmFeyo0BnSqVoZ-Wa9Mob0soYGyimBpDTCqplNyG01KKBpFHtpzxUOZo+IptmsktFP3Ve56Y6W5L2Zg-WZz96oe2hvdHeEmPkkOjV-UK6UbYwPdrpaaGNorLpxcUzL-bxN7wq9igD2U7bBxcmBnJEHSmIy0fxzq5UfMmb82Z0FSKeUyM5SlylnzvLu0MTbZZW1esyY9iZWesrVYnqTUq6y+V4OyygxN1G66jaOq9oXMOM9sssPqX1g7g3jL1Oc00tzrSjUXryZB8qm3RrbZMRM+pCzm4aeMHjErNL530qXWJsr3WD4Av0kC57fsd6scQaHbHelcc+2ksaaiXQ3SmRXdxrzXULuuL0u4zD66wUGwhVwqFqg2rJQWXWlZwVk5bSsTZ7JHsh5WN5qVcRt7ra23Fsohqcucl3sV1tMKMMYPKzMvz2tSyhdLUCtr+n8NVAQxScDg9T1LdtYy6D5yNkrtCyenzdLo275O5VSE6OF2Pcg7G5pOnr0Ge8y2kZW0pvAE+Q8htSyNVxHvoEWNHqTuLbGRMtpaXINIoAPMrH-aOftNbKt5Iiey3LJHMMrzi7PuDWJVlyM-SqrEogyirC6yImOxGV5pFe3nu3eyHry7OWocQ9ly8wn03ofg02xn5PufhH07EeibzOvLu5ZrJH6Ii3P7U4B3SlPcKJsO+rS7-C3b2kk9mPSWWqml2po1SlqM0DUD0O39Lb7KxgXFsV9RUslksjBNLPMsrlLTmCjQhrqoEbCkuSs2ofHrPrqvILtNMLsZAvpirrlHkJnCs5JEt-lHgPoHl7sYI-i3r7m7lHs3k7A3tHMHjQb4nQW-BdsQTbjTKoFnnTjHsAjRnYHAadnchZKXsziWinrzKFFFBFP7tyv-rIuZK3GwlVHND1CApZB5IEp3t3ltLPKnPAYqogRdrgRfvgb3utMgTGobmgcboFuFFrHzHYVHuirPmupZAwZviweQbQaPm-Eehhr+p5INBpABs-sBnNOHoFqISyqnhtKrpbOrnQlXi4vLvetpKoPVHoYIQYbzt5FofCgQaoLLjvmqmdF4UwdOhbp5O3tGosnGtYbzPwc4Yvq4THHAj+s8tDMzjMu0V4rTmwR1nnh4eHmUa3nLCDKNJkWGiAbNG-gjmXqYMiryo1FYhYbUfWofFnHER5AkXbFtCFM7hHA3uFOPpEuft3gUXVCMSEuFJbnYcHgHuwXom4QfuBiQUPpgTKp5GsowaMZ4Q8QMRPlgWVKHMHiEUBq-uAYFjUagRsbrHkaJq5FIdbIUSnJ5ubj1Dfm4k8r0XnlmjzN9B8WHisV0azgEc8f0aDvPv8Y7mQRSaUisWia4W5E5OkUYbzrIMYecb3kgZyfkb3tlM1ALlYX3EtMHC8SNm8X3uKVfJKW5FIfPoyViqCUMQyXiR9ElE0UCRzCSdiUnKZLSfobgrTKsTCegfwacVNHgT3r7HKX3AbnUSKbzKnvcdbh1hdj8ZQRIeHg0QcRQcwRqWqQjLiTrgjHZJicynfldHjFIVwoSeiczIGVUYFnaSgcKcLiscUa7tPh6f6a+q6ZSTIa8Y8e6YmfaqWV7EofEQrnQltNUUKQ6emYWRKewSse7N0WzsMTqT0X+i6UWR1sHnSV7tQeWUzv4R0XVu1GfpaSYQiplL6d4bvnbvmWNqKcEUMfPnYfwTmT4RqSqfwW2aSR0YntCcKRbqLgmSGV8aCaWUcnlF2R2aCuwlztwl1IgfwbyaYd-qieWcESOR-lid2V8btszOucqYcTufdPKWyXlJmfQVcf6bNPBTuXdP+SzrqZ5OtM8dubvgqeuZ4TcVuS7pudKe1pSRpNSWNqOW0R2SsRRQUmyXzNhddrzN+Zec8XRZ4ZqZ8dWOeCAKMEAA). Note that the complete specification is stored in the URL. You can easily share modifications with your collaborators.

<img src="{{ site.baseurl }}/static/falcon.png" style="max-width: 500px">

If you need to customize the figure beyond what is supported in Vega-Lite, you can open the compiled Vega in the editor, edit it as desired, and then continue the tutorial below.

## Export as SVG

Now that you have loaded the chart in the editor, you can export it with "Export" and then "Open SVG". We are exporting the chart as an SVG, a vector graphic format, which is infinitely scalable. You figure will be crisp even when zoomed in.

<video controls style="max-width: 700px">
  <source src="{{ site.baseurl }}/static/share.mp4" type="video/mp4">
</video>

## Print to PDF

Unfortunately, LaTeX cannot import SVGs so we must first convert it to PDF. There are many ways to convert SVGs to PDF, including using illustrator, using another image editor, using command line scripts, or printing as PDF in the browser. For this tutorial, we are going to use the printing feature of your browser; from the newly opened SVG image, select "File" and then "Print..." (or use <kbd>Cmd</kbd>+<kbd>P</kbd>) in your browser (e.g. Chrome or Firefox).

Now make sure that the destination is set to "Save as PDF" (see below). Then save the PDF in the directory of your LaTeX paper.

<img src="{{ site.baseurl }}/static/print.png" style="max-width: 700px">

## Crop the PDF

You will notice that there is a lot of white space that we want to remove because the SVG image is saved as a single printer page. If your figure is too large, you need to scale it so that the output fits on a single page. To crop the file, open the PDF file in Mac OS Preview application. Select the "Rectangular Selection" tool and draw a box around the chart. You can adjust the box until it tightly fits the chart. Then click "crop" (or use <kbd>Cmd</kbd>+<kbd>K</kbd>). Make sure to save the newly modified file!

<video controls style="max-width: 700px">
  <source src="{{ site.baseurl }}/static/crop.mp4" type="video/mp4">
</video>

## Embed the Chart

Lastly, embed the chart in the paper as a figure. In this case we named the PDF `benchmark.pdf`. Adjust the command below accordingly.

```latex
\begin{figure}
  \centering
  \includegraphics[width=\columnwidth]{benchmark}
  \caption{\label{fig:benchmark} A title that describes the figure.}
\end{figure}
```

That's it. Do you have feedback on this tutorial or suggestions? Please [create an issue on GitHub](https://github.com/vega/vega-lite/issues/new).
