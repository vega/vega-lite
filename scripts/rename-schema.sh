#!/usr/bin/env bash

set -euo pipefail

perl -pi -e s,'<Field>','',g build/vega-lite-schema.json
perl -pi -e s,'<Field\,','<',g build/vega-lite-schema.json
perl -pi -e s,'<StandardType>','',g build/vega-lite-schema.json

perl -pi -e s,'CompositeEncoding','Encoding',g build/vega-lite-schema.json
perl -pi -e s,'GenericLayerSpec<UnitSpec>','LayerSpec',g build/vega-lite-schema.json # This is required as LayerSpec's own definition would depend on generic and have GenericLayerSpec<UnitSpec>, not LayerSpec
perl -pi -e s,'Generic(.*)<FacetedUnitSpec\,LayerSpec>','\1',g build/vega-lite-schema.json

perl -pi -e s,'ValueDef(.*)\<\(number\|\\\"width\\\"\)\>','XValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)\<\(number\|\\\"height\\\"\)\>','YValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)<\(string\|null\)>','StringValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)<Value>','ValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)<number>','NumberValueDef\1',g build/vega-lite-schema.json

perl -pi -e s,'Conditional<(.*)>','Conditional\1',g build/vega-lite-schema.json

perl -pi -e s,'FieldDefWithCondition<FieldDefWithoutScale>','FieldDefWithConditionWithoutScale',g build/vega-lite-schema.json
perl -pi -e s,'ValueDefWithCondition<FieldDefWithoutScale>','ValueDefWithConditionWithoutScale',g build/vega-lite-schema.json

perl -pi -e s,'LogicalComposition<string>','SelectionComposition',g build/vega-lite-schema.json
perl -pi -e s,'LogicalComposition<Predicate>','PredicateComposition',g build/vega-lite-schema.json
perl -pi -e s,'LogicalAnd<string>','SelectionAnd',g build/vega-lite-schema.json
perl -pi -e s,'LogicalOr<string>','SelectionOr',g build/vega-lite-schema.json
perl -pi -e s,'LogicalNot<string>','SelectionNot',g build/vega-lite-schema.json

perl -pi -e s,'TopLevel<(.*)>','TopLevel\1',g build/vega-lite-schema.json

perl -pi -e s,'BaseAxis<(.*)>','BaseAxisConfig',g build/vega-lite-schema.json
perl -pi -e s,'BaseTitle<(.*)>','BaseTitleConfig',g build/vega-lite-schema.json

# ENCODED version

perl -pi -e s,'%3CField%3E','',g build/vega-lite-schema.json
perl -pi -e s,'%3CField%2C','%3C',g build/vega-lite-schema.json
perl -pi -e s,'%3CStandardType%3E','',g build/vega-lite-schema.json

perl -pi -e s,'CompositeEncoding','Encoding',g build/vega-lite-schema.json
perl -pi -e s,'GenericLayerSpec%3CUnitSpec%3E','LayerSpec',g build/vega-lite-schema.json # This is required as LayerSpec's own definition would depend on generic and have GenericLayerSpec<UnitSpec>, not LayerSpec
perl -pi -e s,'Generic(.*)%3CFacetedUnitSpec%2CLayerSpec%3E','\1',g build/vega-lite-schema.json

perl -pi -e s,'ValueDef(.*)\%3C\(number%7C%22width%22\)\%3E','XValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)\%3C\(number%7C%22height%22\)\%3E','YValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)%3C\(string%7Cnull\)%3E','StringValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)%3CValue%3E','ValueDef\1',g build/vega-lite-schema.json
perl -pi -e s,'ValueDef(.*)%3Cnumber%3E','NumberValueDef\1',g build/vega-lite-schema.json

perl -pi -e s,'Conditional%3C(.*)%3E','Conditional\1',g build/vega-lite-schema.json

perl -pi -e s,'FieldDefWithCondition%3CFieldDefWithoutScale%3E','FieldDefWithConditionWithoutScale',g build/vega-lite-schema.json
perl -pi -e s,'ValueDefWithCondition%3CFieldDefWithoutScale%3E','ValueDefWithConditionWithoutScale',g build/vega-lite-schema.json

perl -pi -e s,'LogicalComposition%3Cstring%3E','SelectionComposition',g build/vega-lite-schema.json
perl -pi -e s,'LogicalComposition%3CPredicate%3E','PredicateComposition',g build/vega-lite-schema.json
perl -pi -e s,'LogicalAnd%3Cstring%3E','SelectionAnd',g build/vega-lite-schema.json
perl -pi -e s,'LogicalOr%3Cstring%3E','SelectionOr',g build/vega-lite-schema.json
perl -pi -e s,'LogicalNot%3Cstring%3E','SelectionNot',g build/vega-lite-schema.json

perl -pi -e s,'TopLevel%3C(.*)%3E','TopLevel\1',g build/vega-lite-schema.json

perl -pi -e s,'BaseAxis%3C(.*)%3E','BaseAxisConfig',g build/vega-lite-schema.json
perl -pi -e s,'BaseTitle%3C(.*)%3E','BaseTitleConfig',g build/vega-lite-schema.json
