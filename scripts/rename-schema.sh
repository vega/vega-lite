perl -pi -e s,'<Field>','',g build/vega-lite-schema.json
perl -pi -e s,'<Field\,','<',g build/vega-lite-schema.json

perl -pi -e s,'FacetedCompositeUnitSpec','FacetedUnitSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericLayerSpec<CompositeUnitSpec>','LayerSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericFacetSpec<CompositeUnitSpec>','FacetedSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericRepeatSpec<CompositeUnitSpec>','RepeatSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericVConcatSpec<CompositeUnitSpec>','VConcatSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericHConcatSpec<CompositeUnitSpec>','HConcatSpec',g build/vega-lite-schema.json

perl -pi -e s,'GenericUnitSpec<EncodingWithFacet\,AnyMark>','FacetedCompositeUnitSpecAlias',g build/vega-lite-schema.json
perl -pi -e s,'GenericUnitSpec<Encoding\,AnyMark>','CompositeUnitSpecAlias',g build/vega-lite-schema.json


perl -pi -e s,'ValueDef<\(string\|number\|boolean\)>','TextValueDef',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef<string>','StringValueDef',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef<number>','NumberValueDef',g build/vega-lite-schema.json

perl -pi -e s,'Conditional<TextFieldDef\,TextValueDef>','ConditionTextDef',g build/vega-lite-schema.json
perl -pi -e s,'ConditionalFieldDef<TextFieldDef\,TextValueDef>','ConditionTextFieldDef',g build/vega-lite-schema.json
perl -pi -e s,'ConditionalValueDef<TextFieldDef\,TextValueDef>','ConditionTextValueDef',g build/vega-lite-schema.json
perl -pi -e s,'ConditionOnlyDef<TextFieldDef\,TextValueDef>','ConditionOnlyTextDef',g build/vega-lite-schema.json

perl -pi -e s,'Conditional<LegendFieldDef\,','ConditionLegendDef<',g build/vega-lite-schema.json
perl -pi -e s,'ConditionalFieldDef<LegendFieldDef\,','ConditionLegendFieldDef<',g build/vega-lite-schema.json
perl -pi -e s,'ConditionalValueDef<LegendFieldDef\,','ConditionLegendValueDef<',g build/vega-lite-schema.json
perl -pi -e s,'ConditionOnlyDef<LegendFieldDef\,','ConditionOnlyLegendDef<',g build/vega-lite-schema.json

perl -pi -e s,'LogicalOperand<string>','LogicalOperand',g build/vega-lite-schema.json
perl -pi -e s,'LogicalAnd<string>','LogicalAnd',g build/vega-lite-schema.json
perl -pi -e s,'LogicalOr<string>','LogicalOr',g build/vega-lite-schema.json
perl -pi -e s,'LogicalNot<string>','LogicalNot',g build/vega-lite-schema.json
perl -pi -e s,'LogicalOperand<Filter>','FilterOperand',g build/vega-lite-schema.json
perl -pi -e s,'LogicalAnd<Filter>','AndFilter',g build/vega-lite-schema.json
perl -pi -e s,'LogicalOr<Filter>','OrFilter',g build/vega-lite-schema.json
perl -pi -e s,'LogicalNot<Filter>','NotFilter',g build/vega-lite-schema.json
