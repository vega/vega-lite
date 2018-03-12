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
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var FilterInvalidNode = /** @class */ (function (_super) {
    __extends(FilterInvalidNode, _super);
    function FilterInvalidNode(parent, fieldDefs) {
        var _this = _super.call(this, parent) || this;
        _this.fieldDefs = fieldDefs;
        return _this;
    }
    FilterInvalidNode.prototype.clone = function () {
        return new FilterInvalidNode(null, __assign({}, this.fieldDefs));
    };
    FilterInvalidNode.make = function (parent, model) {
        if (model.config.invalidValues !== 'filter') {
            return null;
        }
        var filter = model.reduceFieldDef(function (aggregator, fieldDef, channel) {
            var scaleComponent = channel_1.isScaleChannel(channel) && model.getScaleComponent(channel);
            if (scaleComponent) {
                var scaleType = scaleComponent.get('type');
                // only automatically filter null for continuous domain since discrete domain scales can handle invalid values.
                if (scale_1.hasContinuousDomain(scaleType) && !fieldDef.aggregate) {
                    aggregator[fieldDef.field] = fieldDef;
                }
            }
            return aggregator;
        }, {});
        if (!util_1.keys(filter).length) {
            return null;
        }
        return new FilterInvalidNode(parent, filter);
    };
    Object.defineProperty(FilterInvalidNode.prototype, "filter", {
        get: function () {
            return this.fieldDefs;
        },
        enumerable: true,
        configurable: true
    });
    // create the VgTransforms for each of the filtered fields
    FilterInvalidNode.prototype.assemble = function () {
        var _this = this;
        var filters = util_1.keys(this.filter).reduce(function (vegaFilters, field) {
            var fieldDef = _this.fieldDefs[field];
            var ref = fielddef_1.vgField(fieldDef, { expr: 'datum' });
            if (fieldDef !== null) {
                vegaFilters.push(ref + " !== null");
                vegaFilters.push("!isNaN(" + ref + ")");
            }
            return vegaFilters;
        }, []);
        return filters.length > 0 ?
            {
                type: 'filter',
                expr: filters.join(' && ')
            } : null;
    };
    return FilterInvalidNode;
}(dataflow_1.DataFlowNode));
exports.FilterInvalidNode = FilterInvalidNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyaW52YWxpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE2QztBQUM3QywyQ0FBNkQ7QUFDN0QscUNBQTJEO0FBQzNELG1DQUFzQztBQUd0Qyx1Q0FBd0M7QUFFeEM7SUFBdUMscUNBQVk7SUFLakQsMkJBQVksTUFBb0IsRUFBVSxTQUFpQztRQUEzRSxZQUNDLGtCQUFNLE1BQU0sQ0FBQyxTQUNiO1FBRnlDLGVBQVMsR0FBVCxTQUFTLENBQXdCOztJQUUzRSxDQUFDO0lBTk0saUNBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixDQUFDLElBQUksZUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDMUQsQ0FBQztJQU1hLHNCQUFJLEdBQWxCLFVBQW1CLE1BQW9CLEVBQUUsS0FBcUI7UUFDNUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEtBQUssUUFBUyxDQUFDLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBQyxVQUFrQyxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQ3hGLElBQU0sY0FBYyxHQUFHLHdCQUFjLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25GLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRTdDLCtHQUErRztnQkFDL0csRUFBRSxDQUFDLENBQUMsMkJBQW1CLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDMUQsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUM7Z0JBQ3hDLENBQUM7WUFDSCxDQUFDO1lBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNwQixDQUFDLEVBQUUsRUFBNEIsQ0FBQyxDQUFDO1FBRWpDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELHNCQUFJLHFDQUFNO2FBQVY7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELDBEQUEwRDtJQUNuRCxvQ0FBUSxHQUFmO1FBQUEsaUJBa0JDO1FBaEJDLElBQU0sT0FBTyxHQUFHLFdBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsV0FBVyxFQUFFLEtBQUs7WUFDMUQsSUFBTSxRQUFRLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QyxJQUFNLEdBQUcsR0FBRyxrQkFBUSxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1lBRWhELEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixXQUFXLENBQUMsSUFBSSxDQUFJLEdBQUcsY0FBVyxDQUFDLENBQUM7Z0JBQ3BDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBVSxHQUFHLE1BQUcsQ0FBQyxDQUFDO1lBQ3JDLENBQUM7WUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3JCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVQLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzNCO2dCQUNJLElBQUksRUFBRSxRQUFRO2dCQUNkLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUM3QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDWCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBMURELENBQXVDLHVCQUFZLEdBMERsRDtBQTFEWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7RmllbGREZWYsIHZnRmllbGQgYXMgZmllbGRSZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7aGFzQ29udGludW91c0RvbWFpbiwgU2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge0RpY3QsIGtleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0ZpbHRlclRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVySW52YWxpZE5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBGaWx0ZXJJbnZhbGlkTm9kZShudWxsLCB7Li4udGhpcy5maWVsZERlZnN9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlLCBwcml2YXRlIGZpZWxkRGVmczogRGljdDxGaWVsZERlZjxzdHJpbmc+Pikge1xuICAgc3VwZXIocGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IE1vZGVsV2l0aEZpZWxkKTogRmlsdGVySW52YWxpZE5vZGUge1xuICAgIGlmIChtb2RlbC5jb25maWcuaW52YWxpZFZhbHVlcyAhPT0gJ2ZpbHRlcicgKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBmaWx0ZXIgPSBtb2RlbC5yZWR1Y2VGaWVsZERlZigoYWdncmVnYXRvcjogRGljdDxGaWVsZERlZjxzdHJpbmc+PiwgZmllbGREZWYsIGNoYW5uZWwpID0+IHtcbiAgICAgIGNvbnN0IHNjYWxlQ29tcG9uZW50ID0gaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgJiYgbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCk7XG4gICAgICBpZiAoc2NhbGVDb21wb25lbnQpIHtcbiAgICAgICAgY29uc3Qgc2NhbGVUeXBlID0gc2NhbGVDb21wb25lbnQuZ2V0KCd0eXBlJyk7XG5cbiAgICAgICAgLy8gb25seSBhdXRvbWF0aWNhbGx5IGZpbHRlciBudWxsIGZvciBjb250aW51b3VzIGRvbWFpbiBzaW5jZSBkaXNjcmV0ZSBkb21haW4gc2NhbGVzIGNhbiBoYW5kbGUgaW52YWxpZCB2YWx1ZXMuXG4gICAgICAgIGlmIChoYXNDb250aW51b3VzRG9tYWluKHNjYWxlVHlwZSkgJiYgIWZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICAgIGFnZ3JlZ2F0b3JbZmllbGREZWYuZmllbGRdID0gZmllbGREZWY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhZ2dyZWdhdG9yO1xuICAgIH0sIHt9IGFzIERpY3Q8RmllbGREZWY8c3RyaW5nPj4pO1xuXG4gICAgaWYgKCFrZXlzKGZpbHRlcikubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEZpbHRlckludmFsaWROb2RlKHBhcmVudCwgZmlsdGVyKTtcbiAgfVxuXG4gIGdldCBmaWx0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGREZWZzO1xuICB9XG5cbiAgLy8gY3JlYXRlIHRoZSBWZ1RyYW5zZm9ybXMgZm9yIGVhY2ggb2YgdGhlIGZpbHRlcmVkIGZpZWxkc1xuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdGaWx0ZXJUcmFuc2Zvcm0ge1xuXG4gICAgY29uc3QgZmlsdGVycyA9IGtleXModGhpcy5maWx0ZXIpLnJlZHVjZSgodmVnYUZpbHRlcnMsIGZpZWxkKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IHRoaXMuZmllbGREZWZzW2ZpZWxkXTtcbiAgICAgIGNvbnN0IHJlZiA9IGZpZWxkUmVmKGZpZWxkRGVmLCB7ZXhwcjogJ2RhdHVtJ30pO1xuXG4gICAgICBpZiAoZmllbGREZWYgIT09IG51bGwpIHtcbiAgICAgICAgdmVnYUZpbHRlcnMucHVzaChgJHtyZWZ9ICE9PSBudWxsYCk7XG4gICAgICAgIHZlZ2FGaWx0ZXJzLnB1c2goYCFpc05hTigke3JlZn0pYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmVnYUZpbHRlcnM7XG4gICAgfSwgW10pO1xuXG4gICAgcmV0dXJuIGZpbHRlcnMubGVuZ3RoID4gMCA/XG4gICAge1xuICAgICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgICAgZXhwcjogZmlsdGVycy5qb2luKCcgJiYgJylcbiAgICB9IDogbnVsbDtcbiAgfVxufVxuIl19