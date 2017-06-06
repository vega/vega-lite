"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var sort_1 = require("../../sort");
var util_1 = require("../../util");
var common_1 = require("../common");
var dataflow_1 = require("./dataflow");
var OrderNode = (function (_super) {
    tslib_1.__extends(OrderNode, _super);
    function OrderNode(sort) {
        var _this = _super.call(this) || this;
        _this.sort = sort;
        return _this;
    }
    OrderNode.prototype.clone = function () {
        return new OrderNode(util_1.duplicate(this.sort));
    };
    OrderNode.make = function (model) {
        var sort = null;
        if (util_1.contains(['line', 'area'], model.mark())) {
            if (model.mark() === 'line' && model.channelHasField('order')) {
                // For only line, sort by the order field if it is specified.
                sort = common_1.sortParams(model.encoding.order);
            }
            else {
                // For both line and area, we sort values based on dimension by default
                var dimensionChannel = model.markDef.orient === 'horizontal' ? 'y' : 'x';
                var s = model.sort(dimensionChannel);
                var sortField = sort_1.isSortField(s) ?
                    fielddef_1.field({
                        // FIXME: this op might not already exist?
                        // FIXME: what if dimensionChannel (x or y) contains custom domain?
                        aggregate: encoding_1.isAggregate(model.encoding) ? s.op : undefined,
                        field: s.field
                    }) :
                    model.field(dimensionChannel, { binSuffix: 'start' });
                sort = {
                    field: sortField,
                    order: 'descending'
                };
            }
        }
        else {
            return null;
        }
        return new OrderNode(sort);
    };
    OrderNode.prototype.assemble = function () {
        return {
            type: 'collect',
            sort: this.sort
        };
    };
    return OrderNode;
}(dataflow_1.DataFlowNode));
exports.OrderNode = OrderNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aG9yZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9wYXRob3JkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQTJDO0FBQzNDLDJDQUFxQztBQUNyQyxtQ0FBdUM7QUFDdkMsbUNBQStDO0FBRy9DLG9DQUFxQztBQUVyQyx1Q0FBd0M7QUFFeEM7SUFBK0IscUNBQVk7SUFLekMsbUJBQW9CLElBQVk7UUFBaEMsWUFDRSxpQkFBTyxTQUNSO1FBRm1CLFVBQUksR0FBSixJQUFJLENBQVE7O0lBRWhDLENBQUM7SUFOTSx5QkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQU1hLGNBQUksR0FBbEIsVUFBbUIsS0FBZ0I7UUFDakMsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDO1FBRXhCLEVBQUUsQ0FBQyxDQUFDLGVBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUQsNkRBQTZEO2dCQUM3RCxJQUFJLEdBQUcsbUJBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTix1RUFBdUU7Z0JBQ3ZFLElBQU0sZ0JBQWdCLEdBQWMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssWUFBWSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7Z0JBQ3RGLElBQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDdkMsSUFBTSxTQUFTLEdBQUcsa0JBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQzlCLGdCQUFLLENBQUM7d0JBQ0osMENBQTBDO3dCQUMxQyxtRUFBbUU7d0JBQ25FLFNBQVMsRUFBRSxzQkFBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLFNBQVM7d0JBQ3pELEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSztxQkFDZixDQUFDO29CQUNGLEtBQUssQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztnQkFFdEQsSUFBSSxHQUFHO29CQUNMLEtBQUssRUFBRSxTQUFTO29CQUNoQixLQUFLLEVBQUUsWUFBWTtpQkFDcEIsQ0FBQztZQUNKLENBQUM7UUFDSCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRU0sNEJBQVEsR0FBZjtRQUNFLE1BQU0sQ0FBQztZQUNMLElBQUksRUFBRSxTQUFTO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2hCLENBQUM7SUFDSixDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBL0NELENBQStCLHVCQUFZLEdBK0MxQztBQS9DWSw4QkFBUyJ9