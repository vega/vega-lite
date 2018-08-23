import * as tslib_1 from "tslib";
import { duplicate, hash } from '../../util';
import { TransformNode } from './dataflow';
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
        return new SampleTransformNode(this.parent, duplicate(this.transform));
    };
    SampleTransformNode.prototype.hash = function () {
        return "SampleTransform " + hash(this.transform);
    };
    SampleTransformNode.prototype.assemble = function () {
        return {
            type: 'sample',
            size: this.transform.sample
        };
    };
    return SampleTransformNode;
}(TransformNode));
export { SampleTransformNode };
//# sourceMappingURL=sample.js.map