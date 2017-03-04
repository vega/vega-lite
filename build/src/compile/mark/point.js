"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
var ref = require("./valueref");
var common_1 = require("../common");
function encodeEntry(model, fixedShape) {
    var config = model.config;
    return tslib_1.__assign({}, mixins.pointPosition('x', model, ref.midX(config)), mixins.pointPosition('y', model, ref.midY(config)), mixins.color(model), mixins.nonPosition('size', model), shapeMixins(model, config, fixedShape), mixins.nonPosition('opacity', model));
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
    role: 'point',
    encodeEntry: function (model) {
        return encodeEntry(model);
    }
};
exports.circle = {
    vgMark: 'symbol',
    role: 'circle',
    encodeEntry: function (model) {
        return encodeEntry(model, 'circle');
    }
};
exports.square = {
    vgMark: 'symbol',
    role: 'square',
    encodeEntry: function (model) {
        return encodeEntry(model, 'square');
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL3BvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGlDQUFtQztBQUluQyxnQ0FBa0M7QUFDbEMsb0NBQXdDO0FBR3hDLHFCQUFxQixLQUFnQixFQUFFLFVBQWdDO0lBQzlELElBQUEscUJBQU0sQ0FBVTtJQUV2QixNQUFNLHNCQUNELE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQ2xELE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBRWxELE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ25CLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUNqQyxXQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFDdEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQ3ZDO0FBQ0osQ0FBQztBQUVELHFCQUE0QixLQUFnQixFQUFFLE1BQWMsRUFBRSxVQUFnQztJQUM1RixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBQyxFQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsc0JBQWEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBVyxFQUFDLENBQUMsQ0FBQztBQUMvRyxDQUFDO0FBTEQsa0NBS0M7QUFFWSxRQUFBLEtBQUssR0FBaUI7SUFDakMsTUFBTSxFQUFFLFFBQVE7SUFDaEIsSUFBSSxFQUFFLE9BQU87SUFDYixXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FDRixDQUFDO0FBRVcsUUFBQSxNQUFNLEdBQWlCO0lBQ2xDLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLElBQUksRUFBRSxRQUFRO0lBQ2QsV0FBVyxFQUFFLFVBQUMsS0FBZ0I7UUFDNUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEMsQ0FBQztDQUNGLENBQUM7QUFFVyxRQUFBLE1BQU0sR0FBaUI7SUFDbEMsTUFBTSxFQUFFLFFBQVE7SUFDaEIsSUFBSSxFQUFFLFFBQVE7SUFDZCxXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0YsQ0FBQyJ9