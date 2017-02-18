import {DataComponentCompiler} from './base';

import {isDateTime, DateTime} from '../../datetime';
import {isUrlData} from '../../data';
import {FieldDef, isCount} from '../../fielddef';
import {isOneOfFilter, isEqualFilter, isRangeFilter} from '../../filter';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {extend, differ, keys, isArray, isNumber, isString, Dict} from '../../util';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

function parse(model: Model): Dict<string> {
  const calcFieldMap = (model.calculate() || []).reduce(function(fieldMap, formula) {
    fieldMap[formula.as] = true;
    return fieldMap;
  }, {});

  let parseComponent: Dict<string> = {};

  // Parse filter fields
  let filter = model.filter();
  if (!isArray(filter)) {
    filter = [filter];
  }
  filter.forEach(f => {
    let val: string | number | boolean | DateTime = null;
    // For EqualFilter, just use the equal property.
    // For RangeFilter and OneOfFilter, all array members should have
    // the same type, so we only use the first one.
    if (isEqualFilter(f)) {
      val = f.equal;
    } else if (isRangeFilter(f)) {
      val = f.range[0];
    } else if (isOneOfFilter(f)) {
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
  model.forEachFieldDef(function(fieldDef: FieldDef) {
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
  const data = model.data;
  if (data && isUrlData(data) && data.format && data.format.parse) {
    const parse = data.format.parse;
    keys(parse).forEach((field) => {
      parseComponent[field] = parse[field];
    });
  }

  return parseComponent;
}

export const formatParse: DataComponentCompiler<Dict<string>> = {
  parseUnit: parse,

  parseFacet: function(model: FacetModel) {
    let parseComponent = parse(model);

    // If child doesn't have its own data source, but has its own parse, then merge
    const childDataComponent = model.child.component.data;
    if (!childDataComponent.source && childDataComponent.formatParse) {
      extend(parseComponent, childDataComponent.formatParse);
      delete childDataComponent.formatParse;
    }
    return parseComponent;
  },

  parseLayer: function(model: LayerModel) {
    // note that we run this before source.parseLayer
    let parseComponent = parse(model);
    model.children.forEach((child) => {
      const childDataComponent = child.component.data;
      if (model.compatibleSource(child) && !differ(childDataComponent.formatParse, parseComponent)) {
        // merge parse up if the child does not have an incompatible parse
        extend(parseComponent, childDataComponent.formatParse);
        delete childDataComponent.formatParse;
      }
    });
    return parseComponent;
  },

  // identity function
  assemble: function (x) {return x;}
};
