---
layout: docs
menu: docs
title: Tick
permalink: /docs/tick.html
---

```js
// Single View Specification
{
  "data": ... ,
  "mark": "tick",
  "encoding": ... ,
  ...
}
```

The `tick` mark represents each data point as a short line. This is a useful mark for displaying the distribution of values in a field.

<!--prettier-ignore-start-->
## Documentation Overview
{:.no_toc}

- TOC
{:toc}

<!--prettier-ignore-end-->

{:#properties}

## Tick Mark Properties

A tick mark definition can contain any [standard mark properties](mark.html#mark-def) and the following special properties:

{% include table.html props="cornerRadius,orient" source="MarkConfig" %}

## Examples

### Dot Plot

For example, the following dot plot uses tick marks to show the distribution of each car's Horsepower.

<span class="vl-example" data-name="tick_dot"></span>

### Strip Plot

<!-- TODO: better explain this -->

The following strip-plot use `tick` mark to represent its data.

<span class="vl-example" data-name="tick_strip"></span>

<!--__TODO__ Colored Tick with adjusted size and thickness-->

{:#config}

## Tick Config

```js
// Top-level View Specification
{
  ...
  "config": {
    "tick": ...,
    ...
  }
}
```

The `tick` property of the top-level [`config`](config.html) object sets the default properties for all tick marks. If [mark property encoding channels](encoding.html#mark-prop) are specified for marks, these config values will be overridden.

Besides standard [mark config properties](mark.html#config), tick config can contain the following additional properties:

{% include table.html props="bandSize,thickness" source="TickConfig" %}

#### Example Customizing Tick's Size and Thickness

<span class="vl-example" data-name="tick_dot_thickness"></span>
