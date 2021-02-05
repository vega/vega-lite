---
layout: docs
menu: docs
title: Parameter / Interaction
permalink: /docs/parameter.html
---

Parameters (`params`) are dynamic variables that can parameterize a visualization, for example to define a mark property.

## Parameter Properties

Parameters can have the following properties:

{% include table.html props="name,description,value,expr,bind" source="Parameter" %}

### Example: Constant Parameter

We can define a parameter as a constant variable in a specification. For example, here we define a `cornerRadius` parameter:

<div class="vl-example" data-name="bar_params"></div>

### Example: Binding Parameter

We can also bind a parameter to input elements to create dynamic query widgets. For example, here we include widgets to customize bar mark's corner radius:

<div class="vl-example" data-name="bar_params_bound"></div>
