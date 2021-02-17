---
layout: usage
menu: usage
title: Vega-Lite and Typescript
permalink: /usage/typescript.html
---

Vega-Lite is written in [TypeScript](https://www.typescriptlang.org). You can use the types provided by Vega-Lite to type check your specifications and the compiler API.

The main function for Vega-Lite is [`compile`](compile.html). Vega-Lite directly exports this function. The first argument to `compile` is a [Vega-Lite specification]({{ site.baseurl }}/docs/spec.html) of type `TopLevelSpec`. You can use the type, which Vega-Lite directly exports, to type check your specification. Vega-Lite also exports a type `Config` for the [Vega-Lite configuration]({{ site.baseurl }}/docs/config.html).

Below is a short code snippet that uses the `compile` function and the various types exported by Vega-Lite.

```ts
import {Config, TopLevelSpec, compile} from 'vega-lite';

const vegaLiteSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: [
      {a: 'A', b: 28},
      {a: 'B', b: 55},
      {a: 'C', b: 43},
      {a: 'D', b: 91},
      {a: 'E', b: 81},
      {a: 'F', b: 53},
      {a: 'G', b: 19},
      {a: 'H', b: 87},
      {a: 'I', b: 52}
    ]
  },
  mark: 'bar',
  encoding: {
    x: {field: 'a', type: 'nominal', axis: {labelAngle: 0}},
    y: {field: 'b', type: 'quantitative'}
  }
};

const config: Config = {
  bar: {
    color: 'firebrick'
  }
};

const vegaSpec = compile(vegaLiteSpec, {config}).spec;
```
