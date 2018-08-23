import * as tslib_1 from "tslib";
import { isFieldDef } from '../../fielddef';
import { isImputeSequence } from '../../transform';
import { duplicate, hash } from '../../util';
import { pathGroupingFields } from '../mark/mark';
import { TransformNode } from './dataflow';
var ImputeNode = /** @class */ (function (_super) {
    tslib_1.__extends(ImputeNode, _super);
    function ImputeNode(parent, transform) {
        var _this = _super.call(this, parent) || this;
        _this.transform = transform;
        return _this;
    }
    ImputeNode.prototype.clone = function () {
        return new ImputeNode(this.parent, duplicate(this.transform));
    };
    ImputeNode.prototype.producedFields = function () {
        var _a;
        // typescript detects true as boolean type
        return _a = {}, _a[this.transform.impute] = true, _a;
    };
    ImputeNode.prototype.processSequence = function (keyvals) {
        var _a = keyvals.start, start = _a === void 0 ? 0 : _a, stop = keyvals.stop, step = keyvals.step;
        var result = [start, stop].concat((step ? [step] : [])).join(',');
        return { signal: "sequence(" + result + ")" };
    };
    ImputeNode.makeFromTransform = function (parent, imputeTransform) {
        return new ImputeNode(parent, imputeTransform);
    };
    ImputeNode.makeFromEncoding = function (parent, model) {
        var encoding = model.encoding;
        var xDef = encoding.x;
        var yDef = encoding.y;
        if (isFieldDef(xDef) && isFieldDef(yDef)) {
            var imputedChannel = xDef.impute ? xDef : yDef.impute ? yDef : undefined;
            if (imputedChannel === undefined) {
                return undefined;
            }
            var keyChannel = xDef.impute ? yDef : yDef.impute ? xDef : undefined;
            var _a = imputedChannel.impute, method = _a.method, value = _a.value, frame = _a.frame, keyvals = _a.keyvals;
            var groupbyFields = pathGroupingFields(model.mark, encoding);
            return new ImputeNode(parent, tslib_1.__assign({ impute: imputedChannel.field, key: keyChannel.field }, (method ? { method: method } : {}), (value !== undefined ? { value: value } : {}), (frame ? { frame: frame } : {}), (keyvals !== undefined ? { keyvals: keyvals } : {}), (groupbyFields.length ? { groupby: groupbyFields } : {})));
        }
        return null;
    };
    ImputeNode.prototype.hash = function () {
        return "Impute " + hash(this.transform);
    };
    ImputeNode.prototype.assemble = function () {
        var _a = this.transform, impute = _a.impute, key = _a.key, keyvals = _a.keyvals, method = _a.method, groupby = _a.groupby, value = _a.value, _b = _a.frame, frame = _b === void 0 ? [null, null] : _b;
        var initialImpute = tslib_1.__assign({ type: 'impute', field: impute, key: key }, (keyvals ? { keyvals: isImputeSequence(keyvals) ? this.processSequence(keyvals) : keyvals } : {}), { method: 'value' }, (groupby ? { groupby: groupby } : {}), { value: null });
        var setImputedField;
        if (method && method !== 'value') {
            var deriveNewField = tslib_1.__assign({ type: 'window', as: ["imputed_" + impute + "_value"], ops: [method], fields: [impute], frame: frame, ignorePeers: false }, (groupby ? { groupby: groupby } : {}));
            var replaceOriginal = {
                type: 'formula',
                expr: "datum." + impute + " === null ? datum.imputed_" + impute + "_value : datum." + impute,
                as: impute
            };
            setImputedField = [deriveNewField, replaceOriginal];
        }
        else {
            var replaceWithValue = {
                type: 'formula',
                expr: "datum." + impute + " === null ? " + value + " : datum." + impute,
                as: impute
            };
            setImputedField = [replaceWithValue];
        }
        return [initialImpute].concat(setImputedField);
    };
    return ImputeNode;
}(TransformNode));
export { ImputeNode };
//# sourceMappingURL=impute.js.map