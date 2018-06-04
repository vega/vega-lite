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
    if (common_1.binRequiresRange(fieldDef, channel)) {
        // read format from axis or legend, if there is no format then use config.numberFormat
        var guide = model_1.isUnitModel(model) ? (model.axis(channel) || model.legend(channel) || {}) : {};
        var startField = fielddef_1.vgField(fieldDef, { expr: 'datum', });
        var endField = fielddef_1.vgField(fieldDef, { expr: 'datum', binSuffix: 'end' });
        return {
            formulaAs: fielddef_1.vgField(fieldDef, { binSuffix: 'range' }),
            formula: common_1.binFormatExpression(startField, endField, guide.format, config)
        };
    }
    return {};
}
function binKey(bin, field) {
    return bin_1.binToString(bin) + "_" + field;
}
function getSignalsFromModel(model, key) {
    return {
        signal: model.getName(key + "_bins"),
        extentSignal: model.getName(key + "_extent")
    };
}
function isBinTransform(t) {
    return 'as' in t;
}
function createBinComponent(t, model) {
    var as;
    if (isBinTransform(t)) {
        as = [t.as, t.as + "_end"];
    }
    else {
        as = [fielddef_1.vgField(t, {}), fielddef_1.vgField(t, { binSuffix: 'end' })];
    }
    var bin = fielddef_1.normalizeBin(t.bin, undefined) || {};
    var key = binKey(bin, t.field);
    var _a = getSignalsFromModel(model, key), signal = _a.signal, extentSignal = _a.extentSignal;
    var binComponent = tslib_1.__assign({ bin: bin, field: t.field, as: as }, signal ? { signal: signal } : {}, extentSignal ? { extentSignal: extentSignal } : {});
    return { key: key, binComponent: binComponent };
}
var BinNode = /** @class */ (function (_super) {
    tslib_1.__extends(BinNode, _super);
    function BinNode(parent, bins) {
        var _this = _super.call(this, parent) || this;
        _this.bins = bins;
        return _this;
    }
    BinNode.prototype.clone = function () {
        return new BinNode(null, util_1.duplicate(this.bins));
    };
    BinNode.makeFromEncoding = function (parent, model) {
        var bins = model.reduceFieldDef(function (binComponentIndex, fieldDef, channel) {
            if (fieldDef.bin) {
                var _a = createBinComponent(fieldDef, model), key = _a.key, binComponent = _a.binComponent;
                binComponentIndex[key] = tslib_1.__assign({}, binComponent, binComponentIndex[key], rangeFormula(model, fieldDef, channel, model.config));
            }
            return binComponentIndex;
        }, {});
        if (util_1.keys(bins).length === 0) {
            return null;
        }
        return new BinNode(parent, bins);
    };
    /**
     * Creates a bin node from BinTransform.
     * The optional parameter should provide
     */
    BinNode.makeFromTransform = function (parent, t, model) {
        var _a;
        var _b = createBinComponent(t, model), key = _b.key, binComponent = _b.binComponent;
        return new BinNode(parent, (_a = {},
            _a[key] = binComponent,
            _a));
    };
    BinNode.prototype.merge = function (other) {
        this.bins = tslib_1.__assign({}, this.bins, other.bins);
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
            if (!bin.bin.extent && bin.extentSignal) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWlEO0FBR2pELDJDQUErRDtBQUUvRCxtQ0FBZ0U7QUFFaEUsb0NBQWdFO0FBQ2hFLGtDQUE0RDtBQUM1RCx1Q0FBd0M7QUFHeEMsc0JBQXNCLEtBQXFCLEVBQUUsUUFBMEIsRUFBRSxPQUFnQixFQUFFLE1BQWM7SUFDckcsSUFBSSx5QkFBZ0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUU7UUFDdkMsc0ZBQXNGO1FBRXRGLElBQU0sS0FBSyxHQUFHLG1CQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFN0YsSUFBTSxVQUFVLEdBQUcsa0JBQU8sQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxHQUFFLENBQUMsQ0FBQztRQUN2RCxJQUFNLFFBQVEsR0FBRyxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFFdEUsT0FBTztZQUNMLFNBQVMsRUFBRSxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQztZQUNsRCxPQUFPLEVBQUUsNEJBQW1CLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztTQUN6RSxDQUFDO0tBQ0g7SUFDRCxPQUFPLEVBQUUsQ0FBQztBQUNkLENBQUM7QUFFRCxnQkFBZ0IsR0FBYyxFQUFFLEtBQWE7SUFDM0MsT0FBVSxpQkFBVyxDQUFD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QUUsQ0FBQztZQUVwQyxJQUFNLFFBQVEsc0JBQ1YsSUFBSSxFQUFFLEtBQUssRUFDWCxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFDaEIsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQ1YsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLElBQ2YsR0FBRyxDQUFDLEdBQUcsQ0FDYixDQUFDO1lBRUYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxZQUFZLEVBQUU7Z0JBQ3ZDLFNBQVMsQ0FBQyxJQUFJLENBQUM7b0JBQ2IsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLO29CQUNoQixNQUFNLEVBQUUsR0FBRyxDQUFDLFlBQVk7aUJBQ3pCLENBQUMsQ0FBQztnQkFDSCxRQUFRLENBQUMsTUFBTSxHQUFHLEVBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxZQUFZLEVBQUMsQ0FBQzthQUM5QztZQUVELFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFekIsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFO2dCQUNmLFNBQVMsQ0FBQyxJQUFJLENBQUM7b0JBQ2IsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsSUFBSSxFQUFFLEdBQUcsQ0FBQyxPQUFPO29CQUNqQixFQUFFLEVBQUUsR0FBRyxDQUFDLFNBQVM7aUJBQ2xCLENBQUMsQ0FBQzthQUNKO1lBRUQsT0FBTyxTQUFTLENBQUM7UUFDbkIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7SUFDSCxjQUFDO0FBQUQsQ0FBQyxBQW5HRCxDQUE2Qix1QkFBWSxHQW1HeEM7QUFuR1ksMEJBQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0JpblBhcmFtcywgYmluVG9TdHJpbmd9IGZyb20gJy4uLy4uL2Jpbic7XG5pbXBvcnQge0NoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0ZpZWxkRGVmLCBub3JtYWxpemVCaW4sIHZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7QmluVHJhbnNmb3JtfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtEaWN0LCBkdXBsaWNhdGUsIGZsYXR0ZW4sIGtleXMsIHZhbHN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0JpblRyYW5zZm9ybSwgVmdUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7YmluRm9ybWF0RXhwcmVzc2lvbiwgYmluUmVxdWlyZXNSYW5nZX0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7aXNVbml0TW9kZWwsIE1vZGVsLCBNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5cbmZ1bmN0aW9uIHJhbmdlRm9ybXVsYShtb2RlbDogTW9kZWxXaXRoRmllbGQsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsLCBjb25maWc6IENvbmZpZykge1xuICAgIGlmIChiaW5SZXF1aXJlc1JhbmdlKGZpZWxkRGVmLCBjaGFubmVsKSkge1xuICAgICAgLy8gcmVhZCBmb3JtYXQgZnJvbSBheGlzIG9yIGxlZ2VuZCwgaWYgdGhlcmUgaXMgbm8gZm9ybWF0IHRoZW4gdXNlIGNvbmZpZy5udW1iZXJGb3JtYXRcblxuICAgICAgY29uc3QgZ3VpZGUgPSBpc1VuaXRNb2RlbChtb2RlbCkgPyAobW9kZWwuYXhpcyhjaGFubmVsKSB8fCBtb2RlbC5sZWdlbmQoY2hhbm5lbCkgfHwge30pIDoge307XG5cbiAgICAgIGNvbnN0IHN0YXJ0RmllbGQgPSB2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwcjogJ2RhdHVtJyx9KTtcbiAgICAgIGNvbnN0IGVuZEZpZWxkID0gdmdGaWVsZChmaWVsZERlZiwge2V4cHI6ICdkYXR1bScsIGJpblN1ZmZpeDogJ2VuZCd9KTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZm9ybXVsYUFzOiB2Z0ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAncmFuZ2UnfSksXG4gICAgICAgIGZvcm11bGE6IGJpbkZvcm1hdEV4cHJlc3Npb24oc3RhcnRGaWVsZCwgZW5kRmllbGQsIGd1aWRlLmZvcm1hdCwgY29uZmlnKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xufVxuXG5mdW5jdGlvbiBiaW5LZXkoYmluOiBCaW5QYXJhbXMsIGZpZWxkOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGAke2JpblRvU3RyaW5nKGJpbil9XyR7ZmllbGR9YDtcbn1cblxuZnVuY3Rpb24gZ2V0U2lnbmFsc0Zyb21Nb2RlbChtb2RlbDogTW9kZWwsIGtleTogc3RyaW5nKSB7XG4gIHJldHVybiB7XG4gICAgc2lnbmFsOiBtb2RlbC5nZXROYW1lKGAke2tleX1fYmluc2ApLFxuICAgIGV4dGVudFNpZ25hbDogbW9kZWwuZ2V0TmFtZShgJHtrZXl9X2V4dGVudGApXG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzQmluVHJhbnNmb3JtKHQ6IEZpZWxkRGVmPHN0cmluZz4gfCBCaW5UcmFuc2Zvcm0pOiB0IGlzIEJpblRyYW5zZm9ybSB7XG4gIHJldHVybiAnYXMnIGluIHQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJpbkNvbXBvbmVudCh0OiBGaWVsZERlZjxzdHJpbmc+IHwgQmluVHJhbnNmb3JtLCBtb2RlbDogTW9kZWwpIHtcbiAgbGV0IGFzOiBbc3RyaW5nLCBzdHJpbmddO1xuXG4gIGlmIChpc0JpblRyYW5zZm9ybSh0KSkge1xuICAgIGFzID0gW3QuYXMsIGAke3QuYXN9X2VuZGBdO1xuICB9IGVsc2Uge1xuICAgIGFzID0gW3ZnRmllbGQodCwge30pLCB2Z0ZpZWxkKHQsIHtiaW5TdWZmaXg6ICdlbmQnfSldO1xuICB9XG5cbiAgY29uc3QgYmluID0gbm9ybWFsaXplQmluKHQuYmluLCB1bmRlZmluZWQpIHx8IHt9O1xuICBjb25zdCBrZXkgPSBiaW5LZXkoYmluLCB0LmZpZWxkKTtcbiAgY29uc3Qge3NpZ25hbCwgZXh0ZW50U2lnbmFsfSA9IGdldFNpZ25hbHNGcm9tTW9kZWwobW9kZWwsIGtleSk7XG5cbiAgY29uc3QgYmluQ29tcG9uZW50OiBCaW5Db21wb25lbnQgPSB7XG4gICAgYmluOiBiaW4sXG4gICAgZmllbGQ6IHQuZmllbGQsXG4gICAgYXM6IGFzLFxuICAgIC4uLnNpZ25hbCA/IHtzaWduYWx9IDoge30sXG4gICAgLi4uZXh0ZW50U2lnbmFsID8ge2V4dGVudFNpZ25hbH0gOiB7fVxuICB9O1xuXG4gIHJldHVybiB7a2V5LCBiaW5Db21wb25lbnR9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJpbkNvbXBvbmVudCB7XG4gIGJpbjogQmluUGFyYW1zO1xuICBmaWVsZDogc3RyaW5nO1xuICBleHRlbnRTaWduYWw/OiBzdHJpbmc7XG4gIHNpZ25hbD86IHN0cmluZztcbiAgYXM6IHN0cmluZ1tdO1xuXG4gIC8vIFJhbmdlIEZvcm11bGFcblxuICBmb3JtdWxhPzogc3RyaW5nO1xuICBmb3JtdWxhQXM/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBCaW5Ob2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgQmluTm9kZShudWxsLCBkdXBsaWNhdGUodGhpcy5iaW5zKSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgcHJpdmF0ZSBiaW5zOiBEaWN0PEJpbkNvbXBvbmVudD4pIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYWtlRnJvbUVuY29kaW5nKHBhcmVudDogRGF0YUZsb3dOb2RlLCBtb2RlbDogTW9kZWxXaXRoRmllbGQpIHtcbiAgICBjb25zdCBiaW5zID0gbW9kZWwucmVkdWNlRmllbGREZWYoKGJpbkNvbXBvbmVudEluZGV4OiBEaWN0PEJpbkNvbXBvbmVudD4sIGZpZWxkRGVmLCBjaGFubmVsKSA9PiB7XG4gICAgICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgICAgIGNvbnN0IHtrZXksIGJpbkNvbXBvbmVudH0gPSBjcmVhdGVCaW5Db21wb25lbnQoZmllbGREZWYsIG1vZGVsKTtcbiAgICAgICAgYmluQ29tcG9uZW50SW5kZXhba2V5XSA9IHtcbiAgICAgICAgICAuLi5iaW5Db21wb25lbnQsXG4gICAgICAgICAgLi4uYmluQ29tcG9uZW50SW5kZXhba2V5XSxcbiAgICAgICAgICAuLi5yYW5nZUZvcm11bGEobW9kZWwsIGZpZWxkRGVmLCBjaGFubmVsLCBtb2RlbC5jb25maWcpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gYmluQ29tcG9uZW50SW5kZXg7XG4gICAgfSwge30pO1xuXG4gICAgaWYgKGtleXMoYmlucykubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEJpbk5vZGUocGFyZW50LCBiaW5zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgYmluIG5vZGUgZnJvbSBCaW5UcmFuc2Zvcm0uXG4gICAqIFRoZSBvcHRpb25hbCBwYXJhbWV0ZXIgc2hvdWxkIHByb3ZpZGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUZyb21UcmFuc2Zvcm0ocGFyZW50OiBEYXRhRmxvd05vZGUsIHQ6IEJpblRyYW5zZm9ybSwgbW9kZWw6IE1vZGVsKSB7XG4gICAgY29uc3Qge2tleSwgYmluQ29tcG9uZW50fSA9IGNyZWF0ZUJpbkNvbXBvbmVudCh0LCBtb2RlbCk7XG4gICAgcmV0dXJuIG5ldyBCaW5Ob2RlKHBhcmVudCwge1xuICAgICAgW2tleV06IGJpbkNvbXBvbmVudFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG1lcmdlKG90aGVyOiBCaW5Ob2RlKSB7XG4gICAgdGhpcy5iaW5zID0gey4uLnRoaXMuYmlucywgLi4ub3RoZXIuYmluc307XG4gICAgb3RoZXIucmVtb3ZlKCk7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICB2YWxzKHRoaXMuYmlucykuZm9yRWFjaChjID0+IHtcbiAgICAgIGMuYXMuZm9yRWFjaChmID0+IG91dFtmXSA9IHRydWUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHB1YmxpYyBkZXBlbmRlbnRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICB2YWxzKHRoaXMuYmlucykuZm9yRWFjaChjID0+IHtcbiAgICAgIG91dFtjLmZpZWxkXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnVHJhbnNmb3JtW10ge1xuICAgIHJldHVybiBmbGF0dGVuKHZhbHModGhpcy5iaW5zKS5tYXAoYmluID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTogVmdUcmFuc2Zvcm1bXSA9IFtdO1xuXG4gICAgICBjb25zdCBiaW5UcmFuczogVmdCaW5UcmFuc2Zvcm0gPSB7XG4gICAgICAgICAgdHlwZTogJ2JpbicsXG4gICAgICAgICAgZmllbGQ6IGJpbi5maWVsZCxcbiAgICAgICAgICBhczogYmluLmFzLFxuICAgICAgICAgIHNpZ25hbDogYmluLnNpZ25hbCxcbiAgICAgICAgICAuLi5iaW4uYmluXG4gICAgICB9O1xuXG4gICAgICBpZiAoIWJpbi5iaW4uZXh0ZW50ICYmIGJpbi5leHRlbnRTaWduYWwpIHtcbiAgICAgICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdleHRlbnQnLFxuICAgICAgICAgIGZpZWxkOiBiaW4uZmllbGQsXG4gICAgICAgICAgc2lnbmFsOiBiaW4uZXh0ZW50U2lnbmFsXG4gICAgICAgIH0pO1xuICAgICAgICBiaW5UcmFucy5leHRlbnQgPSB7c2lnbmFsOiBiaW4uZXh0ZW50U2lnbmFsfTtcbiAgICAgIH1cblxuICAgICAgdHJhbnNmb3JtLnB1c2goYmluVHJhbnMpO1xuXG4gICAgICBpZiAoYmluLmZvcm11bGEpIHtcbiAgICAgICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgICBleHByOiBiaW4uZm9ybXVsYSxcbiAgICAgICAgICBhczogYmluLmZvcm11bGFBc1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgICB9KSk7XG4gIH1cbn1cbiJdfQ==