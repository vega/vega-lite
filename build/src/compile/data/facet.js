"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var scale_1 = require("../../scale");
var vega_schema_1 = require("../../vega.schema");
var domain_1 = require("../scale/domain");
var dataflow_1 = require("./dataflow");
/**
 * A node that helps us track what fields we are faceting by.
 */
var FacetNode = (function (_super) {
    tslib_1.__extends(FacetNode, _super);
    /**
     * @param model The facet model.
     * @param name The name that this facet source will have.
     * @param data The source data for this facet data.
     */
    function FacetNode(model, name, data) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.name = name;
        _this.data = data;
        _this.childIndependentFieldWithStep = {};
        if (model.facet.column) {
            _this.columnFields = [model.field(channel_1.COLUMN)];
            _this.columnName = model.getName('column_domain');
            if (model.fieldDef(channel_1.COLUMN).bin) {
                _this.columnFields.push(model.field(channel_1.COLUMN, { binSuffix: 'range' }));
            }
        }
        if (model.facet.row) {
            _this.rowFields = [model.field(channel_1.ROW)];
            _this.rowName = model.getName('row_domain');
            if (model.fieldDef(channel_1.ROW).bin) {
                _this.rowFields.push(model.field(channel_1.ROW, { binSuffix: 'range' }));
            }
        }
        for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
            var channel = _a[_i];
            var childScaleComponent = model.child.component.scales[channel];
            if (childScaleComponent && !childScaleComponent.merged) {
                var type = childScaleComponent.get('type');
                var range = childScaleComponent.get('range');
                if (scale_1.hasDiscreteDomain(type) && vega_schema_1.isVgRangeStep(range)) {
                    var field = domain_1.getFieldFromDomains(childScaleComponent.domains);
                    if (field) {
                        _this.childIndependentFieldWithStep[channel] = field;
                    }
                    else {
                        throw new Error('We do not yet support calculation of size for faceted union domain.');
                    }
                }
            }
        }
        return _this;
    }
    Object.defineProperty(FacetNode.prototype, "fields", {
        get: function () {
            var fields = [];
            if (this.columnFields) {
                fields = fields.concat(this.columnFields);
            }
            if (this.rowFields) {
                fields = fields.concat(this.rowFields);
            }
            return fields;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The name to reference this source is its name.
     */
    FacetNode.prototype.getSource = function () {
        return this.name;
    };
    FacetNode.prototype.assembleRowColumnData = function (channel, crossedDataName) {
        var childChannel = channel === 'row' ? 'y' : 'x';
        var aggregateChildField = {};
        if (this.childIndependentFieldWithStep[childChannel]) {
            if (crossedDataName) {
                aggregateChildField = {
                    // If there is a crossed data, calculate max
                    fields: ["distinct_" + this.childIndependentFieldWithStep[childChannel]],
                    ops: ['max'],
                    // Although it is technically a max, just name it distinct so it's easier to refer to it
                    as: ["distinct_" + this.childIndependentFieldWithStep[childChannel]]
                };
            }
            else {
                aggregateChildField = {
                    // If there is no crossed data, just calculate distinct
                    fields: [this.childIndependentFieldWithStep[childChannel]],
                    ops: ['distinct']
                };
            }
        }
        return {
            name: channel === 'row' ? this.rowName : this.columnName,
            // Use data from the crossed one if it exist
            source: crossedDataName || this.data,
            transform: [tslib_1.__assign({ type: 'aggregate', groupby: channel === 'row' ? this.rowFields : this.columnFields }, aggregateChildField)]
        };
    };
    FacetNode.prototype.assemble = function () {
        var data = [];
        var crossedDataName = null;
        if (this.columnName && this.rowName && (this.childIndependentFieldWithStep.x || this.childIndependentFieldWithStep.y)) {
            // Need to create a cross dataset to correctly calculate cardinality
            crossedDataName = "cross_" + this.columnName + "_" + this.rowName;
            var fields = [].concat(this.childIndependentFieldWithStep.x ? [this.childIndependentFieldWithStep.x] : [], this.childIndependentFieldWithStep.y ? [this.childIndependentFieldWithStep.y] : []);
            var ops = fields.map(function () { return 'distinct'; });
            data.push({
                name: crossedDataName,
                source: this.data,
                transform: [{
                        type: 'aggregate',
                        groupby: this.columnFields.concat(this.rowFields),
                        fields: fields,
                        ops: ops
                    }]
            });
        }
        if (this.columnName) {
            data.push(this.assembleRowColumnData('column', crossedDataName));
        }
        if (this.rowName) {
            data.push(this.assembleRowColumnData('row', crossedDataName));
        }
        return data;
    };
    return FacetNode;
}(dataflow_1.DataFlowNode));
exports.FacetNode = FacetNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2ZhY2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHlDQUF3RDtBQUN4RCxxQ0FBOEM7QUFDOUMsaURBQThFO0FBRTlFLDBDQUFvRDtBQUNwRCx1Q0FBd0M7QUFFeEM7O0dBRUc7QUFDSDtJQUErQixxQ0FBWTtJQVl6Qzs7OztPQUlHO0lBQ0gsbUJBQW1DLEtBQWlCLEVBQWtCLElBQVksRUFBUyxJQUFZO1FBQXZHLFlBQ0UsaUJBQU8sU0FtQ1I7UUFwQ2tDLFdBQUssR0FBTCxLQUFLLENBQVk7UUFBa0IsVUFBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFVBQUksR0FBSixJQUFJLENBQVE7UUFidEYsbUNBQTZCLEdBRzFDLEVBQUUsQ0FBQztRQWFMLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN2QixLQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxnQkFBTSxDQUFDLENBQUMsQ0FBQztZQUMxQyxLQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDakQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxnQkFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxnQkFBTSxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsQ0FBQztZQUNwRSxDQUFDO1FBRUgsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwQixLQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxDQUFD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