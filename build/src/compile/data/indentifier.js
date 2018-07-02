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
        return _a = {}, _a[SELECTION_ID] = true, _a;
        var _a;
    };
    IdentifierNode.prototype.assemble = function () {
        return { type: 'identifier', as: SELECTION_ID };
    };
    return IdentifierNode;
}(DataFlowNode));
export { IdentifierNode };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZW50aWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2luZGVudGlmaWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFHN0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUV4QztJQUFvQywwQ0FBWTtJQUs5Qyx3QkFBWSxNQUFvQjtlQUM5QixrQkFBTSxNQUFNLENBQUM7SUFDZixDQUFDO0lBTk0sOEJBQUssR0FBWjtRQUNFLE9BQU8sSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQU1NLHVDQUFjLEdBQXJCO1FBQ0UsZ0JBQVEsR0FBQyxZQUFZLElBQUcsSUFBSSxLQUFFOztJQUNoQyxDQUFDO0lBRU0saUNBQVEsR0FBZjtRQUNFLE9BQU8sRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBaEJELENBQW9DLFlBQVksR0FnQi9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTRUxFQ1RJT05fSUR9IGZyb20gJy4uLy4uL3NlbGVjdGlvbic7XG5pbXBvcnQge1N0cmluZ1NldH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnSWRlbnRpZmllclRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5leHBvcnQgY2xhc3MgSWRlbnRpZmllck5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBJZGVudGlmaWVyTm9kZShudWxsKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlKSB7XG4gICAgc3VwZXIocGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpOiBTdHJpbmdTZXQge1xuICAgIHJldHVybiB7W1NFTEVDVElPTl9JRF06IHRydWV9O1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnSWRlbnRpZmllclRyYW5zZm9ybSB7XG4gICAgcmV0dXJuIHt0eXBlOiAnaWRlbnRpZmllcicsIGFzOiBTRUxFQ1RJT05fSUR9O1xuICB9XG59XG4iXX0=