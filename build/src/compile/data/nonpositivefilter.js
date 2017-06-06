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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ucG9zaXRpdmVmaWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL25vbnBvc2l0aXZlZmlsdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFzQztBQUN0QyxtQ0FBeUQ7QUFHekQsdUNBQXdDO0FBRXhDO0lBQTJDLGlEQUFZO0lBT3JELCtCQUFZLE1BQXFCO1FBQWpDLFlBQ0UsaUJBQU8sU0FHUjtRQURDLEtBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOztJQUN4QixDQUFDO0lBUk0scUNBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLHFCQUFxQixDQUFDLGFBQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQVFhLDBCQUFJLEdBQWxCLFVBQW1CLEtBQWdCO1FBQ2pDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBUyxvQkFBb0IsRUFBRSxPQUFPO1lBQzNFLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMscUJBQXFCO2dCQUNyQixNQUFNLENBQUMsb0JBQW9CLENBQUM7WUFDOUIsQ0FBQztZQUNELG9CQUFvQixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLGlCQUFTLENBQUMsR0FBRyxDQUFDO1lBQzFFLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztRQUM5QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxzQkFBSSx5Q0FBTTthQUFWO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQzs7O09BQUE7SUFFTSx3Q0FBUSxHQUFmO1FBQUEsaUJBVUM7UUFUQyxNQUFNLENBQUMsV0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUFLO1lBQ3JDLDhDQUE4QztZQUM5QyxNQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBUyxLQUFLO1lBQ25CLE1BQU0sQ0FBQztnQkFDTCxJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsU0FBUyxHQUFHLEtBQUssR0FBRyxRQUFRO2FBQ2QsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUE5Q0QsQ0FBMkMsdUJBQVksR0E4Q3REO0FBOUNZLHNEQUFxQiJ9