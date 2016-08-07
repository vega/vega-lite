import {FieldDef, isCount} from '../../fielddef';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {extend, Dict, forEach} from '../../util';
import {DataComponent} from './data';

import {FacetModel} from './../facet';
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

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    const formatComponent = parse(model);
    const childDataComponent = model.child().component.data;

    extend(formatComponent, childDataComponent.formatParse);
    delete childDataComponent.formatParse;

    return formatComponent;
  }

  /**
   * Merge the format parse from the parent and all components into parent.
   * Returns whether parse is compatible. It is defined to be compatible if no
   * child defines a parse that differens from any other.
   *
   * Format parse is only merged up if the parent either does not define a parse or the same parse.
   */
  export function merge(dataComponent: DataComponent, childDataComponents: DataComponent[]) {
    let compatible = true;
    childDataComponents.reduce((collector, childData) => {
      if (childData.formatParse) {
        forEach(childData.formatParse, (parse, field) => {
          if (parse === collector[field] || collector[field] === undefined) {
            collector[field] = parse;
            delete childData.formatParse[field];
          } else {
            compatible = false;
          }
        });
      }
      return collector;
    }, dataComponent.formatParse);
    return compatible;
  }

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
