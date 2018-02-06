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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyaW52YWxpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE2QztBQUM3QywyQ0FBNkQ7QUFDN0QscUNBQTJEO0FBQzNELG1DQUFzQztBQUd0Qyx1Q0FBd0M7QUFFeEM7SUFBdUMscUNBQVk7SUFLakQsMkJBQW9CLFNBQWlDO1FBQXJELFlBQ0MsaUJBQU8sU0FDUDtRQUZtQixlQUFTLEdBQVQsU0FBUyxDQUF3Qjs7SUFFckQsQ0FBQztJQU5NLGlDQUFLLEdBQVo7UUFDRSxNQUFNLENBQUMsSUFBSSxpQkFBaUIsY0FBSyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDcEQsQ0FBQztJQU1hLHNCQUFJLEdBQWxCLFVBQW1CLEtBQXFCO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxLQUFLLFFBQVMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQUMsVUFBa0MsRUFBRSxRQUFRLEVBQUUsT0FBTztZQUN4RixJQUFNLGNBQWMsR0FBRyx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRixFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUU3QywrR0FBK0c7Z0JBQy9HLEVBQUUsQ0FBQyxDQUFDLDJCQUFtQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQzFELFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDO2dCQUN4QyxDQUFDO1lBQ0gsQ0FBQztZQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDcEIsQ0FBQyxFQUFFLEVBQTRCLENBQUMsQ0FBQztRQUVqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELHNCQUFJLHFDQUFNO2FBQVY7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELDBEQUEwRDtJQUNuRCxvQ0FBUSxHQUFmO1FBQUEsaUJBa0JDO1FBaEJDLElBQU0sT0FBTyxHQUFHLFdBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsV0FBVyxFQUFFLEtBQUs7WUFDMUQsSUFBTSxRQUFRLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QyxJQUFNLEdBQUcsR0FBRyxrQkFBUSxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1lBRWhELEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixXQUFXLENBQUMsSUFBSSxDQUFJLEdBQUcsY0FBVyxDQUFDLENBQUM7Z0JBQ3BDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBVSxHQUFHLE1BQUcsQ0FBQyxDQUFDO1lBQ3JDLENBQUM7WUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3JCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVQLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzNCO2dCQUNJLElBQUksRUFBRSxRQUFRO2dCQUNkLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUM3QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDWCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBMURELENBQXVDLHVCQUFZLEdBMERsRDtBQTFEWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7RmllbGREZWYsIHZnRmllbGQgYXMgZmllbGRSZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7aGFzQ29udGludW91c0RvbWFpbiwgU2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge0RpY3QsIGtleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0ZpbHRlclRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVySW52YWxpZE5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBGaWx0ZXJJbnZhbGlkTm9kZSh7Li4udGhpcy5maWVsZERlZnN9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZmllbGREZWZzOiBEaWN0PEZpZWxkRGVmPHN0cmluZz4+KSB7XG4gICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYWtlKG1vZGVsOiBNb2RlbFdpdGhGaWVsZCk6IEZpbHRlckludmFsaWROb2RlIHtcbiAgICBpZiAobW9kZWwuY29uZmlnLmludmFsaWRWYWx1ZXMgIT09ICdmaWx0ZXInICkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsdGVyID0gbW9kZWwucmVkdWNlRmllbGREZWYoKGFnZ3JlZ2F0b3I6IERpY3Q8RmllbGREZWY8c3RyaW5nPj4sIGZpZWxkRGVmLCBjaGFubmVsKSA9PiB7XG4gICAgICBjb25zdCBzY2FsZUNvbXBvbmVudCA9IGlzU2NhbGVDaGFubmVsKGNoYW5uZWwpICYmIG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpO1xuICAgICAgaWYgKHNjYWxlQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IHNjYWxlQ29tcG9uZW50LmdldCgndHlwZScpO1xuXG4gICAgICAgIC8vIG9ubHkgYXV0b21hdGljYWxseSBmaWx0ZXIgbnVsbCBmb3IgY29udGludW91cyBkb21haW4gc2luY2UgZGlzY3JldGUgZG9tYWluIHNjYWxlcyBjYW4gaGFuZGxlIGludmFsaWQgdmFsdWVzLlxuICAgICAgICBpZiAoaGFzQ29udGludW91c0RvbWFpbihzY2FsZVR5cGUpICYmICFmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICAgICAgICBhZ2dyZWdhdG9yW2ZpZWxkRGVmLmZpZWxkXSA9IGZpZWxkRGVmO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYWdncmVnYXRvcjtcbiAgICB9LCB7fSBhcyBEaWN0PEZpZWxkRGVmPHN0cmluZz4+KTtcblxuICAgIGlmICgha2V5cyhmaWx0ZXIpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBGaWx0ZXJJbnZhbGlkTm9kZShmaWx0ZXIpO1xuICB9XG5cbiAgZ2V0IGZpbHRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5maWVsZERlZnM7XG4gIH1cblxuICAvLyBjcmVhdGUgdGhlIFZnVHJhbnNmb3JtcyBmb3IgZWFjaCBvZiB0aGUgZmlsdGVyZWQgZmllbGRzXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ0ZpbHRlclRyYW5zZm9ybSB7XG5cbiAgICBjb25zdCBmaWx0ZXJzID0ga2V5cyh0aGlzLmZpbHRlcikucmVkdWNlKCh2ZWdhRmlsdGVycywgZmllbGQpID0+IHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0gdGhpcy5maWVsZERlZnNbZmllbGRdO1xuICAgICAgY29uc3QgcmVmID0gZmllbGRSZWYoZmllbGREZWYsIHtleHByOiAnZGF0dW0nfSk7XG5cbiAgICAgIGlmIChmaWVsZERlZiAhPT0gbnVsbCkge1xuICAgICAgICB2ZWdhRmlsdGVycy5wdXNoKGAke3JlZn0gIT09IG51bGxgKTtcbiAgICAgICAgdmVnYUZpbHRlcnMucHVzaChgIWlzTmFOKCR7cmVmfSlgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2ZWdhRmlsdGVycztcbiAgICB9LCBbXSk7XG5cbiAgICByZXR1cm4gZmlsdGVycy5sZW5ndGggPiAwID9cbiAgICB7XG4gICAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgICBleHByOiBmaWx0ZXJzLmpvaW4oJyAmJiAnKVxuICAgIH0gOiBudWxsO1xuICB9XG59XG4iXX0=