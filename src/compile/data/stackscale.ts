import {STACKED_SCALE, SUMMARY} from '../../data';
import {field} from '../../fielddef';
import {VgData} from '../../vega.schema';
import {extend} from '../../util';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {UnitModel} from './../unit';

import {DataComponent} from './data';


/**
 * Stacked scale data source, for feeding the shared scale.
 */
export namespace stackScale {
  export function parseUnit(model: UnitModel): VgData {
    const stackProps = model.stack();

    if (stackProps) {
      // produce stacked scale
      const groupbyChannel = stackProps.groupbyChannel;
      const fieldChannel = stackProps.fieldChannel;

      let fields = [];
      const field = model.field(groupbyChannel);
      if (field) {
        fields.push(field);
      }

      return {
        name: model.dataName(STACKED_SCALE),
        source: model.dataName(SUMMARY), // always summary because stacked only works with aggregation
        transform: [extend({
          type: 'aggregate',
          // produce sum of the field's value e.g., sum of sum, sum of distinct
          summarize: [{ ops: ['sum'], field: model.field(fieldChannel) }]
        }, fields.length > 0 ? {
          // group by channel and other facets
          groupby: fields
        } : {})]
      };
    }
    return null;
  };

  export function parseFacet(model: FacetModel) {
    const child = model.child();
    const childDataComponent = child.component.data;

    // If child doesn't have its own data source, but has stack scale source, then merge
    if (!childDataComponent.source && childDataComponent.stackScale) {
      let stackComponent = childDataComponent.stackScale;

      const newName = model.dataName(STACKED_SCALE);
      child.renameData(stackComponent.name, newName);
      stackComponent.name = newName;

      // Refer to facet's summary instead (always summary because stacked only works with aggregation)
      stackComponent.source = model.dataName(SUMMARY);

      // Add more dimensions for row/column
      stackComponent.transform[0].groupby = model.reduce(function(groupby, fieldDef) {
        groupby.push(field(fieldDef));
        return groupby;
      }, stackComponent.transform[0].groupby);

      delete childDataComponent.stackScale;
      return stackComponent;
    }
    return null;
  }

  export function parseLayer(model: LayerModel) {
    // TODO
    return null;
  }

  export function assemble(component: DataComponent) {
    return component.stackScale;
  }
}
