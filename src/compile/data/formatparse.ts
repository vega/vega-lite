import {FieldDef, isCount} from '../../fielddef';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {extend, differ, Dict, forEach} from '../../util';
import {DataComponent} from './data';

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
      } else {
        // the field should not be parsed
        parseComponent[fieldDef.field] = null;
      }
    });
    return parseComponent;
  }

  /**
   * Merge the format parse from the parent and all components into parent.
   *
   * Format parse is only merged up if the parent either does not define a parse or the same parse.
   */
  export function merge(dataComponent: DataComponent, childDataComponents: DataComponent[]) {
    childDataComponents.reduce((collector, data) => {
      if (data.formatParse) {
        forEach(data.formatParse, (parse, field) => {
          if (parse === collector[field] || collector[field] === undefined) {
            collector[field] = parse;
            delete data.formatParse[field];
          }
        });
      }
      return collector;
    }, dataComponent.formatParse);
  }

  export const parseUnit = parse;

  /**
   * Assemble only removes null because we only used it to indicate that a field should not be parsed.
   */
  export function assemble(component: DataComponent) {
    const parse = component.formatParse;
    forEach(parse, (type, field) => {
      if (type === null) {
        delete parse[field];
      }
    });
    return parse;
  }
}
