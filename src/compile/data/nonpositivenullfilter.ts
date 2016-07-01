import {ScaleType} from '../../scale';
import {extend, keys, differ, Dict, every, duplicate} from '../../util';

import {FacetModel} from './../facet';
import {Model} from './../model';

import {DataComponent} from './data';

/**
 * Filter non-positive value for log scale
 */
export namespace nonPositiveFilter {
  export function parseUnit(model: Model): Dict<boolean> {
    return model.channels().reduce(function(nonPositiveComponent, channel) {
      const scale = model.scale(channel);
      if (!model.has(channel) || !scale) {
        // don't set anything
        return nonPositiveComponent;
      }
      nonPositiveComponent[model.field(channel)] = scale.type === ScaleType.LOG;
      return nonPositiveComponent;
    }, {} as Dict<boolean>);
  }

  export function parseFacet(model: FacetModel): Dict<boolean> {
    // facet cannot have log so we only need to move up

    const childDataComponent = model.child().component.data;
    delete childDataComponent.nonPositiveFilter;
    return childDataComponent.nonPositiveFilter;
  }

  export function mergeIfCompatible(dataComponent: DataComponent, childDataComponents: DataComponent[]) {
    const nonPosComponent = childDataComponents.reduce((collector, childData) => {
      extend(collector, childData.nonPositiveFilter);
      return collector;
    }, duplicate(dataComponent.nonPositiveFilter));

    const compatibleNonPosFilter = every(childDataComponents, (childData) => {
      return !differ(childData.nonPositiveFilter, nonPosComponent);
    });

    if (compatibleNonPosFilter) {
      dataComponent.nonPositiveFilter = nonPosComponent;
      childDataComponents.forEach((childData) => {
        delete childData.nonPositiveFilter;
      });
    }

    return compatibleNonPosFilter;
  }

  export function assemble(component: DataComponent) {
    return keys(component.nonPositiveFilter).filter((field) => {
      // Only filter fields (keys) with value = true
      return component.nonPositiveFilter[field];
    }).map(function(field) {
      return {
        type: 'filter',
        test: 'datum.' + field + ' > 0'
      };
    });
  }
}
