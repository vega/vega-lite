import * as stringify from 'json-stable-stringify';

import {DataComponentCompiler} from './base';

import {isAggregate} from '../../encoding';
import {field} from '../../fielddef';
import {isSortField} from '../../sort';
import {VgSort} from '../../vega.schema';
import {contains} from '../../util';

import {sortParams} from '../common';
import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {UnitModel} from '../unit';

export const pathOrder: DataComponentCompiler<VgSort> = {
  parseUnit: function(model: UnitModel): VgSort {
    if (contains(['line', 'area'], model.mark())) {
      if (model.mark() === 'line' && model.channelHasField('order')) {
        // For only line, sort by the order field if it is specified.
        return sortParams(model.encoding.order);
      } else {
        // For both line and area, we sort values based on dimension by default
        const dimensionChannel: 'x' | 'y' = model.markDef.orient === 'horizontal' ? 'y' : 'x';
        const sort = model.sort(dimensionChannel);
        const sortField = isSortField(sort) ?
          field({
            // FIXME: this op might not already exist?
            // FIXME: what if dimensionChannel (x or y) contains custom domain?
            aggregate: isAggregate(model.encoding) ? sort.op : undefined,
            field: sort.field
          }) :
          model.field(dimensionChannel, {binSuffix: 'start'});

        return {
          field: sortField,
          order: 'descending'
        };
      }

    }
    return null;
  },

  parseFacet: function(model: FacetModel) {
    const childDataComponent = model.child.component.data;

    // If child doesn't have its own data source, then consider merging
    if (!childDataComponent.source) {
      // For now, let's assume it always has union scale
      const pathOrderComponent = childDataComponent.pathOrder;
      delete childDataComponent.pathOrder;
      return pathOrderComponent;
    }
    return null;
  },

  parseLayer: function(model: LayerModel) {
    // note that we run this before source.parseLayer
    let pathOrderComponent: VgSort = null;
    let stringifiedPathOrder: string = null;

    for (let child of model.children) {
      const childDataComponent = child.component.data;
      if (model.compatibleSource(child) && childDataComponent.pathOrder !== null) {
        if (pathOrderComponent === null) {
          pathOrderComponent = childDataComponent.pathOrder;
          stringifiedPathOrder = stringify(pathOrderComponent);
        } else if (stringifiedPathOrder !== stringify(childDataComponent.pathOrder)) {
          pathOrderComponent = null;
          break;
        }
      }
    }

    if (pathOrderComponent !== null) {
      // If we merge pathOrderComponent, remove them from children.
      for (let child of model.children) {
        delete child.component.data.pathOrder;
      }
    }

    return pathOrderComponent;
  },

  assemble: function(pathOrderComponent: VgSort) {
    if (pathOrderComponent) {
      return {
        type: 'collect',
        sort: pathOrderComponent
      };
    }
    return null;
  }
};
