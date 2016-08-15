import {FieldDef} from '../../fielddef';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {contains, extend, keys, differ, Dict} from '../../util';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

import {DataComponent} from './data';

const DEFAULT_NULL_FILTERS = {
  nominal: false,
  ordinal: false,
  quantitative: true,
  temporal: true
};

// TODO: rename to invalidFilter
export namespace nullFilter {
  /** Return Hashset of fields for null filtering (key=field, value = true). */
  function parse(model: Model): Dict<boolean> {
    const transform = model.transform();
    let filterInvalid = transform.filterInvalid;

    if (filterInvalid === undefined && transform['filterNull'] !== undefined) {
      filterInvalid = transform['filterNull'];
      console.warn('filterNull is deprecated. Please use filterInvalid instead.');
    }

    return model.reduce(function(aggregator, fieldDef: FieldDef) {
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

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    let nullFilterComponent = parse(model);

    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source, then merge
    if (!childDataComponent.source) {
      extend(nullFilterComponent, childDataComponent.nullFilter);
      delete childDataComponent.nullFilter;
    }
    return nullFilterComponent;
  }

  export function parseLayer(model: LayerModel) {
    // note that we run this before source.parseLayer

    // FIXME: null filters are not properly propagated right now
    let nullFilterComponent = parse(model);

    model.children().forEach((child) => {
      const childDataComponent = child.component.data;
      if (model.compatibleSource(child) && !differ<FieldDef>(childDataComponent.nullFilter, nullFilterComponent)) {
        extend(nullFilterComponent, childDataComponent.nullFilter);
        delete childDataComponent.nullFilter;
      }
    });

    return nullFilterComponent;
  }

  /** Convert the hashset of fields to a filter transform.  */
  export function assemble(component: DataComponent) {
    const filters = keys(component.nullFilter).reduce((_filters, field) => {
      const fieldDef = component.nullFilter[field];
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
        test: filters.join(' && ')
      }] : [];
  }
}
