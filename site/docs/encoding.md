---
layout: docs
menu: docs
title: Encoding
permalink: /docs/encoding.html
---

An integral part of the data visualization process is encoding data with visual properties of graphical marks. Vega-Lite's top-level `encoding` property represents key-value mappings between [encoding channels](#channels) (such as `x`, `y`, or `color`) and its [definition object](#def), which describes the encoded [data field](#field) or [constant value](#value), and the channel's [scale and guide (axis or legend)](#scale-and-guide).

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": ... ,
  "encoding": {     // Encoding
    "column": ...,
    "row": ...,
    "x": ...,
    "y": ...,
    "color": ...,
    "opacity": ...,
    "size": ...,
    "shape": ...,
    "text": ...,
    "tooltip": ...,
    "detail": ...
  },
  ...
}
```

* TOC
{:toc}
