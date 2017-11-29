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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var log = require("../../log");
var scale_1 = require("../../scale");
var vega_schema_1 = require("../../vega.schema");
var domain_1 = require("../scale/domain");
var dataflow_1 = require("./dataflow");
/**
 * A node that helps us track what fields we are faceting by.
 */
var FacetNode = /** @class */ (function (_super) {
    __extends(FacetNode, _super);
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
        if (model.facet.column) {
            _this.columnFields = [model.field(channel_1.COLUMN)];
            _this.columnName = model.getName('column_domain');
            if (model.fieldDef(channel_1.COLUMN).bin) {
                _this.columnFields.push(model.field(channel_1.COLUMN, { binSuffix: 'end' }));
            }
        }
        if (model.facet.row) {
            _this.rowFields = [model.field(channel_1.ROW)];
            _this.rowName = model.getName('row_domain');
            if (model.fieldDef(channel_1.ROW).bin) {
                _this.rowFields.push(model.field(channel_1.ROW, { binSuffix: 'end' }));
            }
        }
        _this.childModel = model.child;
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
    FacetNode.prototype.getChildIndependentFieldsWithStep = function () {
        var childIndependentFieldsWithStep = {};
        for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
            var channel = _a[_i];
            var childScaleComponent = this.childModel.component.scales[channel];
            if (childScaleComponent && !childScaleComponent.merged) {
                var type = childScaleComponent.get('type');
                var range = childScaleComponent.get('range');
                if (scale_1.hasDiscreteDomain(type) && vega_schema_1.isVgRangeStep(range)) {
                    var domain = domain_1.assembleDomain(this.childModel, channel);
                    var field = domain_1.getFieldFromDomain(domain);
                    if (field) {
                        childIndependentFieldsWithStep[channel] = field;
                    }
                    else {
                        log.warn('Unknown field for ${channel}.  Cannot calculate view size.');
                    }
                }
            }
        }
        return childIndependentFieldsWithStep;
    };
    FacetNode.prototype.assembleRowColumnData = function (channel, crossedDataName, childIndependentFieldsWithStep) {
        var aggregateChildField = {};
        var childChannel = channel === 'row' ? 'y' : 'x';
        if (childIndependentFieldsWithStep[childChannel]) {
            if (crossedDataName) {
                aggregateChildField = {
                    // If there is a crossed data, calculate max
                    fields: ["distinct_" + childIndependentFieldsWithStep[childChannel]],
                    ops: ['max'],
                    // Although it is technically a max, just name it distinct so it's easier to refer to it
                    as: ["distinct_" + childIndependentFieldsWithStep[childChannel]]
                };
            }
            else {
                aggregateChildField = {
                    // If there is no crossed data, just calculate distinct
                    fields: [childIndependentFieldsWithStep[childChannel]],
                    ops: ['distinct']
                };
            }
        }
        return {
            name: channel === 'row' ? this.rowName : this.columnName,
            // Use data from the crossed one if it exist
            source: crossedDataName || this.data,
            transform: [__assign({ type: 'aggregate', groupby: channel === 'row' ? this.rowFields : this.columnFields }, aggregateChildField)]
        };
    };
    FacetNode.prototype.assemble = function () {
        var data = [];
        var crossedDataName = null;
        var childIndependentFieldsWithStep = this.getChildIndependentFieldsWithStep();
        if (this.columnName && this.rowName && (childIndependentFieldsWithStep.x || childIndependentFieldsWithStep.y)) {
            // Need to create a cross dataset to correctly calculate cardinality
            crossedDataName = "cross_" + this.columnName + "_" + this.rowName;
            var fields = [].concat(childIndependentFieldsWithStep.x ? [childIndependentFieldsWithStep.x] : [], childIndependentFieldsWithStep.y ? [childIndependentFieldsWithStep.y] : []);
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
            data.push(this.assembleRowColumnData('column', crossedDataName, childIndependentFieldsWithStep));
        }
        if (this.rowName) {
            data.push(this.assembleRowColumnData('row', crossedDataName, childIndependentFieldsWithStep));
        }
        return data;
    };
    return FacetNode;
}(dataflow_1.DataFlowNode));
exports.FacetNode = FacetNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2ZhY2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EseUNBQXdEO0FBQ3hELCtCQUFpQztBQUNqQyxxQ0FBOEM7QUFDOUMsaURBQThFO0FBRzlFLDBDQUFtRTtBQUNuRSx1Q0FBd0M7QUFPeEM7O0dBRUc7QUFDSDtJQUErQiw2QkFBWTtJQVN6Qzs7OztPQUlHO0lBQ0gsbUJBQW1DLEtBQWlCLEVBQWtCLElBQVksRUFBUyxJQUFZO1FBQXZHLFlBQ0UsaUJBQU8sU0FtQlI7UUFwQmtDLFdBQUssR0FBTCxLQUFLLENBQVk7UUFBa0IsVUFBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFVBQUksR0FBSixJQUFJLENBQVE7UUFHckcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEtBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzFDLEtBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNqRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGdCQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFNLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLENBQUM7UUFDSCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLEtBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLENB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RSw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7UUFDbkcsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsOEJBQThCLENBQUMsQ0FBQyxDQUFDO1FBQ2hHLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXJKRCxDQUErQix1QkFBWSxHQXFKMUM7QUFySlksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICcuLi8uLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtDT0xVTU4sIFJPVywgU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbn0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtpc1ZnUmFuZ2VTdGVwLCBWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybSwgVmdEYXRhfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0ZhY2V0TW9kZWx9IGZyb20gJy4uL2ZhY2V0JztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7YXNzZW1ibGVEb21haW4sIGdldEZpZWxkRnJvbURvbWFpbn0gZnJvbSAnLi4vc2NhbGUvZG9tYWluJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxudHlwZSBDaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAgPSB7XG4gIHg/OiBzdHJpbmcsXG4gIHk/OiBzdHJpbmdcbn07XG5cbi8qKlxuICogQSBub2RlIHRoYXQgaGVscHMgdXMgdHJhY2sgd2hhdCBmaWVsZHMgd2UgYXJlIGZhY2V0aW5nIGJ5LlxuICovXG5leHBvcnQgY2xhc3MgRmFjZXROb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSByZWFkb25seSBjb2x1bW5GaWVsZHM6IHN0cmluZ1tdO1xuICBwcml2YXRlIHJlYWRvbmx5IGNvbHVtbk5hbWU6IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IHJvd0ZpZWxkczogc3RyaW5nW107XG4gIHByaXZhdGUgcmVhZG9ubHkgcm93TmFtZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgY2hpbGRNb2RlbDogTW9kZWw7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBtb2RlbCBUaGUgZmFjZXQgbW9kZWwuXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIHRoYXQgdGhpcyBmYWNldCBzb3VyY2Ugd2lsbCBoYXZlLlxuICAgKiBAcGFyYW0gZGF0YSBUaGUgc291cmNlIGRhdGEgZm9yIHRoaXMgZmFjZXQgZGF0YS5cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbW9kZWw6IEZhY2V0TW9kZWwsIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmcsIHB1YmxpYyBkYXRhOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKG1vZGVsLmZhY2V0LmNvbHVtbikge1xuICAgICAgdGhpcy5jb2x1bW5GaWVsZHMgPSBbbW9kZWwuZmllbGQoQ09MVU1OKV07XG4gICAgICB0aGlzLmNvbHVtbk5hbWUgPSBtb2RlbC5nZXROYW1lKCdjb2x1bW5fZG9tYWluJyk7XG4gICAgICBpZiAobW9kZWwuZmllbGREZWYoQ09MVU1OKS5iaW4pIHtcbiAgICAgICAgdGhpcy5jb2x1bW5GaWVsZHMucHVzaChtb2RlbC5maWVsZChDT0xVTU4sIHtiaW5TdWZmaXg6ICdlbmQnfSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb2RlbC5mYWNldC5yb3cpIHtcbiAgICAgIHRoaXMucm93RmllbGRzID0gW21vZGVsLmZpZWxkKFJPVyldO1xuICAgICAgdGhpcy5yb3dOYW1lID0gbW9kZWwuZ2V0TmFtZSgncm93X2RvbWFpbicpO1xuICAgICAgaWYgKG1vZGVsLmZpZWxkRGVmKFJPVykuYmluKSB7XG4gICAgICAgIHRoaXMucm93RmllbGRzLnB1c2gobW9kZWwuZmllbGQoUk9XLCB7YmluU3VmZml4OiAnZW5kJ30pKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNoaWxkTW9kZWwgPSBtb2RlbC5jaGlsZDtcbiAgfVxuXG4gIGdldCBmaWVsZHMoKSB7XG4gICAgbGV0IGZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBpZiAodGhpcy5jb2x1bW5GaWVsZHMpIHtcbiAgICAgIGZpZWxkcyA9IGZpZWxkcy5jb25jYXQodGhpcy5jb2x1bW5GaWVsZHMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5yb3dGaWVsZHMpIHtcbiAgICAgIGZpZWxkcyA9IGZpZWxkcy5jb25jYXQodGhpcy5yb3dGaWVsZHMpO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIHRvIHJlZmVyZW5jZSB0aGlzIHNvdXJjZSBpcyBpdHMgbmFtZS5cbiAgICovXG4gIHB1YmxpYyBnZXRTb3VyY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwKCkge1xuICAgIGNvbnN0IGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcDogQ2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWyd4JywgJ3knXSBhcyBTY2FsZUNoYW5uZWxbXSkge1xuICAgICAgY29uc3QgY2hpbGRTY2FsZUNvbXBvbmVudCA9IHRoaXMuY2hpbGRNb2RlbC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICAgICAgaWYgKGNoaWxkU2NhbGVDb21wb25lbnQgJiYgIWNoaWxkU2NhbGVDb21wb25lbnQubWVyZ2VkKSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBjaGlsZFNjYWxlQ29tcG9uZW50LmdldCgndHlwZScpO1xuICAgICAgICBjb25zdCByYW5nZSA9IGNoaWxkU2NhbGVDb21wb25lbnQuZ2V0KCdyYW5nZScpO1xuXG4gICAgICAgIGlmIChoYXNEaXNjcmV0ZURvbWFpbih0eXBlKSAmJiBpc1ZnUmFuZ2VTdGVwKHJhbmdlKSkge1xuICAgICAgICAgIGNvbnN0IGRvbWFpbiA9IGFzc2VtYmxlRG9tYWluKHRoaXMuY2hpbGRNb2RlbCwgY2hhbm5lbCk7XG4gICAgICAgICAgY29uc3QgZmllbGQgPSBnZXRGaWVsZEZyb21Eb21haW4oZG9tYWluKTtcbiAgICAgICAgICBpZiAoZmllbGQpIHtcbiAgICAgICAgICAgIGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcFtjaGFubmVsXSA9IGZpZWxkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2cud2FybignVW5rbm93biBmaWVsZCBmb3IgJHtjaGFubmVsfS4gIENhbm5vdCBjYWxjdWxhdGUgdmlldyBzaXplLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXA7XG4gIH1cblxuICBwcml2YXRlIGFzc2VtYmxlUm93Q29sdW1uRGF0YShjaGFubmVsOiAncm93JyB8ICdjb2x1bW4nLCBjcm9zc2VkRGF0YU5hbWU6IHN0cmluZywgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwOiBDaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXApOiBWZ0RhdGEge1xuICAgIGxldCBhZ2dyZWdhdGVDaGlsZEZpZWxkOiBQYXJ0aWFsPFZnQWdncmVnYXRlVHJhbnNmb3JtPiA9IHt9O1xuICAgIGNvbnN0IGNoaWxkQ2hhbm5lbCA9IGNoYW5uZWwgPT09ICdyb3cnID8gJ3knIDogJ3gnO1xuXG4gICAgaWYgKGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcFtjaGlsZENoYW5uZWxdKSB7XG4gICAgICBpZiAoY3Jvc3NlZERhdGFOYW1lKSB7XG4gICAgICAgIGFnZ3JlZ2F0ZUNoaWxkRmllbGQgPSB7XG4gICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBjcm9zc2VkIGRhdGEsIGNhbGN1bGF0ZSBtYXhcbiAgICAgICAgICBmaWVsZHM6IFtgZGlzdGluY3RfJHtjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXBbY2hpbGRDaGFubmVsXX1gXSxcbiAgICAgICAgICBvcHM6IFsnbWF4J10sXG4gICAgICAgICAgLy8gQWx0aG91Z2ggaXQgaXMgdGVjaG5pY2FsbHkgYSBtYXgsIGp1c3QgbmFtZSBpdCBkaXN0aW5jdCBzbyBpdCdzIGVhc2llciB0byByZWZlciB0byBpdFxuICAgICAgICAgIGFzOiBbYGRpc3RpbmN0XyR7Y2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwW2NoaWxkQ2hhbm5lbF19YF1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFnZ3JlZ2F0ZUNoaWxkRmllbGQgPSB7XG4gICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gY3Jvc3NlZCBkYXRhLCBqdXN0IGNhbGN1bGF0ZSBkaXN0aW5jdFxuICAgICAgICAgIGZpZWxkczogW2NoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcFtjaGlsZENoYW5uZWxdXSxcbiAgICAgICAgICBvcHM6IFsnZGlzdGluY3QnXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBjaGFubmVsID09PSAncm93JyA/IHRoaXMucm93TmFtZSA6IHRoaXMuY29sdW1uTmFtZSxcbiAgICAgIC8vIFVzZSBkYXRhIGZyb20gdGhlIGNyb3NzZWQgb25lIGlmIGl0IGV4aXN0XG4gICAgICBzb3VyY2U6IGNyb3NzZWREYXRhTmFtZSB8fCB0aGlzLmRhdGEsXG4gICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBncm91cGJ5OiBjaGFubmVsID09PSAncm93JyA/IHRoaXMucm93RmllbGRzIDogdGhpcy5jb2x1bW5GaWVsZHMsXG4gICAgICAgIC4uLmFnZ3JlZ2F0ZUNoaWxkRmllbGRcbiAgICAgIH1dXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpIHtcbiAgICBjb25zdCBkYXRhOiBWZ0RhdGFbXSA9IFtdO1xuICAgIGxldCBjcm9zc2VkRGF0YU5hbWUgPSBudWxsO1xuICAgIGNvbnN0IGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcCA9IHRoaXMuZ2V0Q2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwKCk7XG5cbiAgICBpZiAodGhpcy5jb2x1bW5OYW1lICYmIHRoaXMucm93TmFtZSAmJiAoY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwLnggfHwgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwLnkpKSB7XG4gICAgICAvLyBOZWVkIHRvIGNyZWF0ZSBhIGNyb3NzIGRhdGFzZXQgdG8gY29ycmVjdGx5IGNhbGN1bGF0ZSBjYXJkaW5hbGl0eVxuICAgICAgY3Jvc3NlZERhdGFOYW1lID0gYGNyb3NzXyR7dGhpcy5jb2x1bW5OYW1lfV8ke3RoaXMucm93TmFtZX1gO1xuXG4gICAgICBjb25zdCBmaWVsZHMgPSBbXS5jb25jYXQoXG4gICAgICAgIGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcC54ID8gW2NoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcC54XSA6IFtdLFxuICAgICAgICBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAueSA/IFtjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAueV0gOiBbXSxcbiAgICAgICk7XG4gICAgICBjb25zdCBvcHMgPSBmaWVsZHMubWFwKCgpOiBBZ2dyZWdhdGVPcCA9PiAnZGlzdGluY3QnKTtcblxuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgbmFtZTogY3Jvc3NlZERhdGFOYW1lLFxuICAgICAgICBzb3VyY2U6IHRoaXMuZGF0YSxcbiAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IHRoaXMuY29sdW1uRmllbGRzLmNvbmNhdCh0aGlzLnJvd0ZpZWxkcyksXG4gICAgICAgICAgZmllbGRzOiBmaWVsZHMsXG4gICAgICAgICAgb3BzXG4gICAgICAgIH1dXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb2x1bW5OYW1lKSB7XG4gICAgICBkYXRhLnB1c2godGhpcy5hc3NlbWJsZVJvd0NvbHVtbkRhdGEoJ2NvbHVtbicsIGNyb3NzZWREYXRhTmFtZSwgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucm93TmFtZSkge1xuICAgICAgZGF0YS5wdXNoKHRoaXMuYXNzZW1ibGVSb3dDb2x1bW5EYXRhKCdyb3cnLCBjcm9zc2VkRGF0YU5hbWUsIGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcCkpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG59XG4iXX0=