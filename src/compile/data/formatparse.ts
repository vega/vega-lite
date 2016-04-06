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

  export function parseFacet(model: FacetModel) {
    let parseComponent = parse(model);

    // If child doesn't have its own data source, but has its own parse, then merge
    const childDataComponent = model.child().component.data;
    if (!childDataComponent.source && childDataComponent.formatParse) {
      extend(parseComponent, childDataComponent.formatParse);
      delete childDataComponent.formatParse;
    }
    return parseComponent;
  }

  export function parseLayer(model: LayerModel) {
    // note that we run this before source.parseLayer
    let parseComponent = parse(model);
    model.children().forEach((child) => {
      const childDataComponent = child.component.data;
      if (model.compatibleSource(child) && !differ(childDataComponent.formatParse, parseComponent)) {
        // merge parse up if the child does not have an incompatible parse
        extend(parseComponent, childDataComponent.formatParse);
        delete childDataComponent.formatParse;
      }
    });
    return parseComponent;
  }

  // Assemble for formatParse is an identity function, no need to declare
}
