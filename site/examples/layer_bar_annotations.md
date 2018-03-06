---
layout: page
description: To create a bar chart that highlights values beyond a threshold, we use two `layer`s of `bar` marks. The lower layer shows all the bars while the upper layer shows bar with values above the threshold in red (`#e45755`).  We then `layer` a `rule` mark and a `text` mark over the bars to annotate the threshold value.
title: Bar chart that highlights values beyond a threshold
menu: examples
permalink: /examples/layer_bar_annotations.html
image: /examples/compiled/layer_bar_annotations.png
edit_path: _data/examples.json
---

To create a bar chart that highlights values beyond a threshold, we use two `layer`s of `bar` marks. The lower layer shows all the bars while the upper layer shows bar with values above the threshold in red (`#e45755`).  We then `layer` a `rule` mark and a `text` mark over the bars to annotate the threshold value.

{% include example.html spec='layer_bar_annotations'%}
