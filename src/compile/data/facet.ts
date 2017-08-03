import {AggregateOp} from '../../aggregate';
import {COLUMN, ROW, ScaleChannel} from '../../channel';
import {hasDiscreteDomain} from '../../scale';
import {isVgRangeStep, VgAggregateTransform, VgData, VgTransform} from '../../vega.schema';
import {FacetModel} from '../facet';
import {getFieldFromDomains} from '../scale/domain';
import {DataFlowNode, OutputNode} from './dataflow';

/**
 * A node that helps us track what fields we are faceting by.
 */
export class FacetNode extends DataFlowNode {
  private readonly columnField: string;
  private readonly columnName: string;

  private readonly childIndependentFieldWithStep: {
    x?: string,
    y?: string
  } = {};

  private readonly rowField: string;
  private readonly rowName: string;

  /**
   * @param model The facet model.
   * @param name The name that this facet source will have.
   * @param data The source data for this facet data.
   */
  public constructor(public readonly model: FacetModel, public readonly name: string, public data: string) {
    super();

    if (model.facet.column) {
      this.columnField = model.field(COLUMN);
      this.columnName = model.getName('column');
    }

    if (model.facet.row) {
      this.rowField = model.field(ROW);
      this.rowName = model.getName('row');
    }

    for (const channel of ['x', 'y'] as ScaleChannel[]) {
      const childScaleComponent = model.child.component.scales[channel];
      if (childScaleComponent && !childScaleComponent.merged) {
        const type = childScaleComponent.get('type');
        const range = childScaleComponent.get('range');

        if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
          const field = getFieldFromDomains(childScaleComponent.domains);
          if (field) {
            this.childIndependentFieldWithStep[channel] = field;
          } else {
            throw new Error('We do not yet support calculation of size for faceted union domain.');
          }
        }
      }
    }
  }

  get fields() {
    const fields: string[] = [];
    if (this.columnField) {
      fields.push(this.columnField);
    }
    if (this.rowField) {
      fields.push(this.rowField);
    }
    return fields;
  }

  /**
   * The name to reference this source is its name.
   */
  public getSource() {
    return this.name;
  }

  private assembleRowColumnData(channel: 'row' | 'column', crossedDataName: string): VgData {
    const childChannel = channel === 'row' ? 'y' : 'x';

    let aggregateChildField: Partial<VgAggregateTransform> = {};

    if (this.childIndependentFieldWithStep[childChannel]) {
      if (crossedDataName) {
        aggregateChildField = {
          // If there is a crossed data, calculate max
          fields: [`distinct_${this.childIndependentFieldWithStep[childChannel]}`],
          ops: ['max'],
          // Although it is technically a max, just name it distinct so it's easier to refer to it
          as: [`distinct_${this.childIndependentFieldWithStep[childChannel]}`]
        };
      } else {
        aggregateChildField = {
          // If there is no crossed data, just calculate distinct
          fields: [this.childIndependentFieldWithStep[childChannel]],
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
        groupby: [channel === 'row' ? this.rowField : this.columnField],
        ...aggregateChildField
      }]
    };
  }

  public assemble() {
    const data: VgData[] = [];
    let crossedDataName = null;

    if (this.columnName && this.rowName && (this.childIndependentFieldWithStep.x || this.childIndependentFieldWithStep.y)) {
      // Need to create a cross dataset to correctly calculate cardinality
      crossedDataName = `cross_${this.columnName}_${this.rowName}`;

      const fields = [].concat(
        this.childIndependentFieldWithStep.x ? [this.childIndependentFieldWithStep.x] : [],
        this.childIndependentFieldWithStep.y ? [this.childIndependentFieldWithStep.y] : [],
      );
      const ops = fields.map((): AggregateOp => 'distinct');

      data.push({
        name: crossedDataName,
        source: this.data,
        transform: [{
          type: 'aggregate',
          groupby: [this.columnField, this.rowField],
          fields: fields,
          ops
        }]
      });
    }

    if (this.columnName) {
      data.push(this.assembleRowColumnData('column', crossedDataName));

      if (!this.parent || !(this.parent instanceof FacetModel)) {
        // Unless this facet's parent is a facet model,
        // column needs another data source to calculate cardinality as input to layout
        data.push({
          name: this.columnName + '_layout',
          source: this.columnName,
          transform: [{
            type: 'aggregate',
            ops: ['distinct'],
            fields: [this.columnField]
          }]
        });
      }
    }

    if (this.rowName) {
      data.push(this.assembleRowColumnData('row', crossedDataName));
    }

    return data;
  }
}
