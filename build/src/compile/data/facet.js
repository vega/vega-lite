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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2ZhY2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EseUNBQXdEO0FBQ3hELCtCQUFpQztBQUNqQyxxQ0FBOEM7QUFDOUMsaURBQThFO0FBRzlFLDBDQUFtRTtBQUNuRSx1Q0FBd0M7QUFPeEM7O0dBRUc7QUFDSDtJQUErQiw2QkFBWTtJQVN6Qzs7OztPQUlHO0lBQ0gsbUJBQW1DLEtBQWlCLEVBQWtCLElBQVksRUFBUyxJQUFZO1FBQXZHLFlBQ0UsaUJBQU8sU0FtQlI7UUFwQmtDLFdBQUssR0FBTCxLQUFLLENBQVk7UUFBa0IsVUFBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFVBQUksR0FBSixJQUFJLENBQVE7UUFHckcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEtBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzVDLEtBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNqRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGdCQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFNLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLENBQUM7UUFDSCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLEtBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLENB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RSw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7UUFDbkcsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsOEJBQThCLENBQUMsQ0FBQyxDQUFDO1FBQ2hHLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXJKRCxDQUErQix1QkFBWSxHQXFKMUM7QUFySlksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICcuLi8uLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtDT0xVTU4sIFJPVywgU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbn0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtpc1ZnUmFuZ2VTdGVwLCBWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybSwgVmdEYXRhfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0ZhY2V0TW9kZWx9IGZyb20gJy4uL2ZhY2V0JztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7YXNzZW1ibGVEb21haW4sIGdldEZpZWxkRnJvbURvbWFpbn0gZnJvbSAnLi4vc2NhbGUvZG9tYWluJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxudHlwZSBDaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAgPSB7XG4gIHg/OiBzdHJpbmcsXG4gIHk/OiBzdHJpbmdcbn07XG5cbi8qKlxuICogQSBub2RlIHRoYXQgaGVscHMgdXMgdHJhY2sgd2hhdCBmaWVsZHMgd2UgYXJlIGZhY2V0aW5nIGJ5LlxuICovXG5leHBvcnQgY2xhc3MgRmFjZXROb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSByZWFkb25seSBjb2x1bW5GaWVsZHM6IHN0cmluZ1tdO1xuICBwcml2YXRlIHJlYWRvbmx5IGNvbHVtbk5hbWU6IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IHJvd0ZpZWxkczogc3RyaW5nW107XG4gIHByaXZhdGUgcmVhZG9ubHkgcm93TmFtZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgY2hpbGRNb2RlbDogTW9kZWw7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBtb2RlbCBUaGUgZmFjZXQgbW9kZWwuXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIHRoYXQgdGhpcyBmYWNldCBzb3VyY2Ugd2lsbCBoYXZlLlxuICAgKiBAcGFyYW0gZGF0YSBUaGUgc291cmNlIGRhdGEgZm9yIHRoaXMgZmFjZXQgZGF0YS5cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbW9kZWw6IEZhY2V0TW9kZWwsIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmcsIHB1YmxpYyBkYXRhOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKG1vZGVsLmZhY2V0LmNvbHVtbikge1xuICAgICAgdGhpcy5jb2x1bW5GaWVsZHMgPSBbbW9kZWwudmdGaWVsZChDT0xVTU4pXTtcbiAgICAgIHRoaXMuY29sdW1uTmFtZSA9IG1vZGVsLmdldE5hbWUoJ2NvbHVtbl9kb21haW4nKTtcbiAgICAgIGlmIChtb2RlbC5maWVsZERlZihDT0xVTU4pLmJpbikge1xuICAgICAgICB0aGlzLmNvbHVtbkZpZWxkcy5wdXNoKG1vZGVsLnZnRmllbGQoQ09MVU1OLCB7YmluU3VmZml4OiAnZW5kJ30pKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobW9kZWwuZmFjZXQucm93KSB7XG4gICAgICB0aGlzLnJvd0ZpZWxkcyA9IFttb2RlbC52Z0ZpZWxkKFJPVyldO1xuICAgICAgdGhpcy5yb3dOYW1lID0gbW9kZWwuZ2V0TmFtZSgncm93X2RvbWFpbicpO1xuICAgICAgaWYgKG1vZGVsLmZpZWxkRGVmKFJPVykuYmluKSB7XG4gICAgICAgIHRoaXMucm93RmllbGRzLnB1c2gobW9kZWwudmdGaWVsZChST1csIHtiaW5TdWZmaXg6ICdlbmQnfSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2hpbGRNb2RlbCA9IG1vZGVsLmNoaWxkO1xuICB9XG5cbiAgZ2V0IGZpZWxkcygpIHtcbiAgICBsZXQgZmllbGRzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGlmICh0aGlzLmNvbHVtbkZpZWxkcykge1xuICAgICAgZmllbGRzID0gZmllbGRzLmNvbmNhdCh0aGlzLmNvbHVtbkZpZWxkcyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnJvd0ZpZWxkcykge1xuICAgICAgZmllbGRzID0gZmllbGRzLmNvbmNhdCh0aGlzLnJvd0ZpZWxkcyk7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG5hbWUgdG8gcmVmZXJlbmNlIHRoaXMgc291cmNlIGlzIGl0cyBuYW1lLlxuICAgKi9cbiAgcHVibGljIGdldFNvdXJjZSgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAoKSB7XG4gICAgY29uc3QgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwOiBDaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAgPSB7fTtcblxuICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3gnLCAneSddIGFzIFNjYWxlQ2hhbm5lbFtdKSB7XG4gICAgICBjb25zdCBjaGlsZFNjYWxlQ29tcG9uZW50ID0gdGhpcy5jaGlsZE1vZGVsLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgICBpZiAoY2hpbGRTY2FsZUNvbXBvbmVudCAmJiAhY2hpbGRTY2FsZUNvbXBvbmVudC5tZXJnZWQpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGNoaWxkU2NhbGVDb21wb25lbnQuZ2V0KCd0eXBlJyk7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gY2hpbGRTY2FsZUNvbXBvbmVudC5nZXQoJ3JhbmdlJyk7XG5cbiAgICAgICAgaWYgKGhhc0Rpc2NyZXRlRG9tYWluKHR5cGUpICYmIGlzVmdSYW5nZVN0ZXAocmFuZ2UpKSB7XG4gICAgICAgICAgY29uc3QgZG9tYWluID0gYXNzZW1ibGVEb21haW4odGhpcy5jaGlsZE1vZGVsLCBjaGFubmVsKTtcbiAgICAgICAgICBjb25zdCBmaWVsZCA9IGdldEZpZWxkRnJvbURvbWFpbihkb21haW4pO1xuICAgICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwW2NoYW5uZWxdID0gZmllbGQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZy53YXJuKCdVbmtub3duIGZpZWxkIGZvciAke2NoYW5uZWx9LiAgQ2Fubm90IGNhbGN1bGF0ZSB2aWV3IHNpemUuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcDtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZW1ibGVSb3dDb2x1bW5EYXRhKGNoYW5uZWw6ICdyb3cnIHwgJ2NvbHVtbicsIGNyb3NzZWREYXRhTmFtZTogc3RyaW5nLCBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXA6IENoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcCk6IFZnRGF0YSB7XG4gICAgbGV0IGFnZ3JlZ2F0ZUNoaWxkRmllbGQ6IFBhcnRpYWw8VmdBZ2dyZWdhdGVUcmFuc2Zvcm0+ID0ge307XG4gICAgY29uc3QgY2hpbGRDaGFubmVsID0gY2hhbm5lbCA9PT0gJ3JvdycgPyAneScgOiAneCc7XG5cbiAgICBpZiAoY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwW2NoaWxkQ2hhbm5lbF0pIHtcbiAgICAgIGlmIChjcm9zc2VkRGF0YU5hbWUpIHtcbiAgICAgICAgYWdncmVnYXRlQ2hpbGRGaWVsZCA9IHtcbiAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIGNyb3NzZWQgZGF0YSwgY2FsY3VsYXRlIG1heFxuICAgICAgICAgIGZpZWxkczogW2BkaXN0aW5jdF8ke2NoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcFtjaGlsZENoYW5uZWxdfWBdLFxuICAgICAgICAgIG9wczogWydtYXgnXSxcbiAgICAgICAgICAvLyBBbHRob3VnaCBpdCBpcyB0ZWNobmljYWxseSBhIG1heCwganVzdCBuYW1lIGl0IGRpc3RpbmN0IHNvIGl0J3MgZWFzaWVyIHRvIHJlZmVyIHRvIGl0XG4gICAgICAgICAgYXM6IFtgZGlzdGluY3RfJHtjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXBbY2hpbGRDaGFubmVsXX1gXVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWdncmVnYXRlQ2hpbGRGaWVsZCA9IHtcbiAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyBjcm9zc2VkIGRhdGEsIGp1c3QgY2FsY3VsYXRlIGRpc3RpbmN0XG4gICAgICAgICAgZmllbGRzOiBbY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwW2NoaWxkQ2hhbm5lbF1dLFxuICAgICAgICAgIG9wczogWydkaXN0aW5jdCddXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IGNoYW5uZWwgPT09ICdyb3cnID8gdGhpcy5yb3dOYW1lIDogdGhpcy5jb2x1bW5OYW1lLFxuICAgICAgLy8gVXNlIGRhdGEgZnJvbSB0aGUgY3Jvc3NlZCBvbmUgaWYgaXQgZXhpc3RcbiAgICAgIHNvdXJjZTogY3Jvc3NlZERhdGFOYW1lIHx8IHRoaXMuZGF0YSxcbiAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGdyb3VwYnk6IGNoYW5uZWwgPT09ICdyb3cnID8gdGhpcy5yb3dGaWVsZHMgOiB0aGlzLmNvbHVtbkZpZWxkcyxcbiAgICAgICAgLi4uYWdncmVnYXRlQ2hpbGRGaWVsZFxuICAgICAgfV1cbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCkge1xuICAgIGNvbnN0IGRhdGE6IFZnRGF0YVtdID0gW107XG4gICAgbGV0IGNyb3NzZWREYXRhTmFtZSA9IG51bGw7XG4gICAgY29uc3QgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwID0gdGhpcy5nZXRDaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAoKTtcblxuICAgIGlmICh0aGlzLmNvbHVtbk5hbWUgJiYgdGhpcy5yb3dOYW1lICYmIChjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAueCB8fCBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAueSkpIHtcbiAgICAgIC8vIE5lZWQgdG8gY3JlYXRlIGEgY3Jvc3MgZGF0YXNldCB0byBjb3JyZWN0bHkgY2FsY3VsYXRlIGNhcmRpbmFsaXR5XG4gICAgICBjcm9zc2VkRGF0YU5hbWUgPSBgY3Jvc3NfJHt0aGlzLmNvbHVtbk5hbWV9XyR7dGhpcy5yb3dOYW1lfWA7XG5cbiAgICAgIGNvbnN0IGZpZWxkcyA9IFtdLmNvbmNhdChcbiAgICAgICAgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwLnggPyBbY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwLnhdIDogW10sXG4gICAgICAgIGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcC55ID8gW2NoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcC55XSA6IFtdLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG9wcyA9IGZpZWxkcy5tYXAoKCk6IEFnZ3JlZ2F0ZU9wID0+ICdkaXN0aW5jdCcpO1xuXG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBuYW1lOiBjcm9zc2VkRGF0YU5hbWUsXG4gICAgICAgIHNvdXJjZTogdGhpcy5kYXRhLFxuICAgICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogdGhpcy5jb2x1bW5GaWVsZHMuY29uY2F0KHRoaXMucm93RmllbGRzKSxcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkcyxcbiAgICAgICAgICBvcHNcbiAgICAgICAgfV1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbHVtbk5hbWUpIHtcbiAgICAgIGRhdGEucHVzaCh0aGlzLmFzc2VtYmxlUm93Q29sdW1uRGF0YSgnY29sdW1uJywgY3Jvc3NlZERhdGFOYW1lLCBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXApKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yb3dOYW1lKSB7XG4gICAgICBkYXRhLnB1c2godGhpcy5hc3NlbWJsZVJvd0NvbHVtbkRhdGEoJ3JvdycsIGNyb3NzZWREYXRhTmFtZSwgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn1cbiJdfQ==