"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
    tslib_1.__extends(FacetNode, _super);
    /**
     * @param model The facet model.
     * @param name The name that this facet source will have.
     * @param data The source data for this facet data.
     */
    function FacetNode(parent, model, name, data) {
        var _this = _super.call(this, parent) || this;
        _this.model = model;
        _this.name = name;
        _this.data = data;
        if (model.facet.column) {
            _this.columnFields = [model.vgField(channel_1.COLUMN)];
            _this.columnName = model.getName('column_domain');
            if (model.fieldDef(channel_1.COLUMN).bin) {
                _this.columnFields.push(model.vgField(channel_1.COLUMN, { binSuffix: 'end' }));
            }
        }
        if (model.facet.row) {
            _this.rowFields = [model.vgField(channel_1.ROW)];
            _this.rowName = model.getName('row_domain');
            if (model.fieldDef(channel_1.ROW).bin) {
                _this.rowFields.push(model.vgField(channel_1.ROW, { binSuffix: 'end' }));
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
            transform: [tslib_1.__assign({ type: 'aggregate', groupby: channel === 'row' ? this.rowFields : this.columnFields }, aggregateChildField)]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2ZhY2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHlDQUF3RDtBQUN4RCwrQkFBaUM7QUFDakMscUNBQThDO0FBQzlDLGlEQUE4RTtBQUc5RSwwQ0FBbUU7QUFDbkUsdUNBQXdDO0FBT3hDOztHQUVHO0FBQ0g7SUFBK0IscUNBQVk7SUFTekM7Ozs7T0FJRztJQUNILG1CQUFtQixNQUFvQixFQUFrQixLQUFpQixFQUFrQixJQUFZLEVBQVMsSUFBWTtRQUE3SCxZQUNFLGtCQUFNLE1BQU0sQ0FBQyxTQW1CZDtRQXBCd0QsV0FBSyxHQUFMLEtBQUssQ0FBWTtRQUFrQixVQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsVUFBSSxHQUFKLElBQUksQ0FBUTtRQUczSCxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ3RCLEtBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzVDLEtBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNqRCxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRTtnQkFDOUIsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQkFBTSxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQzthQUNuRTtTQUNGO1FBRUQsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUNuQixLQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLEtBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxD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QThCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQzNFLENBQUM7WUFDRixJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQW1CLE9BQUEsVUFBVSxFQUFWLENBQVUsQ0FBQyxDQUFDO1lBRXRELElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ1IsSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDakIsU0FBUyxFQUFFLENBQUM7d0JBQ1YsSUFBSSxFQUFFLFdBQVc7d0JBQ2pCLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO3dCQUNqRCxNQUFNLEVBQUUsTUFBTTt3QkFDZCxHQUFHLEtBQUE7cUJBQ0osQ0FBQzthQUNILENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsOEJBQThCLENBQUMsQ0FBQyxDQUFDO1NBQ2xHO1FBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsOEJBQThCLENBQUMsQ0FBQyxDQUFDO1NBQy9GO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBckpELENBQStCLHVCQUFZLEdBcUoxQztBQXJKWSw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QWdncmVnYXRlT3B9IGZyb20gJ3ZlZ2EnO1xuaW1wb3J0IHtDT0xVTU4sIFJPVywgU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbn0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtpc1ZnUmFuZ2VTdGVwLCBWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybSwgVmdEYXRhfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0ZhY2V0TW9kZWx9IGZyb20gJy4uL2ZhY2V0JztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7YXNzZW1ibGVEb21haW4sIGdldEZpZWxkRnJvbURvbWFpbn0gZnJvbSAnLi4vc2NhbGUvZG9tYWluJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxudHlwZSBDaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAgPSB7XG4gIHg/OiBzdHJpbmcsXG4gIHk/OiBzdHJpbmdcbn07XG5cbi8qKlxuICogQSBub2RlIHRoYXQgaGVscHMgdXMgdHJhY2sgd2hhdCBmaWVsZHMgd2UgYXJlIGZhY2V0aW5nIGJ5LlxuICovXG5leHBvcnQgY2xhc3MgRmFjZXROb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSByZWFkb25seSBjb2x1bW5GaWVsZHM6IHN0cmluZ1tdO1xuICBwcml2YXRlIHJlYWRvbmx5IGNvbHVtbk5hbWU6IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IHJvd0ZpZWxkczogc3RyaW5nW107XG4gIHByaXZhdGUgcmVhZG9ubHkgcm93TmFtZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgY2hpbGRNb2RlbDogTW9kZWw7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBtb2RlbCBUaGUgZmFjZXQgbW9kZWwuXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIHRoYXQgdGhpcyBmYWNldCBzb3VyY2Ugd2lsbCBoYXZlLlxuICAgKiBAcGFyYW0gZGF0YSBUaGUgc291cmNlIGRhdGEgZm9yIHRoaXMgZmFjZXQgZGF0YS5cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgcHVibGljIHJlYWRvbmx5IG1vZGVsOiBGYWNldE1vZGVsLCBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nLCBwdWJsaWMgZGF0YTogc3RyaW5nKSB7XG4gICAgc3VwZXIocGFyZW50KTtcblxuICAgIGlmIChtb2RlbC5mYWNldC5jb2x1bW4pIHtcbiAgICAgIHRoaXMuY29sdW1uRmllbGRzID0gW21vZGVsLnZnRmllbGQoQ09MVU1OKV07XG4gICAgICB0aGlzLmNvbHVtbk5hbWUgPSBtb2RlbC5nZXROYW1lKCdjb2x1bW5fZG9tYWluJyk7XG4gICAgICBpZiAobW9kZWwuZmllbGREZWYoQ09MVU1OKS5iaW4pIHtcbiAgICAgICAgdGhpcy5jb2x1bW5GaWVsZHMucHVzaChtb2RlbC52Z0ZpZWxkKENPTFVNTiwge2JpblN1ZmZpeDogJ2VuZCd9KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1vZGVsLmZhY2V0LnJvdykge1xuICAgICAgdGhpcy5yb3dGaWVsZHMgPSBbbW9kZWwudmdGaWVsZChST1cpXTtcbiAgICAgIHRoaXMucm93TmFtZSA9IG1vZGVsLmdldE5hbWUoJ3Jvd19kb21haW4nKTtcbiAgICAgIGlmIChtb2RlbC5maWVsZERlZihST1cpLmJpbikge1xuICAgICAgICB0aGlzLnJvd0ZpZWxkcy5wdXNoKG1vZGVsLnZnRmllbGQoUk9XLCB7YmluU3VmZml4OiAnZW5kJ30pKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNoaWxkTW9kZWwgPSBtb2RlbC5jaGlsZDtcbiAgfVxuXG4gIGdldCBmaWVsZHMoKSB7XG4gICAgbGV0IGZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBpZiAodGhpcy5jb2x1bW5GaWVsZHMpIHtcbiAgICAgIGZpZWxkcyA9IGZpZWxkcy5jb25jYXQodGhpcy5jb2x1bW5GaWVsZHMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5yb3dGaWVsZHMpIHtcbiAgICAgIGZpZWxkcyA9IGZpZWxkcy5jb25jYXQodGhpcy5yb3dGaWVsZHMpO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIHRvIHJlZmVyZW5jZSB0aGlzIHNvdXJjZSBpcyBpdHMgbmFtZS5cbiAgICovXG4gIHB1YmxpYyBnZXRTb3VyY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwKCkge1xuICAgIGNvbnN0IGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcDogQ2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWyd4JywgJ3knXSBhcyBTY2FsZUNoYW5uZWxbXSkge1xuICAgICAgY29uc3QgY2hpbGRTY2FsZUNvbXBvbmVudCA9IHRoaXMuY2hpbGRNb2RlbC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICAgICAgaWYgKGNoaWxkU2NhbGVDb21wb25lbnQgJiYgIWNoaWxkU2NhbGVDb21wb25lbnQubWVyZ2VkKSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBjaGlsZFNjYWxlQ29tcG9uZW50LmdldCgndHlwZScpO1xuICAgICAgICBjb25zdCByYW5nZSA9IGNoaWxkU2NhbGVDb21wb25lbnQuZ2V0KCdyYW5nZScpO1xuXG4gICAgICAgIGlmIChoYXNEaXNjcmV0ZURvbWFpbih0eXBlKSAmJiBpc1ZnUmFuZ2VTdGVwKHJhbmdlKSkge1xuICAgICAgICAgIGNvbnN0IGRvbWFpbiA9IGFzc2VtYmxlRG9tYWluKHRoaXMuY2hpbGRNb2RlbCwgY2hhbm5lbCk7XG4gICAgICAgICAgY29uc3QgZmllbGQgPSBnZXRGaWVsZEZyb21Eb21haW4oZG9tYWluKTtcbiAgICAgICAgICBpZiAoZmllbGQpIHtcbiAgICAgICAgICAgIGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcFtjaGFubmVsXSA9IGZpZWxkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2cud2FybignVW5rbm93biBmaWVsZCBmb3IgJHtjaGFubmVsfS4gIENhbm5vdCBjYWxjdWxhdGUgdmlldyBzaXplLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXA7XG4gIH1cblxuICBwcml2YXRlIGFzc2VtYmxlUm93Q29sdW1uRGF0YShjaGFubmVsOiAncm93JyB8ICdjb2x1bW4nLCBjcm9zc2VkRGF0YU5hbWU6IHN0cmluZywgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwOiBDaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXApOiBWZ0RhdGEge1xuICAgIGxldCBhZ2dyZWdhdGVDaGlsZEZpZWxkOiBQYXJ0aWFsPFZnQWdncmVnYXRlVHJhbnNmb3JtPiA9IHt9O1xuICAgIGNvbnN0IGNoaWxkQ2hhbm5lbCA9IGNoYW5uZWwgPT09ICdyb3cnID8gJ3knIDogJ3gnO1xuXG4gICAgaWYgKGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcFtjaGlsZENoYW5uZWxdKSB7XG4gICAgICBpZiAoY3Jvc3NlZERhdGFOYW1lKSB7XG4gICAgICAgIGFnZ3JlZ2F0ZUNoaWxkRmllbGQgPSB7XG4gICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBjcm9zc2VkIGRhdGEsIGNhbGN1bGF0ZSBtYXhcbiAgICAgICAgICBmaWVsZHM6IFtgZGlzdGluY3RfJHtjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXBbY2hpbGRDaGFubmVsXX1gXSxcbiAgICAgICAgICBvcHM6IFsnbWF4J10sXG4gICAgICAgICAgLy8gQWx0aG91Z2ggaXQgaXMgdGVjaG5pY2FsbHkgYSBtYXgsIGp1c3QgbmFtZSBpdCBkaXN0aW5jdCBzbyBpdCdzIGVhc2llciB0byByZWZlciB0byBpdFxuICAgICAgICAgIGFzOiBbYGRpc3RpbmN0XyR7Y2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwW2NoaWxkQ2hhbm5lbF19YF1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFnZ3JlZ2F0ZUNoaWxkRmllbGQgPSB7XG4gICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gY3Jvc3NlZCBkYXRhLCBqdXN0IGNhbGN1bGF0ZSBkaXN0aW5jdFxuICAgICAgICAgIGZpZWxkczogW2NoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcFtjaGlsZENoYW5uZWxdXSxcbiAgICAgICAgICBvcHM6IFsnZGlzdGluY3QnXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBjaGFubmVsID09PSAncm93JyA/IHRoaXMucm93TmFtZSA6IHRoaXMuY29sdW1uTmFtZSxcbiAgICAgIC8vIFVzZSBkYXRhIGZyb20gdGhlIGNyb3NzZWQgb25lIGlmIGl0IGV4aXN0XG4gICAgICBzb3VyY2U6IGNyb3NzZWREYXRhTmFtZSB8fCB0aGlzLmRhdGEsXG4gICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBncm91cGJ5OiBjaGFubmVsID09PSAncm93JyA/IHRoaXMucm93RmllbGRzIDogdGhpcy5jb2x1bW5GaWVsZHMsXG4gICAgICAgIC4uLmFnZ3JlZ2F0ZUNoaWxkRmllbGRcbiAgICAgIH1dXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpIHtcbiAgICBjb25zdCBkYXRhOiBWZ0RhdGFbXSA9IFtdO1xuICAgIGxldCBjcm9zc2VkRGF0YU5hbWUgPSBudWxsO1xuICAgIGNvbnN0IGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcCA9IHRoaXMuZ2V0Q2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwKCk7XG5cbiAgICBpZiAodGhpcy5jb2x1bW5OYW1lICYmIHRoaXMucm93TmFtZSAmJiAoY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwLnggfHwgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwLnkpKSB7XG4gICAgICAvLyBOZWVkIHRvIGNyZWF0ZSBhIGNyb3NzIGRhdGFzZXQgdG8gY29ycmVjdGx5IGNhbGN1bGF0ZSBjYXJkaW5hbGl0eVxuICAgICAgY3Jvc3NlZERhdGFOYW1lID0gYGNyb3NzXyR7dGhpcy5jb2x1bW5OYW1lfV8ke3RoaXMucm93TmFtZX1gO1xuXG4gICAgICBjb25zdCBmaWVsZHMgPSBbXS5jb25jYXQoXG4gICAgICAgIGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcC54ID8gW2NoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcC54XSA6IFtdLFxuICAgICAgICBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAueSA/IFtjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAueV0gOiBbXSxcbiAgICAgICk7XG4gICAgICBjb25zdCBvcHMgPSBmaWVsZHMubWFwKCgpOiBBZ2dyZWdhdGVPcCA9PiAnZGlzdGluY3QnKTtcblxuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgbmFtZTogY3Jvc3NlZERhdGFOYW1lLFxuICAgICAgICBzb3VyY2U6IHRoaXMuZGF0YSxcbiAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IHRoaXMuY29sdW1uRmllbGRzLmNvbmNhdCh0aGlzLnJvd0ZpZWxkcyksXG4gICAgICAgICAgZmllbGRzOiBmaWVsZHMsXG4gICAgICAgICAgb3BzXG4gICAgICAgIH1dXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb2x1bW5OYW1lKSB7XG4gICAgICBkYXRhLnB1c2godGhpcy5hc3NlbWJsZVJvd0NvbHVtbkRhdGEoJ2NvbHVtbicsIGNyb3NzZWREYXRhTmFtZSwgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucm93TmFtZSkge1xuICAgICAgZGF0YS5wdXNoKHRoaXMuYXNzZW1ibGVSb3dDb2x1bW5EYXRhKCdyb3cnLCBjcm9zc2VkRGF0YU5hbWUsIGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcCkpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG59XG4iXX0=