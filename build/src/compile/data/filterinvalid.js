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
    function FilterInvalidNode(fieldDefs) {
        var _this = _super.call(this) || this;
        _this.fieldDefs = fieldDefs;
        return _this;
    }
    FilterInvalidNode.prototype.clone = function () {
        return new FilterInvalidNode(__assign({}, this.fieldDefs));
    };
    FilterInvalidNode.make = function (model) {
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
        return new FilterInvalidNode(filter);
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
            var ref = fielddef_1.field(fieldDef, { expr: 'datum' });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyaW52YWxpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE2QztBQUM3QywyQ0FBMkQ7QUFDM0QscUNBQTJEO0FBQzNELG1DQUFzQztBQUd0Qyx1Q0FBd0M7QUFFeEM7SUFBdUMscUNBQVk7SUFLakQsMkJBQW9CLFNBQWlDO1FBQXJELFlBQ0MsaUJBQU8sU0FDUDtRQUZtQixlQUFTLEdBQVQsU0FBUyxDQUF3Qjs7SUFFckQsQ0FBQztJQU5NLGlDQUFLLEdBQVo7UUFDRSxNQUFNLENBQUMsSUFBSSxpQkFBaUIsY0FBSyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDcEQsQ0FBQztJQU1hLHNCQUFJLEdBQWxCLFVBQW1CLEtBQXFCO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxLQUFLLFFBQVMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQUMsVUFBa0MsRUFBRSxRQUFRLEVBQUUsT0FBTztZQUN4RixJQUFNLGNBQWMsR0FBRyx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRixFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUU3QywrR0FBK0c7Z0JBQy9HLEVBQUUsQ0FBQyxDQUFDLDJCQUFtQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQzFELFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDO2dCQUN4QyxDQUFDO1lBQ0gsQ0FBQztZQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDcEIsQ0FBQyxFQUFFLEVBQTRCLENBQUMsQ0FBQztRQUVqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELHNCQUFJLHFDQUFNO2FBQVY7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELDBEQUEwRDtJQUNuRCxvQ0FBUSxHQUFmO1FBQUEsaUJBa0JDO1FBaEJDLElBQU0sT0FBTyxHQUFHLFdBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsV0FBVyxFQUFFLEtBQUs7WUFDMUQsSUFBTSxRQUFRLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QyxJQUFNLEdBQUcsR0FBRyxnQkFBUSxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1lBRWhELEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixXQUFXLENBQUMsSUFBSSxDQUFJLEdBQUcsY0FBVyxDQUFDLENBQUM7Z0JBQ3BDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBVSxHQUFHLE1BQUcsQ0FBQyxDQUFDO1lBQ3JDLENBQUM7WUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3JCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVQLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzNCO2dCQUNJLElBQUksRUFBRSxRQUFRO2dCQUNkLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUM3QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDWCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBMURELENBQXVDLHVCQUFZLEdBMERsRDtBQTFEWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7ZmllbGQgYXMgZmllbGRSZWYsIEZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge2hhc0NvbnRpbnVvdXNEb21haW4sIFNjYWxlVHlwZX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtEaWN0LCBrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdGaWx0ZXJUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7TW9kZWxXaXRoRmllbGR9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuZXhwb3J0IGNsYXNzIEZpbHRlckludmFsaWROb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgRmlsdGVySW52YWxpZE5vZGUoey4uLnRoaXMuZmllbGREZWZzfSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZpZWxkRGVmczogRGljdDxGaWVsZERlZjxzdHJpbmc+Pikge1xuICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZShtb2RlbDogTW9kZWxXaXRoRmllbGQpOiBGaWx0ZXJJbnZhbGlkTm9kZSB7XG4gICAgaWYgKG1vZGVsLmNvbmZpZy5pbnZhbGlkVmFsdWVzICE9PSAnZmlsdGVyJyApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbHRlciA9IG1vZGVsLnJlZHVjZUZpZWxkRGVmKChhZ2dyZWdhdG9yOiBEaWN0PEZpZWxkRGVmPHN0cmluZz4+LCBmaWVsZERlZiwgY2hhbm5lbCkgPT4ge1xuICAgICAgY29uc3Qgc2NhbGVDb21wb25lbnQgPSBpc1NjYWxlQ2hhbm5lbChjaGFubmVsKSAmJiBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKTtcbiAgICAgIGlmIChzY2FsZUNvbXBvbmVudCkge1xuICAgICAgICBjb25zdCBzY2FsZVR5cGUgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3R5cGUnKTtcblxuICAgICAgICAvLyBvbmx5IGF1dG9tYXRpY2FsbHkgZmlsdGVyIG51bGwgZm9yIGNvbnRpbnVvdXMgZG9tYWluIHNpbmNlIGRpc2NyZXRlIGRvbWFpbiBzY2FsZXMgY2FuIGhhbmRsZSBpbnZhbGlkIHZhbHVlcy5cbiAgICAgICAgaWYgKGhhc0NvbnRpbnVvdXNEb21haW4oc2NhbGVUeXBlKSAmJiAhZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgYWdncmVnYXRvcltmaWVsZERlZi5maWVsZF0gPSBmaWVsZERlZjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGFnZ3JlZ2F0b3I7XG4gICAgfSwge30gYXMgRGljdDxGaWVsZERlZjxzdHJpbmc+Pik7XG5cbiAgICBpZiAoIWtleXMoZmlsdGVyKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRmlsdGVySW52YWxpZE5vZGUoZmlsdGVyKTtcbiAgfVxuXG4gIGdldCBmaWx0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGREZWZzO1xuICB9XG5cbiAgLy8gY3JlYXRlIHRoZSBWZ1RyYW5zZm9ybXMgZm9yIGVhY2ggb2YgdGhlIGZpbHRlcmVkIGZpZWxkc1xuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdGaWx0ZXJUcmFuc2Zvcm0ge1xuXG4gICAgY29uc3QgZmlsdGVycyA9IGtleXModGhpcy5maWx0ZXIpLnJlZHVjZSgodmVnYUZpbHRlcnMsIGZpZWxkKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IHRoaXMuZmllbGREZWZzW2ZpZWxkXTtcbiAgICAgIGNvbnN0IHJlZiA9IGZpZWxkUmVmKGZpZWxkRGVmLCB7ZXhwcjogJ2RhdHVtJ30pO1xuXG4gICAgICBpZiAoZmllbGREZWYgIT09IG51bGwpIHtcbiAgICAgICAgdmVnYUZpbHRlcnMucHVzaChgJHtyZWZ9ICE9PSBudWxsYCk7XG4gICAgICAgIHZlZ2FGaWx0ZXJzLnB1c2goYCFpc05hTigke3JlZn0pYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmVnYUZpbHRlcnM7XG4gICAgfSwgW10pO1xuXG4gICAgcmV0dXJuIGZpbHRlcnMubGVuZ3RoID4gMCA/XG4gICAge1xuICAgICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgICAgZXhwcjogZmlsdGVycy5qb2luKCcgJiYgJylcbiAgICB9IDogbnVsbDtcbiAgfVxufVxuIl19