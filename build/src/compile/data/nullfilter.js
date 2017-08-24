"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var NullFilterNode = (function (_super) {
    tslib_1.__extends(NullFilterNode, _super);
    function NullFilterNode(fields) {
        var _this = _super.call(this) || this;
        _this._filteredFields = fields;
        return _this;
    }
    NullFilterNode.prototype.clone = function () {
        return new NullFilterNode(util_1.duplicate(this._filteredFields));
    };
    NullFilterNode.make = function (model) {
        var fields = model.reduceFieldDef(function (aggregator, fieldDef, channel) {
            if (model.config.invalidValues === 'filter' && !fieldDef.aggregate && fieldDef.field) {
                // Vega's aggregate operator already handle invalid values, so we only have to consider non-aggregate field here.
                var scaleComponent = channel_1.isScaleChannel(channel) && model.getScaleComponent(channel);
                if (scaleComponent) {
                    var scaleType = scaleComponent.get('type');
                    // only automatically filter null for continuous domain since discrete domain scales can handle invalid values.
                    if (scale_1.hasContinuousDomain(scaleType)) {
                        aggregator[fieldDef.field] = fieldDef;
                    }
                }
            }
            return aggregator;
        }, {});
        if (util_1.keys(fields).length === 0) {
            return null;
        }
        return new NullFilterNode(fields);
    };
    Object.defineProperty(NullFilterNode.prototype, "filteredFields", {
        get: function () {
            return this._filteredFields;
        },
        enumerable: true,
        configurable: true
    });
    NullFilterNode.prototype.merge = function (other) {
        var _this = this;
        var t = util_1.keys(this._filteredFields).map(function (k) { return k + ' ' + util_1.hash(_this._filteredFields[k]); });
        var o = util_1.keys(other.filteredFields).map(function (k) { return k + ' ' + util_1.hash(other.filteredFields[k]); });
        if (!util_1.differArray(t, o)) {
            this._filteredFields = util_1.extend(this._filteredFields, other._filteredFields);
            other.remove();
        }
    };
    NullFilterNode.prototype.assemble = function () {
        var _this = this;
        var filters = util_1.keys(this._filteredFields).reduce(function (_filters, field) {
            var fieldDef = _this._filteredFields[field];
            if (fieldDef !== null) {
                _filters.push("datum[" + util_1.stringValue(fieldDef.field) + "] !== null");
                if (util_1.contains([type_1.QUANTITATIVE, type_1.TEMPORAL], fieldDef.type)) {
                    // TODO(https://github.com/vega/vega-lite/issues/1436):
                    // We can be even smarter and add NaN filter for N,O that are numbers
                    // based on the `parse` property once we have it.
                    _filters.push("!isNaN(datum[" + util_1.stringValue(fieldDef.field) + "])");
                }
            }
            return _filters;
        }, []);
        return filters.length > 0 ?
            {
                type: 'filter',
                expr: filters.join(' && ')
            } : null;
    };
    return NullFilterNode;
}(dataflow_1.DataFlowNode));
exports.NullFilterNode = NullFilterNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVsbGZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvbnVsbGZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx5Q0FBNkM7QUFFN0MscUNBQWdEO0FBQ2hELG1DQUFrRDtBQUNsRCxtQ0FBbUc7QUFHbkcsdUNBQXdDO0FBRXhDO0lBQW9DLDBDQUFZO0lBTzlDLHdCQUFZLE1BQThCO1FBQTFDLFlBQ0UsaUJBQU8sU0FHUjtRQURDLEtBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDOztJQUNoQyxDQUFDO0lBUk0sOEJBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLGNBQWMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFRYSxtQkFBSSxHQUFsQixVQUFtQixLQUFxQjtRQUN0QyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQUMsVUFBa0MsRUFBRSxRQUFRLEVBQUUsT0FBTztZQUN4RixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsS0FBSyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNyRixpSEFBaUg7Z0JBRWpILElBQU0sY0FBYyxHQUFHLHdCQUFjLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRixFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUNuQixJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUU3QywrR0FBK0c7b0JBQy9HLEVBQUUsQ0FBQyxDQUFDLDJCQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsVUFB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