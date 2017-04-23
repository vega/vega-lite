import {isArray} from 'vega-util';
import {field} from '../../fielddef';
import {hasDiscreteDomain} from '../../scale';
import {StackOffset} from '../../stack';
import {contains, duplicate} from '../../util';
import {VgSort, VgTransform} from '../../vega.schema';
import {sortParams} from '../common';
import {UnitModel} from './../unit';
import {DataFlowNode} from './dataflow';

function getStackByFields(model: UnitModel): string[] {
  return model.stack.stackBy.reduce((fields, by) => {
    const channel = by.channel;
    const fieldDef = by.fieldDef;

    const scale = model.scale(channel);
    const _field = field(fieldDef, {
      binSuffix: scale && hasDiscreteDomain(scale.type) ? 'range' : 'start'
    });
    if (_field) {
      fields.push(_field);
    }
    return fields;
  }, [] as string[]);
}

export interface StackComponent {
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

export class StackNode extends DataFlowNode {
  private _stack: StackComponent;

  public clone() {
    return new StackNode(duplicate(this._stack));
  }

  constructor(stack: StackComponent) {
    super();

    this._stack = stack;
  }

  public static make(model: UnitModel) {

    const stackProperties = model.stack;

    if (!stackProperties) {
      return null;
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

    return new StackNode({
      groupby,
      field: model.field(stackProperties.fieldChannel),
      stackby,
      sort,
      offset: stackProperties.offset,
      impute: contains(['area', 'line'], model.mark()),
    });
  }

  get stack(): StackComponent {
    return this._stack;
  }

  public addDimensions(fields: string[]) {
    this._stack.groupby = this._stack.groupby.concat(fields);
  }

  public dependentFields() {
    const out = {};

    out[this._stack.field] = true;
    this._stack.groupby.forEach(f => out[f] = true);
    const field = this._stack.sort.field;
    isArray(field) ? field.forEach(f => out[f] = true) : out[field] = true;

    return out;
  }

  public producedFields() {
    const out = {};

    out[this._stack.field + '_start'] = true;
    out[this._stack.field + '_end'] = true;

    return out;
  }

  public assemble(): VgTransform[] {
    const transform: VgTransform[] = [];

    const stack = this._stack;

    // Impute
    if (stack.impute) {
      transform.push({
        type: 'impute',
        field: stack.field,
        groupby: stack.stackby,
        orderby: stack.groupby,
        method: 'value',
        value: 0
      });
    }

    // Stack
    transform.push({
      type: 'stack',
      groupby: stack.groupby,
      field: stack.field,
      sort: stack.sort,
      as: [
        stack.field + '_start',
        stack.field + '_end'
      ],
      offset: stack.offset
    });

    return transform;
  }
}
