import {SingleDefChannel} from '../../channel';
import {DateTime} from '../../datetime';
import {FieldDef, isScaleFieldDef, vgField} from '../../fielddef';
import {FieldRefOption} from '../../fielddef';
import {fieldFilterExpression} from '../../predicate';
import {isSortArray} from '../../sort';
import {CalculateTransform} from '../../transform';
import {duplicate, hash, StringSet} from '../../util';
import {VgFormulaTransform} from '../../vega.schema';
import {ModelWithField} from '../model';

import {DataFlowNode, TransformNode} from './dataflow';
import {getDependentFields} from './expressions';

/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */

export class CalculateNode extends TransformNode {
  private _dependentFields: StringSet;

  public clone() {
    return new CalculateNode(null, duplicate(this.transform));
  }

  constructor(parent: DataFlowNode, private transform: CalculateTransform) {
    super(parent);

    this._dependentFields = getDependentFields(this.transform.calculate);
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
        const calculate =
          sort
            .map((sortValue, i) => {
              return `${fieldFilterExpression({field, timeUnit, equal: sortValue})} ? ${i} : `;
            })
            .join('') + sort.length;

        parent = new CalculateNode(parent, {
          calculate,
          as: sortArrayIndexField(fieldDef, channel, {forAs: true})
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

  public dependentFields() {
    return this._dependentFields;
  }

  public assemble(): VgFormulaTransform {
    return {
      type: 'formula',
      expr: this.transform.calculate,
      as: this.transform.as
    };
  }

  public hash() {
    return `Calculate ${hash(this.transform)}`;
  }
}

export function sortArrayIndexField(fieldDef: FieldDef<string>, channel: SingleDefChannel, opt?: FieldRefOption) {
  return vgField(fieldDef, {prefix: channel, suffix: 'sort_index', ...(opt || {})});
}
