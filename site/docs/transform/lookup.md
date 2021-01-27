---
layout: docs
menu: docs
title: Lookup Transform
permalink: /docs/lookup.html
---

The lookup transform extends a primary data source by looking up values from another data source. It is similar to a one sided join.

```js
// Any View Specification
{
  ...
  "transform": [
    {"lookup": ..., "from" ..., "as": ..., "default": ...} // Lookup Transform
     ...
  ],
  ...
}
```

## Lookup Transform

For each data object in the main data source, the transform finds matching objects in the secondary data source. An object matches if the value in the field specified by `lookup` is the same as the field specified in the `from.key`.

{% include table.html props="lookup,from,as,default" source="LookupTransform" %}

### Lookup Data

The secondary data reference (set with `from`) can be object that specifies how the lookup key should be matched to a second data source and what fields should be added.

{% include table.html props="data,key,fields" source="LookupData" %}

#### Example

This example uses `lookup` to add the properties `age` and `height` to the main data source. The `person` field in the main data source is matched to the `name` field in the secondary data source.

<span class="vl-example" data-name="lookup"></span>

### Lookup Selection

The secondary data reference (set with `from`) can also be a selection parameter name.

{% include table.html props="param" source="LookupSelection" %}

#### Example: Interactive Index Chart

<span class="vl-example" data-name="interactive_index_chart"></span>
