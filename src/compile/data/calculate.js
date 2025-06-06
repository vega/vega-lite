import {isScaleFieldDef, vgField} from '../../channeldef.js';
import {fieldFilterExpression} from '../../predicate.js';
import {isSortArray} from '../../sort.js';
import {duplicate, hash} from '../../util.js';
import {DataFlowNode} from './dataflow.js';
import {getDependentFields} from './expressions.js';
export class CalculateNode extends DataFlowNode {
  transform;
  _dependentFields;
  clone() {
    return new CalculateNode(null, duplicate(this.transform));
  }
  constructor(parent, transform) {
    super(parent);
    this.transform = transform;
    this._dependentFields = getDependentFields(this.transform.calculate);
  }
  static parseAllForSortIndex(parent, model) {
    // get all the encoding with sort fields from model
    model.forEachFieldDef((fieldDef, channel) => {
      if (!isScaleFieldDef(fieldDef)) {
        return;
      }
      if (isSortArray(fieldDef.sort)) {
        const {field, timeUnit} = fieldDef;
        const sort = fieldDef.sort;
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
  producedFields() {
    return new Set([this.transform.as]);
  }
  dependentFields() {
    return this._dependentFields;
  }
  assemble() {
    return {
      type: 'formula',
      expr: this.transform.calculate,
      as: this.transform.as,
    };
  }
  hash() {
    return `Calculate ${hash(this.transform)}`;
  }
}
export function sortArrayIndexField(fieldDef, channel, opt) {
  return vgField(fieldDef, {prefix: channel, suffix: 'sort_index', ...opt});
}
//# sourceMappingURL=calculate.js.map
