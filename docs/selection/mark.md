---
layout: docs
menu: docs
title: Customizing Selection Mark
permalink: /docs/selection-mark.html
---

Every interval selection also adds a rectangle mark to the visualization, to depict the extents of the selected region. The appearance of this mark can be customized with the following properties, specified under `mark`.

{% include table.html props="fill,fillOpacity,stroke,strokeOpacity,strokeWidth,strokeDash,strokeDashOffset" source="BrushConfig" %}

## Examples

For example, the spec below imagines two users, Alex and Morgan, who can each drag out an interval selection. To prevent collision between the two selections, Morgan must press the shift key while dragging out their interval (while Alex must not). Morgan's interval is depicted with the default grey rectangle, and Morgan's with a customized red rectangle.

<div class="vl-example" data-name="selection_interval_mark_style"></div>
