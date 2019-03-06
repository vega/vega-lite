## New Features & Enhancements 

- Migrated to Vega 5 

- Multi-View Composition 
  - Support for wrapped `facet`, `concat`, and `repeat`
  - Add `config` for `facet`, `concat`, and `repeat`
  - Single-View specifications with `row`/`column` channels (for faceting) now support `resolve`
  - Improve default layouts

- Composite Marks
  - New `boxplot` and `errorbar` marks

- Sorting
  - Make sort `"op"` optional and make `"mean"` the default op (#4475)
  - Support sorting by another encoding (#4478)

- Interactions
  - Support `init`ializing selection (#4139)

- Scale & Guides
  - Support binning and schemes for all continuous scales.
  - Add `rect/barBandPaddingInner/Outer` to `config.scale`
  - Change default scale `rangeStep` to `20` to makes bar boundaries fall on full pixels.
  - Improve default point size range for binned scatterplot
  - Improve axis format and . layout (`minExtent` is no longer set by default)
  - Revise default `legendDirection` and `gradientLength`
  - Change default color interpolation for continuous scales to `hcl`
  - Add support for quantize, quantile, and threshold scales (by @sirahd)
  - New axis and legend properties from Vega 4 & 5 (Thanks by @melissatdiamond)
  - Changes: `maxTitleLength` is now `titleLimit` (**Breaking Changes**)
  - More customization support for `header` properties

-  Encoding / Mark Properties
  - Add `fill/strokeOpacity` and `strokeWidth` channels
  - `x`, `y`, `x2`, `y` now work in `mark` definition and `config`  
  - Added `view` as a property for Layer and Unit specs for customizing view background
  - Make tooltip include all fields in encoding by default.  
  
- Data Transform
  - New transforms -- Thanks @invokesus
    - `joinaggregate` 
    - `flatten`
    - `fold`
    - `impute`
    - `sample`
    - `stack`
  - Add `monthdatehours` time unit
  - Add filter for valid fields
  - Better support for pre-binned data (by @sirahd)
 

- Update CLI. Support vl2pdf and make API consistent with vg2*. (#4480)


## New Examples and Tutorials

- [Bar chart with highlighting on hover and selection on click](https://vega.github.io/vega-lite/examples/interactive_bar_select_highlight.html)

- [Multi Series Line Chart with Tooltip](
https://vega.github.io/vega-lite/examples/interactive_multi_line_tooltip.html)

- New Emoji IsoType Bar Chart (by @chanwutk)

- TODO: highlight cool new examples 

- Paper figure tutorial (#4189)


## JSON Schema Changes

- Eliminate Vg prefixes from the JSON schema (#4453)
- Refactor to distinguish `NormalizedUnitSpec` and `CompositeUnitSpec`
- `x2/y2/latitude2/longitude2` channels no longer need `type` and `bin`
- Decouple `CompositeUnitSpec` from normal `UnitSpec`



