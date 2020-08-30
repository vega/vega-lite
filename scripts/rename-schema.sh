#!/usr/bin/env bash

set -euo pipefail

perl -pi -e s,'<Field>','',g build/vega-lite-schema.json
perl -pi -e s,'<Field\,','<',g build/vega-lite-schema.json
perl -pi -e s,'<StandardType>','',g build/vega-lite-schema.json
perl -pi -e s,'<ExprRef>','',g build/vega-lite-schema.json
perl -pi -e s,'\,ExprRef>','>',g build/vega-lite-schema.json

perl -pi -e s,'CompositeEncoding','Encoding',g build/vega-lite-schema.json
perl -pi -e s,'Generic(.*)<FacetedUnitSpec\,LayerSpec\,?.*\,FieldName>','\1',g build/vega-lite-schema.json
perl -pi -e s,'Generic(.*)<FacetedUnitSpec\,LayerSpec\,?.*\,Field>','Normalized\1',g build/vega-lite-schema.json

perl -pi -e s,'ValueDef(.*)<Value>','ValueDef\1',g build/vega-lite-schema.json
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
