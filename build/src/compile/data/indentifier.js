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
    function IdentifierNode(parent) {
        return _super.call(this, parent) || this;
    }
    IdentifierNode.prototype.clone = function () {
        return new IdentifierNode(null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZW50aWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2luZGVudGlmaWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDZDQUE2QztBQUc3Qyx1Q0FBd0M7QUFFeEM7SUFBb0Msa0NBQVk7SUFLOUMsd0JBQVksTUFBb0I7ZUFDOUIsa0JBQU0sTUFBTSxDQUFDO0lBQ2YsQ0FBQztJQU5NLDhCQUFLLEdBQVo7UUFDRSxNQUFNLENBQUMsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQU1NLHVDQUFjLEdBQXJCO1FBQ0UsTUFBTSxVQUFFLEdBQUMsd0JBQVksSUFBRyxJQUFJLEtBQUU7O0lBQ2hDLENBQUM7SUFFTSxpQ0FBUSxHQUFmO1FBQ0UsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsd0JBQVksRUFBQyxDQUFDO0lBQ2hELENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFoQkQsQ0FBb0MsdUJBQVksR0FnQi9DO0FBaEJZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTRUxFQ1RJT05fSUR9IGZyb20gJy4uLy4uL3NlbGVjdGlvbic7XG5pbXBvcnQge1N0cmluZ1NldH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnSWRlbnRpZmllclRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5leHBvcnQgY2xhc3MgSWRlbnRpZmllck5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBJZGVudGlmaWVyTm9kZShudWxsKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlKSB7XG4gICAgc3VwZXIocGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpOiBTdHJpbmdTZXQge1xuICAgIHJldHVybiB7W1NFTEVDVElPTl9JRF06IHRydWV9O1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnSWRlbnRpZmllclRyYW5zZm9ybSB7XG4gICAgcmV0dXJuIHt0eXBlOiAnaWRlbnRpZmllcicsIGFzOiBTRUxFQ1RJT05fSUR9O1xuICB9XG59XG4iXX0=