"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var log = tslib_1.__importStar(require("../../log"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2ZhY2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHlDQUF3RDtBQUN4RCxxREFBaUM7QUFDakMscUNBQThDO0FBQzlDLGlEQUE4RTtBQUc5RSwwQ0FBbUU7QUFDbkUsdUNBQXdDO0FBT3hDOztHQUVHO0FBQ0g7SUFBK0IscUNBQVk7SUFTekM7Ozs7T0FJRztJQUNILG1CQUFtQixNQUFvQixFQUFrQixLQUFpQixFQUFrQixJQUFZLEVBQVMsSUFBWTtRQUE3SCxZQUNFLGtCQUFNLE1BQU0sQ0FBQyxTQW1CZDtRQXBCd0QsV0FBSyxHQUFMLEtBQUssQ0FBWTtRQUFrQixVQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsVUFBSSxHQUFKLElBQUksQ0FBUTtRQUczSCxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ3RCLEtBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzVDLEtBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNqRCxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRTtnQkFDOUIsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQkFBTSxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQzthQUNuRTtTQUNGO1FBRUQsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUNuQixLQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLEtBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxD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RSw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FDM0UsQ0FBQztZQUNGLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBbUIsT0FBQSxVQUFVLEVBQVYsQ0FBVSxDQUFDLENBQUM7WUFFdEQsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDUixJQUFJLEVBQUUsZUFBZTtnQkFDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNqQixTQUFTLEVBQUUsQ0FBQzt3QkFDVixJQUFJLEVBQUUsV0FBVzt3QkFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7d0JBQ2pELE1BQU0sRUFBRSxNQUFNO3dCQUNkLEdBQUcsS0FBQTtxQkFDSixDQUFDO2FBQ0gsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7U0FDbEc7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7U0FDL0Y7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUFySkQsQ0FBK0IsdUJBQVksR0FxSjFDO0FBckpZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZ2dyZWdhdGVPcH0gZnJvbSAndmVnYSc7XG5pbXBvcnQge0NPTFVNTiwgUk9XLCBTY2FsZUNoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge2hhc0Rpc2NyZXRlRG9tYWlufSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge2lzVmdSYW5nZVN0ZXAsIFZnQWdncmVnYXRlVHJhbnNmb3JtLCBWZ0RhdGF9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7RmFjZXRNb2RlbH0gZnJvbSAnLi4vZmFjZXQnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHthc3NlbWJsZURvbWFpbiwgZ2V0RmllbGRGcm9tRG9tYWlufSBmcm9tICcuLi9zY2FsZS9kb21haW4nO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG50eXBlIENoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcCA9IHtcbiAgeD86IHN0cmluZyxcbiAgeT86IHN0cmluZ1xufTtcblxuLyoqXG4gKiBBIG5vZGUgdGhhdCBoZWxwcyB1cyB0cmFjayB3aGF0IGZpZWxkcyB3ZSBhcmUgZmFjZXRpbmcgYnkuXG4gKi9cbmV4cG9ydCBjbGFzcyBGYWNldE5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwcml2YXRlIHJlYWRvbmx5IGNvbHVtbkZpZWxkczogc3RyaW5nW107XG4gIHByaXZhdGUgcmVhZG9ubHkgY29sdW1uTmFtZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgcm93RmllbGRzOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSByZWFkb25seSByb3dOYW1lOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBjaGlsZE1vZGVsOiBNb2RlbDtcblxuICAvKipcbiAgICogQHBhcmFtIG1vZGVsIFRoZSBmYWNldCBtb2RlbC5cbiAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgdGhhdCB0aGlzIGZhY2V0IHNvdXJjZSB3aWxsIGhhdmUuXG4gICAqIEBwYXJhbSBkYXRhIFRoZSBzb3VyY2UgZGF0YSBmb3IgdGhpcyBmYWNldCBkYXRhLlxuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlLCBwdWJsaWMgcmVhZG9ubHkgbW9kZWw6IEZhY2V0TW9kZWwsIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmcsIHB1YmxpYyBkYXRhOiBzdHJpbmcpIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuXG4gICAgaWYgKG1vZGVsLmZhY2V0LmNvbHVtbikge1xuICAgICAgdGhpcy5jb2x1bW5GaWVsZHMgPSBbbW9kZWwudmdGaWVsZChDT0xVTU4pXTtcbiAgICAgIHRoaXMuY29sdW1uTmFtZSA9IG1vZGVsLmdldE5hbWUoJ2NvbHVtbl9kb21haW4nKTtcbiAgICAgIGlmIChtb2RlbC5maWVsZERlZihDT0xVTU4pLmJpbikge1xuICAgICAgICB0aGlzLmNvbHVtbkZpZWxkcy5wdXNoKG1vZGVsLnZnRmllbGQoQ09MVU1OLCB7YmluU3VmZml4OiAnZW5kJ30pKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobW9kZWwuZmFjZXQucm93KSB7XG4gICAgICB0aGlzLnJvd0ZpZWxkcyA9IFttb2RlbC52Z0ZpZWxkKFJPVyldO1xuICAgICAgdGhpcy5yb3dOYW1lID0gbW9kZWwuZ2V0TmFtZSgncm93X2RvbWFpbicpO1xuICAgICAgaWYgKG1vZGVsLmZpZWxkRGVmKFJPVykuYmluKSB7XG4gICAgICAgIHRoaXMucm93RmllbGRzLnB1c2gobW9kZWwudmdGaWVsZChST1csIHtiaW5TdWZmaXg6ICdlbmQnfSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2hpbGRNb2RlbCA9IG1vZGVsLmNoaWxkO1xuICB9XG5cbiAgZ2V0IGZpZWxkcygpIHtcbiAgICBsZXQgZmllbGRzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGlmICh0aGlzLmNvbHVtbkZpZWxkcykge1xuICAgICAgZmllbGRzID0gZmllbGRzLmNvbmNhdCh0aGlzLmNvbHVtbkZpZWxkcyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnJvd0ZpZWxkcykge1xuICAgICAgZmllbGRzID0gZmllbGRzLmNvbmNhdCh0aGlzLnJvd0ZpZWxkcyk7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG5hbWUgdG8gcmVmZXJlbmNlIHRoaXMgc291cmNlIGlzIGl0cyBuYW1lLlxuICAgKi9cbiAgcHVibGljIGdldFNvdXJjZSgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAoKSB7XG4gICAgY29uc3QgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwOiBDaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAgPSB7fTtcblxuICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3gnLCAneSddIGFzIFNjYWxlQ2hhbm5lbFtdKSB7XG4gICAgICBjb25zdCBjaGlsZFNjYWxlQ29tcG9uZW50ID0gdGhpcy5jaGlsZE1vZGVsLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgICBpZiAoY2hpbGRTY2FsZUNvbXBvbmVudCAmJiAhY2hpbGRTY2FsZUNvbXBvbmVudC5tZXJnZWQpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGNoaWxkU2NhbGVDb21wb25lbnQuZ2V0KCd0eXBlJyk7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gY2hpbGRTY2FsZUNvbXBvbmVudC5nZXQoJ3JhbmdlJyk7XG5cbiAgICAgICAgaWYgKGhhc0Rpc2NyZXRlRG9tYWluKHR5cGUpICYmIGlzVmdSYW5nZVN0ZXAocmFuZ2UpKSB7XG4gICAgICAgICAgY29uc3QgZG9tYWluID0gYXNzZW1ibGVEb21haW4odGhpcy5jaGlsZE1vZGVsLCBjaGFubmVsKTtcbiAgICAgICAgICBjb25zdCBmaWVsZCA9IGdldEZpZWxkRnJvbURvbWFpbihkb21haW4pO1xuICAgICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwW2NoYW5uZWxdID0gZmllbGQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZy53YXJuKCdVbmtub3duIGZpZWxkIGZvciAke2NoYW5uZWx9LiAgQ2Fubm90IGNhbGN1bGF0ZSB2aWV3IHNpemUuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcDtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZW1ibGVSb3dDb2x1bW5EYXRhKGNoYW5uZWw6ICdyb3cnIHwgJ2NvbHVtbicsIGNyb3NzZWREYXRhTmFtZTogc3RyaW5nLCBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXA6IENoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcCk6IFZnRGF0YSB7XG4gICAgbGV0IGFnZ3JlZ2F0ZUNoaWxkRmllbGQ6IFBhcnRpYWw8VmdBZ2dyZWdhdGVUcmFuc2Zvcm0+ID0ge307XG4gICAgY29uc3QgY2hpbGRDaGFubmVsID0gY2hhbm5lbCA9PT0gJ3JvdycgPyAneScgOiAneCc7XG5cbiAgICBpZiAoY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwW2NoaWxkQ2hhbm5lbF0pIHtcbiAgICAgIGlmIChjcm9zc2VkRGF0YU5hbWUpIHtcbiAgICAgICAgYWdncmVnYXRlQ2hpbGRGaWVsZCA9IHtcbiAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIGNyb3NzZWQgZGF0YSwgY2FsY3VsYXRlIG1heFxuICAgICAgICAgIGZpZWxkczogW2BkaXN0aW5jdF8ke2NoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcFtjaGlsZENoYW5uZWxdfWBdLFxuICAgICAgICAgIG9wczogWydtYXgnXSxcbiAgICAgICAgICAvLyBBbHRob3VnaCBpdCBpcyB0ZWNobmljYWxseSBhIG1heCwganVzdCBuYW1lIGl0IGRpc3RpbmN0IHNvIGl0J3MgZWFzaWVyIHRvIHJlZmVyIHRvIGl0XG4gICAgICAgICAgYXM6IFtgZGlzdGluY3RfJHtjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXBbY2hpbGRDaGFubmVsXX1gXVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWdncmVnYXRlQ2hpbGRGaWVsZCA9IHtcbiAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyBjcm9zc2VkIGRhdGEsIGp1c3QgY2FsY3VsYXRlIGRpc3RpbmN0XG4gICAgICAgICAgZmllbGRzOiBbY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwW2NoaWxkQ2hhbm5lbF1dLFxuICAgICAgICAgIG9wczogWydkaXN0aW5jdCddXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IGNoYW5uZWwgPT09ICdyb3cnID8gdGhpcy5yb3dOYW1lIDogdGhpcy5jb2x1bW5OYW1lLFxuICAgICAgLy8gVXNlIGRhdGEgZnJvbSB0aGUgY3Jvc3NlZCBvbmUgaWYgaXQgZXhpc3RcbiAgICAgIHNvdXJjZTogY3Jvc3NlZERhdGFOYW1lIHx8IHRoaXMuZGF0YSxcbiAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGdyb3VwYnk6IGNoYW5uZWwgPT09ICdyb3cnID8gdGhpcy5yb3dGaWVsZHMgOiB0aGlzLmNvbHVtbkZpZWxkcyxcbiAgICAgICAgLi4uYWdncmVnYXRlQ2hpbGRGaWVsZFxuICAgICAgfV1cbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCkge1xuICAgIGNvbnN0IGRhdGE6IFZnRGF0YVtdID0gW107XG4gICAgbGV0IGNyb3NzZWREYXRhTmFtZSA9IG51bGw7XG4gICAgY29uc3QgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwID0gdGhpcy5nZXRDaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAoKTtcblxuICAgIGlmICh0aGlzLmNvbHVtbk5hbWUgJiYgdGhpcy5yb3dOYW1lICYmIChjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAueCB8fCBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAueSkpIHtcbiAgICAgIC8vIE5lZWQgdG8gY3JlYXRlIGEgY3Jvc3MgZGF0YXNldCB0byBjb3JyZWN0bHkgY2FsY3VsYXRlIGNhcmRpbmFsaXR5XG4gICAgICBjcm9zc2VkRGF0YU5hbWUgPSBgY3Jvc3NfJHt0aGlzLmNvbHVtbk5hbWV9XyR7dGhpcy5yb3dOYW1lfWA7XG5cbiAgICAgIGNvbnN0IGZpZWxkcyA9IFtdLmNvbmNhdChcbiAgICAgICAgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwLnggPyBbY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwLnhdIDogW10sXG4gICAgICAgIGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcC55ID8gW2NoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcC55XSA6IFtdLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG9wcyA9IGZpZWxkcy5tYXAoKCk6IEFnZ3JlZ2F0ZU9wID0+ICdkaXN0aW5jdCcpO1xuXG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBuYW1lOiBjcm9zc2VkRGF0YU5hbWUsXG4gICAgICAgIHNvdXJjZTogdGhpcy5kYXRhLFxuICAgICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogdGhpcy5jb2x1bW5GaWVsZHMuY29uY2F0KHRoaXMucm93RmllbGRzKSxcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkcyxcbiAgICAgICAgICBvcHNcbiAgICAgICAgfV1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbHVtbk5hbWUpIHtcbiAgICAgIGRhdGEucHVzaCh0aGlzLmFzc2VtYmxlUm93Q29sdW1uRGF0YSgnY29sdW1uJywgY3Jvc3NlZERhdGFOYW1lLCBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXApKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yb3dOYW1lKSB7XG4gICAgICBkYXRhLnB1c2godGhpcy5hc3NlbWJsZVJvd0NvbHVtbkRhdGEoJ3JvdycsIGNyb3NzZWREYXRhTmFtZSwgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbn1cbiJdfQ==