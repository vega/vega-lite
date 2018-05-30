---
layout: page
description: By setting the `point` property of the line mark definition to an object defining a property of the overlaying point marks, we can overlay point markers on top of line. Here we set the point color to `"red"` and set the line color to `"green"`. 

 Notes: (1) This is equivalent to adding another layer of point marks. 
 (2) While `"point"` marks are normally semi-transparent, the overlay point marker has `opacity` = 1 by default.
title: Line Chart with Overlaying Point Markers
menu: examples
permalink: /examples/line_overlay.html
image: /examples/compiled/line_overlay.png
edit_path: _data/examples.json
---

By setting the `point` property of the line mark definition to an object defining a property of the overlaying point marks, we can overlay point markers on top of line. Here we set the point color to `"red"` and set the line color to `"green"`. 

 Notes: (1) This is equivalent to adding another layer of point marks. 
 (2) While `"point"` marks are normally semi-transparent, the overlay point marker has `opacity` = 1 by default.

{% include example.html spec='line_overlay'%}
