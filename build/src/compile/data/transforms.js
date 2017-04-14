"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var filter_1 = require("../../filter");
var log = require("../../log");
var transform_1 = require("../../transform");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var FilterNode = (function (_super) {
    tslib_1.__extends(FilterNode, _super);
    function FilterNode(filter) {
        var _this = _super.call(this) || this;
        _this.filter = filter;
        return _this;
    }
    FilterNode.prototype.clone = function () {
        return new FilterNode(util_1.duplicate(this.filter));
    };
    FilterNode.prototype.merge = function (other) {
        this.filter = (vega_util_1.isArray(this.filter) ? this.filter : [this.filter]).concat(vega_util_1.isArray(other.filter) ? other.filter : [other.filter]);
        this.remove();
    };
    FilterNode.prototype.assemble = function () {
        return {
            type: 'filter',
            expr: filter_1.expression(this.filter)
        };
    };
    return FilterNode;
}(dataflow_1.DataFlowNode));
exports.FilterNode = FilterNode;
/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
var CalculateNode = (function (_super) {
    tslib_1.__extends(CalculateNode, _super);
    function CalculateNode(transform) {
        var _this = _super.call(this) || this;
        _this.transform = transform;
        return _this;
    }
    CalculateNode.prototype.clone = function () {
        return new CalculateNode(util_1.duplicate(this.transform));
    };
    CalculateNode.prototype.producedFields = function () {
        var out = {};
        out[this.transform.as] = true;
        return out;
    };
    CalculateNode.prototype.assemble = function () {
        return {
            type: 'formula',
            expr: this.transform.calculate,
            as: this.transform.as
        };
    };
    return CalculateNode;
}(dataflow_1.DataFlowNode));
exports.CalculateNode = CalculateNode;
/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
function parseTransformArray(model) {
    var first;
    var last;
    var node;
    var previous;
    model.transforms.forEach(function (t, i) {
        if (transform_1.isCalculate(t)) {
            node = new CalculateNode(t);
        }
        else if (transform_1.isFilter(t)) {
            node = new FilterNode(t.filter);
        }
        else {
            log.warn(log.message.invalidTransformIgnored(t));
            return;
        }
        if (i === 0) {
            first = node;
        }
        else {
            node.parent = previous;
        }
        previous = node;
    });
    last = node;
    return { first: first, last: last };
}
exports.parseTransformArray = parseTransformArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3Jtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvdHJhbnNmb3Jtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFDbEMsdUNBQWdEO0FBQ2hELCtCQUFpQztBQUNqQyw2Q0FBMkY7QUFDM0YsbUNBQXFDO0FBR3JDLHVDQUF3QztBQUd4QztJQUFnQyxzQ0FBWTtJQUsxQyxvQkFBb0IsTUFBeUI7UUFBN0MsWUFDRSxpQkFBTyxTQUNSO1FBRm1CLFlBQU0sR0FBTixNQUFNLENBQW1COztJQUU3QyxDQUFDO0lBTk0sMEJBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFNTSwwQkFBSyxHQUFaLFVBQWEsS0FBaUI7UUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLG1CQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQ3ZFLG1CQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUV6RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVNLDZCQUFRLEdBQWY7UUFDRSxNQUFNLENBQUM7WUFDTCxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxtQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDOUIsQ0FBQztJQUNKLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUF0QkQsQ0FBZ0MsdUJBQVksR0FzQjNDO0FBdEJZLGdDQUFVO0FBd0J2Qjs7R0FFRztBQUNIO0lBQW1DLHlDQUFZO0lBSzdDLHVCQUFvQixTQUE2QjtRQUFqRCxZQUNFLGlCQUFPLFNBQ1I7UUFGbUIsZUFBUyxHQUFULFNBQVMsQ0FBb0I7O0lBRWpELENBQUM7SUFOTSw2QkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksYUFBYSxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQU1NLHNDQUFjLEdBQXJCO1FBQ0UsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU0sZ0NBQVEsR0FBZjtRQUNFLE1BQU0sQ0FBQztZQUNMLElBQUksRUFBRSxTQUFTO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUztZQUM5QixFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1NBQ3RCLENBQUM7SUFDSixDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBdEJELENBQW1DLHVCQUFZLEdBc0I5QztBQXRCWSxzQ0FBYTtBQXdCMUI7O0dBRUc7QUFDSCw2QkFBb0MsS0FBWTtJQUM5QyxJQUFJLEtBQW1CLENBQUM7SUFDeEIsSUFBSSxJQUFrQixDQUFDO0lBQ3ZCLElBQUksSUFBa0IsQ0FBQztJQUN2QixJQUFJLFFBQXNCLENBQUM7SUFFM0IsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyx1QkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLEdBQUcsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxvQkFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDZixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztRQUN6QixDQUFDO1FBQ0QsUUFBUSxHQUFHLElBQUksQ0FBQztJQUNsQixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksR0FBRyxJQUFJLENBQUM7SUFFWixNQUFNLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBRSxJQUFJLE1BQUEsRUFBQyxDQUFDO0FBQ3ZCLENBQUM7QUEzQkQsa0RBMkJDIn0=