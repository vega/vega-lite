import {AggregateOp} from 'vega';
import {ScaleChannel} from '../../channel';
import {vgField} from '../../fielddef';
import * as log from '../../log';
import {hasDiscreteDomain} from '../../scale';
import {EncodingSortField, isSortField} from '../../sort';
import {isVgRangeStep, VgData} from '../../vega.schema';
import {FacetModel} from '../facet';
import {Model} from '../model';
import {assembleDomain, getFieldFromDomain} from '../scale/domain';
import {DataFlowNode} from './dataflow';

type ChildIndependentFieldsWithStep = {
  x?: string,
  y?: string
};

/**
 * A node that helps us track what fields we are faceting by.
 */
export class FacetNode extends DataFlowNode {
  private readonly columnFields: string[];
  private readonly columnFieldSort: EncodingSortField<string>;
  private readonly columnName: string;

  private readonly rowFields: string[];
  private readonly rowFieldSort: EncodingSortField<string>;
  private readonly rowName: string;

  private readonly childModel: Model;

  /**
   * @param model The facet model.
   * @param name The name that this facet source will have.
   * @param data The source data for this facet data.
   */
  public constructor(parent: DataFlowNode, public readonly model: FacetModel, public readonly name: string, public data: string) {
    super(parent);

    const {column, row} = model.facet;
    if (column) {
      this.columnFields = [vgField(column)];
      this.columnName = model.getName('column_domain');
      if (column.bin) {
        this.columnFields.push(vgField(column, {binSuffix: 'end'}));
      }
      const {sort} = column;
      if (sort && isSortField(sort)) {
        this.columnFieldSort = sort;
      }
    }

    if (row) {
      this.rowFields = [vgField(row)];
      this.rowName = model.getName('row_domain');
      if (row.bin) {
        this.rowFields.push(vgField(row, {binSuffix: 'end'}));
      }
      const {sort} = row;
      if (sort && isSortField(sort)) {
        this.rowFieldSort = sort;
      }
    }

    this.childModel = model.child;
  }

  get fields() {
    let fields: string[] = [];
    if (this.columnFields) {
      fields = fields.concat(this.columnFields);
    }
    if (this.rowFields) {
      fields = fields.concat(this.rowFields);
    }
    return fields;
  }

  /**
   * The name to reference this source is its name.
   */
  public getSource() {
    return this.name;
  }

  private getChildIndependentFieldsWithStep() {
    const childIndependentFieldsWithStep: ChildIndependentFieldsWithStep = {};

    for (const channel of ['x', 'y'] as ScaleChannel[]) {
      const childScaleComponent = this.childModel.component.scales[channel];
      if (childScaleComponent && !childScaleComponent.merged) {
        const type = childScaleComponent.get('type');
        const range = childScaleComponent.get('range');

        if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
          const domain = assembleDomain(this.childModel, channel);
          const field = getFieldFromDomain(domain);
          if (field) {
            childIndependentFieldsWithStep[channel] = field;
          } else {
            log.warn('Unknown field for ${channel}.  Cannot calculate view size.');
          }
        }
      }
    }

    return childIndependentFieldsWithStep;
  }

  private assembleRowColumnData(channel: 'row' | 'column', crossedDataName: string, childIndependentFieldsWithStep: ChildIndependentFieldsWithStep): VgData {
    const childChannel = channel === 'row' ? 'y' : 'x';

    const fields: string[] = [];
    const ops: AggregateOp[] = [];
    const as: string[] = [];

    if (childIndependentFieldsWithStep[childChannel]) {
      if (crossedDataName) {
        // If there is a crossed data, calculate max
        fields.push(`distinct_${childIndependentFieldsWithStep[childChannel]}`);

        ops.push('max');
      } else {
        // If there is no crossed data, just calculate distinct
        fields.push(childIndependentFieldsWithStep[childChannel]);
        ops.push('distinct');
      }
      // Although it is technically a max, just name it distinct so it's easier to refer to it
      as.push(`distinct_${childIndependentFieldsWithStep[childChannel]}`);
    }

    const sort = channel === 'row' ? this.rowFieldSort : this.columnFieldSort;
    if (sort) {
      const {op, field} = sort;
      fields.push(field);
      ops.push(op);
      as.push(vgField(sort));
    }

    return {
      name: channel === 'row' ? this.rowName : this.columnName,
      // Use data from the crossed one if it exist
      source: crossedDataName || this.data,
      transform: [{
        type: 'aggregate',
        groupby: channel === 'row' ? this.rowFields : this.columnFields,
        ...(fields.length ? {
          fields, ops, as
        } : {})
      }]
    };
  }

  public assemble() {
    const data: VgData[] = [];
    let crossedDataName = null;
    const childIndependentFieldsWithStep = this.getChildIndependentFieldsWithStep();

    if (this.columnName && this.rowName && (childIndependentFieldsWithStep.x || childIndependentFieldsWithStep.y)) {
      // Need to create a cross dataset to correctly calculate cardinality
      crossedDataName = `cross_${this.columnName}_${this.rowName}`;

      const fields = [].concat(
        childIndependentFieldsWithStep.x ? [childIndependentFieldsWithStep.x] : [],
        childIndependentFieldsWithStep.y ? [childIndependentFieldsWithStep.y] : [],
      );
      const ops = fields.map((): AggregateOp => 'distinct');

      data.push({
        name: crossedDataName,
        source: this.data,
        transform: [{
          type: 'aggregate',
          groupby: this.columnFields.concat(this.rowFields),
          fields,
          ops
        }]
      });
    }

    if (this.columnName) {
      data.push(this.assembleRowColumnData('column', crossedDataName, childIndependentFieldsWithStep));
    }

    if (this.rowName) {
      data.push(this.assembleRowColumnData('row', crossedDataName, childIndependentFieldsWithStep));
    }

    return data;
  }
}
