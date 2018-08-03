"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
/**
 * A class for the sample transform nodes
 */
var SampleTransformNode = /** @class */ (function (_super) {
    tslib_1.__extends(SampleTransformNode, _super);
    function SampleTransformNode(parent, transform) {
        var _this = _super.call(this, parent) || this;
        _this.transform = transform;
        return _this;
    }
    SampleTransformNode.prototype.clone = function () {
        return new SampleTransformNode(this.parent, util_1.duplicate(this.transform));
    };
    SampleTransformNode.prototype.hash = function () {
        return "SampleTransform " + util_1.hash(this.transform);
    };
    SampleTransformNode.prototype.assemble = function () {
        return {
            type: 'sample',
            size: this.transform.sample
        };
    };
    return SampleTransformNode;
}(dataflow_1.TransformNode));
exports.SampleTransformNode = SampleTransformNode;
//# sourceMappingURL=sample.js.map