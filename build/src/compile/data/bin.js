"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    var binComponent = __assign({ bin: bin, field: t.field, as: as }, signal ? { signal: signal } : {}, extentSignal ? { extentSignal: extentSignal } : {});
    return { key: key, binComponent: binComponent };
}
var BinNode = /** @class */ (function (_super) {
    __extends(BinNode, _super);
    function BinNode(bins) {
        var _this = _super.call(this) || this;
        _this.bins = bins;
        return _this;
    }
    BinNode.prototype.clone = function () {
        return new BinNode(util_1.duplicate(this.bins));
    };
    BinNode.makeBinFromEncoding = function (model) {
        var bins = model.reduceFieldDef(function (binComponentIndex, fieldDef, channel) {
            if (fieldDef.bin) {
                var _a = createBinComponent(fieldDef, model), key = _a.key, binComponent = _a.binComponent;
                binComponentIndex[key] = __assign({}, binComponent, binComponentIndex[key], rangeFormula(model, fieldDef, channel, model.config));
            }
            return binComponentIndex;
        }, {});
        if (util_1.keys(bins).length === 0) {
            return null;
        }
        return new BinNode(bins);
    };
    /**
     * Creates a bin node from BinTransform.
     * The optional parameter should provide
     */
    BinNode.makeFromTransform = function (t, model) {
        var _a = createBinComponent(t, model), key = _a.key, binComponent = _a.binComponent;
        return new BinNode((_b = {},
            _b[key] = binComponent,
            _b));
        var _b;
    };
    BinNode.prototype.merge = function (other) {
        this.bins = __assign({}, this.bins, other.bins);
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
            var binTrans = __assign({ type: 'bin', field: bin.field, as: bin.as, signal: bin.signal }, bin.bin);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQ0FBaUQ7QUFHakQsMkNBQStEO0FBRS9ELG1DQUFnRTtBQUVoRSxvQ0FBZ0U7QUFDaEUsa0NBQTREO0FBQzVELHVDQUF3QztBQUd4QyxzQkFBc0IsS0FBcUIsRUFBRSxRQUEwQixFQUFFLE9BQWdCLEVBQUUsTUFBYztJQUNyRyxFQUFFLENBQUMsQ0FBQyx5QkFBZ0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLHNGQUFzRjtRQUV0RixJQUFNLEtBQUssR0FBRyxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRTdGLElBQU0sVUFBVSxHQUFHLGtCQUFPLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sR0FBRSxDQUFDLENBQUM7UUFDdkQsSUFBTSxRQUFRLEdBQUcsa0JBQU8sQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBRXRFLE1BQU0sQ0FBQztZQUNMLFNBQVMsRUFBRSxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQztZQUNsRCxPQUFPLEVBQUUsNEJBQW1CLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztTQUN6RSxDQUFDO0lBQ0osQ0FBQztJQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDZCxD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QW5HRCxDQUE2Qix1QkFBWSxHQW1HeEM7QUFuR1ksMEJBQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0JpblBhcmFtcywgYmluVG9TdHJpbmd9IGZyb20gJy4uLy4uL2Jpbic7XG5pbXBvcnQge0NoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0ZpZWxkRGVmLCBub3JtYWxpemVCaW4sIHZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7QmluVHJhbnNmb3JtfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtEaWN0LCBkdXBsaWNhdGUsIGZsYXR0ZW4sIGtleXMsIHZhbHN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0JpblRyYW5zZm9ybSwgVmdUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7YmluRm9ybWF0RXhwcmVzc2lvbiwgYmluUmVxdWlyZXNSYW5nZX0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7aXNVbml0TW9kZWwsIE1vZGVsLCBNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5cbmZ1bmN0aW9uIHJhbmdlRm9ybXVsYShtb2RlbDogTW9kZWxXaXRoRmllbGQsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsLCBjb25maWc6IENvbmZpZykge1xuICAgIGlmIChiaW5SZXF1aXJlc1JhbmdlKGZpZWxkRGVmLCBjaGFubmVsKSkge1xuICAgICAgLy8gcmVhZCBmb3JtYXQgZnJvbSBheGlzIG9yIGxlZ2VuZCwgaWYgdGhlcmUgaXMgbm8gZm9ybWF0IHRoZW4gdXNlIGNvbmZpZy5udW1iZXJGb3JtYXRcblxuICAgICAgY29uc3QgZ3VpZGUgPSBpc1VuaXRNb2RlbChtb2RlbCkgPyAobW9kZWwuYXhpcyhjaGFubmVsKSB8fCBtb2RlbC5sZWdlbmQoY2hhbm5lbCkgfHwge30pIDoge307XG5cbiAgICAgIGNvbnN0IHN0YXJ0RmllbGQgPSB2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwcjogJ2RhdHVtJyx9KTtcbiAgICAgIGNvbnN0IGVuZEZpZWxkID0gdmdGaWVsZChmaWVsZERlZiwge2V4cHI6ICdkYXR1bScsIGJpblN1ZmZpeDogJ2VuZCd9KTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZm9ybXVsYUFzOiB2Z0ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAncmFuZ2UnfSksXG4gICAgICAgIGZvcm11bGE6IGJpbkZvcm1hdEV4cHJlc3Npb24oc3RhcnRGaWVsZCwgZW5kRmllbGQsIGd1aWRlLmZvcm1hdCwgY29uZmlnKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xufVxuXG5mdW5jdGlvbiBiaW5LZXkoYmluOiBCaW5QYXJhbXMsIGZpZWxkOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGAke2JpblRvU3RyaW5nKGJpbil9XyR7ZmllbGR9YDtcbn1cblxuZnVuY3Rpb24gZ2V0U2lnbmFsc0Zyb21Nb2RlbChtb2RlbDogTW9kZWwsIGtleTogc3RyaW5nKSB7XG4gIHJldHVybiB7XG4gICAgc2lnbmFsOiBtb2RlbC5nZXROYW1lKGAke2tleX1fYmluc2ApLFxuICAgIGV4dGVudFNpZ25hbDogbW9kZWwuZ2V0TmFtZShgJHtrZXl9X2V4dGVudGApXG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzQmluVHJhbnNmb3JtKHQ6IEZpZWxkRGVmPHN0cmluZz4gfCBCaW5UcmFuc2Zvcm0pOiB0IGlzIEJpblRyYW5zZm9ybSB7XG4gIHJldHVybiAnYXMnIGluIHQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJpbkNvbXBvbmVudCh0OiBGaWVsZERlZjxzdHJpbmc+IHwgQmluVHJhbnNmb3JtLCBtb2RlbDogTW9kZWwpIHtcbiAgbGV0IGFzOiBbc3RyaW5nLCBzdHJpbmddO1xuXG4gIGlmIChpc0JpblRyYW5zZm9ybSh0KSkge1xuICAgIGFzID0gW3QuYXMsIGAke3QuYXN9X2VuZGBdO1xuICB9IGVsc2Uge1xuICAgIGFzID0gW3ZnRmllbGQodCwge30pLCB2Z0ZpZWxkKHQsIHtiaW5TdWZmaXg6ICdlbmQnfSldO1xuICB9XG5cbiAgY29uc3QgYmluID0gbm9ybWFsaXplQmluKHQuYmluLCB1bmRlZmluZWQpIHx8IHt9O1xuICBjb25zdCBrZXkgPSBiaW5LZXkoYmluLCB0LmZpZWxkKTtcbiAgY29uc3Qge3NpZ25hbCwgZXh0ZW50U2lnbmFsfSA9IGdldFNpZ25hbHNGcm9tTW9kZWwobW9kZWwsIGtleSk7XG5cbiAgY29uc3QgYmluQ29tcG9uZW50OiBCaW5Db21wb25lbnQgPSB7XG4gICAgYmluOiBiaW4sXG4gICAgZmllbGQ6IHQuZmllbGQsXG4gICAgYXM6IGFzLFxuICAgIC4uLnNpZ25hbCA/IHtzaWduYWx9IDoge30sXG4gICAgLi4uZXh0ZW50U2lnbmFsID8ge2V4dGVudFNpZ25hbH0gOiB7fVxuICB9O1xuXG4gIHJldHVybiB7a2V5LCBiaW5Db21wb25lbnR9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJpbkNvbXBvbmVudCB7XG4gIGJpbjogQmluUGFyYW1zO1xuICBmaWVsZDogc3RyaW5nO1xuICBleHRlbnRTaWduYWw/OiBzdHJpbmc7XG4gIHNpZ25hbD86IHN0cmluZztcbiAgYXM6IHN0cmluZ1tdO1xuXG4gIC8vIFJhbmdlIEZvcm11bGFcblxuICBmb3JtdWxhPzogc3RyaW5nO1xuICBmb3JtdWxhQXM/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBCaW5Ob2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgQmluTm9kZShkdXBsaWNhdGUodGhpcy5iaW5zKSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJpbnM6IERpY3Q8QmluQ29tcG9uZW50Pikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VCaW5Gcm9tRW5jb2RpbmcobW9kZWw6IE1vZGVsV2l0aEZpZWxkKSB7XG4gICAgY29uc3QgYmlucyA9IG1vZGVsLnJlZHVjZUZpZWxkRGVmKChiaW5Db21wb25lbnRJbmRleDogRGljdDxCaW5Db21wb25lbnQ+LCBmaWVsZERlZiwgY2hhbm5lbCkgPT4ge1xuICAgICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgICBjb25zdCB7a2V5LCBiaW5Db21wb25lbnR9ID0gY3JlYXRlQmluQ29tcG9uZW50KGZpZWxkRGVmLCBtb2RlbCk7XG4gICAgICAgIGJpbkNvbXBvbmVudEluZGV4W2tleV0gPSB7XG4gICAgICAgICAgLi4uYmluQ29tcG9uZW50LFxuICAgICAgICAgIC4uLmJpbkNvbXBvbmVudEluZGV4W2tleV0sXG4gICAgICAgICAgLi4ucmFuZ2VGb3JtdWxhKG1vZGVsLCBmaWVsZERlZiwgY2hhbm5lbCwgbW9kZWwuY29uZmlnKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJpbkNvbXBvbmVudEluZGV4O1xuICAgIH0sIHt9KTtcblxuICAgIGlmIChrZXlzKGJpbnMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBCaW5Ob2RlKGJpbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBiaW4gbm9kZSBmcm9tIEJpblRyYW5zZm9ybS5cbiAgICogVGhlIG9wdGlvbmFsIHBhcmFtZXRlciBzaG91bGQgcHJvdmlkZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBtYWtlRnJvbVRyYW5zZm9ybSh0OiBCaW5UcmFuc2Zvcm0sIG1vZGVsOiBNb2RlbCkge1xuICAgIGNvbnN0IHtrZXksIGJpbkNvbXBvbmVudH0gPSBjcmVhdGVCaW5Db21wb25lbnQodCwgbW9kZWwpO1xuICAgIHJldHVybiBuZXcgQmluTm9kZSh7XG4gICAgICBba2V5XTogYmluQ29tcG9uZW50XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbWVyZ2Uob3RoZXI6IEJpbk5vZGUpIHtcbiAgICB0aGlzLmJpbnMgPSB7Li4udGhpcy5iaW5zLCAuLi5vdGhlci5iaW5zfTtcbiAgICBvdGhlci5yZW1vdmUoKTtcbiAgfVxuXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcblxuICAgIHZhbHModGhpcy5iaW5zKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgYy5hcy5mb3JFYWNoKGYgPT4gb3V0W2ZdID0gdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHVibGljIGRlcGVuZGVudEZpZWxkcygpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcblxuICAgIHZhbHModGhpcy5iaW5zKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgb3V0W2MuZmllbGRdID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdUcmFuc2Zvcm1bXSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4odmFscyh0aGlzLmJpbnMpLm1hcChiaW4gPT4ge1xuICAgICAgY29uc3QgdHJhbnNmb3JtOiBWZ1RyYW5zZm9ybVtdID0gW107XG5cbiAgICAgIGNvbnN0IGJpblRyYW5zOiBWZ0JpblRyYW5zZm9ybSA9IHtcbiAgICAgICAgICB0eXBlOiAnYmluJyxcbiAgICAgICAgICBmaWVsZDogYmluLmZpZWxkLFxuICAgICAgICAgIGFzOiBiaW4uYXMsXG4gICAgICAgICAgc2lnbmFsOiBiaW4uc2lnbmFsLFxuICAgICAgICAgIC4uLmJpbi5iaW5cbiAgICAgIH07XG5cbiAgICAgIGlmICghYmluLmJpbi5leHRlbnQgJiYgYmluLmV4dGVudFNpZ25hbCkge1xuICAgICAgICB0cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2V4dGVudCcsXG4gICAgICAgICAgZmllbGQ6IGJpbi5maWVsZCxcbiAgICAgICAgICBzaWduYWw6IGJpbi5leHRlbnRTaWduYWxcbiAgICAgICAgfSk7XG4gICAgICAgIGJpblRyYW5zLmV4dGVudCA9IHtzaWduYWw6IGJpbi5leHRlbnRTaWduYWx9O1xuICAgICAgfVxuXG4gICAgICB0cmFuc2Zvcm0ucHVzaChiaW5UcmFucyk7XG5cbiAgICAgIGlmIChiaW4uZm9ybXVsYSkge1xuICAgICAgICB0cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICAgIGV4cHI6IGJpbi5mb3JtdWxhLFxuICAgICAgICAgIGFzOiBiaW4uZm9ybXVsYUFzXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJhbnNmb3JtO1xuICAgIH0pKTtcbiAgfVxufVxuIl19