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
    var binComponent = tslib_1.__assign({ bin: bin, field: t.field, as: as }, signal ? { signal: signal } : {}, extentSignal ? { extentSignal: extentSignal } : {});
    return { key: key, binComponent: binComponent };
}
var BinNode = /** @class */ (function (_super) {
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
        var bins = model.reduceFieldDef(function (binComponentIndex, fieldDef, channel) {
            if (fieldDef.bin) {
                var _a = createBinComponent(fieldDef, { model: model }), key = _a.key, binComponent = _a.binComponent;
                binComponentIndex[key] = tslib_1.__assign({}, binComponent, binComponentIndex[key], rangeFormula(model, fieldDef, channel, model.config));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWlEO0FBR2pELDJDQUE2RDtBQUU3RCxtQ0FBZ0U7QUFFaEUsb0NBQWdFO0FBQ2hFLGtDQUE0RDtBQUM1RCx1Q0FBd0M7QUFHeEMsc0JBQXNCLEtBQXFCLEVBQUUsUUFBMEIsRUFBRSxPQUFnQixFQUFFLE1BQWM7SUFDckcsRUFBRSxDQUFDLENBQUMseUJBQWdCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxzRkFBc0Y7UUFFdEYsSUFBTSxLQUFLLEdBQUcsbUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUU3RixJQUFNLFVBQVUsR0FBRyxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEdBQUUsQ0FBQyxDQUFDO1FBQ3JELElBQU0sUUFBUSxHQUFHLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUVwRSxNQUFNLENBQUM7WUFDTCxTQUFTLEVBQUUsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLENBQUM7WUFDaEQsT0FBTyxFQUFFLDRCQUFtQixDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7U0FDekUsQ0FBQztJQUNKLENBQUM7SUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQ2QsQ0FBQztBQUVELGdCQUFnQixHQUFjLEVBQUUsS0FBYTtJQUMzQyxNQUFNLENBQUksaUJBQVcsQ0FBQyxHQUFHLENBQUMsU0FBSSxLQUFPLENBQUM7QUFDeEMsQ0FBQztBQUVELHVCQUF1QixDQUE0RDtJQUNqRixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0QixDQUFDO0FBRUQsOEJBQ0UsTUFBaUUsRUFDakUsR0FBVztJQUVYLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUMzQixNQUFNLENBQUM7WUFDTCxNQUFNLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBSSxHQUFHLFVBQU8sQ0FBQztZQUNwQyxZQUFZLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBSSxHQUFHLFlBQVMsQ0FBQztTQUM3QyxDQUFDO0lBQ0osQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELHdCQUF3QixDQUFrQztJQUN4RCxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBRUQsNEJBQ0UsQ0FBa0MsRUFDbEMsTUFBaUU7SUFFakUsSUFBSSxFQUFvQixDQUFDO0lBRXpCLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBSyxDQUFDLENBQUMsRUFBRSxTQUFNLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixFQUFFLEdBQUcsQ0FBQyxnQkFBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxnQkFBSyxDQUFDLENBQUMsRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELElBQU0sR0FBRyxHQUFHLHVCQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDakQsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0IsSUFBQSxzQ0FBMEQsRUFBekQsa0JBQU0sRUFBRSw4QkFBWSxDQUFzQztJQUVqRSxJQUFNLFlBQVksc0JBQ2hCLEdBQUcsRUFBRSxHQUFHLEVBQ1IsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQ2QsRUFBRSxFQUFFLEVBQUUsSUFDSCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxRQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUN0QixZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUMsWUFBWSxjQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUN0QyxDQUFDO0lBRUYsTUFBTSxDQUFDLEVBQUMsR0FBRyxLQUFBLEVBQUUsWUFBWSxjQUFBLEVBQUMsQ0FBQztBQUM3QixDQUFDO0FBZUQ7SUFBNkIsbUNBQVk7SUFLdkMsaUJBQW9CLElBQXdCO1FBQTVDLFlBQ0UsaUJBQU8sU0FDUjtRQUZtQixVQUFJLEdBQUosSUFBSSxDQUFvQjs7SUFFNUMsQ0FBQztJQU5NLHVCQUFLLEdBQVo7UUFDRSxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBTWEsMkJBQW1CLEdBQWpDLFVBQWtDLEtBQXFCO1FBQ3JELElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBQyxpQkFBcUMsRUFBRSxRQUFRLEVBQUUsT0FBTztZQUN6RixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFBLG1EQUEyRCxFQUExRCxZQUFHLEVBQUUsOEJBQVksQ0FBMEM7Z0JBQ2xFLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyx3QkFDakIsWUFBWSxFQUNaLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUN0QixZQUFZLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUN4RCxDQUFDO1lBQ0osQ0FBQztZQUNELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztRQUMzQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsQ0FBQyxXQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7T0FHRztJQUNXLHlCQUFpQixHQUEvQixVQUFnQyxDQUFlLEVBQUUsTUFBaUU7UUFDMUcsSUFBQSxrQ0FBbUQsRUFBbEQsWUFBRyxFQUFFLDhCQUFZLENBQWtDO1FBQzFELE1BQU0sQ0FBQyxJQUFJLE9BQU87WUFDaEIsR0FBQyxHQUFHLElBQUcsWUFBWTtnQkFDbkIsQ0FBQzs7SUFDTCxDQUFDO0lBRU0sdUJBQUssR0FBWixVQUFhLEtBQWM7UUFDekIsSUFBSSxDQUFDLElBQUksd0JBQU8sSUFBSSxDQUFDLElBQUksRUFBSyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFTSxnQ0FBYyxHQUFyQjtRQUNFLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUVmLFdBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztZQUN2QixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQWIsQ0FBYSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVNLGlDQUFlLEdBQXRCO1FBQ0UsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRWYsV0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQ3ZCLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTSwwQkFBUSxHQUFmO1FBQ0UsTUFBTSxDQUFDLGNBQU8sQ0FBQyxXQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUc7WUFDcEMsSUFBTSxTQUFTLEdBQWtCLEVBQUUsQ0FBQztZQUVwQyxJQUFNLFFBQVEsc0JBQ1YsSUFBSSxFQUFFLEtBQUssRUFDWCxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFDaEIsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQ1YsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLElBQ2YsR0FBRyxDQUFDLEdBQUcsQ0FDYixDQUFDO1lBRUYsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDeEMsU0FBUyxDQUFDLElBQUksQ0FBQztvQkFDYixJQUFJLEVBQUUsUUFBUTtvQkFDZCxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUs7b0JBQ2hCLE1BQU0sRUFBRSxHQUFHLENBQUMsWUFBWTtpQkFDekIsQ0FBQyxDQUFDO2dCQUNILFFBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFlBQVksRUFBQyxDQUFDO1lBQy9DLENBQUM7WUFFRCxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXpCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixTQUFTLENBQUMsSUFBSSxDQUFDO29CQUNiLElBQUksRUFBRSxTQUFTO29CQUNmLElBQUksRUFBRSxHQUFHLENBQUMsT0FBTztvQkFDakIsRUFBRSxFQUFFLEdBQUcsQ0FBQyxTQUFTO2lCQUNsQixDQUFDLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBbkdELENBQTZCLHVCQUFZLEdBbUd4QztBQW5HWSwwQkFBTyJ9