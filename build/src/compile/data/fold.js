"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
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
        return new FoldTransformNode(this.parent, util_1.duplicate(this.transform));
    };
    FoldTransformNode.prototype.producedFields = function () {
        return this.transform.as.reduce(function (result, item) {
            result[item] = true;
            return result;
        }, {});
    };
    FoldTransformNode.prototype.hash = function () {
        return "FoldTransform " + util_1.hash(this.transform);
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
}(dataflow_1.TransformNode));
exports.FoldTransformNode = FoldTransformNode;
//# sourceMappingURL=fold.js.map