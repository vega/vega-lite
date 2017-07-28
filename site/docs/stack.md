---
layout: docs
title: Stack
permalink: /docs/stack.html
---
<!-- TODO: Intro for stack -->

#### Example: Stack
Here is an example of stack area with `normalize`:
<div class="vl-example" data-name="stacked_area_normalize"></div>

And this example has a stack value of `center`:
<div class="vl-example" data-name="stacked_area_stream"></div>

Another example is to have a stack value of `none`:
<div class="vl-example" data-name="bar_layered_transparent"></div>


{:#ex-order}
#### Example: Sorting Stack Order

Given a stacked bar chart:

<div class="vl-example" data-name="stacked_bar_h"></div>

By default, the stacked bar are sorted by the stack grouping fields (`color` in this example).

Mapping the sum of yield to `order` channel will sort the layer of stacked bar by the sum of yield instead.

<div class="vl-example" data-name="stacked_bar_h_order"></div>

Here we can see that site with higher yields for each type of barley are put on the top of the stack (rightmost).