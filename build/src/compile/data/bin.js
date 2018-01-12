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
        var startField = fielddef_1.field(fieldDef, { expr: 'datum', });
        var endField = fielddef_1.field(fieldDef, { expr: 'datum', binSuffix: 'end' });
        return {
            formulaAs: fielddef_1.field(fieldDef, { binSuffix: 'range' }),
            formula: common_1.binFormatExpression(startField, endField, guide.format, config)
        };
    }
    return {};
}
function binKey(bin, field) {
    return bin_1.binToString(bin) + "_" + field;
}
function isModelParams(p) {
    return !!p['model'];
}
function getSignalsFromParams(params, key) {
    if (isModelParams(params)) {
        var model = params.model;
        return {
            signal: model.getName(key + "_bins"),
            extentSignal: model.getName(key + "_extent")
        };
    }
    return params;
}
function isBinTransform(t) {
    return 'as' in t;
}
function createBinComponent(t, params) {
    var as;
    if (isBinTransform(t)) {
        as = [t.as, t.as + "_end"];
    }
    else {
        as = [fielddef_1.field(t, {}), fielddef_1.field(t, { binSuffix: 'end' })];
    }
    var bin = fielddef_1.normalizeBin(t.bin, undefined) || {};
    var key = binKey(bin, t.field);
    var _a = getSignalsFromParams(params, key), signal = _a.signal, extentSignal = _a.extentSignal;
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
                var _a = createBinComponent(fieldDef, { model: model }), key = _a.key, binComponent = _a.binComponent;
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
    BinNode.makeFromTransform = function (t, params) {
        var _a = createBinComponent(t, params), key = _a.key, binComponent = _a.binComponent;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQ0FBaUQ7QUFHakQsMkNBQTZEO0FBRTdELG1DQUFnRTtBQUVoRSxvQ0FBZ0U7QUFDaEUsa0NBQTREO0FBQzVELHVDQUF3QztBQUd4QyxzQkFBc0IsS0FBcUIsRUFBRSxRQUEwQixFQUFFLE9BQWdCLEVBQUUsTUFBYztJQUNyRyxFQUFFLENBQUMsQ0FBQyx5QkFBZ0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLHNGQUFzRjtRQUV0RixJQUFNLEtBQUssR0FBRyxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRTdGLElBQU0sVUFBVSxHQUFHLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sR0FBRSxDQUFDLENBQUM7UUFDckQsSUFBTSxRQUFRLEdBQUcsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBRXBFLE1BQU0sQ0FBQztZQUNMLFNBQVMsRUFBRSxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQztZQUNoRCxPQUFPLEVBQUUsNEJBQW1CLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztTQUN6RSxDQUFDO0lBQ0osQ0FBQztJQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDZCxD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QixTQUFTLENBQUMsSUFBSSxDQUFDO29CQUNiLElBQUksRUFBRSxTQUFTO29CQUNmLElBQUksRUFBRSxHQUFHLENBQUMsT0FBTztvQkFDakIsRUFBRSxFQUFFLEdBQUcsQ0FBQyxTQUFTO2lCQUNsQixDQUFDLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBbkdELENBQTZCLHVCQUFZLEdBbUd4QztBQW5HWSwwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QmluUGFyYW1zLCBiaW5Ub1N0cmluZ30gZnJvbSAnLi4vLi4vYmluJztcbmltcG9ydCB7Q2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7ZmllbGQsIEZpZWxkRGVmLCBub3JtYWxpemVCaW59IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7QmluVHJhbnNmb3JtfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtEaWN0LCBkdXBsaWNhdGUsIGZsYXR0ZW4sIGtleXMsIHZhbHN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0JpblRyYW5zZm9ybSwgVmdUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7YmluRm9ybWF0RXhwcmVzc2lvbiwgYmluUmVxdWlyZXNSYW5nZX0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7aXNVbml0TW9kZWwsIE1vZGVsLCBNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5cbmZ1bmN0aW9uIHJhbmdlRm9ybXVsYShtb2RlbDogTW9kZWxXaXRoRmllbGQsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsLCBjb25maWc6IENvbmZpZykge1xuICAgIGlmIChiaW5SZXF1aXJlc1JhbmdlKGZpZWxkRGVmLCBjaGFubmVsKSkge1xuICAgICAgLy8gcmVhZCBmb3JtYXQgZnJvbSBheGlzIG9yIGxlZ2VuZCwgaWYgdGhlcmUgaXMgbm8gZm9ybWF0IHRoZW4gdXNlIGNvbmZpZy5udW1iZXJGb3JtYXRcblxuICAgICAgY29uc3QgZ3VpZGUgPSBpc1VuaXRNb2RlbChtb2RlbCkgPyAobW9kZWwuYXhpcyhjaGFubmVsKSB8fCBtb2RlbC5sZWdlbmQoY2hhbm5lbCkgfHwge30pIDoge307XG5cbiAgICAgIGNvbnN0IHN0YXJ0RmllbGQgPSBmaWVsZChmaWVsZERlZiwge2V4cHI6ICdkYXR1bScsfSk7XG4gICAgICBjb25zdCBlbmRGaWVsZCA9IGZpZWxkKGZpZWxkRGVmLCB7ZXhwcjogJ2RhdHVtJywgYmluU3VmZml4OiAnZW5kJ30pO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBmb3JtdWxhQXM6IGZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAncmFuZ2UnfSksXG4gICAgICAgIGZvcm11bGE6IGJpbkZvcm1hdEV4cHJlc3Npb24oc3RhcnRGaWVsZCwgZW5kRmllbGQsIGd1aWRlLmZvcm1hdCwgY29uZmlnKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xufVxuXG5mdW5jdGlvbiBiaW5LZXkoYmluOiBCaW5QYXJhbXMsIGZpZWxkOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGAke2JpblRvU3RyaW5nKGJpbil9XyR7ZmllbGR9YDtcbn1cblxuZnVuY3Rpb24gaXNNb2RlbFBhcmFtcyhwOiB7bW9kZWw6IE1vZGVsfSB8IHtzaWduYWw/OiBzdHJpbmcsIGV4dGVudFNpZ25hbD86IHN0cmluZ30pOiBwIGlzIHttb2RlbDogTW9kZWx9IHtcbiAgcmV0dXJuICEhcFsnbW9kZWwnXTtcbn1cblxuZnVuY3Rpb24gZ2V0U2lnbmFsc0Zyb21QYXJhbXMoXG4gIHBhcmFtczoge21vZGVsOiBNb2RlbH0gfCB7c2lnbmFsPzogc3RyaW5nLCBleHRlbnRTaWduYWw/OiBzdHJpbmd9LFxuICBrZXk6IHN0cmluZ1xuKSB7XG4gIGlmIChpc01vZGVsUGFyYW1zKHBhcmFtcykpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcmFtcy5tb2RlbDtcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBtb2RlbC5nZXROYW1lKGAke2tleX1fYmluc2ApLFxuICAgICAgZXh0ZW50U2lnbmFsOiBtb2RlbC5nZXROYW1lKGAke2tleX1fZXh0ZW50YClcbiAgICB9O1xuICB9XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmZ1bmN0aW9uIGlzQmluVHJhbnNmb3JtKHQ6IEZpZWxkRGVmPHN0cmluZz4gfCBCaW5UcmFuc2Zvcm0pOiB0IGlzIEJpblRyYW5zZm9ybSB7XG4gIHJldHVybiAnYXMnIGluIHQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJpbkNvbXBvbmVudChcbiAgdDogRmllbGREZWY8c3RyaW5nPiB8IEJpblRyYW5zZm9ybSxcbiAgcGFyYW1zOiB7bW9kZWw6IE1vZGVsfSB8IHtzaWduYWw/OiBzdHJpbmcsIGV4dGVudFNpZ25hbD86IHN0cmluZ31cbikge1xuICBsZXQgYXM6IFtzdHJpbmcsIHN0cmluZ107XG5cbiAgaWYgKGlzQmluVHJhbnNmb3JtKHQpKSB7XG4gICAgYXMgPSBbdC5hcywgYCR7dC5hc31fZW5kYF07XG4gIH0gZWxzZSB7XG4gICAgYXMgPSBbZmllbGQodCwge30pLCBmaWVsZCh0LCB7YmluU3VmZml4OiAnZW5kJ30pXTtcbiAgfVxuXG4gIGNvbnN0IGJpbiA9IG5vcm1hbGl6ZUJpbih0LmJpbiwgdW5kZWZpbmVkKSB8fCB7fTtcbiAgY29uc3Qga2V5ID0gYmluS2V5KGJpbiwgdC5maWVsZCk7XG4gIGNvbnN0IHtzaWduYWwsIGV4dGVudFNpZ25hbH0gPSBnZXRTaWduYWxzRnJvbVBhcmFtcyhwYXJhbXMsIGtleSk7XG5cbiAgY29uc3QgYmluQ29tcG9uZW50OiBCaW5Db21wb25lbnQgPSB7XG4gICAgYmluOiBiaW4sXG4gICAgZmllbGQ6IHQuZmllbGQsXG4gICAgYXM6IGFzLFxuICAgIC4uLnNpZ25hbCA/IHtzaWduYWx9IDoge30sXG4gICAgLi4uZXh0ZW50U2lnbmFsID8ge2V4dGVudFNpZ25hbH0gOiB7fVxuICB9O1xuXG4gIHJldHVybiB7a2V5LCBiaW5Db21wb25lbnR9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJpbkNvbXBvbmVudCB7XG4gIGJpbjogQmluUGFyYW1zO1xuICBmaWVsZDogc3RyaW5nO1xuICBleHRlbnRTaWduYWw/OiBzdHJpbmc7XG4gIHNpZ25hbD86IHN0cmluZztcbiAgYXM6IHN0cmluZ1tdO1xuXG4gIC8vIFJhbmdlIEZvcm11bGFcblxuICBmb3JtdWxhPzogc3RyaW5nO1xuICBmb3JtdWxhQXM/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBCaW5Ob2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgQmluTm9kZShkdXBsaWNhdGUodGhpcy5iaW5zKSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJpbnM6IERpY3Q8QmluQ29tcG9uZW50Pikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VCaW5Gcm9tRW5jb2RpbmcobW9kZWw6IE1vZGVsV2l0aEZpZWxkKSB7XG4gICAgY29uc3QgYmlucyA9IG1vZGVsLnJlZHVjZUZpZWxkRGVmKChiaW5Db21wb25lbnRJbmRleDogRGljdDxCaW5Db21wb25lbnQ+LCBmaWVsZERlZiwgY2hhbm5lbCkgPT4ge1xuICAgICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgICBjb25zdCB7a2V5LCBiaW5Db21wb25lbnR9ID0gY3JlYXRlQmluQ29tcG9uZW50KGZpZWxkRGVmLCB7bW9kZWx9KTtcbiAgICAgICAgYmluQ29tcG9uZW50SW5kZXhba2V5XSA9IHtcbiAgICAgICAgICAuLi5iaW5Db21wb25lbnQsXG4gICAgICAgICAgLi4uYmluQ29tcG9uZW50SW5kZXhba2V5XSxcbiAgICAgICAgICAuLi5yYW5nZUZvcm11bGEobW9kZWwsIGZpZWxkRGVmLCBjaGFubmVsLCBtb2RlbC5jb25maWcpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gYmluQ29tcG9uZW50SW5kZXg7XG4gICAgfSwge30pO1xuXG4gICAgaWYgKGtleXMoYmlucykubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEJpbk5vZGUoYmlucyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGJpbiBub2RlIGZyb20gQmluVHJhbnNmb3JtLlxuICAgKiBUaGUgb3B0aW9uYWwgcGFyYW1ldGVyIHNob3VsZCBwcm92aWRlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG1ha2VGcm9tVHJhbnNmb3JtKHQ6IEJpblRyYW5zZm9ybSwgcGFyYW1zOiB7bW9kZWw6IE1vZGVsfSB8IHtzaWduYWw/OiBzdHJpbmcsIGV4dGVudFNpZ25hbD86IHN0cmluZ30pIHtcbiAgICBjb25zdCB7a2V5LCBiaW5Db21wb25lbnR9ID0gY3JlYXRlQmluQ29tcG9uZW50KHQsIHBhcmFtcyk7XG4gICAgcmV0dXJuIG5ldyBCaW5Ob2RlKHtcbiAgICAgIFtrZXldOiBiaW5Db21wb25lbnRcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBtZXJnZShvdGhlcjogQmluTm9kZSkge1xuICAgIHRoaXMuYmlucyA9IHsuLi50aGlzLmJpbnMsIC4uLm90aGVyLmJpbnN9O1xuICAgIG90aGVyLnJlbW92ZSgpO1xuICB9XG5cbiAgcHVibGljIHByb2R1Y2VkRmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAgdmFscyh0aGlzLmJpbnMpLmZvckVhY2goYyA9PiB7XG4gICAgICBjLmFzLmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgZGVwZW5kZW50RmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAgdmFscyh0aGlzLmJpbnMpLmZvckVhY2goYyA9PiB7XG4gICAgICBvdXRbYy5maWVsZF0gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ1RyYW5zZm9ybVtdIHtcbiAgICByZXR1cm4gZmxhdHRlbih2YWxzKHRoaXMuYmlucykubWFwKGJpbiA9PiB7XG4gICAgICBjb25zdCB0cmFuc2Zvcm06IFZnVHJhbnNmb3JtW10gPSBbXTtcblxuICAgICAgY29uc3QgYmluVHJhbnM6IFZnQmluVHJhbnNmb3JtID0ge1xuICAgICAgICAgIHR5cGU6ICdiaW4nLFxuICAgICAgICAgIGZpZWxkOiBiaW4uZmllbGQsXG4gICAgICAgICAgYXM6IGJpbi5hcyxcbiAgICAgICAgICBzaWduYWw6IGJpbi5zaWduYWwsXG4gICAgICAgICAgLi4uYmluLmJpblxuICAgICAgfTtcblxuICAgICAgaWYgKCFiaW4uYmluLmV4dGVudCAmJiBiaW4uZXh0ZW50U2lnbmFsKSB7XG4gICAgICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnZXh0ZW50JyxcbiAgICAgICAgICBmaWVsZDogYmluLmZpZWxkLFxuICAgICAgICAgIHNpZ25hbDogYmluLmV4dGVudFNpZ25hbFxuICAgICAgICB9KTtcbiAgICAgICAgYmluVHJhbnMuZXh0ZW50ID0ge3NpZ25hbDogYmluLmV4dGVudFNpZ25hbH07XG4gICAgICB9XG5cbiAgICAgIHRyYW5zZm9ybS5wdXNoKGJpblRyYW5zKTtcblxuICAgICAgaWYgKGJpbi5mb3JtdWxhKSB7XG4gICAgICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgICAgZXhwcjogYmluLmZvcm11bGEsXG4gICAgICAgICAgYXM6IGJpbi5mb3JtdWxhQXNcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cmFuc2Zvcm07XG4gICAgfSkpO1xuICB9XG59XG4iXX0=