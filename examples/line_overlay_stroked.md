---
layout: page
description: "By setting the `point` property of the line mark definition to an object defining a property of the overlaying point marks, we can overlay point markers on top of line. Here we create stroked points by setting their `\"filled\"` to `false` and their `fill` to `\"white\"`. 

 Notes&#58; (1) This is equivalent to adding another layer of point marks. 
 (2) While `\"point\"` marks are normally semi-transparent, the overlay point marker has `opacity` = 1 by default."
title: Line Chart with Stroked Point Markers
menu: examples
permalink: /examples/line_overlay_stroked.html
image: /examples/compiled/line_overlay_stroked.png
edit_path: _data/examples.json
---

By setting the `point` property of the line mark definition to an object defining a property of the overlaying point marks, we can overlay point markers on top of line. Here we create stroked points by setting their `"filled"` to `false` and their `fill` to `"white"`. 

 Notes&#58; (1) This is equivalent to adding another layer of point marks. 
 (2) While `"point"` marks are normally semi-transparent, the overlay point marker has `opacity` = 1 by default.

{% include example.html spec='line_overlay_stroked'%}
