---
layout: docs
menu: docs
title: Sample
permalink: /docs/sample.html
---

The sample transform filters random rows from the data source to reduce its size. As input data objects are added and removed, the sampled values may change in first-in, first-out manner. This transform uses [reservoir sampling](https://en.wikipedia.org/wiki/Reservoir_sampling) to maintain a representative sample of the stream.

```js
// Any View Specification
{
  ...
  "transform": [
    {"sample": ...} // Sample Transform
     ...
  ],
  ...
}
```

## Sample Transform Definition

{% include table.html props="sample" source="SampleTransform" %}

## Usage

```json
{"sample": 500}
```

Filters a data stream to a random sample of at most 500 data objects.

## Example

Comparison between plots of the complete data and sampled data.

<div class="vl-example" data-name="sample_scatterplot"></div>
