import {AggregateOp} from 'vega';
import {COLUMN, ROW, ScaleChannel} from '../../channel';
import * as log from '../../log';
import {hasDiscreteDomain} from '../../scale';
import {isVgRangeStep, VgAggregateTransform, VgData} from '../../vega.schema';
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
  private readonly columnName: string;

  private readonly rowFields: string[];
  private readonly rowName: string;

  private readonly childModel: Model;

  /**
   * @param model The facet model.
   * @param name The name that this facet source will have.
   * @param data The source data for this facet data.
   */
  public constructor(parent: DataFlowNode, public readonly model: FacetModel, public readonly name: string, public data: string) {
    super(parent);

    if (model.facet.column) {
      this.columnFields = [model.vgField(COLUMN)];
      this.columnName = model.getName('column_domain');
      if (model.fieldDef(COLUMN).bin) {
        this.columnFields.push(model.vgField(COLUMN, {binSuffix: 'end'}));
      }
    }

    if (model.facet.row) {
      this.rowFields = [model.vgField(ROW)];
      this.rowName = model.getName('row_domain');
      if (model.fieldDef(ROW).bin) {
        this.rowFields.push(model.vgField(ROW, {binSuffix: 'end'}));
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
    let aggregateChildField: Partial<VgAggregateTransform> = {};
    const childChannel = channel === 'row' ? 'y' : 'x';

    if (childIndependentFieldsWithStep[childChannel]) {
      if (crossedDataName) {
        aggregateChildField = {
          // If there is a crossed data, calculate max
          fields: [`distinct_${childIndependentFieldsWithStep[childChannel]}`],
          ops: ['max'],
          // Although it is technically a max, just name it distinct so it's easier to refer to it
          as: [`distinct_${childIndependentFieldsWithStep[childChannel]}`]
        };
      } else {
        aggregateChildField = {
          // If there is no crossed data, just calculate distinct
          fields: [childIndependentFieldsWithStep[childChannel]],
          ops: ['distinct']
        };
      }
    }

    return {
      name: channel === 'row' ? this.rowName : this.columnName,
      // Use data from the crossed one if it exist
      source: crossedDataName || this.data,
      transform: [{
        type: 'aggregate',
        groupby: channel === 'row' ? this.rowFields : this.columnFields,
        ...aggregateChildField
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
          fields: fields,
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
