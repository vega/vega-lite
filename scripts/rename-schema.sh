#!/usr/bin/env bash

perl -pi -e s,'<\(string\|RepeatRef\)>','',g build/vega-lite-schema.json
perl -pi -e s,'<\(string\|RepeatRef\)\,','<',g build/vega-lite-schema.json

perl -pi -e s,'FacetedCompositeUnitSpec','FacetedUnitSpec',g build/vega-lite-schema.json
perl -pi -e s,'ExtendedLayerSpec','LayerSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericLayerSpec<CompositeUnitSpec>','LayerSpec',g build/vega-lite-schema.json
perl -pi -e s,'Generic(.*)<FacetedUnitSpec\,LayerSpec>','\1',g build/vega-lite-schema.json

perl -pi -e s,'GenericUnitSpec<EncodingWithFacet\,AnyMark>','FacetedCompositeUnitSpecAlias',g build/vega-lite-schema.json
perl -pi -e s,'GenericUnitSpec<Encoding\,AnyMark>','CompositeUnitSpecAlias',g build/vega-lite-schema.json

perl -pi -e s,'Conditional<(.*)>','Conditional\1',g build/vega-lite-schema.json

perl -pi -e s,'FieldDefWithCondition<FieldDef>','FieldDefWithCondition',g build/vega-lite-schema.json
perl -pi -e s,'ValueDefWithCondition<FieldDef>','ValueDefWithCondition',g build/vega-lite-schema.json

perl -pi -e s,'FieldDefWithCondition<TextFieldDef>','TextFieldDefWithCondition',g build/vega-lite-schema.json
perl -pi -e s,'ValueDefWithCondition<TextFieldDef>','TextValueDefWithCondition',g build/vega-lite-schema.json

perl -pi -e s,'FieldDefWithCondition<MarkPropFieldDef>','MarkPropFieldDefWithCondition',g build/vega-lite-schema.json
perl -pi -e s,'ValueDefWithCondition<MarkPropFieldDef>','MarkPropValueDefWithCondition',g build/vega-lite-schema.json

perl -pi -e s,'LogicalOperand<string>','SelectionOperand',g build/vega-lite-schema.json
perl -pi -e s,'LogicalAnd<string>','SelectionAnd',g build/vega-lite-schema.json
perl -pi -e s,'LogicalOr<string>','SelectionOr',g build/vega-lite-schema.json
perl -pi -e s,'LogicalNot<string>','SelectionNot',g build/vega-lite-schema.json

perl -pi -e s,'TopLevel<(.*)>','TopLevel\1',g build/vega-lite-schema.json

perl -pi -e s,'BaseAxis<(.*)>','VgAxisConfig',g build/vega-lite-schema.json
perl -pi -e s,'BaseTitle<(.*)>','VgTitleConfig',g build/vega-lite-schema.json
