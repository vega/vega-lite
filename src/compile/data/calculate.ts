import {SingleDefChannel} from '../../channel';
import {FieldRefOption, isScaleFieldDef, TypedFieldDef, vgField} from '../../channeldef';
import {DateTime} from '../../datetime';
import {fieldFilterExpression} from '../../predicate';
import {isSortArray} from '../../sort';
import {CalculateTransform} from '../../transform';
import {duplicate, hash, keys, Dict, vals} from '../../util';
import {VgFormulaTransform} from '../../vega.schema';
import {ModelWithField} from '../model';
import {DataFlowNode} from './dataflow';
import {getDependentFields} from './expressions';

export class CalculateNode extends DataFlowNode {
  public clone() {
    return new CalculateNode(null, duplicate(this.calculates));
  }

  constructor(parent: DataFlowNode, private calculates: Dict<CalculateTransform>) {
    super(parent);
  }

  public static makeFromTransform(parent: DataFlowNode, transform: CalculateTransform) {
    return new CalculateNode(parent, {
      [transform.as]: transform
    });
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

        parent = this.makeFromTransform(parent, {
          calculate,
          as: sortArrayIndexField(fieldDef, channel, {forAs: true})
        });
      }
    });
    return parent;
  }

  /**
   * Merge calculate nodes. This method either integrates the bin config from the other node
   * or if this node already has a bin config, renames the corresponding signal in the model.
   */
  public merge(other: CalculateNode) {
    for (const key of keys(other.calculates)) {
      if (key in this.calculates) {
        // make sure we are not merging something incompatible
        if (this.calculates[key].calculate !== other.calculates[key].calculate) {
          throw new Error('Merged incompatible calculates.');
        }
      } else {
        this.calculates[key] = other.calculates[key];
      }
    }

    for (const child of other.children) {
      other.removeChild(child);
      child.parent = this;
    }
    other.remove();
  }

  public producedFields() {
    return new Set(vals(this.calculates).map(c => c.as));
  }

  public dependentFields() {
    let depFields = new Set<string>();

    for (const c of vals(this.calculates)) {
      depFields = new Set([...depFields, ...getDependentFields(c.calculate)]);
    }

    return depFields;
  }

  public assemble(): VgFormulaTransform[] {
    const transforms: VgFormulaTransform[] = [];

    for (const c of vals(this.calculates)) {
      transforms.push({
        type: 'formula',
        expr: c.calculate,
        as: c.as
      });
    }

    return transforms;
  }

  public hash() {
    return `Calculate ${hash(this.calculates)}`;
  }
}

export function sortArrayIndexField(fieldDef: TypedFieldDef<string>, channel: SingleDefChannel, opt?: FieldRefOption) {
  return vgField(fieldDef, {prefix: channel, suffix: 'sort_index', ...(opt || {})});
}
