"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
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
        var filter = channel_1.SCALE_CHANNELS.reduce(function (nonPositiveComponent, channel) {
            var scale = model.getScaleComponent(channel);
            if (!scale || !model.field(channel)) {
                // don't set anything
                return nonPositiveComponent;
            }
            nonPositiveComponent[model.field(channel)] = scale.get('type') === scale_1.ScaleType.LOG;
            return nonPositiveComponent;
        }, {});
        if (!util_1.keys(filter).length) {
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
                expr: "datum[" + util_1.stringValue(field) + "] > 0"
            };
        });
    };
    return NonPositiveFilterNode;
}(dataflow_1.DataFlowNode));
exports.NonPositiveFilterNode = NonPositiveFilterNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ucG9zaXRpdmVmaWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL25vbnBvc2l0aXZlZmlsdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQUE2QztBQUM3QyxxQ0FBc0M7QUFDdEMsbUNBQTJEO0FBRzNELHVDQUF3QztBQUd4QztJQUEyQyxpREFBWTtJQU9yRCwrQkFBWSxNQUFxQjtRQUFqQyxZQUNFLGlCQUFPLFNBR1I7UUFEQyxLQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7SUFDeEIsQ0FBQztJQVJNLHFDQUFLLEdBQVo7UUFDRSxNQUFNLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxhQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFRYSwwQkFBSSxHQUFsQixVQUFtQixLQUFnQjtRQUNqQyxJQUFNLE1BQU0sR0FBRyx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxVQUFTLG9CQUFvQixFQUFFLE9BQU87WUFDekUsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLHFCQUFxQjtnQkFDckIsTUFBTSxDQUFDLG9CQUFvQixDQUFDO1lBQzlCLENBQUM7WUFDRCxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxpQkFBUyxDQUFDLEdBQUcsQ0FBQztZQUNqRixNQUFNLENBQUMsb0JBQW9CLENBQUM7UUFDOUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxzQkFBSSx5Q0FBTTthQUFWO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQzs7O09BQUE7SUFFTSx3Q0FBUSxHQUFmO1FBQUEsaUJBVUM7UUFUQyxNQUFNLENBQUMsV0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUFLO1lBQ3JDLDhDQUE4QztZQUM5QyxNQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBUyxLQUFLO1lBQ25CLE1BQU0sQ0FBQztnQkFDTCxJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsV0FBUyxrQkFBVyxDQUFDLEtBQUssQ0FBQyxVQUFPO2FBQ3BCLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBOUNELENBQTJDLHVCQUFZLEdBOEN0RDtBQTlDWSxzREFBcUIifQ==