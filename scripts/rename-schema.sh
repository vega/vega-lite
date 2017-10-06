perl -pi -e s,'<\(string\|RepeatRef\)>','',g build/vega-lite-schema.json
perl -pi -e s,'<\(string\|RepeatRef\)\,','<',g build/vega-lite-schema.json

perl -pi -e s,'GenericSpec<CompositeUnitSpec>','Spec',g build/vega-lite-schema.json
perl -pi -e s,'FacetedCompositeUnitSpec','FacetedUnitSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericLayerSpec<CompositeUnitSpec>','LayerSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericFacetSpec<CompositeUnitSpec>','FacetedSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericRepeatSpec<CompositeUnitSpec>','RepeatSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericVConcatSpec<CompositeUnitSpec>','VConcatSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericHConcatSpec<CompositeUnitSpec>','HConcatSpec',g build/vega-lite-schema.json

perl -pi -e s,'GenericUnitSpec<EncodingWithFacet\,AnyMark>','FacetedCompositeUnitSpecAlias',g build/vega-lite-schema.json
perl -pi -e s,'GenericUnitSpec<Encoding\,AnyMark>','CompositeUnitSpecAlias',g build/vega-lite-schema.json

perl -pi -e s,'TopLevel<(.*)>','TopLevel\1',g build/vega-lite-schema.json
perl -pi -e s,'Condition<(.*)>','Condition\1',g build/vega-lite-schema.json

perl -pi -e s,'ConditionalFieldDef<TextFieldDef\>','ConditionalTextFieldDef',g build/vega-lite-schema.json
perl -pi -e s,'ConditionalValueDef<TextFieldDef\>','ConditionalTextValueDef',g build/vega-lite-schema.json
perl -pi -e s,'ConditionOnlyDef<TextFieldDef>','ConditionOnlyTextDef',g build/vega-lite-schema.json

perl -pi -e s,'ConditionalFieldDef<LegendFieldDef\>','ConditionalLegendFieldDef',g build/vega-lite-schema.json
perl -pi -e s,'ConditionalValueDef<LegendFieldDef\>','ConditionalLegendValueDef',g build/vega-lite-schema.json
perl -pi -e s,'ConditionOnlyDef<LegendFieldDef\>','ConditionOnlyLegendDef',g build/vega-lite-schema.json

perl -pi -e s,'LogicalOperand<string>','SelectionOperand',g build/vega-lite-schema.json
perl -pi -e s,'LogicalAnd<string>','SelectionAnd',g build/vega-lite-schema.json
perl -pi -e s,'LogicalOr<string>','SelectionOr',g build/vega-lite-schema.json
perl -pi -e s,'LogicalNot<string>','SelectionNot',g build/vega-lite-schema.json
perl -pi -e s,'LogicalOperand<Filter>','FilterOperand',g build/vega-lite-schema.json
perl -pi -e s,'LogicalAnd<Filter>','AndFilter',g build/vega-lite-schema.json
perl -pi -e s,'LogicalOr<Filter>','OrFilter',g build/vega-lite-schema.json
perl -pi -e s,'LogicalNot<Filter>','NotFilter',g build/vega-lite-schema.json
