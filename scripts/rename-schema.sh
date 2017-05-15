sed -i '' -e 's/GenericLayerSpec<.*..\./LayerSpec/g' build/vega-lite-schema.json
sed -i '' -e 's/GenericRepeatSpec<.*..\./RepeatSpec/g' build/vega-lite-schema.json
sed -i '' -e 's/GenericUnitSpec<Encoding<.*..\./UnitSpec/g' build/vega-lite-schema.json
sed -i '' -e 's/GenericUnitSpec<EncodingWithFacet<.*..\./FacetedUnitSpec/g' build/vega-lite-schema.json
sed -i '' -e 's/<Field>//g' build/vega-lite-schema.json
