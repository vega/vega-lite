import {extend, keys, differ, Dict} from '../../util';
import {FieldDef} from '../../fielddef';
import {Channel} from '../../channel';

import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {RepeatModel} from '../repeat';
import {Model} from '../model';

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
    return model.reduce(function(aggregator, fieldDef: FieldDef, channel: Channel) {
      const field = model.fieldOrig(channel);
      if (!field) return aggregator;
      if (filterNull ||
        (filterNull === undefined && field !== '*' && DEFAULT_NULL_FILTERS[fieldDef.type])) {
        aggregator[field] = true;
      } else {
        // define this so we know that we don't filter nulls for this field
        // this makes it easier to merge into parents
        aggregator[field] = false;
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
      if (model.compatibleSource(child) && !differ(childDataComponent.nullFilter, nullFilterComponent)) {
        extend(nullFilterComponent, childDataComponent.nullFilter);
        delete childDataComponent.nullFilter;
      }
    });

    return nullFilterComponent;
  }

  export function parseRepeat(model: RepeatModel): Dict<boolean> {
    // note that we run this before source.parseLayer

    let nullFilterComponent = {} as Dict<boolean>;

    const children = model.children();
    for (let i = 0; i < children.length; i++) {
      const childDataComponent = children[i].component.data;
      if (!differ(childDataComponent.nullFilter, nullFilterComponent)) {
        extend(nullFilterComponent, childDataComponent.nullFilter);
      } else {
        // children are incompatible
        return {};
      }
    }

    // children are compatible so let's delete their null filters
    model.children().forEach((child) => {
      const childDataComponent = child.component.data;
      delete childDataComponent.nullFilter;
    });

    return nullFilterComponent;
  }

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