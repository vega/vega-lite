"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var NonPositiveFilterNode = (function (_super) {
    tslib_1.__extends(NonPositiveFilterNode, _super);
    function NonPositiveFilterNode(filter) {
        var _this = _super.call(this) || this;
        _this._filter = filter;
        return _this;
    }
    NonPositiveFilterNode.prototype.clone = function () {
        return new NonPositiveFilterNode(util_1.extend({}, this._filter));
    };
    NonPositiveFilterNode.make = function (model) {
        var filter = model.channels().reduce(function (nonPositiveComponent, channel) {
            var scale = model.scale(channel);
            if (!scale || !model.field(channel)) {
                // don't set anything
                return nonPositiveComponent;
            }
            nonPositiveComponent[model.field(channel)] = scale.type === scale_1.ScaleType.LOG;
            return nonPositiveComponent;
        }, {});
        if (!Object.keys(filter).length) {
            return null;
        }
        return new NonPositiveFilterNode(filter);
    };
    Object.defineProperty(NonPositiveFilterNode.prototype, "filter", {
        get: function () {
            return this._filter;
        },
        enumerable: true,
        configurable: true
    });
    NonPositiveFilterNode.prototype.assemble = function () {
        var _this = this;
        return util_1.keys(this._filter).filter(function (field) {
            // Only filter fields (keys) with value = true
            return _this._filter[field];
        }).map(function (field) {
            return {
                type: 'filter',
                expr: 'datum["' + field + '"] > 0'
            };
        });
    };
    return NonPositiveFilterNode;
}(dataflow_1.DataFlowNode));
exports.NonPositiveFilterNode = NonPositiveFilterNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ucG9zaXRpdmVmaWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL25vbnBvc2l0aXZlZmlsdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFzQztBQUN0QyxtQ0FBeUQ7QUFHekQsdUNBQXdDO0FBRXhDO0lBQTJDLGlEQUFZO0lBT3JELCtCQUFZLE1BQXFCO1FBQWpDLFlBQ0UsaUJBQU8sU0FHUjtRQURDLEtBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOztJQUN4QixDQUFDO0lBUk0scUNBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLHFCQUFxQixDQUFDLGFBQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQVFhLDBCQUFJLEdBQWxCLFVBQW1CLEtBQVk7UUFDN0IsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFTLG9CQUFvQixFQUFFLE9BQU87WUFDM0UsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxxQkFBcUI7Z0JBQ3JCLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztZQUM5QixDQUFDO1lBQ0Qsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxHQUFHLENBQUM7WUFDMUUsTUFBTSxDQUFDLG9CQUFvQixDQUFDO1FBQzlCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUkscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELHNCQUFJLHlDQUFNO2FBQVY7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDOzs7T0FBQTtJQUVNLHdDQUFRLEdBQWY7UUFBQSxpQkFVQztRQVRDLE1BQU0sQ0FBQyxXQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUs7WUFDckMsOENBQThDO1lBQzlDLE1BQU0sQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFTLEtBQUs7WUFDbkIsTUFBTSxDQUFDO2dCQUNMLElBQUksRUFBRSxRQUFRO2dCQUNkLElBQUksRUFBRSxTQUFTLEdBQUcsS0FBSyxHQUFHLFFBQVE7YUFDZCxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILDRCQUFDO0FBQUQsQ0FBQyxBQTlDRCxDQUEyQyx1QkFBWSxHQThDdEQ7QUE5Q1ksc0RBQXFCIn0=