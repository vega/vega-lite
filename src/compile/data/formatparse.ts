import {isDateTime} from '../../datetime';
import {FieldDef, isCount} from '../../fielddef';
import {isOneOfFilter, isEqualFilter, isRangeFilter} from '../../filter';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {extend, differ, keys, isArray, isNumber, isString, Dict} from '../../util';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

export namespace formatParse {
  // TODO: need to take calculate into account across levels when merging
  function parse(model: Model): Dict<string> {
    const calcFieldMap = (model.calculate() || []).reduce(function(fieldMap, formula) {
      fieldMap[formula.field] = true;
      return fieldMap;
    }, {});

    let parseComponent: Dict<string> = {};

    // Parse filter fields
    let filter = model.filter();
    if (!isArray(filter)) {
      filter = [filter];
    }
    filter.forEach((f) => {
      let val = null;
      // For EqualFilter, just use the equal property.
      // For RangeFilter and OneOfFilter, all array members should have
      // the same type, so we only use the first one.
      if (isEqualFilter(f)) {
        val = f.equal;
      } else if (isRangeFilter(f)) {
        val = f.range[0];
      } else if (isOneOfFilter(f)) {
        // in = old name (this is for backward compatability)
        val = (f.oneOf || f['in'])[0];
      } // else -- for filter expression, we can't infer anything

      if (!!val) {
        if (isDateTime(val)) {
          parseComponent[f['field']] = 'date';
        } else if (isNumber(val)) {
          parseComponent[f['field']] = 'number';
        } else if (isString(val)) {
          parseComponent[f['field']] = 'string';
        }
      }
    });

    // Parse encoded fields
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

    // Custom parse should override inferred parse
    const data = model.data();
    if (data && data.format && data.format.parse) {
      const parse = data.format.parse;
      keys(parse).forEach((field) => {
        parseComponent[field] = parse[field];
      });
    }

    return parseComponent;
  }

  export const parseUnit: (model: Model) => Dict<string> = parse;

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
