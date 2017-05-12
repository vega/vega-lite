sed -i '' 's/GenericLayerSpec<.*..\./LayerSpec/g' build/vega-lite-schema.json
sed -i '' 's/GenericRepeatSpec<.*..\./RepeatSpec/g' build/vega-lite-schema.json
sed -i '' 's/GenericUnitSpec<Encoding<.*..\./UnitSpec/g' build/vega-lite-schema.json
sed -i '' 's/GenericUnitSpec<EncodingWithFacet<.*..\./FacetedUnitSpec/g' build/vega-lite-schema.json
sed -i '' 's/<Field>//g' build/vega-lite-schema.json
