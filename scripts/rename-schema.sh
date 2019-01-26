#!/usr/bin/env bash

perl -pi -e s,'<Field>','',g build/vega-lite-schema.json
perl -pi -e s,'<Field\,','<',g build/vega-lite-schema.json
perl -pi -e s,'<StandardType>','',g build/vega-lite-schema.json

perl -pi -e s,'FacetedCompositeUnitSpec','FacetedUnitSpec',g build/vega-lite-schema.json
perl -pi -e s,'ExtendedLayerSpec','LayerSpec',g build/vega-lite-schema.json
perl -pi -e s,'GenericLayerSpec<CompositeUnitSpec>','LayerSpec',g build/vega-lite-schema.json
perl -pi -e s,'Generic(.*)<FacetedUnitSpec\,LayerSpec>','\1',g build/vega-lite-schema.json

perl -pi -e s,'GenericUnitSpec<EncodingWithFacet\,AnyMark>','FacetedCompositeUnitSpecAlias',g build/vega-lite-schema.json
perl -pi -e s,'GenericUnitSpec<Encoding\,AnyMark>','CompositeUnitSpecAlias',g build/vega-lite-schema.json

perl -pi -e s,'FieldDefWithoutScale','FieldDef',g build/vega-lite-schema.json

perl -pi -e s,'ValueDef(.*)\<\(number\|\\\"width\\\"\)\>','XValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)\<\(number\|\\\"height\\\"\)\>','YValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)<\(string\|null\)>','ColorValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)<\(string\|number\|boolean\)>','TextValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)<string>','StringValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)<number>','NumberValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)<\(number\|string\|boolean\|null\)>','ValueDef\1',g build/vega-lite-schema.json

perl -pi -e s,'Conditional<(.*)>','Conditional\1',g build/vega-lite-schema.json

perl -pi -e s,'FieldDefWithCondition<FieldDef>','FieldDefWithCondition',g build/vega-lite-schema.json
perl -pi -e s,'ValueDefWithCondition<FieldDef>','ValueDefWithCondition',g build/vega-lite-schema.json

perl -pi -e s,'LogicalOperand<string>','SelectionOperand',g build/vega-lite-schema.json
perl -pi -e s,'LogicalAnd<string>','SelectionAnd',g build/vega-lite-schema.json
perl -pi -e s,'LogicalOr<string>','SelectionOr',g build/vega-lite-schema.json
perl -pi -e s,'LogicalNot<string>','SelectionNot',g build/vega-lite-schema.json

perl -pi -e s,'TopLevel<(.*)>','TopLevel\1',g build/vega-lite-schema.json

perl -pi -e s,'BaseAxis<(.*)>','BaseAxisConfig',g build/vega-lite-schema.json
perl -pi -e s,'BaseTitle<(.*)>','BaseTitleConfig',g build/vega-lite-schema.json
