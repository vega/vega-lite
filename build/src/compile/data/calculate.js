"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fielddef_1 = require("../../fielddef");
var sort_1 = require("../../sort");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
var CalculateNode = /** @class */ (function (_super) {
    tslib_1.__extends(CalculateNode, _super);
    function CalculateNode(parent, transform) {
        var _this = _super.call(this, parent) || this;
        _this.transform = transform;
        return _this;
    }
    CalculateNode.prototype.clone = function () {
        return new CalculateNode(null, util_1.duplicate(this.transform));
    };
    CalculateNode.parseAllForSortIndex = function (parent, model) {
        // get all the encoding with sort fields from model
        model.forEachFieldDef(function (fieldDef, channel) {
            if (fielddef_1.isScaleFieldDef(fieldDef) && sort_1.isSortArray(fieldDef.sort)) {
                var transform = {
                    calculate: CalculateNode.calculateExpressionFromSortField(fieldDef.field, fieldDef.sort),
                    as: sortArrayIndexField(model, channel)
                };
                parent = new CalculateNode(parent, transform);
            }
        });
        return parent;
    };
    CalculateNode.calculateExpressionFromSortField = function (field, sortFields) {
        var expression = '';
        var i;
        for (i = 0; i < sortFields.length; i++) {
            expression += "datum." + field + " === '" + sortFields[i] + "' ? " + i + " : ";
        }
        expression += i;
        return expression;
    };
    CalculateNode.prototype.producedFields = function () {
        var out = {};
        out[this.transform.as] = true;
        return out;
    };
    CalculateNode.prototype.assemble = function () {
        return {
            type: 'formula',
            expr: this.transform.calculate,
            as: this.transform.as
        };
    };
    return CalculateNode;
}(dataflow_1.DataFlowNode));
exports.CalculateNode = CalculateNode;
function sortArrayIndexField(model, channel) {
    var fieldDef = model.fieldDef(channel);
    return channel + "_" + fielddef_1.vgField(fieldDef) + "_sort_index";
}
exports.sortArrayIndexField = sortArrayIndexField;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsY3VsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9jYWxjdWxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXVFO0FBQ3ZFLG1DQUF1QztBQUN2QyxtQ0FBcUM7QUFLckMsdUNBQXdDO0FBRXhDOztHQUVHO0FBQ0g7SUFBbUMseUNBQVk7SUFLN0MsdUJBQVksTUFBb0IsRUFBVSxTQUE2QjtRQUF2RSxZQUNFLGtCQUFNLE1BQU0sQ0FBQyxTQUNkO1FBRnlDLGVBQVMsR0FBVCxTQUFTLENBQW9COztJQUV2RSxDQUFDO0lBTk0sNkJBQUssR0FBWjtRQUNFLE9BQU8sSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFLGdCQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQU1hLGtDQUFvQixHQUFsQyxVQUFtQyxNQUFvQixFQUFFLEtBQXFCO1FBQzVFLG1EQUFtRDtRQUNuRCxLQUFLLENBQUMsZUFBZSxDQUFDLFVBQUMsUUFBK0IsRUFBRSxPQUF5QjtZQUMvRSxJQUFJLDBCQUFlLENBQUMsUUFBUSxDQUFDLElBQUksa0JBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzNELElBQU0sU0FBUyxHQUF1QjtvQkFDcEMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxnQ0FBZ0MsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQ3hGLEVBQUUsRUFBRSxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDO2lCQUN4QyxDQUFDO2dCQUNGLE1BQU0sR0FBRyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDL0M7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFYSw4Q0FBZ0MsR0FBOUMsVUFBK0MsS0FBYSxFQUFFLFVBQW9CO1FBQ2hGLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQVMsQ0FBQztRQUNkLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QyxVQUFVLElBQUksV0FBUyxLQUFLLGNBQVMsVUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFPLENBQUMsUUFBSyxDQUFDO1NBQ2pFO1FBQ0QsVUFBVSxJQUFJLENBQUMsQ0FBQztRQUNoQixPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBRU0sc0NBQWMsR0FBckI7UUFDRSxJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZixHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDOUIsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU0sZ0NBQVEsR0FBZjtRQUNFLE9BQU87WUFDTCxJQUFJLEVBQUUsU0FBUztZQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVM7WUFDOUIsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtTQUN0QixDQUFDO0lBQ0osQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQTlDRCxDQUFtQyx1QkFBWSxHQThDOUM7QUE5Q1ksc0NBQWE7QUFnRDFCLDZCQUFvQyxLQUFxQixFQUFFLE9BQXlCO0lBQ2xGLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsT0FBVSxPQUFPLFNBQUksa0JBQU8sQ0FBQyxRQUFRLENBQUMsZ0JBQWEsQ0FBQztBQUN0RCxDQUFDO0FBSEQsa0RBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzU2NhbGVGaWVsZERlZiwgU2NhbGVGaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtpc1NvcnRBcnJheX0gZnJvbSAnLi4vLi4vc29ydCc7XG5pbXBvcnQge2R1cGxpY2F0ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnRm9ybXVsYVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtTaW5nbGVEZWZDaGFubmVsfSBmcm9tICcuLy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDYWxjdWxhdGVUcmFuc2Zvcm19IGZyb20gJy4vLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuLyoqXG4gKiBXZSBkb24ndCBrbm93IHdoYXQgYSBjYWxjdWxhdGUgbm9kZSBkZXBlbmRzIG9uIHNvIHdlIHNob3VsZCBuZXZlciBtb3ZlIGl0IGJleW9uZCBhbnl0aGluZyB0aGF0IHByb2R1Y2VzIGZpZWxkcy5cbiAqL1xuZXhwb3J0IGNsYXNzIENhbGN1bGF0ZU5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBDYWxjdWxhdGVOb2RlKG51bGwsIGR1cGxpY2F0ZSh0aGlzLnRyYW5zZm9ybSkpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHByaXZhdGUgdHJhbnNmb3JtOiBDYWxjdWxhdGVUcmFuc2Zvcm0pIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBwYXJzZUFsbEZvclNvcnRJbmRleChwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IE1vZGVsV2l0aEZpZWxkKSB7XG4gICAgLy8gZ2V0IGFsbCB0aGUgZW5jb2Rpbmcgd2l0aCBzb3J0IGZpZWxkcyBmcm9tIG1vZGVsXG4gICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKChmaWVsZERlZjogU2NhbGVGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBTaW5nbGVEZWZDaGFubmVsKSA9PiB7XG4gICAgICBpZiAoaXNTY2FsZUZpZWxkRGVmKGZpZWxkRGVmKSAmJiBpc1NvcnRBcnJheShmaWVsZERlZi5zb3J0KSkge1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm06IENhbGN1bGF0ZVRyYW5zZm9ybSA9IHtcbiAgICAgICAgICBjYWxjdWxhdGU6IENhbGN1bGF0ZU5vZGUuY2FsY3VsYXRlRXhwcmVzc2lvbkZyb21Tb3J0RmllbGQoZmllbGREZWYuZmllbGQsIGZpZWxkRGVmLnNvcnQpLFxuICAgICAgICAgIGFzOiBzb3J0QXJyYXlJbmRleEZpZWxkKG1vZGVsLCBjaGFubmVsKVxuICAgICAgICB9O1xuICAgICAgICBwYXJlbnQgPSBuZXcgQ2FsY3VsYXRlTm9kZShwYXJlbnQsIHRyYW5zZm9ybSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHBhcmVudDtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgY2FsY3VsYXRlRXhwcmVzc2lvbkZyb21Tb3J0RmllbGQoZmllbGQ6IHN0cmluZywgc29ydEZpZWxkczogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIGxldCBleHByZXNzaW9uID0gJyc7XG4gICAgbGV0IGk6IG51bWJlcjtcbiAgICBmb3IgKGkgPSAwOyBpIDwgc29ydEZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgZXhwcmVzc2lvbiArPSBgZGF0dW0uJHtmaWVsZH0gPT09ICcke3NvcnRGaWVsZHNbaV19JyA/ICR7aX0gOiBgO1xuICAgIH1cbiAgICBleHByZXNzaW9uICs9IGk7XG4gICAgcmV0dXJuIGV4cHJlc3Npb247XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG4gICAgb3V0W3RoaXMudHJhbnNmb3JtLmFzXSA9IHRydWU7XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ0Zvcm11bGFUcmFuc2Zvcm0ge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICBleHByOiB0aGlzLnRyYW5zZm9ybS5jYWxjdWxhdGUsXG4gICAgICBhczogdGhpcy50cmFuc2Zvcm0uYXNcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0QXJyYXlJbmRleEZpZWxkKG1vZGVsOiBNb2RlbFdpdGhGaWVsZCwgY2hhbm5lbDogU2luZ2xlRGVmQ2hhbm5lbCkge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICByZXR1cm4gYCR7Y2hhbm5lbH1fJHt2Z0ZpZWxkKGZpZWxkRGVmKX1fc29ydF9pbmRleGA7XG59XG4iXX0=