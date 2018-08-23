import * as tslib_1 from "tslib";
import { duplicate, hash } from '../../util';
import { TransformNode } from './dataflow';
/**
 * A class for flatten transform nodes
 */
var FoldTransformNode = /** @class */ (function (_super) {
    tslib_1.__extends(FoldTransformNode, _super);
    function FoldTransformNode(parent, transform) {
        var _this = _super.call(this, parent) || this;
        _this.transform = transform;
        var specifiedAs = _this.transform.as || [undefined, undefined];
        _this.transform.as = [specifiedAs[0] || 'key', specifiedAs[1] || 'value'];
        return _this;
    }
    FoldTransformNode.prototype.clone = function () {
        return new FoldTransformNode(this.parent, duplicate(this.transform));
    };
    FoldTransformNode.prototype.producedFields = function () {
        return this.transform.as.reduce(function (result, item) {
            result[item] = true;
            return result;
        }, {});
    };
    FoldTransformNode.prototype.hash = function () {
        return "FoldTransform " + hash(this.transform);
    };
    FoldTransformNode.prototype.assemble = function () {
        var _a = this.transform, fold = _a.fold, as = _a.as;
        var result = {
            type: 'fold',
            fields: fold,
            as: as
        };
        return result;
    };
    return FoldTransformNode;
}(TransformNode));
export { FoldTransformNode };
//# sourceMappingURL=fold.js.map