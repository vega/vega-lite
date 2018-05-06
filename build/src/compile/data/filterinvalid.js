"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var mark_1 = require("../../mark");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var FilterInvalidNode = /** @class */ (function (_super) {
    tslib_1.__extends(FilterInvalidNode, _super);
    function FilterInvalidNode(parent, fieldDefs) {
        var _this = _super.call(this, parent) || this;
        _this.fieldDefs = fieldDefs;
        return _this;
    }
    FilterInvalidNode.prototype.clone = function () {
        return new FilterInvalidNode(null, tslib_1.__assign({}, this.fieldDefs));
    };
    FilterInvalidNode.make = function (parent, model) {
        var config = model.config, mark = model.mark;
        if (config.invalidValues !== 'filter') {
            return null;
        }
        var filter = model.reduceFieldDef(function (aggregator, fieldDef, channel) {
            var scaleComponent = channel_1.isScaleChannel(channel) && model.getScaleComponent(channel);
            if (scaleComponent) {
                var scaleType = scaleComponent.get('type');
                // While discrete domain scales can handle invalid values, continuous scales can't.
                // Thus, for non-path marks, we have to filter null for scales with continuous domains.
                // (For path marks, we will use "defined" property and skip these values instead.)
                if (scale_1.hasContinuousDomain(scaleType) && !fieldDef.aggregate && !mark_1.isPathMark(mark)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyaW52YWxpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5Q0FBNkM7QUFDN0MsMkNBQTZEO0FBQzdELG1DQUFzQztBQUN0QyxxQ0FBMkQ7QUFDM0QsbUNBQXNDO0FBR3RDLHVDQUF3QztBQUV4QztJQUF1Qyw2Q0FBWTtJQUtqRCwyQkFBWSxNQUFvQixFQUFVLFNBQWlDO1FBQTNFLFlBQ0Msa0JBQU0sTUFBTSxDQUFDLFNBQ2I7UUFGeUMsZUFBUyxHQUFULFNBQVMsQ0FBd0I7O0lBRTNFLENBQUM7SUFOTSxpQ0FBSyxHQUFaO1FBQ0UsT0FBTyxJQUFJLGlCQUFpQixDQUFDLElBQUksdUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzFELENBQUM7SUFNYSxzQkFBSSxHQUFsQixVQUFtQixNQUFvQixFQUFFLEtBQWdCO1FBQ2hELElBQUEscUJBQU0sRUFBRSxpQkFBSSxDQUFVO1FBQzdCLElBQUksTUFBTSxDQUFDLGFBQWEsS0FBSyxRQUFRLEVBQUc7WUFDdEMsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBQyxVQUFrQyxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQ3hGLElBQU0sY0FBYyxHQUFHLHdCQUFjLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25GLElBQUksY0FBYyxFQUFFO2dCQUNsQixJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUc3QyxtRkFBbUY7Z0JBQ25GLHVGQUF1RjtnQkFDdkYsa0ZBQWtGO2dCQUNsRixJQUFJLDJCQUFtQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsSUFBSSxDQUFDLGlCQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzlFLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDO2lCQUN2QzthQUNGO1lBQ0QsT0FBTyxVQUFVLENBQUM7UUFDcEIsQ0FBQyxFQUFFLEVBQTRCLENBQUMsQ0FBQztRQUVqQyxJQUFJLENBQUMsV0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUN4QixPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsT0FBTyxJQUFJLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsc0JBQUkscUNBQU07YUFBVjtZQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELDBEQUEwRDtJQUNuRCxvQ0FBUSxHQUFmO1FBQUEsaUJBaUJDO1FBaEJDLElBQU0sT0FBTyxHQUFHLFdBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsV0FBVyxFQUFFLEtBQUs7WUFDMUQsSUFBTSxRQUFRLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QyxJQUFNLEdBQUcsR0FBRyxrQkFBUSxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1lBRWhELElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQkFDckIsV0FBVyxDQUFDLElBQUksQ0FBSSxHQUFHLGNBQVcsQ0FBQyxDQUFDO2dCQUNwQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVUsR0FBRyxNQUFHLENBQUMsQ0FBQzthQUNwQztZQUNELE9BQU8sV0FBVyxDQUFDO1FBQ3JCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVQLE9BQU8sT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzQjtnQkFDSSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDN0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ1gsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQTdERCxDQUF1Qyx1QkFBWSxHQTZEbEQ7QUE3RFksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1NjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0ZpZWxkRGVmLCB2Z0ZpZWxkIGFzIGZpZWxkUmVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge2lzUGF0aE1hcmt9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtoYXNDb250aW51b3VzRG9tYWluLCBTY2FsZVR5cGV9IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7RGljdCwga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnRmlsdGVyVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJJbnZhbGlkTm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IEZpbHRlckludmFsaWROb2RlKG51bGwsIHsuLi50aGlzLmZpZWxkRGVmc30pO1xuICB9XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHByaXZhdGUgZmllbGREZWZzOiBEaWN0PEZpZWxkRGVmPHN0cmluZz4+KSB7XG4gICBzdXBlcihwYXJlbnQpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYWtlKHBhcmVudDogRGF0YUZsb3dOb2RlLCBtb2RlbDogVW5pdE1vZGVsKTogRmlsdGVySW52YWxpZE5vZGUge1xuICAgIGNvbnN0IHtjb25maWcsIG1hcmt9ID0gbW9kZWw7XG4gICAgaWYgKGNvbmZpZy5pbnZhbGlkVmFsdWVzICE9PSAnZmlsdGVyJyApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbHRlciA9IG1vZGVsLnJlZHVjZUZpZWxkRGVmKChhZ2dyZWdhdG9yOiBEaWN0PEZpZWxkRGVmPHN0cmluZz4+LCBmaWVsZERlZiwgY2hhbm5lbCkgPT4ge1xuICAgICAgY29uc3Qgc2NhbGVDb21wb25lbnQgPSBpc1NjYWxlQ2hhbm5lbChjaGFubmVsKSAmJiBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKTtcbiAgICAgIGlmIChzY2FsZUNvbXBvbmVudCkge1xuICAgICAgICBjb25zdCBzY2FsZVR5cGUgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3R5cGUnKTtcblxuXG4gICAgICAgIC8vIFdoaWxlIGRpc2NyZXRlIGRvbWFpbiBzY2FsZXMgY2FuIGhhbmRsZSBpbnZhbGlkIHZhbHVlcywgY29udGludW91cyBzY2FsZXMgY2FuJ3QuXG4gICAgICAgIC8vIFRodXMsIGZvciBub24tcGF0aCBtYXJrcywgd2UgaGF2ZSB0byBmaWx0ZXIgbnVsbCBmb3Igc2NhbGVzIHdpdGggY29udGludW91cyBkb21haW5zLlxuICAgICAgICAvLyAoRm9yIHBhdGggbWFya3MsIHdlIHdpbGwgdXNlIFwiZGVmaW5lZFwiIHByb3BlcnR5IGFuZCBza2lwIHRoZXNlIHZhbHVlcyBpbnN0ZWFkLilcbiAgICAgICAgaWYgKGhhc0NvbnRpbnVvdXNEb21haW4oc2NhbGVUeXBlKSAmJiAhZmllbGREZWYuYWdncmVnYXRlICYmICFpc1BhdGhNYXJrKG1hcmspKSB7XG4gICAgICAgICAgYWdncmVnYXRvcltmaWVsZERlZi5maWVsZF0gPSBmaWVsZERlZjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGFnZ3JlZ2F0b3I7XG4gICAgfSwge30gYXMgRGljdDxGaWVsZERlZjxzdHJpbmc+Pik7XG5cbiAgICBpZiAoIWtleXMoZmlsdGVyKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRmlsdGVySW52YWxpZE5vZGUocGFyZW50LCBmaWx0ZXIpO1xuICB9XG5cbiAgZ2V0IGZpbHRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5maWVsZERlZnM7XG4gIH1cblxuICAvLyBjcmVhdGUgdGhlIFZnVHJhbnNmb3JtcyBmb3IgZWFjaCBvZiB0aGUgZmlsdGVyZWQgZmllbGRzXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ0ZpbHRlclRyYW5zZm9ybSB7XG4gICAgY29uc3QgZmlsdGVycyA9IGtleXModGhpcy5maWx0ZXIpLnJlZHVjZSgodmVnYUZpbHRlcnMsIGZpZWxkKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IHRoaXMuZmllbGREZWZzW2ZpZWxkXTtcbiAgICAgIGNvbnN0IHJlZiA9IGZpZWxkUmVmKGZpZWxkRGVmLCB7ZXhwcjogJ2RhdHVtJ30pO1xuXG4gICAgICBpZiAoZmllbGREZWYgIT09IG51bGwpIHtcbiAgICAgICAgdmVnYUZpbHRlcnMucHVzaChgJHtyZWZ9ICE9PSBudWxsYCk7XG4gICAgICAgIHZlZ2FGaWx0ZXJzLnB1c2goYCFpc05hTigke3JlZn0pYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmVnYUZpbHRlcnM7XG4gICAgfSwgW10pO1xuXG4gICAgcmV0dXJuIGZpbHRlcnMubGVuZ3RoID4gMCA/XG4gICAge1xuICAgICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgICAgZXhwcjogZmlsdGVycy5qb2luKCcgJiYgJylcbiAgICB9IDogbnVsbDtcbiAgfVxufVxuIl19