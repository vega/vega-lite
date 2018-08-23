import * as tslib_1 from "tslib";
import { isString } from 'vega-util';
import { binToString, isBinning } from '../../bin';
import { normalizeBin, vgField } from '../../fielddef';
import { duplicate, flatten, hash, keys, vals } from '../../util';
import { binFormatExpression, binRequiresRange } from '../common';
import { isUnitModel } from '../model';
import { TransformNode } from './dataflow';
function rangeFormula(model, fieldDef, channel, config) {
    if (binRequiresRange(fieldDef, channel)) {
        // read format from axis or legend, if there is no format then use config.numberFormat
        var guide = isUnitModel(model) ? model.axis(channel) || model.legend(channel) || {} : {};
        var startField = vgField(fieldDef, { expr: 'datum' });
        var endField = vgField(fieldDef, { expr: 'datum', binSuffix: 'end' });
        return {
            formulaAs: vgField(fieldDef, { binSuffix: 'range', forAs: true }),
            formula: binFormatExpression(startField, endField, guide.format, config)
        };
    }
    return {};
}
function binKey(bin, field) {
    return binToString(bin) + "_" + field;
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
function createBinComponent(t, bin, model) {
    var as;
    if (isBinTransform(t)) {
        as = isString(t.as) ? [t.as, t.as + "_end"] : [t.as[0], t.as[1]];
    }
    else {
        as = [vgField(t, { forAs: true }), vgField(t, { binSuffix: 'end', forAs: true })];
    }
    var normalizedBin = normalizeBin(bin, undefined) || {};
    var key = binKey(normalizedBin, t.field);
    var _a = getSignalsFromModel(model, key), signal = _a.signal, extentSignal = _a.extentSignal;
    var binComponent = tslib_1.__assign({ bin: normalizedBin, field: t.field, as: as }, (signal ? { signal: signal } : {}), (extentSignal ? { extentSignal: extentSignal } : {}));
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
        return new BinNode(null, duplicate(this.bins));
    };
    BinNode.makeFromEncoding = function (parent, model) {
        var bins = model.reduceFieldDef(function (binComponentIndex, fieldDef, channel) {
            if (isBinning(fieldDef.bin)) {
                var _a = createBinComponent(fieldDef, fieldDef.bin, model), key = _a.key, binComponent = _a.binComponent;
                binComponentIndex[key] = tslib_1.__assign({}, binComponent, binComponentIndex[key], rangeFormula(model, fieldDef, channel, model.config));
            }
            return binComponentIndex;
        }, {});
        if (keys(bins).length === 0) {
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
        var _b = createBinComponent(t, t.bin, model), key = _b.key, binComponent = _b.binComponent;
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
        vals(this.bins).forEach(function (c) {
            c.as.forEach(function (f) { return (out[f] = true); });
        });
        return out;
    };
    BinNode.prototype.dependentFields = function () {
        var out = {};
        vals(this.bins).forEach(function (c) {
            out[c.field] = true;
        });
        return out;
    };
    BinNode.prototype.hash = function () {
        return "Bin " + hash(this.bins);
    };
    BinNode.prototype.assemble = function () {
        return flatten(vals(this.bins).map(function (bin) {
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
}(TransformNode));
export { BinNode };
//# sourceMappingURL=bin.js.map