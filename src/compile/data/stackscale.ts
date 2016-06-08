import {field} from '../../fielddef';

import {FacetModel} from './../facet';
import {Model} from './../model';

import {DataComponent} from './data';


/**
 * Stacked scale data transform, for feeding the shared scale.
 */
export namespace stackScale {
  export function parse(model: Model) {
    const stackProps = model.stack();

    if (stackProps) {
      // produce stacked scale
      const groupbyChannel = stackProps.groupbyChannel;
      const fieldChannel = stackProps.fieldChannel;
      return {
        type: 'aggregate',
        // group by channel and other facets
        groupby: [model.field(groupbyChannel)],
        // produce sum of the field's value e.g., sum of sum, sum of distinct
        summarize: [{ ops: ['sum'], field: model.field(fieldChannel) }]
      };
    }
    return null;
  };

  /**
   * Add facet fields as dimensions and move stack transform up.
   */
  export function parseFacet(model: FacetModel) {
    const child = model.child();
    const childTransform = child.component.data.stackScale;

    if (childTransform) {
      // Add more dimensions for row/column
      childTransform.groupby = model.reduce(function (groupby, fieldDef) {
        groupby.push(field(fieldDef));
        return groupby;
      }, childTransform.groupby);

      delete child.component.data.stackScale;
    }

    return childTransform;
  }

  export function assemble(component: DataComponent) {
    return component.stackScale;
  }
}
