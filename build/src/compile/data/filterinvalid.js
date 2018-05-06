import * as tslib_1 from "tslib";
import { isScaleChannel } from '../../channel';
import { vgField as fieldRef } from '../../fielddef';
import { isPathMark } from '../../mark';
import { hasContinuousDomain } from '../../scale';
import { keys } from '../../util';
import { DataFlowNode } from './dataflow';
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
            var scaleComponent = isScaleChannel(channel) && model.getScaleComponent(channel);
            if (scaleComponent) {
                var scaleType = scaleComponent.get('type');
                // While discrete domain scales can handle invalid values, continuous scales can't.
                // Thus, for non-path marks, we have to filter null for scales with continuous domains.
                // (For path marks, we will use "defined" property and skip these values instead.)
                if (hasContinuousDomain(scaleType) && !fieldDef.aggregate && !isPathMark(mark)) {
                    aggregator[fieldDef.field] = fieldDef;
                }
            }
            return aggregator;
        }, {});
        if (!keys(filter).length) {
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
        var filters = keys(this.filter).reduce(function (vegaFilters, field) {
            var fieldDef = _this.fieldDefs[field];
            var ref = fieldRef(fieldDef, { expr: 'datum' });
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
}(DataFlowNode));
export { FilterInvalidNode };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyaW52YWxpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZmlsdGVyaW52YWxpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3QyxPQUFPLEVBQVcsT0FBTyxJQUFJLFFBQVEsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzdELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFDLG1CQUFtQixFQUFZLE1BQU0sYUFBYSxDQUFDO0FBQzNELE9BQU8sRUFBTyxJQUFJLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFHdEMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUV4QztJQUF1Qyw2Q0FBWTtJQUtqRCwyQkFBWSxNQUFvQixFQUFVLFNBQWlDO1FBQTNFLFlBQ0Msa0JBQU0sTUFBTSxDQUFDLFNBQ2I7UUFGeUMsZUFBUyxHQUFULFNBQVMsQ0FBd0I7O0lBRTNFLENBQUM7SUFOTSxpQ0FBSyxHQUFaO1FBQ0UsT0FBTyxJQUFJLGlCQUFpQixDQUFDLElBQUksdUJBQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzFELENBQUM7SUFNYSxzQkFBSSxHQUFsQixVQUFtQixNQUFvQixFQUFFLEtBQWdCO1FBQ2hELElBQUEscUJBQU0sRUFBRSxpQkFBSSxDQUFVO1FBQzdCLElBQUksTUFBTSxDQUFDLGFBQWEsS0FBSyxRQUFRLEVBQUc7WUFDdEMsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBQyxVQUFrQyxFQUFFLFFBQVEsRUFBRSxPQUFPO1lBQ3hGLElBQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkYsSUFBSSxjQUFjLEVBQUU7Z0JBQ2xCLElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRzdDLG1GQUFtRjtnQkFDbkYsdUZBQXVGO2dCQUN2RixrRkFBa0Y7Z0JBQ2xGLElBQUksbUJBQW1CLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUM5RSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQztpQkFDdkM7YUFDRjtZQUNELE9BQU8sVUFBVSxDQUFDO1FBQ3BCLENBQUMsRUFBRSxFQUE0QixDQUFDLENBQUM7UUFFakMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDeEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELHNCQUFJLHFDQUFNO2FBQVY7WUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEIsQ0FBQzs7O09BQUE7SUFFRCwwREFBMEQ7SUFDbkQsb0NBQVEsR0FBZjtRQUFBLGlCQWlCQztRQWhCQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxLQUFLO1lBQzFELElBQU0sUUFBUSxHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkMsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1lBRWhELElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQkFDckIsV0FBVyxDQUFDLElBQUksQ0FBSSxHQUFHLGNBQVcsQ0FBQyxDQUFDO2dCQUNwQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVUsR0FBRyxNQUFHLENBQUMsQ0FBQzthQUNwQztZQUNELE9BQU8sV0FBVyxDQUFDO1FBQ3JCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVQLE9BQU8sT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzQjtnQkFDSSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDN0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ1gsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQTdERCxDQUF1QyxZQUFZLEdBNkRsRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNTY2FsZUNoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtGaWVsZERlZiwgdmdGaWVsZCBhcyBmaWVsZFJlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtpc1BhdGhNYXJrfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7aGFzQ29udGludW91c0RvbWFpbiwgU2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge0RpY3QsIGtleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0ZpbHRlclRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVySW52YWxpZE5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBGaWx0ZXJJbnZhbGlkTm9kZShudWxsLCB7Li4udGhpcy5maWVsZERlZnN9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlLCBwcml2YXRlIGZpZWxkRGVmczogRGljdDxGaWVsZERlZjxzdHJpbmc+Pikge1xuICAgc3VwZXIocGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IFVuaXRNb2RlbCk6IEZpbHRlckludmFsaWROb2RlIHtcbiAgICBjb25zdCB7Y29uZmlnLCBtYXJrfSA9IG1vZGVsO1xuICAgIGlmIChjb25maWcuaW52YWxpZFZhbHVlcyAhPT0gJ2ZpbHRlcicgKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBmaWx0ZXIgPSBtb2RlbC5yZWR1Y2VGaWVsZERlZigoYWdncmVnYXRvcjogRGljdDxGaWVsZERlZjxzdHJpbmc+PiwgZmllbGREZWYsIGNoYW5uZWwpID0+IHtcbiAgICAgIGNvbnN0IHNjYWxlQ29tcG9uZW50ID0gaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgJiYgbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCk7XG4gICAgICBpZiAoc2NhbGVDb21wb25lbnQpIHtcbiAgICAgICAgY29uc3Qgc2NhbGVUeXBlID0gc2NhbGVDb21wb25lbnQuZ2V0KCd0eXBlJyk7XG5cblxuICAgICAgICAvLyBXaGlsZSBkaXNjcmV0ZSBkb21haW4gc2NhbGVzIGNhbiBoYW5kbGUgaW52YWxpZCB2YWx1ZXMsIGNvbnRpbnVvdXMgc2NhbGVzIGNhbid0LlxuICAgICAgICAvLyBUaHVzLCBmb3Igbm9uLXBhdGggbWFya3MsIHdlIGhhdmUgdG8gZmlsdGVyIG51bGwgZm9yIHNjYWxlcyB3aXRoIGNvbnRpbnVvdXMgZG9tYWlucy5cbiAgICAgICAgLy8gKEZvciBwYXRoIG1hcmtzLCB3ZSB3aWxsIHVzZSBcImRlZmluZWRcIiBwcm9wZXJ0eSBhbmQgc2tpcCB0aGVzZSB2YWx1ZXMgaW5zdGVhZC4pXG4gICAgICAgIGlmIChoYXNDb250aW51b3VzRG9tYWluKHNjYWxlVHlwZSkgJiYgIWZpZWxkRGVmLmFnZ3JlZ2F0ZSAmJiAhaXNQYXRoTWFyayhtYXJrKSkge1xuICAgICAgICAgIGFnZ3JlZ2F0b3JbZmllbGREZWYuZmllbGRdID0gZmllbGREZWY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhZ2dyZWdhdG9yO1xuICAgIH0sIHt9IGFzIERpY3Q8RmllbGREZWY8c3RyaW5nPj4pO1xuXG4gICAgaWYgKCFrZXlzKGZpbHRlcikubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEZpbHRlckludmFsaWROb2RlKHBhcmVudCwgZmlsdGVyKTtcbiAgfVxuXG4gIGdldCBmaWx0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmllbGREZWZzO1xuICB9XG5cbiAgLy8gY3JlYXRlIHRoZSBWZ1RyYW5zZm9ybXMgZm9yIGVhY2ggb2YgdGhlIGZpbHRlcmVkIGZpZWxkc1xuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdGaWx0ZXJUcmFuc2Zvcm0ge1xuICAgIGNvbnN0IGZpbHRlcnMgPSBrZXlzKHRoaXMuZmlsdGVyKS5yZWR1Y2UoKHZlZ2FGaWx0ZXJzLCBmaWVsZCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSB0aGlzLmZpZWxkRGVmc1tmaWVsZF07XG4gICAgICBjb25zdCByZWYgPSBmaWVsZFJlZihmaWVsZERlZiwge2V4cHI6ICdkYXR1bSd9KTtcblxuICAgICAgaWYgKGZpZWxkRGVmICE9PSBudWxsKSB7XG4gICAgICAgIHZlZ2FGaWx0ZXJzLnB1c2goYCR7cmVmfSAhPT0gbnVsbGApO1xuICAgICAgICB2ZWdhRmlsdGVycy5wdXNoKGAhaXNOYU4oJHtyZWZ9KWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZlZ2FGaWx0ZXJzO1xuICAgIH0sIFtdKTtcblxuICAgIHJldHVybiBmaWx0ZXJzLmxlbmd0aCA+IDAgP1xuICAgIHtcbiAgICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICAgIGV4cHI6IGZpbHRlcnMuam9pbignICYmICcpXG4gICAgfSA6IG51bGw7XG4gIH1cbn1cbiJdfQ==