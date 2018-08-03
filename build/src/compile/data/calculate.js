"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fielddef_1 = require("../../fielddef");
var predicate_1 = require("../../predicate");
var sort_1 = require("../../sort");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var expressions_1 = require("./expressions");
/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
var CalculateNode = /** @class */ (function (_super) {
    tslib_1.__extends(CalculateNode, _super);
    function CalculateNode(parent, transform) {
        var _this = _super.call(this, parent) || this;
        _this.transform = transform;
        _this._dependentFields = expressions_1.getDependentFields(_this.transform.calculate);
        return _this;
    }
    CalculateNode.prototype.clone = function () {
        return new CalculateNode(null, util_1.duplicate(this.transform));
    };
    CalculateNode.parseAllForSortIndex = function (parent, model) {
        // get all the encoding with sort fields from model
        model.forEachFieldDef(function (fieldDef, channel) {
            if (!fielddef_1.isScaleFieldDef(fieldDef)) {
                return;
            }
            if (sort_1.isSortArray(fieldDef.sort)) {
                var field_1 = fieldDef.field, timeUnit_1 = fieldDef.timeUnit;
                var sort = fieldDef.sort;
                // generate `datum["a"] === val0 ? 0 : datum["a"] === val1 ? 1 : ... : n` via FieldEqualPredicate
                var calculate = sort
                    .map(function (sortValue, i) {
                    return predicate_1.fieldFilterExpression({ field: field_1, timeUnit: timeUnit_1, equal: sortValue }) + " ? " + i + " : ";
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
    CalculateNode.prototype.dependentFields = function () {
        return this._dependentFields;
    };
    CalculateNode.prototype.assemble = function () {
        return {
            type: 'formula',
            expr: this.transform.calculate,
            as: this.transform.as
        };
    };
    CalculateNode.prototype.hash = function () {
        return "Calculate " + util_1.hash(this.transform);
    };
    return CalculateNode;
}(dataflow_1.TransformNode));
exports.CalculateNode = CalculateNode;
function sortArrayIndexField(fieldDef, channel, opt) {
    return fielddef_1.vgField(fieldDef, tslib_1.__assign({ prefix: channel, suffix: 'sort_index' }, (opt || {})));
}
exports.sortArrayIndexField = sortArrayIndexField;
//# sourceMappingURL=calculate.js.map