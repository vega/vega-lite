import {STACKED_SCALE} from '../../data';
import {field} from '../../fielddef';
import {VgData} from '../../vega.schema';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

import {DataComponent} from './data';


/**
 * Stacked scale data source, for feeding the shared scale.
 */
export namespace stackScale {
  export function parseUnit(model: Model): VgData {
    const stackProps = model.stack();

    if (stackProps) {
      // produce stacked scale
      const groupbyChannel = stackProps.groupbyChannel;
      const fieldChannel = stackProps.fieldChannel;
      return {
        transform: [{
          type: 'aggregate',
          // group by channel and other facets
          groupby: [model.field(groupbyChannel)],
          // produce sum of the field's value e.g., sum of sum, sum of distinct
          summarize: [{ ops: ['sum'], field: model.field(fieldChannel) }]
        }]
      };
    }
    return null;
  };

  /**
   * Add facet fields as dimensions.
   */
  export function parseFacet(model: FacetModel, stackComponent: VgData) {
    // Add more dimensions for row/column
    stackComponent.transform[0].groupby = model.reduce(function (groupby, fieldDef) {
      groupby.push(field(fieldDef));
      return groupby;
    }, stackComponent.transform[0].groupby);
  }

  export function assemble(component: DataComponent) {
    return component.stackScale;
  }
}
