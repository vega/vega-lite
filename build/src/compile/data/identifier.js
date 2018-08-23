import * as tslib_1 from "tslib";
import { SELECTION_ID } from '../../selection';
import { DataFlowNode } from './dataflow';
var IdentifierNode = /** @class */ (function (_super) {
    tslib_1.__extends(IdentifierNode, _super);
    function IdentifierNode(parent) {
        return _super.call(this, parent) || this;
    }
    IdentifierNode.prototype.clone = function () {
        return new IdentifierNode(null);
    };
    IdentifierNode.prototype.producedFields = function () {
        var _a;
        return _a = {}, _a[SELECTION_ID] = true, _a;
    };
    IdentifierNode.prototype.assemble = function () {
        return { type: 'identifier', as: SELECTION_ID };
    };
    return IdentifierNode;
}(DataFlowNode));
export { IdentifierNode };
//# sourceMappingURL=identifier.js.map