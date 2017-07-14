perl -pi -e s,'<Field>','',g build/vega-lite-schema.json
perl -pi -e s,'<Field\,','<',g build/vega-lite-schema.json

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

perl -pi -e s,'ValueDef<\(string\|number\|boolean\)>','TextValueDef',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef<string>','StringValueDef',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef<number>','NumberValueDef',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef<any>','ValueDef',g build/vega-lite-schema.json

perl -pi -e s,'Condition<(.*)>','Condition\1',g build/vega-lite-schema.json

perl -pi -e s,'Conditional<TextFieldDef\,TextValueDef>','ConditionalTextDef',g build/vega-lite-schema.json
perl -pi -e s,'ConditionalFieldDef<TextFieldDef\,TextValueDef>','ConditionalTextFieldDef',g build/vega-lite-schema.json
perl -pi -e s,'ConditionalValueDef<TextFieldDef\,TextValueDef>','ConditionalTextValueDef',g build/vega-lite-schema.json
perl -pi -e s,'ConditionOnlyDef<TextFieldDef\,TextValueDef>','ConditionOnlyTextDef',g build/vega-lite-schema.json

perl -pi -e s,'Conditional<LegendFieldDef\,(.*)ValueDef>','Conditional\1LegendDef',g build/vega-lite-schema.json
perl -pi -e s,'ConditionalFieldDef<LegendFieldDef\,(.*)ValueDef>','Conditional\1LegendFieldDef',g build/vega-lite-schema.json
perl -pi -e s,'ConditionalValueDef<LegendFieldDef\,(.*)ValueDef>','Conditional\1LegendValueDef',g build/vega-lite-schema.json
perl -pi -e s,'ConditionOnlyDef<LegendFieldDef\,(.*)ValueDef>','ConditionOnly\1LegendDef',g build/vega-lite-schema.json

perl -pi -e s,'LogicalOperand<string>','SelectionOperand',g build/vega-lite-schema.json
perl -pi -e s,'LogicalAnd<string>','SelectionAnd',g build/vega-lite-schema.json
perl -pi -e s,'LogicalOr<string>','SelectionOr',g build/vega-lite-schema.json
perl -pi -e s,'LogicalNot<string>','SelectionNot',g build/vega-lite-schema.json
perl -pi -e s,'LogicalOperand<Filter>','FilterOperand',g build/vega-lite-schema.json
perl -pi -e s,'LogicalAnd<Filter>','AndFilter',g build/vega-lite-schema.json
perl -pi -e s,'LogicalOr<Filter>','OrFilter',g build/vega-lite-schema.json
perl -pi -e s,'LogicalNot<Filter>','NotFilter',g build/vega-lite-schema.json
