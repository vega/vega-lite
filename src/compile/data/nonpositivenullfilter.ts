import {ScaleType} from '../../scale';
import {extend, keys, differ, Dict} from '../../util';
import {field} from '../../fielddef';

import {FacetModel} from './../facet';
import {RepeatModel} from './../repeat';
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
      const fieldDef = model.fieldDef(channel);
      if (!fieldDef || !fieldDef.field || !scale) {
        // don't set anything
        return nonPositiveComponent;
      }
      const opt = fieldDef.bin ? {binSuffix: scale.type === ScaleType.ORDINAL ? '_range' : '_start'} : {};
      nonPositiveComponent[field(fieldDef, opt)] = scale.type === ScaleType.LOG;
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

  export function parseRepeat(model: RepeatModel) {
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
