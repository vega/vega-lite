"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var selection_1 = require("../../selection");
var dataflow_1 = require("./dataflow");
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
        return _a = {}, _a[selection_1.SELECTION_ID] = true, _a;
    };
    IdentifierNode.prototype.assemble = function () {
        return { type: 'identifier', as: selection_1.SELECTION_ID };
    };
    return IdentifierNode;
}(dataflow_1.DataFlowNode));
exports.IdentifierNode = IdentifierNode;
//# sourceMappingURL=identifier.js.map