import * as tslib_1 from "tslib";
import { isScaleFieldDef, vgField } from '../../fielddef';
import { fieldFilterExpression } from '../../predicate';
import { isSortArray } from '../../sort';
import { duplicate } from '../../util';
import { DataFlowNode } from './dataflow';
/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
var CalculateNode = /** @class */ (function (_super) {
    tslib_1.__extends(CalculateNode, _super);
    function CalculateNode(parent, transform) {
        var _this = _super.call(this, parent) || this;
        _this.transform = transform;
        return _this;
    }
    CalculateNode.prototype.clone = function () {
        return new CalculateNode(null, duplicate(this.transform));
    };
    CalculateNode.parseAllForSortIndex = function (parent, model) {
        // get all the encoding with sort fields from model
        model.forEachFieldDef(function (fieldDef, channel) {
            if (!isScaleFieldDef(fieldDef)) {
                return;
            }
            if (isSortArray(fieldDef.sort)) {
                var field_1 = fieldDef.field, timeUnit_1 = fieldDef.timeUnit;
                var sort = fieldDef.sort;
                // generate `datum["a"] === val0 ? 0 : datum["a"] === val1 ? 1 : ... : n` via FieldEqualPredicate
                var calculate = sort
                    .map(function (sortValue, i) {
                    return fieldFilterExpression({ field: field_1, timeUnit: timeUnit_1, equal: sortValue }) + " ? " + i + " : ";
                })
                    .join('') + sort.length;
                parent = new CalculateNode(parent, {
                    calculate: calculate,
                    as: sortArrayIndexField(fieldDef, channel, { forAs: true })
                });
            }
        });
        return parent;
    };
    CalculateNode.prototype.producedFields = function () {
        var out = {};
        out[this.transform.as] = true;
        return out;
    };
    CalculateNode.prototype.assemble = function () {
        return {
            type: 'formula',
            expr: this.transform.calculate,
            as: this.transform.as
        };
    };
    return CalculateNode;
}(DataFlowNode));
export { CalculateNode };
export function sortArrayIndexField(fieldDef, channel, opt) {
    return vgField(fieldDef, tslib_1.__assign({ prefix: channel, suffix: 'sort_index' }, (opt || {})));
}
//# sourceMappingURL=calculate.js.map