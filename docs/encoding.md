---
layout: docs
title: Encoding
permalink: /docs/encoding.html
---

Vega-Lite's top-level `encoding` property describes a mapping between
encoding channels (such as `x`,`y`, and `color`) and [field definitions](#field-definition).
Each field definition object describes (1) a reference to the `field` name and its data `type` or a constant value (2) the field's [inline transforms](transform.html#inline) (`aggregate`, `bin`, `sort` and `timeUnit`), and (3) properties for the field's `scale`, `axis`, and `legend`.

## Encoding Channels

Vega-Lite supports the following encoding channels: `x`,`y`, `row`, `column`, `color`, `size`, `shape`, `text`, `detail`.
These channels are properties for the top-level `encoding` definition object.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| x, y          | [FieldDef](#field-definition)| Description of a field mapped to x or y coordinates (or to width or height for `bar` and `area` marks). |
| color | [FieldDef](#field-definition)| Description of a field or a constant value mapped to color.  |
| shape  | [FieldDef](#field-definition)| Description of a field or a constant value mapped to the symbol's shape.  Possible values are: `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`, or `"triangle-down"`.  (Only applicable for `point` marks.)  |
| size  | [FieldDef](#field-definition)| Description of a field or a constant value mapped to size. If `size` is not mapped to a field, default value will be provided based on mark type.    <br/> • For `text`, this property determines the font size. The default value is `10`.     <br/> • For `bar` and `tick`, this property determines the width of the mark.  For `bar`, the default size is set to `bandWidth-1` to provide 1 pixel offset between bars.  If the dimension has linear scale, the bar's default size will be `2` instead.  For `tick`, the default value is `2/3*bandWidth`. This will provide offset between band equals to the width of the tick. <br/> • For `point`, `square` and `circle`, this property determines the pixel area of the mark.  The default value is `30`. |
| detail | [FieldDef](#field-definition)| Description of a field or fields for (a) adding extra level of detail for aggregate views without mapping to a specific visual channel or (2) determining layer or stack order.  |
| row, column   | [FieldDef](#field-definition)| Description of a field that facets data into vertical and horizontal [trellis plots](https://en.wikipedia.org/wiki/Small_multiple). |

<!-- TODO: Need to expand on "(or to width or height for `bar` and `area` marks)." for x,y -->
<!-- TODO: describe more about color's behavior -- possibly link to the scale page -->

<div id="def"></div>
## Field Definition

Here is a list of properties for the field definition object:

### Field, Value and Type

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| field         | String        | Name of the field from which to pull a data value.    |
| value         | String &#124; Integer | A constant value. |
| type          | String        | Data type of the field.  This property accepts both a full type name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`), or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).  This property is case insensitive.|

### Inline Transforms

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [bin](transform.html#bin) | Boolean &#124; Object        | Boolean flag / configuration object for binning.   |
| [timeUnit](transform.html#timeunit)| String        | Property for converting time unit.            |
| [aggregate](transform.html#aggregate) | String        | Aggregation function for the field (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).  |
| [sort](transform.html#sort) | String &#124; Object        | Sort order for a particular field.  This can be string (`"ascending"`, `"descending"`, or `"unsorted"`) or a sort field definition object for sorting by an aggregate calculation of a specified sort field.  If unspecified, the default value is `ascending`.  See [Sort](#sort) section for more information. |

For more information about these transforms, please look at [inline transforms section in the transformation page](transform.html#inline).


### Scale, Axis and Legend

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| [scale](#scale)      | Object        | Configuration object for the encoding's scale.   |
| [axis](#axis)        | Object        | Configuration object for the encoding's axis.    |
| [legend](#legend)    | Boolean &#124; Object  | Boolean flag for showing legend (`true` by default), or a configuration object for the encoding's legends. |

--------

#### Example: Setting Color and Shape of a Scatter Plot

You can set `color` and `shape` of a scatter plot to constant values.

```js
{
  "data": {"url": "data/cars.json"},
  "mark": "point",
  "encoding": {
    "x": {"field": "Horsepower","type": "quantitative"},
    "y": {"field": "Miles_per_Gallon","type": "quantitative"},
    "color": {"value": "#ff9900"},
    "shape": {"value": "square"}
  }
}
```

<script>
vg.embed('#scatter_color_shape_constant', {
  mode: 'vega-lite',
  spec: {
    "data": {"url": "../data/cars.json"},
    "mark": "point",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {"value": "#ff9900"},
      "shape": {"value": "square"}
    }
  }
});
</script>
<div id="scatter_color_shape_constant"></div>

Also, see [this example for mapping fields to color and shape](mark.html#ex-scatter_color_shape).

<!-- linked from another page do not remove this "a" tag-->
<a id="ex-bar-size"></a>

#### Example: Setting Bar's size

By default, there will be 1 pixel offset between bars.  
Specifying `size`' `value` will adjust the bar's width.  
The following example sets the width to 10 to add more offset between bars.  

```js
{
  "description": "A bar chart showing the US population distribution of age groups in 2000.",
  "data": { "url": "data/population.json"},
  "transform": {
    "filter": "datum.year == 2000"
  },
  "mark": "bar",
  "encoding": {
    "y": {
      "aggregate": "sum", "field": "people", "type": "quantitative",
      "axis": {"title": "population"}
    },
    "x": {
      "field": "age", "type": "ordinal",
      "scale": {"bandWidth": 17}
    },
    "size": {"value": 10}
  }
}
```
<script>
vg.embed('#bar_aggregate_size', {
  mode: 'vega-lite',
  spec: {
    "description": "A bar chart showing the US population distribution of age groups in 2000.",
    "data": { "url": "../data/population.json"},
    "transform": {
      "filter": "datum.year == 2000"
    },
    "mark": "bar",
    "encoding": {
      "y": {"field": "people", "type": "quantitative", "aggregate": "sum", "axis": {"title": "population"}},
      "x": {"field": "age", "type": "ordinal", "scale": {"bandWidth": 17}}
    },
    "size": {"value": 10}
  }
});
</script>
<div id="bar_aggregate_size"></div>

#### Example: Detail

TODO: Grouping for line and area
<!-- Additional measure / groupby for aggregation -->
<!-- Layer order -->


<!-- TODO: tooltips, labels -->
