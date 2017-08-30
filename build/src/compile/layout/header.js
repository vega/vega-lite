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
    var title = model.component.layoutHeaders[channel].title;
    var textOrient = channel === 'row' ? 'vertical' : undefined;
    return {
        name: model.getName(channel + "_title"),
        role: channel + "-title",
        type: 'group',
        marks: [{
                type: 'text',
                role: channel + "-title-text",
                style: 'guide-title',
                encode: {
                    update: tslib_1.__assign({ 
                        // TODO: add title align
                        align: { value: 'center' }, text: { value: title } }, (textOrient === 'vertical' ? { angle: { value: 270 } } : {}))
                }
            }]
    };
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
                style: 'guide-label',
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
                from: { data: model.getName(channel + '_domain') },
                sort: {
                    field: fielddef_1.field(layoutHeader.facetFieldDef, { expr: 'datum' }),
                    order: (layoutHeader.facetFieldDef.header && layoutHeader.facetFieldDef.sort) || 'ascending'
                }
            } : {}), (title ? { title: title } : {}), (header.sizeSignal ? {
                encode: {
                    update: (_a = {},
                        _a[sizeChannel] = header.sizeSignal,
                        _a)
                }
            } : {}), (hasAxes ? { axes: axes } : {}));
        }
    }
    return null;
    var _a;
}
exports.getHeaderGroup = getHeaderGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGF5b3V0L2hlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSwyQ0FBcUM7QUFFckMsb0NBQTBDO0FBSTdCLFFBQUEsZUFBZSxHQUFvQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztBQUdyRCxRQUFBLFlBQVksR0FBaUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUF3Qy9ELHVCQUE4QixNQUFrQjtJQUM5QyxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssS0FBSyxJQUFJLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQUxELHNDQUtDO0FBRUQsdUJBQThCLEtBQVksRUFBRSxPQUFzQjtJQUNoRSxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDM0QsSUFBTSxVQUFVLEdBQUcsT0FBTyxLQUFLLEtBQUssR0FBRyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBRTlELE1BQU0sQ0FBQztRQUNMLElBQUksRUFBRyxLQUFLLENBQUMsT0FBTyxDQUFJLE9BQU8sV0FBUSxDQUFDO1FBQ3hDLElBQUksRUFBSyxPQUFPLFdBQVE7UUFDeEIsSUFBSSxFQUFFLE9BQU87UUFDYixLQUFLLEVBQUUsQ0FBQztnQkFDTixJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUssT0FBTyxnQkFBYTtnQkFDN0IsS0FBSyxFQUFFLGFBQWE7Z0JBQ3BCLE1BQU0sRUFBRTtvQkFDTixNQUFNO3dCQUNKLHdCQUF3Qjt3QkFDeEIsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxFQUN4QixJQUFJLEVBQUUs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