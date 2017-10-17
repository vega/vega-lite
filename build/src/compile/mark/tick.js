"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_schema_1 = require("../../vega.schema");
var mixins = require("./mixins");
var ref = require("./valueref");
exports.tick = {
    vgMark: 'rect',
    encodeEntry: function (model) {
        var config = model.config, markDef = model.markDef, width = model.width, height = model.height;
        var orient = markDef.orient;
        var vgSizeChannel = orient === 'horizontal' ? 'width' : 'height';
        var vgThicknessChannel = orient === 'horizontal' ? 'height' : 'width';
        return tslib_1.__assign({}, mixins.pointPosition('x', model, ref.mid(width), 'xc'), mixins.pointPosition('y', model, ref.mid(height), 'yc'), mixins.nonPosition('size', model, {
            defaultValue: defaultSize(model),
            vgChannel: vgSizeChannel
        }), (_a = {}, _a[vgThicknessChannel] = { value: config.tick.thickness }, _a), mixins.color(model), mixins.nonPosition('opacity', model));
        var _a;
    }
};
function defaultSize(model) {
    var config = model.config;
    var orient = model.markDef.orient;
    var scale = model.getScaleComponent(orient === 'horizontal' ? 'x' : 'y');
    if (config.tick.bandSize !== undefined) {
        return config.tick.bandSize;
    }
    else {
        var scaleRange = scale ? scale.get('range') : undefined;
        var rangeStep = scaleRange && vega_schema_1.isVgRangeStep(scaleRange) ?
            scaleRange.step :
            config.scale.rangeStep;
        if (typeof rangeStep !== 'number') {
            // FIXME consolidate this log
            throw new Error('Function does not handle non-numeric rangeStep');
        }
        return rangeStep / 1.5;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGljay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvdGljay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBZ0Q7QUFHaEQsaUNBQW1DO0FBQ25DLGdDQUFrQztBQUdyQixRQUFBLElBQUksR0FBaUI7SUFDaEMsTUFBTSxFQUFFLE1BQU07SUFFZCxXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUNyQixJQUFBLHFCQUFNLEVBQUUsdUJBQU8sRUFBRSxtQkFBSyxFQUFFLHFCQUFNLENBQVU7UUFDL0MsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUU5QixJQUFNLGFBQWEsR0FBRyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUNuRSxJQUFNLGtCQUFrQixHQUFHLE1BQU0sS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBRXhFLE1BQU0sc0JBQ0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQ3RELE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUd2RCxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7WUFDbkMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUM7WUFDaEMsU0FBUyxFQUFFLGFBQWE7U0FDekIsQ0FBQyxlQUNELGtCQUFrQixJQUFHLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFDLE9BRWpELE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ25CLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUN2Qzs7SUFDSixDQUFDO0NBQ0YsQ0FBQztBQUVGLHFCQUFxQixLQUFnQjtJQUM1QixJQUFBLHFCQUFNLENBQVU7SUFDdkIsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDcEMsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFM0UsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDOUIsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDMUQsSUFBTSxTQUFTLEdBQUcsVUFBVSxJQUFJLDJCQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN6RCxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDekIsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNsQyw2QkFBNkI7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFDRCxNQUFNLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztJQUN6QixDQUFDO0FBQ0gsQ0FBQyJ9