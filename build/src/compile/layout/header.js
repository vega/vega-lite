"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
        if (layoutHeader.fieldRef && header.labels) {
            title = {
                text: layoutHeader.fieldRef,
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
            return tslib_1.__assign({ name: model.getName(channel + "_" + headerType), type: 'group', role: channel + "-" + headerType }, (layoutHeader.fieldRef ? { from: { data: model.getName(channel) } } : {}), (title ? { title: title } : {}), { encode: {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGF5b3V0L2hlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFXYSxRQUFBLGVBQWUsR0FBb0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFHckQsUUFBQSxZQUFZLEdBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBMkMvRCx1QkFBOEIsTUFBa0I7SUFDOUMsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLEtBQUssSUFBSSxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFMRCxzQ0FLQztBQUVELHVCQUE4QixLQUFZLEVBQUUsT0FBc0I7SUFDaEUsSUFBTSxXQUFXLEdBQUcsT0FBTyxLQUFLLEtBQUssR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzNELElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUMzRCxJQUFNLGVBQWUsR0FBRyxPQUFPLEtBQUssS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDdEQsSUFBTSxLQUFLLEdBQUcsT0FBTyxLQUFLLEtBQUssR0FBRyxPQUFPLEdBQUcsUUFBUSxDQUFDO0lBQ3JELElBQU0sVUFBVSxHQUFHLE9BQU8sS0FBSyxLQUFLLEdBQUcsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUU5RCxNQUFNLENBQUM7UUFDTCxJQUFJLEVBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBSSxPQUFPLFdBQVEsQ0FBQztRQUN4QyxJQUFJLEVBQUssT0FBTyxXQUFRO1FBQ3hCLElBQUksRUFBRSxPQUFPO1FBQ2IsS0FBSyxFQUFFLENBQUM7Z0JBQ04sSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFLLE9BQU8sZ0JBQWE7Z0JBQzdCLE1BQU0sRUFBRTtvQkFDTixNQUFNLGdDQUVILGVBQWUsSUFBRyxFQUFDLE1BQU0sRUFBRSxXQUFTLFdBQWEsRUFBQyxFQUNuRCxRQUFLLEdBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLEVBQ3JCLE9BQUksR0FBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsRUFDcEIsT0FBSSxHQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxFQUN0QixhQUFVLEdBQUUsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLE9BQ3hCLENBQUMsVUFBVSxLQUFLLFVBQVUsR0FBRyxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUM1RDtpQkFDRjthQUNGLENBQUM7S0FDSCxDQUFDOztBQUNKLENBQUM7QUEzQkQsc0NBMkJDO0FBRUQsd0JBQStCLEtBQVksRUFBRSxPQUFzQixFQUFFLFVBQXNCLEVBQUUsWUFBbUMsRUFBRSxNQUF1QjtJQUN2SixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDM0MsS0FBSyxHQUFHO2dCQUNOLElBQUksRUFBRSxZQUFZLENBQUMsUUFBUTtnQkFDM0IsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsTUFBTSxFQUFFLE9BQU8sS0FBSyxLQUFLLEdBQUcsTUFBTSxHQUFHLEtBQUs7Z0JBQzFDLE1BQU0sRUFBRTtvQkFDTixNQUFNLHFCQUNKLFVBQVUsRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsRUFDN0IsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBQyxFQUNqQixRQUFRLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFDLElBQ2pCLENBQUMsT0FBTyxLQUFLLEtBQUssR0FBRzt3QkFDdkIsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQzt3QkFDdkIsUUFBUSxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQztxQkFDNUIsR0FBRyxFQUFFLENBQUMsQ0FDUjtpQkFDRjthQUNGLENBQUM7UUFDSixDQUFDO1FBRUQsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUV6QixJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDeEMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBTSxXQUFXLEdBQUcsT0FBTyxLQUFLLEtBQUssR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDO1lBRTNELE1BQU0sb0JBQ0osSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUksT0FBTyxTQUFJLFVBQVksQ0FBQyxFQUMvQyxJQUFJLEVBQUUsT0FBTyxFQUNiLElBQUksRUFBSyxPQUFPLFNBQUksVUFBWSxJQUM3QixDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsRUFBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBQyxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQ3JFLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxPQUFBLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFDekIsTUFBTSxFQUFFO29CQUNOLE1BQU07d0JBQ0osR0FBQyxXQUFXLElBQUcsTUFBTSxDQUFDLFVBQVU7MkJBQ2pDO2lCQUNGLElBQ0UsQ0FBQyxPQUFPLEdBQUcsRUFBQyxJQUFJLE1BQUEsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUMxQjtRQUNKLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQzs7QUFDZCxDQUFDO0FBNUNELHdDQTRDQyJ9