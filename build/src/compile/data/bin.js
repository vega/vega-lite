"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bin_1 = require("../../bin");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
function numberFormatExpr(expr, format) {
    return "format(" + expr + ", '" + format + "')";
}
function rangeFormula(model, fieldDef, channel) {
    var discreteDomain = scale_1.hasDiscreteDomain(model.scale(channel).type);
    if (discreteDomain) {
        // read format from axis or legend, if there is no format then use config.numberFormat
        var format = (model.axis(channel) || model.legend(channel) || {}).format ||
            model.config.numberFormat;
        var startField = fielddef_1.field(fieldDef, { datum: true, binSuffix: 'start' });
        var endField = fielddef_1.field(fieldDef, { datum: true, binSuffix: 'end' });
        return {
            formulaAs: fielddef_1.field(fieldDef, { binSuffix: 'range' }),
            formula: numberFormatExpr(startField, format) + " + ' - ' + " + numberFormatExpr(endField, format)
        };
    }
    return {};
}
var BinNode = (function (_super) {
    tslib_1.__extends(BinNode, _super);
    function BinNode(bins) {
        var _this = _super.call(this) || this;
        _this.bins = bins;
        return _this;
    }
    BinNode.prototype.clone = function () {
        return new BinNode(util_1.duplicate(this.bins));
    };
    BinNode.make = function (model) {
        var bins = model.reduceFieldDef(function (binComponent, fieldDef, channel) {
            var fieldDefBin = model.fieldDef(channel).bin;
            if (fieldDefBin) {
                var bin = util_1.isBoolean(fieldDefBin) ? {} : fieldDefBin;
                var key = bin_1.binToString(fieldDef.bin) + "_" + fieldDef.field;
                if (!(key in binComponent)) {
                    binComponent[key] = {
                        bin: bin,
                        field: fieldDef.field,
                        as: [fielddef_1.field(fieldDef, { binSuffix: 'start' }), fielddef_1.field(fieldDef, { binSuffix: 'end' })],
                        signal: util_1.varName(model.getName(key + "_bins")),
                        extentSignal: model.getName(key + '_extent')
                    };
                }
                binComponent[key] = tslib_1.__assign({}, binComponent[key], rangeFormula(model, fieldDef, channel));
            }
            return binComponent;
        }, {});
        if (Object.keys(bins).length === 0) {
            return null;
        }
        return new BinNode(bins);
    };
    BinNode.prototype.merge = function (other) {
        this.bins = util_1.extend(other.bins);
        other.remove();
    };
    BinNode.prototype.producedFields = function () {
        var out = {};
        util_1.vals(this.bins).forEach(function (c) {
            c.as.forEach(function (f) { return out[f] = true; });
        });
        return out;
    };
    BinNode.prototype.dependentFields = function () {
        var out = {};
        util_1.vals(this.bins).forEach(function (c) {
            out[c.field] = true;
        });
        return out;
    };
    BinNode.prototype.assemble = function () {
        return util_1.flatten(util_1.vals(this.bins).map(function (bin) {
            var transform = [];
            var binTrans = tslib_1.__assign({ type: 'bin', field: bin.field, as: bin.as, signal: bin.signal }, bin.bin);
            if (!bin.bin.extent) {
                transform.push({
                    type: 'extent',
                    field: bin.field,
                    signal: bin.extentSignal
                });
                binTrans.extent = { signal: bin.extentSignal };
            }
            transform.push(binTrans);
            if (bin.formula) {
                transform.push({
                    type: 'formula',
                    expr: bin.formula,
                    as: bin.formulaAs
                });
            }
            return transform;
        }));
    };
    return BinNode;
}(dataflow_1.DataFlowNode));
exports.BinNode = BinNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXdEO0FBRXhELDJDQUErQztBQUMvQyxxQ0FBOEM7QUFDOUMsbUNBQXVHO0FBR3ZHLHVDQUF3QztBQUd4QywwQkFBMEIsSUFBWSxFQUFFLE1BQWM7SUFDcEQsTUFBTSxDQUFDLFlBQVUsSUFBSSxXQUFNLE1BQU0sT0FBSSxDQUFDO0FBQ3hDLENBQUM7QUFFRCxzQkFBc0IsS0FBWSxFQUFFLFFBQWtCLEVBQUUsT0FBZ0I7SUFDcEUsSUFBTSxjQUFjLEdBQUcseUJBQWlCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVwRSxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ25CLHNGQUFzRjtRQUN0RixJQUFNLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNO1lBQ3hFLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO1FBRTVCLElBQU0sVUFBVSxHQUFHLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUN0RSxJQUFNLFFBQVEsR0FBRyxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFFbEUsTUFBTSxDQUFDO1lBQ0wsU0FBUyxFQUFFLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDO1lBQ2hELE9BQU8sRUFBSyxnQkFBZ0IsQ0FB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