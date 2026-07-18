import {FormulaTransform as VgFormulaTransform} from 'vega';
import {SingleDefChannel} from '../../channel.js';
import {FieldRefOption, isScaleFieldDef, TypedFieldDef, vgField} from '../../channeldef.js';
import {DateTime} from '../../datetime.js';
import {fieldFilterExpression} from '../../predicate.js';
import {isSortArray} from '../../sort.js';
import {CalculateTransform} from '../../transform.js';
import {duplicate, hash} from '../../util.js';
import {ModelWithField} from '../model.js';
import {DataFlowNode} from './dataflow.js';
import {getDependentFields} from './expressions.js';

export class CalculateNode extends DataFlowNode {
  private _dependentFields: Set<string>;

  public clone() {
    return new CalculateNode(null, duplicate(this.transform));
  }

  constructor(
    parent: DataFlowNode,
    private readonly transform: CalculateTransform,
  ) {
    super(parent);

    this._dependentFields = getDependentFields(this.transform.calculate);
  }

  public static parseAllForSortIndex(parent: DataFlowNode, model: ModelWithField) {
    // get all the encoding with sort fields from model
    model.forEachFieldDef((fieldDef: TypedFieldDef<string>, channel: SingleDefChannel) => {
      if (!isScaleFieldDef(fieldDef)) {
        return;
      }
      if (isSortArray(fieldDef.sort)) {
        const {field, timeUnit} = fieldDef;
        const sort: (number | string | boolean | DateTime)[] = fieldDef.sort;
        // generate `datum["a"] === val0 ? 0 : datum["a"] === val1 ? 1 : ... : n` via FieldEqualPredicate
        const calculate =
          sort
            .map((sortValue, i) => {
              return `${fieldFilterExpression({field, timeUnit, equal: sortValue})} ? ${i} : `;
            })
            .join('') + sort.length;

        parent = new CalculateNode(parent, {
          calculate,
          as: sortArrayIndexField(fieldDef, channel, {forAs: true}),
        });
      }
    });
    return parent;
  }

  public producedFields() {
    return new Set([this.transform.as]);
  }

  public dependentFields() {
    return this._dependentFields;
  }

  public assemble(): VgFormulaTransform {
    return {
      type: 'formula',
      expr: this.transform.calculate,
      as: this.transform.as,
    };
  }

  public hash() {
    return `Calculate ${hash(this.transform)}`;
  }
}

export function sortArrayIndexField(fieldDef: TypedFieldDef<string>, channel: SingleDefChannel, opt?: FieldRefOption) {
  return vgField(fieldDef, {prefix: channel, suffix: 'sort_index', ...opt});
}
