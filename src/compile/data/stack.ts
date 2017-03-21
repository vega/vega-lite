import {DataComponentCompiler} from './base';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {UnitModel} from './../unit';

import {STACKED, SUMMARY} from '../../data';
import {field, FieldDef} from '../../fielddef';
import {hasDiscreteDomain} from '../../scale';
import {StackOffset} from '../../stack';
import {contains} from '../../util';
import {VgData, VgImputeTransform, VgSort, VgStackTransform} from '../../vega.schema';
import {sortParams} from '../common';

export interface StackComponent {
  /**
   * Name of the output stacked data source
   */
  name: string;

  /**
   * Name of the input source data for stacked data source
   */
  source: string;

  /**
   * Grouping fields for stacked charts.  This includes one of x- or 'y-field and may include faceted field.
   */
  groupby: string[];

  /**
   * Stack measure's field
   */
  field: string;

  /**
   * Level of detail fields for each level in the stacked charts such as color or detail.
   */
  stackby: string[];

  /**
   * Field that determines order of levels in the stacked charts.
   */
  sort: VgSort;

  /** Mode for stacking marks. */
  offset: StackOffset;

  /**
   * Whether to impute the data before stacking.
   */
  impute: boolean;
}


function getStackByFields(model: UnitModel) {
  return model.stack.stackBy.reduce((fields, by) => {
    const channel = by.channel;
    const fieldDef = by.fieldDef;

    const scale = model.scale(channel);
    const _field = field(fieldDef, {
      binSuffix: scale && hasDiscreteDomain(scale.type) ? 'range' : 'start'
    });
    if (!!_field) {
      fields.push(_field);
    }
    return fields;
  }, [] as string[]);
}

/**
 * Stack data compiler
 */
export const stack: DataComponentCompiler<StackComponent> = {

  parseUnit: function(model: UnitModel): StackComponent {
    const stackProperties = model.stack;
    if (!stackProperties) {
      return undefined;
    }

    const groupby = [];
    if (stackProperties.groupbyChannel) {
      const groupbyFieldDef = model.fieldDef(stackProperties.groupbyChannel);
      if (groupbyFieldDef.bin) {
        // For Bin, we need to add both start and end to ensure that both get imputed
        // and included in the stack output (https://github.com/vega/vega-lite/issues/1805).
        groupby.push(model.field(stackProperties.groupbyChannel, {binSuffix: 'start'}));
        groupby.push(model.field(stackProperties.groupbyChannel, {binSuffix: 'end'}));
      } else {
        groupby.push(model.field(stackProperties.groupbyChannel));
      }
    }

    const stackby = getStackByFields(model);
    const orderDef = model.encoding.order;

    let sort: VgSort;
    if (orderDef) {
      sort = sortParams(orderDef);
    } else {
      // default = descending by stackFields
      // FIXME is the default here correct for binned fields?
      sort = stackby.reduce((s, field) => {
        s.field.push(field);
        s.order.push('descending');
        return s;
      }, {field:[], order: []});
    }

    return {
      name: model.dataName(STACKED),
      source: model.dataName(SUMMARY),
      groupby: groupby,
      field: model.field(stackProperties.fieldChannel),
      stackby: stackby,
      sort: sort,
      offset: stackProperties.offset,
      impute: contains(['area', 'line'], model.mark())
    };
  },

  parseLayer: function(model: LayerModel): StackComponent {
    // FIXME: merge if identical
    // FIXME: Correctly support facet of layer of stack.
    return undefined;
  },

  parseFacet: function(model: FacetModel): StackComponent {
    const child = model.child;
    const childDataComponent = child.component.data;
    // FIXME: Correctly support facet of layer of stack.
    if (childDataComponent.stack) {
      let stackComponent = childDataComponent.stack;

      const newName = model.dataName(STACKED);
      child.renameData(stackComponent.name, newName);
      stackComponent.name = newName;

      // Refer to facet's summary instead (always summary because stacked only works with aggregation)
      stackComponent.source = model.dataName(SUMMARY);

      // Add faceted field to groupby
      stackComponent.groupby = model.reduceFieldDef((groupby: string[], fieldDef: FieldDef) => {
        const facetedField = field(fieldDef, {binSuffix: 'start'});
        if (!contains(groupby, facetedField)) {
          groupby.push(facetedField);
        }
        return groupby;
      }, stackComponent.groupby);

      delete childDataComponent.stack;
      return stackComponent;
    }
    return undefined;
  },
  assemble: (stackComponent: StackComponent): VgData => {
    if (!stackComponent) {
      return undefined;
    }

    let transform: (VgStackTransform|VgImputeTransform)[] = [];
    // Impute
    if (stackComponent.impute) {
      transform.push({
        type: 'impute',
        field: stackComponent.field,
        groupby: stackComponent.stackby,
        orderby: stackComponent.groupby,
        method: 'value',
        value: 0
      });
    }

    // Stack
    transform.push({
      type: 'stack',
      groupby: stackComponent.groupby,
      field: stackComponent.field,
      sort: stackComponent.sort,
      as: [
        stackComponent.field + '_start',
        stackComponent.field + '_end'
      ],
      offset: stackComponent.offset
    });

    return {
      name: stackComponent.name,
      source: stackComponent.source,
      transform: transform
    };
  }
};
