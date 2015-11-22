---
layout: docs
title: Config
permalink: /docs/config.html
---

## Layout

### Facet Layout

__Coming Soon!__

### Stack Layout

When either `"bar"` or `"area"` mark type is used with either `"color"` or `"detail"`
channel, a stacked (bar or area) chart is automatically created.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| _stack_       | String        | `stack` can be used to customize stacking behavior in Vega-Lite.  If `"stack"` is `false`, stacking is disabled.  Otherwise, if `"stack"` is either `true` or a stack property object, stacking is enabled.|


#### Stack Config Object

A stack property object contains the following properties for customizing:

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| _stack.offset_ | String        | The baseline offset style. One of `"zero"` (default), `"center"` <!--, or `"normalize"` -->. The `"center"` offset will center the stacks. The `"normalize"` offset will compute percentage values for each stack point; the output values will be in the range [0,1].|
| _stack.sort_ | String &#124; Array<field> | Order of the stack.  This can be either a string (either "descending" or "ascending") or a list of fields to determine the order of stack layers.By default, stack uses descending order. |


## Other Config

__Coming Soon!__
