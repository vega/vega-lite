import {Transforms as VgTransform} from 'vega';
import {isArray, isString} from 'vega-util';
import {FieldDef, FieldName, getFieldDef, isFieldDef, vgField} from '../../channeldef';
import {SortFields, SortOrder} from '../../sort';
import {StackOffset} from '../../stack';
import {StackTransform} from '../../transform';
import {duplicate, getFirstDefined, hash} from '../../util';
import {sortParams} from '../common';
import {UnitModel} from '../unit';
import {DataFlowNode} from './dataflow';

function getStackByFields(model: UnitModel): string[] {
  return model.stack.stackBy.reduce((fields, by) => {
    const fieldDef = by.fieldDef;

    const _field = vgField(fieldDef);
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

  dimensionFieldDefs: FieldDef<string>[];

  /**
   * Stack measure's field. Used in makeFromEncoding.
   */
  stackField: string;

  /**
   * Level of detail fields for each level in the stacked charts such as color or detail.
   * Used in makeFromEncoding.
   */
  stackby?: string[];

  /**
   * Field that determines order of levels in the stacked charts.
   * Used in both but optional in transform.
   */
  sort: SortFields;

  /** Mode for stacking marks.
   */
  offset: StackOffset;

  /**
   * Whether to impute the data before stacking. Used only in makeFromEncoding.
   */
  impute?: boolean;

  /**
   * The data fields to group by.
   */
  groupby?: FieldName[];
  /**
   * Output field names of each stack field.
   */
  as: [FieldName, FieldName];
}

function isValidAsArray(as: string[] | string): as is string[] {
  return isArray(as) && as.every(s => isString(s)) && as.length > 1;
}

export class StackNode extends DataFlowNode {
  private _stack: StackComponent;

  public clone() {
    return new StackNode(null, duplicate(this._stack));
  }

  constructor(parent: DataFlowNode, stack: StackComponent) {
    super(parent);

    this._stack = stack;
  }

  public static makeFromTransform(parent: DataFlowNode, stackTransform: StackTransform) {
    const {stack, groupby, as, offset = 'zero'} = stackTransform;

    const sortFields: string[] = [];
    const sortOrder: SortOrder[] = [];
    if (stackTransform.sort !== undefined) {
      for (const sortField of stackTransform.sort) {
        sortFields.push(sortField.field);
        sortOrder.push(getFirstDefined(sortField.order, 'ascending'));
      }
    }
    const sort: SortFields = {
      field: sortFields,
      order: sortOrder
    };
    let normalizedAs: [string, string];
    if (isValidAsArray(as)) {
      normalizedAs = as;
    } else if (isString(as)) {
      normalizedAs = [as, `${as}_end`];
    } else {
      normalizedAs = [`${stackTransform.stack}_start`, `${stackTransform.stack}_end`];
    }

    return new StackNode(parent, {
      dimensionFieldDefs: [],
      stackField: stack,
      groupby,
      offset,
      sort,
      facetby: [],
      as: normalizedAs
    });
  }

  public static makeFromEncoding(parent: DataFlowNode, model: UnitModel) {
    const stackProperties = model.stack;
    const {encoding} = model;

    if (!stackProperties) {
      return null;
    }

    const {groupbyChannels, fieldChannel, offset, impute} = stackProperties;

    const dimensionFieldDefs = groupbyChannels
      .map(groupbyChannel => {
        const cDef = encoding[groupbyChannel];
        return getFieldDef(cDef);
      })
      .filter(def => !!def);

    const stackby = getStackByFields(model);
    const orderDef = model.encoding.order;

    let sort: SortFields;
    if (isArray(orderDef) || isFieldDef(orderDef)) {
      sort = sortParams(orderDef);
    } else {
      // default = descending by stackFields
      // FIXME is the default here correct for binned fields?
      sort = stackby.reduce(
        (s, field) => {
          s.field.push(field);
          s.order.push(fieldChannel === 'y' ? 'descending' : 'ascending');
          return s;
        },
        {field: [], order: []}
      );
    }

    return new StackNode(parent, {
      dimensionFieldDefs,
      stackField: model.vgField(fieldChannel),
      facetby: [],
      stackby,
      sort,
      offset,
      impute,
      as: [
        model.vgField(fieldChannel, {suffix: 'start', forAs: true}),
        model.vgField(fieldChannel, {suffix: 'end', forAs: true})
      ]
    });
  }

  get stack(): StackComponent {
    return this._stack;
  }

  public addDimensions(fields: string[]) {
    this._stack.facetby.push(...fields);
  }

  public dependentFields() {
    const out = new Set<string>();

    out.add(this._stack.stackField);

    this.getGroupbyFields().forEach(out.add, out);
    this._stack.facetby.forEach(out.add, out);
    this._stack.sort.field.forEach(out.add, out);

    return out;
  }

  public producedFields() {
    return new Set(this._stack.as);
  }

  public hash() {
    return `Stack ${hash(this._stack)}`;
  }

  private getGroupbyFields() {
    const {dimensionFieldDefs, impute, groupby} = this._stack;

    if (dimensionFieldDefs.length > 0) {
      return dimensionFieldDefs
        .map(dimensionFieldDef => {
          if (dimensionFieldDef.bin) {
            if (impute) {
              // For binned group by field with impute, we calculate bin_mid
              // as we cannot impute two fields simultaneously
              return [vgField(dimensionFieldDef, {binSuffix: 'mid'})];
            }
            return [
              // For binned group by field without impute, we need both bin (start) and bin_end
              vgField(dimensionFieldDef, {}),
              vgField(dimensionFieldDef, {binSuffix: 'end'})
            ];
          }
          return [vgField(dimensionFieldDef)];
        })
        .flat();
    }
    return groupby ?? [];
  }

  public assemble(): VgTransform[] {
    const transform: VgTransform[] = [];
    const {facetby, dimensionFieldDefs, stackField: field, stackby, sort, offset, impute, as} = this._stack;

    // Impute
    if (impute) {
      for (const dimensionFieldDef of dimensionFieldDefs) {
        const {bandPosition = 0.5, bin} = dimensionFieldDef;
        if (bin) {
          // As we can only impute one field at a time, we need to calculate
          // mid point for a binned field

          const binStart = vgField(dimensionFieldDef, {expr: 'datum'});
          const binEnd = vgField(dimensionFieldDef, {expr: 'datum', binSuffix: 'end'});
          transform.push({
            type: 'formula',
            expr: `${bandPosition}*${binStart}+${1 - bandPosition}*${binEnd}`,
            as: vgField(dimensionFieldDef, {binSuffix: 'mid', forAs: true})
          });
        }

        transform.push({
          type: 'impute',
          field,
          groupby: [...stackby, ...facetby],
          key: vgField(dimensionFieldDef, {binSuffix: 'mid'}),
          method: 'value',
          value: 0
        });
      }
    }

    // Stack
    transform.push({
      type: 'stack',
      groupby: [...this.getGroupbyFields(), ...facetby],
      field,
      sort,
      as,
      offset
    });

    return transform;
  }
}
