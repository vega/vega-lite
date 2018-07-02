import {DateTime} from '../../datetime';
import {FieldDef, isScaleFieldDef, vgField} from '../../fielddef';
import {fieldFilterExpression} from '../../predicate';
import {isSortArray} from '../../sort';
import {duplicate} from '../../util';
import {VgFormulaTransform} from '../../vega.schema';
import {ModelWithField} from '../model';
import {SingleDefChannel} from './../../channel';
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

  public static parseAllForSortIndex(parent: DataFlowNode, model: ModelWithField) {
    // get all the encoding with sort fields from model
    model.forEachFieldDef((fieldDef: FieldDef<string>, channel: SingleDefChannel) => {
      if (!isScaleFieldDef(fieldDef)) {
        return;
      }
      if (isSortArray(fieldDef.sort)) {
        const {field, timeUnit} = fieldDef;
        const sort: (number | string | boolean | DateTime)[] = fieldDef.sort;
        // generate `datum["a"] === val0 ? 0 : datum["a"] === val1 ? 1 : ... : n` via FieldEqualPredicate
        const calculate = sort.map((sortValue, i) => {
          return `${fieldFilterExpression({field, timeUnit, equal: sortValue})} ? ${i} : `;
        }).join('') + sort.length;

        parent = new CalculateNode(parent, {
          calculate,
          as: sortArrayIndexField(fieldDef, channel)
        });
      }
    });
    return parent;
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

export function sortArrayIndexField(fieldDef: FieldDef<string>, channel: SingleDefChannel, expr?: 'datum') {
  return vgField(fieldDef, {prefix: channel, suffix: 'sort_index', expr});
}
