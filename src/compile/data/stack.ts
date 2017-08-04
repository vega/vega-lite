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

  dimensionFieldDef: FieldDef<string>;

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

    let dimensionFieldDef: FieldDef<string>;
    if (stackProperties.groupbyChannel) {
      dimensionFieldDef = model.fieldDef(stackProperties.groupbyChannel);
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
      dimensionFieldDef,
      field: model.field(stackProperties.fieldChannel),
      facetby: [],
      stackby,
      sort,
      offset: stackProperties.offset,
      impute: stackProperties.impute,
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
    const {dimensionFieldDef, impute} = this._stack;
    if (dimensionFieldDef) {
      if (dimensionFieldDef.bin) {
        if (impute) {
          // For binned group by field with impute, we calculate bin_mid
          // as we cannot impute two fields simultaneously
          return [field(dimensionFieldDef, {binSuffix: 'mid'})];
        }
        return [
          // For binned group by field without impute, we need both bin_start and bin_end
          field(dimensionFieldDef, {binSuffix: 'start'}),
          field(dimensionFieldDef, {binSuffix: 'end'})
        ];
      }
      return [field(dimensionFieldDef)];
    }
    return [];
  }

  public assemble(): VgTransform[] {
    const transform: VgTransform[] = [];

    const {facetby, field: stackField, dimensionFieldDef, impute, offset, sort, stackby} = this._stack;

    // Impute
    if (impute && dimensionFieldDef) {
      const dimensionField = dimensionFieldDef ? field(dimensionFieldDef, {binSuffix: 'mid'}): undefined;

      if (dimensionFieldDef.bin) {
        // As we can only impute one field at a time, we need to calculate
        // mid point for a binned field
        transform.push({
          type: 'formula',
          expr: '(' +
            field(dimensionFieldDef, {expr: 'datum', binSuffix: 'start'}) +
            '+' +
            field(dimensionFieldDef, {expr: 'datum', binSuffix: 'end'}) +
            ')/2',
          as: dimensionField
        });
      }

      transform.push({
        type: 'impute',
        field: stackField,
        groupby: stackby,
        key: dimensionField,
        method: 'value',
        value: 0
      });
    }

    // Stack
    transform.push({
      type: 'stack',
      groupby: this.getGroupbyFields().concat(facetby),
      field: stackField,
      sort,
      as: [
        stackField + '_start',
        stackField + '_end'
      ],
      offset
    });

    return transform;
  }
}
