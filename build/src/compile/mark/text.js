"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var common_1 = require("../common");
var mixins = require("./mixins");
var fielddef_1 = require("../../fielddef");
var type_1 = require("../../type");
var ref = require("./valueref");
var encoding_1 = require("../../encoding");
exports.text = {
    vgMark: 'text',
    role: undefined,
    encodeEntry: function (model) {
        var config = model.config, encoding = model.encoding;
        var textDef = encoding.text;
        return tslib_1.__assign({}, mixins.pointPosition('x', model, xDefault(config, textDef)), mixins.pointPosition('y', model, ref.midY(config)), mixins.text(model), mixins.color(model), mixins.nonPosition('opacity', model), mixins.nonPosition('size', model, {
            vgChannel: 'fontSize' // VL's text size is fontSize
        }), mixins.valueIfDefined('align', align(encoding, config)));
    }
};
function xDefault(config, textDef) {
    if (fielddef_1.isFieldDef(textDef) && textDef.type === type_1.QUANTITATIVE) {
        return { field: { group: 'width' }, offset: -5 };
    }
    // TODO: allow this to fit (Be consistent with ref.midX())
    return { value: config.scale.textXRangeStep / 2 };
}
function align(encoding, config) {
    var alignConfig = common_1.getMarkConfig('align', 'text', config);
    if (alignConfig === undefined) {
        return encoding_1.channelHasField(encoding, channel_1.X) ? 'center' : 'right';
    }
    // If there is a config, Vega-parser will process this already.
    return undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvdGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5Q0FBZ0M7QUFDaEMsb0NBQXdDO0FBRXhDLGlDQUFtQztBQUVuQywyQ0FBc0Q7QUFDdEQsbUNBQXdDO0FBS3hDLGdDQUFrQztBQUNsQywyQ0FBeUQ7QUFFNUMsUUFBQSxJQUFJLEdBQWlCO0lBQ2hDLE1BQU0sRUFBRSxNQUFNO0lBQ2QsSUFBSSxFQUFFLFNBQVM7SUFFZixXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUNyQixJQUFBLHFCQUFNLEVBQUUseUJBQVEsQ0FBVTtRQUNqQyxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBRTlCLE1BQU0sc0JBQ0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFDM0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFDbEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFDbkIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQ3BDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUNuQyxTQUFTLEVBQUUsVUFBVSxDQUFFLDZCQUE2QjtTQUNyRCxDQUFDLEVBQ0MsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUMxRDtJQUNKLENBQUM7Q0FDRixDQUFDO0FBRUYsa0JBQWtCLE1BQWMsRUFBRSxPQUFtQjtJQUNuRCxFQUFFLENBQUMsQ0FBQyxxQkFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssbUJBQVksQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDO0lBQy9DLENBQUM7SUFDRCwwREFBMEQ7SUFDMUQsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLENBQUMsRUFBQyxDQUFDO0FBQ2xELENBQUM7QUFFRCxlQUFlLFFBQWtCLEVBQUUsTUFBYztJQUMvQyxJQUFNLFdBQVcsR0FBRyxzQkFBYSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0QsRUFBRSxDQUFDLENBQUMsV0FBVyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLDBCQUFlLENBQUMsUUFBUSxFQUFFLFdBQUMsQ0FBQyxHQUFHLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDM0QsQ0FBQztJQUNELCtEQUErRDtJQUMvRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUMifQ==