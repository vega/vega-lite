#!/usr/bin/env bash

perl -pi -e s,'<\(string\|RepeatRef\)>','',g build/Vegemite-schema.json
perl -pi -e s,'<\(string\|RepeatRef\)\,','<',g build/Vegemite-schema.json

perl -pi -e s,'FacetedCompositeUnitSpec','FacetedUnitSpec',g build/Vegemite-schema.json
perl -pi -e s,'ExtendedLayerSpec','LayerSpec',g build/Vegemite-schema.json
perl -pi -e s,'GenericLayerSpec<CompositeUnitSpec>','LayerSpec',g build/Vegemite-schema.json
perl -pi -e s,'Generic(.*)<CompositeUnitSpec\,LayerSpec>','\1',g build/Vegemite-schema.json

perl -pi -e s,'GenericUnitSpec<EncodingWithFacet\,AnyMark>','FacetedCompositeUnitSpecAlias',g build/Vegemite-schema.json
perl -pi -e s,'GenericUnitSpec<Encoding\,AnyMark>','CompositeUnitSpecAlias',g build/Vegemite-schema.json

perl -pi -e s,'Conditional<(.*)>','Conditional\1',g build/Vegemite-schema.json

perl -pi -e s,'FieldDefWithCondition<FieldDef>','FieldDefWithCondition',g build/Vegemite-schema.json
perl -pi -e s,'ValueDefWithCondition<FieldDef>','ValueDefWithCondition',g build/Vegemite-schema.json

perl -pi -e s,'FieldDefWithCondition<TextFieldDef>','TextFieldDefWithCondition',g build/Vegemite-schema.json
perl -pi -e s,'ValueDefWithCondition<TextFieldDef>','TextValueDefWithCondition',g build/Vegemite-schema.json

perl -pi -e s,'FieldDefWithCondition<MarkPropFieldDef>','MarkPropFieldDefWithCondition',g build/Vegemite-schema.json
perl -pi -e s,'ValueDefWithCondition<MarkPropFieldDef>','MarkPropValueDefWithCondition',g build/Vegemite-schema.json

perl -pi -e s,'LogicalOperand<string>','SelectionOperand',g build/Vegemite-schema.json
perl -pi -e s,'LogicalAnd<string>','SelectionAnd',g build/Vegemite-schema.json
perl -pi -e s,'LogicalOr<string>','SelectionOr',g build/Vegemite-schema.json
perl -pi -e s,'LogicalNot<string>','SelectionNot',g build/Vegemite-schema.json

perl -pi -e s,'TopLevel<(.*)>','TopLevel\1',g build/Vegemite-schema.json
