"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var type_1 = require("../../type");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var DEFAULT_NULL_FILTERS = {
    nominal: false,
    ordinal: false,
    quantitative: true,
    temporal: true
};
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
        var fields = model.reduceFieldDef(function (aggregator, fieldDef) {
            if (fieldDef.aggregate !== 'count') {
                if (model.config.filterInvalid ||
                    (model.config.filterInvalid === undefined && (fieldDef.field && DEFAULT_NULL_FILTERS[fieldDef.type]))) {
                    aggregator[fieldDef.field] = fieldDef;
                }
                else {
                    // define this so we know that we don't filter nulls for this field
                    // this makes it easier to merge into parents
                    aggregator[fieldDef.field] = null;
                }
            }
            return aggregator;
        }, {});
        if (Object.keys(fields).length === 0) {
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
        var t = Object.keys(this._filteredFields).map(function (k) { return k + ' ' + util_1.hash(_this._filteredFields[k]); });
        var o = Object.keys(other.filteredFields).map(function (k) { return k + ' ' + util_1.hash(other.filteredFields[k]); });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVsbGZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvbnVsbGZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtQ0FBa0Q7QUFDbEQsbUNBQTJHO0FBSTNHLHVDQUF3QztBQUd4QyxJQUFNLG9CQUFvQixHQUFHO0lBQzNCLE9BQU8sRUFBRSxLQUFLO0lBQ2QsT0FBTyxFQUFFLEtBQUs7SUFDZCxZQUFZLEVBQUUsSUFBSTtJQUNsQixRQUFRLEVBQUUsSUFBSTtDQUNmLENBQUM7QUFFRjtJQUFvQywwQ0FBWTtJQU85Qyx3QkFBWSxNQUE4QjtRQUExQyxZQUNFLGlCQUFPLFNBR1I7UUFEQyxLQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQzs7SUFDaEMsQ0FBQztJQVJNLDhCQUFLLEdBQVo7UUFDRSxNQUFNLENBQUMsSUFBSSxjQUFjLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBUWEsbUJBQUksR0FBbEIsVUFBbUIsS0FBcUI7UUFDdEMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxVQUFDLFVBQWtDLEVBQUUsUUFBUTtZQUMvRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYTtvQkFDNUIsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsS0FBSyxTQUFTLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4RyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQztnQkFDeEMsQ0FBQztnQkFBQyxJQUFJLENB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