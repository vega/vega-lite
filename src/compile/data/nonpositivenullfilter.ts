import {ScaleType} from '../../scale';
import {extend, keys, differ, Dict} from '../../util';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

import {DataComponent} from './data';

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
