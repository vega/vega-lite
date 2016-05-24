import {FieldDef} from '../../fielddef';
import {extend, keys, differ, Dict, forEach, all, duplicate} from '../../util';

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

export namespace nullFilter {
  /** Return Hashset of fields for null filtering (key=field, value = true). */
  function parse(model: Model): Dict<boolean> {
    const filterNull = model.transform().filterNull;
    return model.reduce(function(aggregator, fieldDef: FieldDef) {
      if (filterNull ||
        (filterNull === undefined && fieldDef.field && fieldDef.field !== '*' && DEFAULT_NULL_FILTERS[fieldDef.type])) {
        aggregator[fieldDef.field] = true;
      } else {
        // define this so we know that we don't filter nulls for this field
        // this makes it easier to merge into parents
        aggregator[fieldDef.field] = false;
      }
      return aggregator;
    }, {});
  }

  export function mergeIfCompatible(dataComponent: DataComponent, childDataComponents: DataComponent[]) {
    const nullFilterComponent = childDataComponents.reduce((collector, data) => {
      extend(collector, data.nullFilter);
      return collector;
    }, duplicate(dataComponent.nullFilter));

    const compatibleNullfilter = all(childDataComponents, (data) => {
      return !differ(data.nullFilter, nullFilterComponent);
    });

    if (compatibleNullfilter) {
      dataComponent.nullFilter = nullFilterComponent;
      childDataComponents.forEach((data) => {
        delete data.nullFilter;
      });
    }

    return compatibleNullfilter;
  }

  export const parseUnit = parse;

  /** Convert the hashset of fields to a filter transform.  */
  export function assemble(component: DataComponent) {
    const filteredFields = keys(component.nullFilter).filter((field) => {
      // only include fields that has value = true
      return component.nullFilter[field];
    });
    return filteredFields.length > 0 ?
      [{
        type: 'filter',
        test: filteredFields.map(function(fieldName) {
          return 'datum.' + fieldName + '!==null';
        }).join(' && ')
      }] : [];
  }
}
