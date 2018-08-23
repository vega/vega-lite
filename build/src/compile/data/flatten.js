import * as tslib_1 from "tslib";
import { duplicate, hash } from '../../util';
import { TransformNode } from './dataflow';
/**
 * A class for flatten transform nodes
 */
var FlattenTransformNode = /** @class */ (function (_super) {
    tslib_1.__extends(FlattenTransformNode, _super);
    function FlattenTransformNode(parent, transform) {
        var _this = _super.call(this, parent) || this;
        _this.transform = transform;
        var _a = _this.transform, flatten = _a.flatten, _b = _a.as, as = _b === void 0 ? [] : _b;
        _this.transform.as = flatten.map(function (f, i) { return as[i] || f; });
        return _this;
    }
    FlattenTransformNode.prototype.clone = function () {
        return new FlattenTransformNode(this.parent, duplicate(this.transform));
    };
    FlattenTransformNode.prototype.producedFields = function () {
        var _this = this;
        return this.transform.flatten.reduce(function (out, field, i) {
            out[_this.transform.as[i]] = true;
            return out;
        }, {});
    };
    FlattenTransformNode.prototype.hash = function () {
        return "FlattenTransform " + hash(this.transform);
    };
    FlattenTransformNode.prototype.assemble = function () {
        var _a = this.transform, fields = _a.flatten, as = _a.as;
        var result = {
            type: 'flatten',
            fields: fields,
            as: as
        };
        return result;
    };
    return FlattenTransformNode;
}(TransformNode));
export { FlattenTransformNode };
//# sourceMappingURL=flatten.js.map