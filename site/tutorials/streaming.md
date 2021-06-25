---
layout: tutorials
menu: tutorials
title: Streaming Data
permalink: /tutorials/streaming.html
---

In this tutorial, you'll learn how to stream new data in a Vega-Lite visualization. If you are not familiar with Vega-Lite, please read the [getting started tutorial]({{site.baseurl}}/tutorials/getting_started.html) first.

We will be using the `View` API from the Vega, where we update data via the [`change`](https://vega.github.io/vega/docs/api/view/#data) method. Data in Vega and Vega-Lite is updated either via interactions, or by specifying the data changes directly. In both cases, the data is pushed through the Vega runtime for optimized performance. This tutorial focuses on the latter for streaming data, where no user interaction is involved.

<div id="chart"></div>

To use `view.change`, you have to first specify the name of the data source you are updating: `view.change('data', ... )`. The name needs to be specified in the original spec, as described [here]({{site.baseurl}}/docs/data.html#named). As the second parameter to the `view.change` method, you should specify what data to add, and what data to remove. To add data, simply supply the array of data entries matching previous schemas, for the example here, it is:

```js
{
  "x": number,
  "y": number,
  "category": number
}
```

As for removing data points, you could either supply the actual data points to be removed similar to the insert above (which requires your storing the data), or you could filter existing rendered data by some attributes and pass the predicate to the `remove()` function, such as in this case `function (t) { return t.x < minimumX; }`. If you are familiar with D3, this `insert` and `remove` pattern is similar to the [enter exit](https://bost.ocks.org/mike/circles/#entering) pattern.

Putting it together, we have:

```js
var changeSet = vega
  .changeset()
  .insert(valueGenerator())
  .remove(function (t) {
    return t.x < minimumX;
  });
view.change('table', changeSet).run();
```

The view is given to us by the [embed](https://github.com/vega/vega-embed) method, which helps load Vega/Vega-Lite specs on your webpages. When `embed` completes successfully, `embed` returns a fulfilled [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) with an object containing the `view`, which is how we could access the `view.change` mentioned earlier, and `spec`, which is the compiled Vega spec from the original Vega-Lite spec given. When `embed` fails, it returns a rejected [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) with an error object.

For simplicity, we have generated some data to simulate real time data updates, but the code could easily be swapped with a server data request. In the example, the "real time" is being simulated by `window.setInterval` that triggers `view.change` periodically.

Below is the JavaScript code to run this example. Make sure your html contains a div with id `'chart'`.

```js
var vlSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {name: 'table'},
  width: 400,
  mark: 'line',
  encoding: {
    x: {field: 'x', type: 'quantitative', scale: {zero: false}},
    y: {field: 'y', type: 'quantitative'},
    color: {field: 'category', type: 'nominal'}
  }
};
vegaEmbed('#chart', vlSpec).then(function (res) {
  /**
   * Generates a new tuple with random walk.
   */
  function newGenerator() {
    var counter = -1;
    var previousY = [5, 5, 5, 5];
    return function () {
      counter++;
      var newVals = previousY.map(function (v, c) {
        return {
          x: counter,
          y: v + Math.round(Math.random() * 10 - c * 3),
          category: c
        };
      });
      previousY = newVals.map(function (v) {
        return v.y;
      });
      return newVals;
    };
  }

  var valueGenerator = newGenerator();
  var minimumX = -100;
  window.setInterval(function () {
    minimumX++;
    var changeSet = vega
      .changeset()
      .insert(valueGenerator())
      .remove(function (t) {
        return t.x < minimumX;
      });
    res.view.change('table', changeSet).run();
  }, 1000);
});
```

New data may change the layout but Vega does not always resize the chart. Because of this optimization, your axes may be clipped off for example. To resolve this issue, you need to configure [autosize](https://vega.github.io/vega-lite/docs/size.html#autosize) or explicitly use [view.resize](https://vega.github.io/vega/docs/api/view/#view_resize) to resize when the data updates.

This is the end of this tutorial where you learned how to stream new data into your chart. If you want to use Vega-Lite with websockets, check out the [Vega-Lite with websockets](https://bl.ocks.org/domoritz/8e1e4da185e1a32c7e54934732a8d3d5) demo. You can find more visualizations in the [gallery]({{site.baseurl}}/examples/). If you want to further customize your charts, please read the [documentation]({{site.baseurl}}/docs/).

<script>
  window.onload = () => window.runStreamingExample('#chart');
</script>
