"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
var ref = require("./valueref");
exports.tick = {
    vgMark: 'rect',
    role: 'tick',
    encodeEntry: function (model) {
        var config = model.config, markDef = model.markDef;
        var orient = markDef.orient;
        var vgSizeChannel = orient === 'horizontal' ? 'width' : 'height';
        var vgThicknessChannel = orient === 'horizontal' ? 'height' : 'width';
        return tslib_1.__assign({}, mixins.pointPosition('x', model, ref.midX(config), 'xc'), mixins.pointPosition('y', model, ref.midY(config), 'yc'), mixins.nonPosition('size', model, {
            defaultValue: defaultSize(model),
            vgChannel: vgSizeChannel
        }), (_a = {}, _a[vgThicknessChannel] = { value: config.tick.thickness }, _a), mixins.color(model), mixins.nonPosition('opacity', model));
        var _a;
    }
};
function defaultSize(model) {
    var config = model.config;
    var orient = model.markDef.orient;
    var scaleRangeStep = (model.scale(orient === 'horizontal' ? 'x' : 'y') || {}).rangeStep;
    if (config.tick.bandSize !== undefined) {
        return config.tick.bandSize;
    }
    else {
        var rangeStep = scaleRangeStep !== undefined ?
            scaleRangeStep :
            config.scale.rangeStep;
        if (typeof rangeStep !== 'number') {
            // FIXME consolidate this log
            throw new Error('Function does not handle non-numeric rangeStep');
        }
        return rangeStep / 1.5;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGljay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvdGljay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxpQ0FBbUM7QUFJbkMsZ0NBQWtDO0FBRXJCLFFBQUEsSUFBSSxHQUFpQjtJQUNoQyxNQUFNLEVBQUUsTUFBTTtJQUNkLElBQUksRUFBRSxNQUFNO0lBRVosV0FBVyxFQUFFLFVBQUMsS0FBZ0I7UUFDckIsSUFBQSxxQkFBTSxFQUFFLHVCQUFPLENBQVU7UUFDaEMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUU5QixJQUFNLGFBQWEsR0FBRyxNQUFNLEtBQUssWUFBWSxHQUFHLE9BQU8sR0FBRyxRQUFRLENBQUM7UUFDbkUsSUFBTSxrQkFBa0IsR0FBRyxNQUFNLEtBQUssWUFBWSxHQUFHLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFFeEUsTUFBTSxzQkFDRCxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsRUFDeEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBR3hELE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUNuQyxZQUFZLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUNoQyxTQUFTLEVBQUUsYUFBYTtTQUN6QixDQUFDLGVBQ0Qsa0JBQWtCLElBQUcsRUFBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUMsT0FFakQsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFDbkIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQ3ZDOztJQUNKLENBQUM7Q0FDRixDQUFDO0FBRUYscUJBQXFCLEtBQWdCO0lBQzVCLElBQUEscUJBQU0sQ0FBVTtJQUN2QixJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUVwQyxJQUFNLGNBQWMsR0FBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxZQUFZLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUV6RyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUM5QixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixJQUFNLFNBQVMsR0FBRyxjQUFjLEtBQUssU0FBUztZQUM1QyxjQUFjO1lBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDekIsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNsQyw2QkFBNkI7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFDRCxNQUFNLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztJQUN6QixDQUFDO0FBQ0gsQ0FBQyJ9