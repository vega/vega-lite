import {ScaleType} from '../../scale';
import {extend, keys, differ, Dict} from '../../util';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

/**
 * Filter non-positive value for log scale
 */
export namespace nonPositiveFilter {
  export function parseUnit(model: Model): Dict<boolean> {
    return model.channels().reduce(function(nonPositiveComponent, channel) {
      const scale = model.scale(channel);
      if (!model.field(channel) || !scale) {
        // don't set anything
        return nonPositiveComponent;
      }
      nonPositiveComponent[model.field(channel)] = scale.type === ScaleType.LOG;
      return nonPositiveComponent;
    }, {} as Dict<boolean>);
  }

  export function parseFacet(model: FacetModel) {
    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source, then consider merging
    if (!childDataComponent.source) {
      // For now, let's assume it always has union scale
      const nonPositiveFilterComponent = childDataComponent.nonPositiveFilter;
      delete childDataComponent.nonPositiveFilter;
      return nonPositiveFilterComponent;
    }
    return {} as Dict<boolean>;
  }

  export function parseLayer(model: LayerModel) {
    // note that we run this before source.parseLayer
    let nonPositiveFilter = {} as Dict<boolean>;

    model.children().forEach((child) => {
      const childDataComponent = child.component.data;
      if (model.compatibleSource(child) && !differ(childDataComponent.nonPositiveFilter, nonPositiveFilter)) {
        extend(nonPositiveFilter, childDataComponent.nonPositiveFilter);
        delete childDataComponent.nonPositiveFilter;
      }
    });

    return nonPositiveFilter;
  }

  export function assemble(component: Dict<boolean>) {
    if (!component) {
      return [];
    }
    return keys(component).filter((field) => {
      // Only filter fields (keys) with value = true
      return component[field];
    }).map(function(field) {
      return {
        type: 'filter',
        expr: 'datum["' + field + '"] > 0'
      };
    });
  }
}
