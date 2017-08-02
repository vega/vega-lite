import {isArray} from 'vega-util';
import {isScaleChannel} from '../../channel';
import {field, FieldDef} from '../../fielddef';
import {hasDiscreteDomain} from '../../scale';
import {StackOffset} from '../../stack';
import {contains, duplicate, stringValue} from '../../util';
import {VgSort, VgTransform} from '../../vega.schema';
import {sortParams} from '../common';
import {UnitModel} from './../unit';
import {DataFlowNode} from './dataflow';


function getStackByFields(model: UnitModel): string[] {
  return model.stack.stackBy.reduce((fields, by) => {
    const channel = by.channel;
    const fieldDef = by.fieldDef;

    const scale = isScaleChannel(channel) ? model.getScaleComponent(channel) : undefined;
    const _field = field(fieldDef, {
      binSuffix: scale && hasDiscreteDomain(scale.get('type')) ? 'range' : 'start'
    });
    if (_field) {
      fields.push(_field);
    }
    return fields;
  }, [] as string[]);
}

export interface StackComponent {
  /**
   * Faceted field.
   */
  facetby: string[];

  groupbyFieldDef: FieldDef<string>;

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

    let groupbyFieldDef: FieldDef<string>;
    if (stackProperties.groupbyChannel) {
      groupbyFieldDef = model.fieldDef(stackProperties.groupbyChannel);
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
      groupbyFieldDef,
      field: model.field(stackProperties.fieldChannel),
      facetby: [],
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
    this._stack.facetby = this._stack.facetby.concat(fields);
  }

  public dependentFields() {
    const out = {};

    out[this._stack.field] = true;

    this.getGroupbyFields().forEach(f => out[f] = true);
    this._stack.facetby.forEach(f => out[f] = true);
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

  private getGroupbyFields() {
    const {groupbyFieldDef} = this._stack;
    if (groupbyFieldDef) {
      if (groupbyFieldDef.bin) {
        return [
          // For binned group by field, we need both bin_start and bin_end
          field(groupbyFieldDef, {binSuffix: 'start'}),
          field(groupbyFieldDef, {binSuffix: 'end'})
        ];
      }
      return [field(groupbyFieldDef)];
    }
    return [];
  }

  public assemble(): VgTransform[] {
    const transform: VgTransform[] = [];

    const {facetby, field, groupbyFieldDef, impute, offset, sort, stackby} = this._stack;
    const groupbyFields = this.getGroupbyFields();

    // Impute
    if (impute) {

      if (groupbyFieldDef) {
        for (const key of groupbyFields) {
          transform.push({
            type: 'impute',
            field: field,
            groupby: stackby,
            key,
            method: 'value',
            value: 0
          });
        }
      }
    }

    // Stack
    transform.push({
      type: 'stack',
      groupby: groupbyFields.concat(facetby),
      field,
      sort,
      as: [
        field + '_start',
        field + '_end'
      ],
      offset
    });

    return transform;
  }
}
