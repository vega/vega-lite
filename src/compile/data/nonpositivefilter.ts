import {DataComponentCompiler} from './base';

import {ScaleType} from '../../scale';
import {extend, keys, differ, Dict} from '../../util';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';


export const nonPositiveFilter: DataComponentCompiler<Dict<boolean>> = {
  parseUnit: function(model: Model): Dict<boolean> {
    return model.channels().reduce(function(nonPositiveComponent, channel) {
      const scale = model.scale(channel);
      if (!model.field(channel) || !scale) {
        // don't set anything
        return nonPositiveComponent;
      }
      nonPositiveComponent[model.field(channel)] = scale.type === ScaleType.LOG;
      return nonPositiveComponent;
    }, {});
  },

  parseFacet: function(model: FacetModel) {
    const childDataComponent = model.child.component.data;

    // If child doesn't have its own data source, then consider merging
    if (!childDataComponent.source) {
      // For now, let's assume it always has union scale
      const nonPositiveFilterComponent = childDataComponent.nonPositiveFilter;
      delete childDataComponent.nonPositiveFilter;
      return nonPositiveFilterComponent;
    }
    return {};
  },

  parseLayer: function(model: LayerModel) {
    // note that we run this before source.parseLayer
    let nonPositiveFilterComponent = {};

    model.children.forEach((child) => {
      const childDataComponent = child.component.data;
      if (model.compatibleSource(child) && !differ(childDataComponent.nonPositiveFilter, nonPositiveFilterComponent)) {
        extend(nonPositiveFilterComponent, childDataComponent.nonPositiveFilter);
        delete childDataComponent.nonPositiveFilter;
      }
    });

    return nonPositiveFilterComponent;
  },

  assemble: function(nonPositiveFilterComponent: Dict<boolean>) {
    if (nonPositiveFilterComponent) {
      return keys(nonPositiveFilterComponent).filter((field) => {
        // Only filter fields (keys) with value = true
        return nonPositiveFilterComponent[field];
      }).map(function(field) {
        return {
          type: 'filter',
          expr: 'datum["' + field + '"] > 0'
        };
      });
    }
    return [];
  }
};
