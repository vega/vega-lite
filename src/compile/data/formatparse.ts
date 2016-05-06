import {FieldDef, isCount} from '../../fielddef';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {extend, differ, Dict} from '../../util';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

export namespace formatParse {
  // TODO: need to take calculate into account across levels when merging
  function parse(model: Model): Dict<string> {
    const calcFieldMap = (model.transform().calculate || []).reduce(function(fieldMap, formula) {
      fieldMap[formula.field] = true;
      return fieldMap;
    }, {});

    let parseComponent: Dict<string> = {};
    // use forEach rather than reduce so that it can return undefined
    // if there is no parse needed
    model.forEach(function(fieldDef: FieldDef) {
      if (fieldDef.type === TEMPORAL) {
        parseComponent[fieldDef.field] = 'date';
      } else if (fieldDef.type === QUANTITATIVE) {
        if (isCount(fieldDef) || calcFieldMap[fieldDef.field]) {
          return;
        }
        parseComponent[fieldDef.field] = 'number';
      }
    });
    return parseComponent;
  }

  export const parseUnit = parse;

  // Assemble for formatParse is an identity function, no need to declare
}
