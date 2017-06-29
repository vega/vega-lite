"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fielddef_1 = require("../../fielddef");
var common_1 = require("../common");
exports.HEADER_CHANNELS = ['row', 'column'];
exports.HEADER_TYPES = ['header', 'footer'];
function getHeaderType(orient) {
    if (orient === 'top' || orient === 'left') {
        return 'header';
    }
    return 'footer';
}
exports.getHeaderType = getHeaderType;
function getTitleGroup(model, channel) {
    var sizeChannel = channel === 'row' ? 'height' : 'width';
    var title = model.component.layoutHeaders[channel].title;
    var positionChannel = channel === 'row' ? 'y' : 'x';
    var align = channel === 'row' ? 'right' : 'center';
    var textOrient = channel === 'row' ? 'vertical' : undefined;
    return {
        name: model.getName(channel + "_title"),
        role: channel + "-title",
        type: 'group',
        marks: [{
                type: 'text',
                role: channel + "-title-text",
                encode: {
                    update: tslib_1.__assign((_a = {}, _a[positionChannel] = { signal: "0.5 * " + sizeChannel }, _a.align = { value: align }, _a.text = { value: title }, _a.fill = { value: 'black' }, _a.fontWeight = { value: 'bold' }, _a), (textOrient === 'vertical' ? { angle: { value: 270 } } : {}))
                }
            }]
    };
    var _a;
}
exports.getTitleGroup = getTitleGroup;
function getHeaderGroup(model, channel, headerType, layoutHeader, header) {
    if (header) {
        var title = null;
        if (layoutHeader.facetFieldDef && header.labels) {
            var facetFieldDef = layoutHeader.facetFieldDef;
            var format = facetFieldDef.header ? facetFieldDef.header.format : undefined;
            title = {
                text: common_1.formatSignalRef(facetFieldDef, format, 'parent', model.config, true),
                offset: 10,
                orient: channel === 'row' ? 'left' : 'top',
                encode: {
                    update: tslib_1.__assign({ fontWeight: { value: 'normal' }, angle: { value: 0 }, fontSize: { value: 10 } }, (channel === 'row' ? {
                        align: { value: 'right' },
                        baseline: { value: 'middle' }
                    } : {}))
                }
            };
        }
        var axes = header.axes;
        var hasAxes = axes && axes.length > 0;
        if (title || hasAxes) {
            var sizeChannel = channel === 'row' ? 'height' : 'width';
            return tslib_1.__assign({ name: model.getName(channel + "_" + headerType), type: 'group', role: channel + "-" + headerType }, (layoutHeader.facetFieldDef ? {
                from: { data: model.getName(channel) },
                sort: {
                    field: fielddef_1.field(layoutHeader.facetFieldDef, { expr: 'datum' }),
                    order: (layoutHeader.facetFieldDef.header && layoutHeader.facetFieldDef.header.sort) || 'ascending'
                }
            } : {}), (title ? { title: title } : {}), { encode: {
                    update: (_a = {},
                        _a[sizeChannel] = header.sizeSignal,
                        _a)
                } }, (hasAxes ? { axes: axes } : {}));
        }
    }
    return null;
    var _a;
}
exports.getHeaderGroup = getHeaderGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGF5b3V0L2hlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSwyQ0FBcUM7QUFHckMsb0NBQTBDO0FBSzdCLFFBQUEsZUFBZSxHQUFvQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztBQUdyRCxRQUFBLFlBQVksR0FBaUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUF3Qy9ELHVCQUE4QixNQUFrQjtJQUM5QyxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssS0FBSyxJQUFJLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQUxELHNDQUtDO0FBRUQsdUJBQThCLEtBQVksRUFBRSxPQUFzQjtJQUNoRSxJQUFNLFdBQVcsR0FBRyxPQUFPLEtBQUssS0FBSyxHQUFHLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDM0QsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzNELElBQU0sZUFBZSxHQUFHLE9BQU8sS0FBSyxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUN0RCxJQUFNLEtBQUssR0FBRyxPQUFPLEtBQUssS0FBSyxHQUFHLE9BQU8sR0FBRyxRQUFRLENBQUM7SUFDckQsSUFBTSxVQUFVLEdBQUcsT0FBTyxLQUFLLEtBQUssR0FBRyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBRTlELE1BQU0sQ0FBQztRQUNMLElBQUksRUFBRyxLQUFLLENBQUMsT0FBTyxDQUFJLE9BQU8sV0FBUSxDQUFDO1FBQ3hDLElBQUksRUFBSyxPQUFPLFdBQVE7UUFDeEIsSUFBSSxFQUFFLE9BQU87UUFDYixL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