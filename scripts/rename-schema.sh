perl -pi -e s,'GenericLayerSpec<.*>','LayerSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericRepeatSpec<.*>','RepeatSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericUnitSpec<EncodingWithFacet<.*>','FacetedUnitSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericUnitSpec<Encoding<.*>','UnitSpec',g build/vega-lite-schema.json
perl -pi -e s,'<Field>',,g build/vega-lite-schema.json
