import {ChannelDef, isScaleFieldDef} from '../../fielddef';
import {isSortArray} from '../../sort';
import {duplicate} from '../../util';
import {VgFormulaTransform} from '../../vega.schema';
import {ModelWithField} from '../model';
import {Channel} from './../../channel';
import {CalculateTransform} from './../../transform';
import {DataFlowNode} from './dataflow';

/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
export class CalculateNode extends DataFlowNode {
  public clone() {
    return new CalculateNode(null, duplicate(this.transform));
  }

  constructor(parent: DataFlowNode, private transform: CalculateTransform) {
    super(parent);
  }

  public static makeAllForSortIndex(parent: DataFlowNode, model: ModelWithField): CalculateNode[] {
    // get all the encoding with sort fields from model
    const nodes = model.reduceFieldDef((acc: CalculateNode[], fieldDef: ChannelDef<any>, channel: Channel) => {
      if (isScaleFieldDef(fieldDef) && isSortArray(fieldDef.sort)) {
        const transform: CalculateTransform = {
          calculate: CalculateNode.calculateExpressionFromSortField(fieldDef.field, fieldDef.sort),
          as: `${channel}_${fieldDef.field}_sort_index`
        };
         acc.push(new CalculateNode(parent, transform));
      }
      return acc;
    }, [] as CalculateNode[]);
    return nodes;
  }

  public static calculateExpressionFromSortField(field: string, sortFields: string[]): string {
    let expression = '';
    let i: number;
    for (i = 0; i < sortFields.length; i++) {
      expression += `datum.${field} === '${sortFields[i]}' ? ${i} : `;
    }
    expression += i;
    return expression;
  }

  public producedFields() {
    const out = {};
    out[this.transform.as] = true;
    return out;
  }

  public assemble(): VgFormulaTransform {
    return {
      type: 'formula',
      expr: this.transform.calculate,
      as: this.transform.as
    };
  }
}
