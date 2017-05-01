"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var mark_1 = require("../../mark");
var scale_1 = require("../../scale");
var mixins = require("./mixins");
exports.rect = {
    vgMark: 'rect',
    defaultRole: undefined,
    encodeEntry: function (model) {
        return tslib_1.__assign({}, x(model), y(model), mixins.color(model), mixins.text(model, 'tooltip'), mixins.nonPosition('opacity', model));
    }
};
function x(model) {
    var xDef = model.encoding.x;
    var x2Def = model.encoding.x2;
    var xScale = model.scale(channel_1.X);
    if (fielddef_1.isFieldDef(xDef) && xDef.bin && !x2Def) {
        return mixins.binnedPosition('x', model, 0);
    }
    else if (xScale && scale_1.hasDiscreteDomain(xScale.type)) {
        /* istanbul ignore else */
        if (xScale.type === scale_1.ScaleType.BAND) {
            return mixins.bandPosition('x', model);
        }
        else {
            // We don't support rect mark with point/ordinal scale
            throw new Error(log.message.scaleTypeNotWorkWithMark(mark_1.RECT, xScale.type));
        }
    }
    else {
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMax'), mixins.pointPosition2(model, 'zeroOrMin', 'x2'));
    }
}
function y(model) {
    var yDef = model.encoding.y;
    var y2Def = model.encoding.y2;
    var yScale = model.scale(channel_1.Y);
    if (fielddef_1.isFieldDef(yDef) && yDef.bin && !y2Def) {
        return mixins.binnedPosition('y', model, 0);
    }
    else if (yScale && scale_1.hasDiscreteDomain(yScale.type)) {
        /* istanbul ignore else */
        if (yScale.type === scale_1.ScaleType.BAND) {
            return mixins.bandPosition('y', model);
        }
        else {
            // We don't support rect mark with point/ordinal scale
            throw new Error(log.message.scaleTypeNotWorkWithMark(mark_1.RECT, yScale.type));
        }
    }
    else {
        return tslib_1.__assign({}, mixins.pointPosition('y', model, 'zeroOrMax'), mixins.pointPosition2(model, 'zeroOrMin', 'y2'));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvcmVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5Q0FBbUM7QUFDbkMsMkNBQTBDO0FBQzFDLCtCQUFpQztBQUNqQyxtQ0FBZ0M7QUFDaEMscUNBQXlEO0FBR3pELGlDQUFtQztBQUl0QixRQUFBLElBQUksR0FBaUI7SUFDaEMsTUFBTSxFQUFFLE1BQU07SUFDZCxXQUFXLEVBQUUsU0FBUztJQUN0QixXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUM1QixNQUFNLHNCQUNELENBQUMsQ0FBQyxLQUFLLENBQUMsRUFDUixDQUFDLENBQUMsS0FBSyxDQUFDLEVBQ1IsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEVBQzdCLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUN2QztJQUNKLENBQUM7Q0FDRixDQUFDO0FBRUYsV0FBVyxLQUFnQjtJQUN6QixJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUM5QixJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztJQUNoQyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQUMsQ0FBQyxDQUFDO0lBRTlCLEVBQUUsQ0FBQyxDQUFDLHFCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSx5QkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELDBCQUEwQjtRQUMxQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sc0RBQXNEO1lBQ3RELE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxXQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQztJQUNILENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sc0JBQ0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxFQUM3QyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLEVBQ2xEO0lBQ0osQ0FBQztBQUNILENBQUM7QUFFRCxXQUFXLEtBQWdCO0lBQ3pCLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzlCLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO0lBQ2hDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBQyxDQUFDLENBQUM7SUFFOUIsRUFBRSxDQUFDLENBQUMscUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLHlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQsMEJBQTBCO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixzREFBc0Q7WUFDdEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLFdBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMzRSxDQUFDO0lBQ0gsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxzQkFDRCxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLEVBQzdDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsRUFDbEQ7SUFDSixDQUFDO0FBQ0gsQ0FBQyJ9