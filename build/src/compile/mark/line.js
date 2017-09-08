"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
var ref = require("./valueref");
exports.line = {
    vgMark: 'line',
    encodeEntry: function (model) {
        var width = model.width, height = model.height;
        return tslib_1.__assign({}, mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.color(model), mixins.text(model, 'tooltip'), mixins.nonPosition('opacity', model), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's line size is strokeWidth
        }), mixins.markDefProperties(model.markDef, ['interpolate', 'tension']));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxpQ0FBbUM7QUFDbkMsZ0NBQWtDO0FBR3JCLFFBQUEsSUFBSSxHQUFpQjtJQUNoQyxNQUFNLEVBQUUsTUFBTTtJQUNkLFdBQVcsRUFBRSxVQUFDLEtBQWdCO1FBQ3JCLElBQUEsbUJBQUssRUFBRSxxQkFBTSxDQUFVO1FBRTlCLE1BQU0sc0JBQ0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDaEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDakQsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEVBQzdCLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUNwQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7WUFDbkMsU0FBUyxFQUFFLGFBQWEsQ0FBRSxnQ0FBZ0M7U0FDM0QsQ0FBQyxFQUNDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQ3RFO0lBQ0osQ0FBQztDQUNGLENBQUMifQ==