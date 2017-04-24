"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
var common_1 = require("../common");
var ref = require("./valueref");
function encodeEntry(model, fixedShape) {
    var config = model.config, width = model.width, height = model.height;
    return tslib_1.__assign({}, mixins.pointPosition('x', model, ref.midX(width, config)), mixins.pointPosition('y', model, ref.midY(height, config)), mixins.color(model), mixins.nonPosition('size', model), shapeMixins(model, config, fixedShape), mixins.nonPosition('opacity', model));
}
function shapeMixins(model, config, fixedShape) {
    if (fixedShape) {
        return { shape: { value: fixedShape } };
    }
    return mixins.nonPosition('shape', model, { defaultValue: common_1.getMarkConfig('shape', 'point', config) });
}
exports.shapeMixins = shapeMixins;
exports.point = {
    vgMark: 'symbol',
    defaultRole: 'point',
    encodeEntry: function (model) {
        return encodeEntry(model);
    }
};
exports.circle = {
    vgMark: 'symbol',
    defaultRole: 'circle',
    encodeEntry: function (model) {
        return encodeEntry(model, 'circle');
    }
};
exports.square = {
    vgMark: 'symbol',
    defaultRole: 'square',
    encodeEntry: function (model) {
        return encodeEntry(model, 'square');
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL3BvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLGlDQUFtQztBQUduQyxvQ0FBd0M7QUFFeEMsZ0NBQWtDO0FBRWxDLHFCQUFxQixLQUFnQixFQUFFLFVBQWdDO0lBQzlELElBQUEscUJBQU0sRUFBRSxtQkFBSyxFQUFFLHFCQUFNLENBQVU7SUFFdEMsTUFBTSxzQkFDRCxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFDekQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBRTFELE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ25CLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUNqQyxXQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFDdEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQ3ZDO0FBQ0osQ0FBQztBQUVELHFCQUE0QixLQUFnQixFQUFFLE1BQWMsRUFBRSxVQUFnQztJQUM1RixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBQyxFQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsc0JBQWEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBVyxFQUFDLENBQUMsQ0FBQztBQUMvRyxDQUFDO0FBTEQsa0NBS0M7QUFFWSxRQUFBLEtBQUssR0FBaUI7SUFDakMsTUFBTSxFQUFFLFFBQVE7SUFDaEIsV0FBVyxFQUFFLE9BQU87SUFDcEIsV0FBVyxFQUFFLFVBQUMsS0FBZ0I7UUFDNUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0NBQ0YsQ0FBQztBQUVXLFFBQUEsTUFBTSxHQUFpQjtJQUNsQyxNQUFNLEVBQUUsUUFBUTtJQUNoQixXQUFXLEVBQUUsUUFBUTtJQUNyQixXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0YsQ0FBQztBQUVXLFFBQUEsTUFBTSxHQUFpQjtJQUNsQyxNQUFNLEVBQUUsUUFBUTtJQUNoQixXQUFXLEVBQUUsUUFBUTtJQUNyQixXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0YsQ0FBQyJ9