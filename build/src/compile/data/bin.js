"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bin_1 = require("../../bin");
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
var common_1 = require("../common");
var model_1 = require("../model");
var dataflow_1 = require("./dataflow");
function rangeFormula(model, fieldDef, channel, config) {
    var discreteDomain = model.hasDiscreteDomain(channel);
    if (discreteDomain) {
        // read format from axis or legend, if there is no format then use config.numberFormat
        var guide = model_1.isUnitModel(model) ? (model.axis(channel) || model.legend(channel) || {}) : {};
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
                var key = binKey(bin, fieldDef.field);
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
    BinNode.makeFromTransform = function (model, t) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQXdEO0FBR3hELDJDQUE2RDtBQUc3RCxtQ0FBb0c7QUFFcEcsb0NBQTJDO0FBQzNDLGtDQUE0RDtBQUU1RCx1Q0FBd0M7QUFFeEMsc0JBQXNCLEtBQXFCLEVBQUUsUUFBMEIsRUFBRSxPQUFnQixFQUFFLE1BQWM7SUFDckcsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXhELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsc0ZBQXNGO1FBRXRGLElBQU0sS0FBSyxHQUFHLG1CQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRTdGLElBQU0sVUFBVSxHQUFHLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUN4RSxJQUFNLFFBQVEsR0FBRyxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFFcEUsTUFBTSxDQUFDO1lBQ0wsU0FBUyxFQUFFLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDO1lBQ2hELE9BQU8sRUFBSyx5QkFBZ0IsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMscUJBQWMseUJBQWdCLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUs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