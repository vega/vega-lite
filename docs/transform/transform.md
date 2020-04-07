---
layout: docs
menu: docs
title: Transformation
permalink: /docs/transform.html
---

Data transformations in Vega-Lite are described via either [view-level](spec.html#common) transforms (the `transform` property) or [field transforms inside `encoding`](encoding.html#field-transform) (`bin`, `timeUnit`, `aggregate`, `sort`, and `stack`).

When both types of transforms are specified, the view-level `transform`s are executed first based on the order in the array. Then the inline transforms are executed in this order: `bin`, `timeUnit`, `aggregate`, `sort`, and `stack`.

## View-level Transform Property

```js
{
  "data": ... ,
  "transform": [
     ...
  ],
  "mark": ... ,
  "encoding": ... ,
  ...
}
```

The View-level `transform` object is an array of objects describing transformations. The transformations are executed in the order in which they are specified in the array. Vega-Lite's `transform` supports the following types of transformations:

- [Aggregate](aggregate.html#transform)
- [Bin](bin.html#transform)
- [Calculate](calculate.html)
- [Density](density.html)
- [Filter](filter.html)
- [Flatten](flatten.html)
- [Fold](fold.html)
- [Impute](impute.html)
- [Join Aggregate](joinaggregate.html)
- [Lookup](lookup.html)
- [Pivot](pivot.html)
- [Quantile](quantile.html)
- [Regression](regression.html) and [Loess Regression](loess.html)
- [Sample](sample.html)
- [Stack](stack.html)
- [Time Unit](timeunit.html#transform)
- [Window](window.html)
