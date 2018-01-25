"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = require("../../selection");
var dataflow_1 = require("./dataflow");
var IdentifierNode = /** @class */ (function (_super) {
    __extends(IdentifierNode, _super);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZW50aWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2luZGVudGlmaWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDZDQUE2QztBQUU3Qyx1Q0FBd0M7QUFFeEM7SUFBb0Msa0NBQVk7SUFLOUM7ZUFDRSxpQkFBTztJQUNULENBQUM7SUFOTSw4QkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksY0FBYyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQU1NLHVDQUFjLEdBQXJCO1FBQ0UsTUFBTSxVQUFFLEdBQUMsd0JBQVksSUFBRyxJQUFJLEtBQUU7O0lBQ2hDLENBQUM7SUFFTSxpQ0FBUSxHQUFmO1FBQ0UsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsd0JBQVksRUFBQyxDQUFDO0lBQ2hELENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFoQkQsQ0FBb0MsdUJBQVksR0FnQi9DO0FBaEJZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTRUxFQ1RJT05fSUR9IGZyb20gJy4uLy4uL3NlbGVjdGlvbic7XG5pbXBvcnQge1ZnSWRlbnRpZmllclRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5leHBvcnQgY2xhc3MgSWRlbnRpZmllck5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBJZGVudGlmaWVyTm9kZSgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpIHtcbiAgICByZXR1cm4ge1tTRUxFQ1RJT05fSURdOiB0cnVlfTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ0lkZW50aWZpZXJUcmFuc2Zvcm0ge1xuICAgIHJldHVybiB7dHlwZTogJ2lkZW50aWZpZXInLCBhczogU0VMRUNUSU9OX0lEfTtcbiAgfVxufVxuIl19