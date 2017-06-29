"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bin_1 = require("../../bin");
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
var common_1 = require("../common");
var unit_1 = require("../unit");
var dataflow_1 = require("./dataflow");
function rangeFormula(model, fieldDef, channel, config) {
    var discreteDomain = model.hasDiscreteDomain(channel);
    if (discreteDomain) {
        // read format from axis or legend, if there is no format then use config.numberFormat
        var guide = (model instanceof unit_1.UnitModel) ? (model.axis(channel) || model.legend(channel) || {}) : {};
        var startField = fielddef_1.field(fieldDef, { expr: 'datum', binSuffix: 'start' });
        var endField = fielddef_1.field(fieldDef, { expr: 'datum', binSuffix: 'end' });
        return {
            formulaAs: fielddef_1.field(fieldDef, { binSuffix: 'range' }),
            formula: common_1.numberFormatExpr(startField, guide.format, config) + " + \" - \" + " + common_1.numberFormatExpr(endField, guide.format, config)
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
            var fieldDefBin = fieldDef.bin;
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
        if (util_1.keys(bins).length === 0) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXdEO0FBR3hELDJDQUE2RDtBQUc3RCxtQ0FBb0c7QUFFcEcsb0NBQTJDO0FBRTNDLGdDQUFrQztBQUNsQyx1Q0FBd0M7QUFFeEMsc0JBQXNCLEtBQXFCLEVBQUUsUUFBMEIsRUFBRSxPQUFnQixFQUFFLE1BQWM7SUFDckcsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXhELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsc0ZBQXNGO1FBRXRGLElBQU0sS0FBSyxHQUFHLENBQUMsS0FBSyxZQUFZLGdCQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFdkcsSUFBTSxVQUFVLEdBQUcsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ3hFLElBQU0sUUFBUSxHQUFHLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUVwRSxNQUFNLENBQUM7WUFDTCxTQUFTLEVBQUUsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLENBQUM7WUFDaEQsT0FBTyxFQUFLLHlCQUFnQixDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxxQkFBYyx5QkFBZ0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE1BQU0s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