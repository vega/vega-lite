import {DataComponentCompiler} from './base';

import {FieldDef} from '../../fielddef';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {contains, Dict, differ, extend, keys} from '../../util';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

const DEFAULT_NULL_FILTERS = {
  nominal: false,
  ordinal: false,
  quantitative: true,
  temporal: true
};

/** Return Hashset of fields for null filtering (key=field, value = true). */
function parse(model: Model): Dict<FieldDef> {
  const filterInvalid = model.filterInvalid();

  return model.reduceFieldDef(function(aggregator: Dict<FieldDef>, fieldDef: FieldDef) {
    if (fieldDef.field !== '*') { // Ignore * for count(*) fields.
      if (filterInvalid ||
        (filterInvalid === undefined && fieldDef.field && DEFAULT_NULL_FILTERS[fieldDef.type])) {
        aggregator[fieldDef.field] = fieldDef;
      } else {
        // define this so we know that we don't filter nulls for this field
        // this makes it easier to merge into parents
        aggregator[fieldDef.field] = null;
      }
    }
    return aggregator;
  }, {});
}

export const nullFilter: DataComponentCompiler<Dict<FieldDef>> = {
  parseUnit: parse,

  parseFacet: function(model: FacetModel) {
    const nullFilterComponent = parse(model);

    const childDataComponent = model.child.component.data;

    // If child doesn't have its own data source, then merge
    if (!childDataComponent.source) {
      extend(nullFilterComponent, childDataComponent.nullFilter);
      delete childDataComponent.nullFilter;
    }
    return nullFilterComponent;
  },

  parseLayer: function(model: LayerModel) {
    // note that we run this before source.parseLayer

    // FIXME: null filters are not properly propagated right now
    let nullFilterComponent = parse(model);

    model.children.forEach((child) => {
      const childDataComponent = child.component.data;
      if (model.compatibleSource(child) && !differ<FieldDef>(childDataComponent.nullFilter, nullFilterComponent)) {
        extend(nullFilterComponent, childDataComponent.nullFilter);
        delete childDataComponent.nullFilter;
      }
    });

    return nullFilterComponent;
  },

  assemble: function(component: Dict<FieldDef>) {
    const filters = keys(component).reduce((_filters, field) => {
      const fieldDef = component[field];
      if (fieldDef !== null) {
        _filters.push('datum["' + fieldDef.field + '"] !== null');
        if (contains([QUANTITATIVE, TEMPORAL], fieldDef.type)) {
          // TODO(https://github.com/vega/vega-lite/issues/1436):
          // We can be even smarter and add NaN filter for N,O that are numbers
          // based on the `parse` property once we have it.
          _filters.push('!isNaN(datum["'+ fieldDef.field + '"])');
        }
      }
      return _filters;
    }, []);

    return filters.length > 0 ?
      [{
        type: 'filter',
        expr: filters.join(' && ')
      }] : [];
  }
};
