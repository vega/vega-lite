---
layout: docs
menu: docs
title: Callout
permalink: /docs/callout.html
---

`callout` composite mark represents a annotation with a line and label.

To create a callout, we can set `mark` to `"callout"`:

{: .suppress-error}
```json
{
  ...
  "mark": "callout",
  ...
}
```

Alternatively, you can use callout's mark definition object, which supports the following properties:

{% include table.html props="angle,lineOffset,lineLength,labelOffset" source="CalloutDef" %}

## Basic Usage
A simple callout plot annotating one point with default configurations looks like the following:
<div class="vl-example" data-name="callout_simple_default"></div>

Aggregation can be specified to annotate multiple points.
<div class="vl-example" data-name="callout_aggregate_default"></div>


## Customizing Callout
To customize callout, we can set callout's mark definition object.
{: .suppress-error}
```json
{
  ...
  "mark": {
    "type": "callout",
    "angle": ...,
    "lineOffset": ...,
    "lineLength": ...,
    "labelOffset": ...
  }
  ...
}
```
An example of a callout plot where we customize the callout by setting `angle` to `90` and `labelOffset` to `5`
<div class="vl-example" data-name="callout_vertical"></div>
