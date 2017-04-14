"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
exports.area = {
    vgMark: 'area',
    defaultRole: undefined,
    encodeEntry: function (model) {
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition('y', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin'), mixins.color(model), mixins.nonPosition('opacity', model), mixins.markDefProperties(model.markDef, ['orient', 'interpolate', 'tension']));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJlYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvYXJlYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBbUM7QUFJdEIsUUFBQSxJQUFJLEdBQWlCO0lBQ2hDLE1BQU0sRUFBRSxNQUFNO0lBQ2QsV0FBVyxFQUFFLFNBQVM7SUFDdEIsV0FBVyxFQUFFLFVBQUMsS0FBZ0I7UUFDNUIsTUFBTSxzQkFDRCxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLEVBQzdDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsRUFDN0MsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLEVBRXpDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ25CLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUNwQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFDaEY7SUFDSixDQUFDO0NBQ0YsQ0FBQyJ9