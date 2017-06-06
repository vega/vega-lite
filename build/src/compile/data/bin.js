"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bin_1 = require("../../bin");
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
var common_1 = require("../common");
var unit_1 = require("../unit");
var dataflow_1 = require("./dataflow");
function numberFormatExpr(expr, format) {
    return "format(" + expr + ", '" + format + "')";
}
function rangeFormula(model, fieldDef, channel, config) {
    var discreteDomain = model.hasDiscreteDomain(channel);
    if (discreteDomain) {
        // read format from axis or legend, if there is no format then use config.numberFormat
        var guide = (model instanceof unit_1.UnitModel) ? (model.axis(channel) || model.legend(channel) || {}) : {};
        var format = common_1.numberFormat(fieldDef, guide.format, config, channel);
        var startField = fielddef_1.field(fieldDef, { expr: 'datum', binSuffix: 'start' });
        var endField = fielddef_1.field(fieldDef, { expr: 'datum', binSuffix: 'end' });
        return {
            formulaAs: fielddef_1.field(fieldDef, { binSuffix: 'range' }),
            formula: numberFormatExpr(startField, format) + " + ' - ' + " + numberFormatExpr(endField, format)
        };
    }
    return {};
}
function binKey(bin, field) {
    return bin_1.binToString(bin) + "_" + field;
}
function createBinComponent(bin, t, model, key) {
    return {
        bin: bin,
        field: t.field,
        as: [fielddef_1.field(t, { binSuffix: 'start' }), fielddef_1.field(t, { binSuffix: 'end' })],
        signal: model.getName(key + "_bins"),
        extentSignal: model.getName(key + '_extent')
    };
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
    BinNode.makeBinFromEncoding = function (model) {
        var bins = model.reduceFieldDef(function (binComponent, fieldDef, channel) {
            var fieldDefBin = model.fieldDef(channel).bin;
            if (fieldDefBin) {
                var bin = fielddef_1.normalizeBin(fieldDefBin, undefined) || {};
                var key = binKey(fieldDefBin, fieldDef.field);
                if (!(key in binComponent)) {
                    binComponent[key] = createBinComponent(bin, fieldDef, model, key);
                }
                binComponent[key] = tslib_1.__assign({}, binComponent[key], rangeFormula(model, fieldDef, channel, model.config));
            }
            return binComponent;
        }, {});
        if (Object.keys(bins).length === 0) {
            return null;
        }
        return new BinNode(bins);
    };
    BinNode.makeBinFromTransform = function (model, t) {
        var bins = {};
        var bin = fielddef_1.normalizeBin(t.bin, undefined) || {};
        var key = binKey(bin, t.field);
        return new BinNode((_a = {},
            _a[key] = createBinComponent(bin, t, model, key),
            _a));
        var _a;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXdEO0FBR3hELDJDQUE2RDtBQUc3RCxtQ0FBOEY7QUFFOUYsb0NBQXVDO0FBRXZDLGdDQUFrQztBQUNsQyx1Q0FBd0M7QUFHeEMsMEJBQTBCLElBQVksRUFBRSxNQUFjO0lBQ3BELE1BQU0sQ0FBQyxZQUFVLElBQUksV0FBTSxNQUFNLE9BQUksQ0FBQztBQUN4QyxDQUFDO0FBRUQsc0JBQXNCLEtBQXFCLEVBQUUsUUFBMEIsRUFBRSxPQUFnQixFQUFFLE1BQWM7SUFDckcsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXhELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsc0ZBQXNGO1FBRXRGLElBQU0sS0FBSyxHQUFHLENBQUMsS0FBSyxZQUFZLGdCQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdkcsSUFBTSxNQUFNLEdBQUcscUJBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFckUsSUFBTSxVQUFVLEdBQUcsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ3hFLElBQU0sUUFBUSxHQUFHLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUVwRSxNQUFNLENBQUM7WUFDTCxT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