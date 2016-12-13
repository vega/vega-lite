import {AbstractDataCompiler} from './abstract';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {UnitModel} from './../unit';

import {STACKED, SUMMARY} from '../../data';
import {sortField} from '../common';
import {has} from '../../encoding';
import {FieldDef, field} from '../../fielddef';
import {hasDiscreteDomain} from '../../scale';
import {StackOffset} from '../../stack';
import {contains, isArray} from '../../util';
import {VgData, VgStackTransform, VgImputeTransform} from '../../vega.schema';

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
  sort: string[];

  /** Mode for stacking marks. */
  offset: StackOffset;

  /**
   * Whether to impute the data before stacking.
   */
  impute: boolean;
}


function getStackByFields(model: UnitModel) {
  const encoding = model.encoding();
  const stackProperties = model.stack();

  return stackProperties.stackByChannels.reduce(function(fields, channel) {
    const channelEncoding = encoding[channel];
    if (has(encoding, channel)) {
      if (isArray(channelEncoding)) {
        channelEncoding.forEach(function(fieldDef) {
          fields.push(field(fieldDef));
        });
      } else {
        const fieldDef: FieldDef = channelEncoding;
        const scale = model.scale(channel);
        const _field = field(fieldDef, {
          binSuffix: scale && hasDiscreteDomain(scale.type) ? 'range' : 'start'
        });
        if (!!_field) {
          fields.push(_field);
        }
      }
    }
    return fields;
  }, [] as string []);
}

/**
 * Stack data compiler
 */
export const stack: AbstractDataCompiler<StackComponent> = {

  parseUnit: function(model: UnitModel): StackComponent {
    const stackProperties = model.stack();
    if (!stackProperties) {
      return undefined;
    }

    const groupby = model.field(stackProperties.groupbyChannel, {binSuffix: 'start'});

    const stackby = getStackByFields(model);
    const orderDef = model.encoding().order;
    const sortby = orderDef ?
      (isArray(orderDef) ? orderDef : [orderDef]).map(sortField) :
      // default = descending by stackFields
      // FIXME is the default here correct for binned fields?
      stackby.map(function(field) {
        return '-' + field;
      });

    return {
      name: model.dataName(STACKED),
      source: model.dataName(SUMMARY),
      groupby: groupby ? [groupby] : [],
      field: model.field(stackProperties.fieldChannel),
      stackby: stackby,
      sort: sortby,
      offset: stackProperties.offset,
      impute: contains(['area', 'line',], model.mark())
    };
  },

  parseLayer: function(model: LayerModel): StackComponent {
    // FIXME: merge if identical
    // FIXME: Correctly support facet of layer of stack.
    return undefined;
  },

  parseFacet: function(model: FacetModel): StackComponent {
    const child = model.child();
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
      stackComponent.groupby = model.reduce((groupby: string[], fieldDef: FieldDef) => {
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
