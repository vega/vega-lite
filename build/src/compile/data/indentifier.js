"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var selection_1 = require("../../selection");
var dataflow_1 = require("./dataflow");
var IdentifierNode = (function (_super) {
    tslib_1.__extends(IdentifierNode, _super);
    function IdentifierNode() {
        return _super.call(this) || this;
    }
    IdentifierNode.prototype.clone = function () {
        return new IdentifierNode();
    };
    IdentifierNode.prototype.producedFields = function () {
        return _a = {}, _a[selection_1.SELECTION_ID] = true, _a;
        var _a;
    };
    IdentifierNode.prototype.assemble = function () {
        return { type: 'identifier', as: selection_1.SELECTION_ID };
    };
    return IdentifierNode;
}(dataflow_1.DataFlowNode));
exports.IdentifierNode = IdentifierNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZW50aWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2luZGVudGlmaWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUE2QztBQUU3Qyx1Q0FBd0M7QUFFeEM7SUFBb0MsMENBQVk7SUFLOUM7ZUFDRSxpQkFBTztJQUNULENBQUM7SUFOTSw4QkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksY0FBYyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQU1NLHVDQUFjLEdBQXJCO1FBQ0UsTUFBTSxVQUFFLEdBQUMsd0JBQVksSUFBRyxJQUFJLEtBQUU7O0lBQ2hDLENBQUM7SUFFTSxpQ0FBUSxHQUFmO1FBQ0UsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsd0JBQVksRUFBQyxDQUFDO0lBQ2hELENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFoQkQsQ0FBb0MsdUJBQVksR0FnQi9DO0FBaEJZLHdDQUFjIn0=