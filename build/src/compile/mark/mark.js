import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { MAIN } from '../../data';
import { isAggregate } from '../../encoding';
import { getFieldDef, isFieldDef, isValueDef, vgField } from '../../fielddef';
import { AREA, isPathMark, LINE, TRAIL } from '../../mark';
import { isSortField } from '../../sort';
import { contains, keys } from '../../util';
import { getStyles, sortParams } from '../common';
import { area } from './area';
import { bar } from './bar';
import { geoshape } from './geoshape';
import { line, trail } from './line';
import { circle, point, square } from './point';
import { rect } from './rect';
import { rule } from './rule';
import { text } from './text';
import { tick } from './tick';
var markCompiler = {
    area: area,
    bar: bar,
    circle: circle,
    geoshape: geoshape,
    line: line,
    point: point,
    rect: rect,
    rule: rule,
    square: square,
    text: text,
    tick: tick,
    trail: trail
};
export function parseMarkGroup(model) {
    if (contains([LINE, AREA, TRAIL], model.mark)) {
        return parsePathMark(model);
    }
    else {
        return getMarkGroups(model);
    }
}
var FACETED_PATH_PREFIX = 'faceted_path_';
function parsePathMark(model) {
    var details = pathGroupingFields(model.mark, model.encoding);
    var pathMarks = getMarkGroups(model, {
        // If has subfacet for line/area group, need to use faceted data from below.
        fromPrefix: (details.length > 0 ? FACETED_PATH_PREFIX : '')
    });
    if (details.length > 0) { // have level of details - need to facet line into subgroups
        // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)
        return [{
                name: model.getName('pathgroup'),
                type: 'group',
                from: {
                    facet: {
                        name: FACETED_PATH_PREFIX + model.requestDataName(MAIN),
                        data: model.requestDataName(MAIN),
                        groupby: details,
                    }
                },
                encode: {
                    update: {
                        width: { field: { group: 'width' } },
                        height: { field: { group: 'height' } }
                    }
                },
                marks: pathMarks
            }];
    }
    else {
        return pathMarks;
    }
}
export function getSort(model) {
    var encoding = model.encoding, stack = model.stack, mark = model.mark, markDef = model.markDef;
    var order = encoding.order;
    if (!isArray(order) && isValueDef(order)) {
        return undefined;
    }
    else if ((isArray(order) || isFieldDef(order)) && !stack) {
        // Sort by the order field if it is specified and the field is not stacked. (For stacked field, order specify stack order.)
        return sortParams(order, { expr: 'datum' });
    }
    else if (isPathMark(mark)) {
        // For both line and area, we sort values based on dimension by default
        var dimensionChannelDef = encoding[markDef.orient === 'horizontal' ? 'y' : 'x'];
        if (isFieldDef(dimensionChannelDef)) {
            var s = dimensionChannelDef.sort;
            var sortField = isSortField(s) ?
                vgField({
                    // FIXME: this op might not already exist?
                    // FIXME: what if dimensionChannel (x or y) contains custom domain?
                    aggregate: isAggregate(model.encoding) ? s.op : undefined,
                    field: s.field
                }, { expr: 'datum' }) :
                vgField(dimensionChannelDef, {
                    // For stack with imputation, we only have bin_mid
                    binSuffix: model.stack && model.stack.impute ? 'mid' : undefined,
                    expr: 'datum'
                });
            return {
                field: sortField,
                order: 'descending'
            };
        }
        return undefined;
    }
    return undefined;
}
function getMarkGroups(model, opt) {
    if (opt === void 0) { opt = { fromPrefix: '' }; }
    var mark = model.mark;
    var clip = model.markDef.clip !== undefined ?
        !!model.markDef.clip : scaleClip(model);
    var style = getStyles(model.markDef);
    var key = model.encoding.key;
    var sort = getSort(model);
    var postEncodingTransform = markCompiler[mark].postEncodingTransform ? markCompiler[mark].postEncodingTransform(model) : null;
    return [tslib_1.__assign({ name: model.getName('marks'), type: markCompiler[mark].vgMark }, (clip ? { clip: true } : {}), (style ? { style: style } : {}), (key ? { key: { field: key.field } } : {}), (sort ? { sort: sort } : {}), { from: { data: opt.fromPrefix + model.requestDataName(MAIN) }, encode: {
                update: markCompiler[mark].encodeEntry(model)
            } }, (postEncodingTransform ? {
            transform: postEncodingTransform
        } : {}))];
}
/**
 * Returns list of path grouping fields
 * that the model's spec contains.
 */
export function pathGroupingFields(mark, encoding) {
    return keys(encoding).reduce(function (details, channel) {
        switch (channel) {
            // x, y, x2, y2, lat, long, lat1, long2, order, tooltip, href, cursor should not cause lines to group
            case 'x':
            case 'y':
            case 'order':
            case 'tooltip':
            case 'href':
            case 'x2':
            case 'y2':
            case 'latitude':
            case 'longitude':
            case 'latitude2':
            case 'longitude2':
            // TODO: case 'cursor':
            // text, shape, shouldn't be a part of line/trail/area
            case 'text':
            case 'shape':
                return details;
            case 'detail':
            case 'key':
                var channelDef = encoding[channel];
                if (channelDef) {
                    (isArray(channelDef) ? channelDef : [channelDef]).forEach(function (fieldDef) {
                        if (!fieldDef.aggregate) {
                            details.push(vgField(fieldDef, {}));
                        }
                    });
                }
                return details;
            case 'size':
                if (mark === 'trail') {
                    // For trail, size should not group trail lines.
                    return details;
                }
            // For line, it should group lines.
            /* tslint:disable */
            // intentional fall through
            case 'color':
            case 'fill':
            case 'stroke':
            case 'opacity':
                // TODO strokeDashOffset:
                /* tslint:enable */
                var fieldDef = getFieldDef(encoding[channel]);
                if (fieldDef && !fieldDef.aggregate) {
                    details.push(vgField(fieldDef, {}));
                }
                return details;
            default:
                throw new Error("Bug: Channel " + channel + " unimplemented for line mark");
        }
    }, []);
}
/**
 * If scales are bound to interval selections, we want to automatically clip
 * marks to account for panning/zooming interactions. We identify bound scales
 * by the domainRaw property, which gets added during scale parsing.
 */
function scaleClip(model) {
    var xScale = model.getScaleComponent('x');
    var yScale = model.getScaleComponent('y');
    return (xScale && xScale.get('domainRaw')) ||
        (yScale && yScale.get('domainRaw')) ? true : false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNsQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ2hDLE9BQU8sRUFBVyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUUsT0FBTyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFRLEtBQUssRUFBQyxNQUFNLFlBQVksQ0FBQztBQUMvRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQzFDLE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRWhELE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUUxQixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUM5QyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBRzVCLElBQU0sWUFBWSxHQUFnQztJQUNoRCxJQUFJLE1BQUE7SUFDSixHQUFHLEtBQUE7SUFDSCxNQUFNLFFBQUE7SUFDTixRQUFRLFVBQUE7SUFDUixJQUFJLE1BQUE7SUFDSixLQUFLLE9BQUE7SUFDTCxJQUFJLE1BQUE7SUFDSixJQUFJLE1BQUE7SUFDSixNQUFNLFFBQUE7SUFDTixJQUFJLE1BQUE7SUFDSixJQUFJLE1BQUE7SUFDSixLQUFLLE9BQUE7Q0FDTixDQUFDO0FBRUYsTUFBTSx5QkFBeUIsS0FBZ0I7SUFDN0MsSUFBSSxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM3QyxPQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM3QjtTQUFNO1FBQ0wsT0FBTyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0I7QUFDSCxDQUFDO0FBRUQsSUFBTSxtQkFBbUIsR0FBRyxlQUFlLENBQUM7QUFFNUMsdUJBQXVCLEtBQWdCO0lBQ3JDLElBQU0sT0FBTyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRS9ELElBQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxLQUFLLEVBQUU7UUFDckMsNEVBQTRFO1FBQzVFLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQzVELENBQUMsQ0FBQztJQUVILElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsRUFBRSw0REFBNEQ7UUFDcEYsNkZBQTZGO1FBRTdGLE9BQU8sQ0FBQztnQkFDTixJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7Z0JBQ2hDLElBQUksRUFBRSxPQUFPO2dCQUNiLElBQUksRUFBRTtvQkFDSixLQUFLLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO3dCQUN2RCxJQUFJLEVBQUUsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7d0JBQ2pDLE9BQU8sRUFBRSxPQUFPO3FCQUNqQjtpQkFDRjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sTUFBTSxFQUFFO3dCQUNOLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBQzt3QkFDaEMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxFQUFDO3FCQUNuQztpQkFDRjtnQkFDRCxLQUFLLEVBQUUsU0FBUzthQUNqQixDQUFDLENBQUM7S0FDSjtTQUFNO1FBQ0wsT0FBTyxTQUFTLENBQUM7S0FDbEI7QUFDSCxDQUFDO0FBRUQsTUFBTSxrQkFBa0IsS0FBZ0I7SUFDL0IsSUFBQSx5QkFBUSxFQUFFLG1CQUFLLEVBQUUsaUJBQUksRUFBRSx1QkFBTyxDQUFVO0lBQy9DLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEMsT0FBTyxTQUFTLENBQUM7S0FDbEI7U0FBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQzFELDJIQUEySDtRQUMzSCxPQUFPLFVBQVUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztLQUMzQztTQUFNLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzNCLHVFQUF1RTtRQUN2RSxJQUFNLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRixJQUFJLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO1lBQ25DLElBQU0sQ0FBQyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQztZQUNuQyxJQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsT0FBTyxDQUFDO29CQUNOLDBDQUEwQztvQkFDMUMsbUVBQW1FO29CQUNuRSxTQUFTLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztvQkFDekQsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLO2lCQUNmLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixPQUFPLENBQUMsbUJBQW1CLEVBQUU7b0JBQzNCLGtEQUFrRDtvQkFDbEQsU0FBUyxFQUFFLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUztvQkFDaEUsSUFBSSxFQUFFLE9BQU87aUJBQ2QsQ0FBQyxDQUFDO1lBRUwsT0FBTztnQkFDTCxLQUFLLEVBQUUsU0FBUztnQkFDaEIsS0FBSyxFQUFFLFlBQVk7YUFDcEIsQ0FBQztTQUNIO1FBQ0QsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFDRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBRUQsdUJBQXVCLEtBQWdCLEVBQUUsR0FFckI7SUFGcUIsb0JBQUEsRUFBQSxRQUVwQyxVQUFVLEVBQUUsRUFBRSxFQUFDO0lBQ2xCLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFFeEIsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUMsSUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QyxJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztJQUMvQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFNUIsSUFBTSxxQkFBcUIsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBRWhJLE9BQU8sb0JBQ0wsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQzVCLElBQUksRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUM1QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUMxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDdEIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUMsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDdEMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxNQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQ3ZCLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxHQUFHLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUMsRUFDMUQsTUFBTSxFQUFFO2dCQUNOLE1BQU0sRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQzthQUM5QyxJQUNFLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1lBQzFCLFNBQVMsRUFBRSxxQkFBcUI7U0FDakMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ1AsQ0FBQztBQUVMLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLDZCQUE2QixJQUFVLEVBQUUsUUFBMEI7SUFDdkUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBTyxFQUFFLE9BQU87UUFDNUMsUUFBUSxPQUFPLEVBQUU7WUFDZixxR0FBcUc7WUFDckcsS0FBSyxHQUFHLENBQUM7WUFDVCxLQUFLLEdBQUcsQ0FBQztZQUNULEtBQUssT0FBTyxDQUFDO1lBQ2IsS0FBSyxTQUFTLENBQUM7WUFDZixLQUFLLE1BQU0sQ0FBQztZQUNaLEtBQUssSUFBSSxDQUFDO1lBQ1YsS0FBSyxJQUFJLENBQUM7WUFFVixLQUFLLFVBQVUsQ0FBQztZQUNoQixLQUFLLFdBQVcsQ0FBQztZQUNqQixLQUFLLFdBQVcsQ0FBQztZQUNqQixLQUFLLFlBQVksQ0FBQztZQUNsQix1QkFBdUI7WUFFdkIsc0RBQXNEO1lBQ3RELEtBQUssTUFBTSxDQUFDO1lBQ1osS0FBSyxPQUFPO2dCQUNWLE9BQU8sT0FBTyxDQUFDO1lBRWpCLEtBQUssUUFBUSxDQUFDO1lBQ2QsS0FBSyxLQUFLO2dCQUNSLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDckMsSUFBSSxVQUFVLEVBQUU7b0JBQ2QsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7d0JBQ2pFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFOzRCQUN2QixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDckM7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7aUJBQ0o7Z0JBQ0QsT0FBTyxPQUFPLENBQUM7WUFFakIsS0FBSyxNQUFNO2dCQUNULElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRTtvQkFDcEIsZ0RBQWdEO29CQUNoRCxPQUFPLE9BQU8sQ0FBQztpQkFDaEI7WUFDRCxtQ0FBbUM7WUFFckMsb0JBQW9CO1lBQ3BCLDJCQUEyQjtZQUUzQixLQUFLLE9BQU8sQ0FBQztZQUNiLEtBQUssTUFBTSxDQUFDO1lBQ1osS0FBSyxRQUFRLENBQUM7WUFDZCxLQUFLLFNBQVM7Z0JBQ2QseUJBQXlCO2dCQUV6QixtQkFBbUI7Z0JBQ2pCLElBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBUyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFO29CQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDckM7Z0JBQ0QsT0FBTyxPQUFPLENBQUM7WUFDakI7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBZ0IsT0FBTyxpQ0FBOEIsQ0FBQyxDQUFDO1NBQzFFO0lBQ0gsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxtQkFBbUIsS0FBZ0I7SUFDakMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QyxPQUFPLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN2RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0FycmF5fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtNQUlOfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7RW5jb2RpbmcsIGlzQWdncmVnYXRlfSBmcm9tICcuLi8uLi9lbmNvZGluZyc7XG5pbXBvcnQge2dldEZpZWxkRGVmLCBpc0ZpZWxkRGVmLCBpc1ZhbHVlRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge0FSRUEsIGlzUGF0aE1hcmssIExJTkUsIE1hcmssIFRSQUlMfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7aXNTb3J0RmllbGR9IGZyb20gJy4uLy4uL3NvcnQnO1xuaW1wb3J0IHtjb250YWlucywga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2dldFN0eWxlcywgc29ydFBhcmFtc30gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7YXJlYX0gZnJvbSAnLi9hcmVhJztcbmltcG9ydCB7YmFyfSBmcm9tICcuL2Jhcic7XG5pbXBvcnQge01hcmtDb21waWxlcn0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7Z2Vvc2hhcGV9IGZyb20gJy4vZ2Vvc2hhcGUnO1xuaW1wb3J0IHtsaW5lLCB0cmFpbH0gZnJvbSAnLi9saW5lJztcbmltcG9ydCB7Y2lyY2xlLCBwb2ludCwgc3F1YXJlfSBmcm9tICcuL3BvaW50JztcbmltcG9ydCB7cmVjdH0gZnJvbSAnLi9yZWN0JztcbmltcG9ydCB7cnVsZX0gZnJvbSAnLi9ydWxlJztcbmltcG9ydCB7dGV4dH0gZnJvbSAnLi90ZXh0JztcbmltcG9ydCB7dGlja30gZnJvbSAnLi90aWNrJztcblxuXG5jb25zdCBtYXJrQ29tcGlsZXI6IHtbbSBpbiBNYXJrXTogTWFya0NvbXBpbGVyfSA9IHtcbiAgYXJlYSxcbiAgYmFyLFxuICBjaXJjbGUsXG4gIGdlb3NoYXBlLFxuICBsaW5lLFxuICBwb2ludCxcbiAgcmVjdCxcbiAgcnVsZSxcbiAgc3F1YXJlLFxuICB0ZXh0LFxuICB0aWNrLFxuICB0cmFpbFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTWFya0dyb3VwKG1vZGVsOiBVbml0TW9kZWwpOiBhbnlbXSB7XG4gIGlmIChjb250YWlucyhbTElORSwgQVJFQSwgVFJBSUxdLCBtb2RlbC5tYXJrKSkge1xuICAgIHJldHVybiBwYXJzZVBhdGhNYXJrKG1vZGVsKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZ2V0TWFya0dyb3Vwcyhtb2RlbCk7XG4gIH1cbn1cblxuY29uc3QgRkFDRVRFRF9QQVRIX1BSRUZJWCA9ICdmYWNldGVkX3BhdGhfJztcblxuZnVuY3Rpb24gcGFyc2VQYXRoTWFyayhtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IGRldGFpbHMgPSBwYXRoR3JvdXBpbmdGaWVsZHMobW9kZWwubWFyaywgbW9kZWwuZW5jb2RpbmcpO1xuXG4gIGNvbnN0IHBhdGhNYXJrcyA9IGdldE1hcmtHcm91cHMobW9kZWwsIHtcbiAgICAvLyBJZiBoYXMgc3ViZmFjZXQgZm9yIGxpbmUvYXJlYSBncm91cCwgbmVlZCB0byB1c2UgZmFjZXRlZCBkYXRhIGZyb20gYmVsb3cuXG4gICAgZnJvbVByZWZpeDogKGRldGFpbHMubGVuZ3RoID4gMCA/IEZBQ0VURURfUEFUSF9QUkVGSVggOiAnJylcbiAgfSk7XG5cbiAgaWYgKGRldGFpbHMubGVuZ3RoID4gMCkgeyAvLyBoYXZlIGxldmVsIG9mIGRldGFpbHMgLSBuZWVkIHRvIGZhY2V0IGxpbmUgaW50byBzdWJncm91cHNcbiAgICAvLyBUT0RPOiBmb3Igbm9uLXN0YWNrZWQgcGxvdCwgbWFwIG9yZGVyIHRvIHppbmRleC4gKE1heWJlIHJlbmFtZSBvcmRlciBmb3IgbGF5ZXIgdG8gemluZGV4PylcblxuICAgIHJldHVybiBbe1xuICAgICAgbmFtZTogbW9kZWwuZ2V0TmFtZSgncGF0aGdyb3VwJyksXG4gICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgZnJvbToge1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIG5hbWU6IEZBQ0VURURfUEFUSF9QUkVGSVggKyBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTiksXG4gICAgICAgICAgZGF0YTogbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pLFxuICAgICAgICAgIGdyb3VwYnk6IGRldGFpbHMsXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBlbmNvZGU6IHtcbiAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgd2lkdGg6IHtmaWVsZDoge2dyb3VwOiAnd2lkdGgnfX0sXG4gICAgICAgICAgaGVpZ2h0OiB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbWFya3M6IHBhdGhNYXJrc1xuICAgIH1dO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwYXRoTWFya3M7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNvcnQobW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCB7ZW5jb2RpbmcsIHN0YWNrLCBtYXJrLCBtYXJrRGVmfSA9IG1vZGVsO1xuICBjb25zdCBvcmRlciA9IGVuY29kaW5nLm9yZGVyO1xuICBpZiAoIWlzQXJyYXkob3JkZXIpICYmIGlzVmFsdWVEZWYob3JkZXIpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmICgoaXNBcnJheShvcmRlcikgfHwgaXNGaWVsZERlZihvcmRlcikpICYmICFzdGFjaykge1xuICAgIC8vIFNvcnQgYnkgdGhlIG9yZGVyIGZpZWxkIGlmIGl0IGlzIHNwZWNpZmllZCBhbmQgdGhlIGZpZWxkIGlzIG5vdCBzdGFja2VkLiAoRm9yIHN0YWNrZWQgZmllbGQsIG9yZGVyIHNwZWNpZnkgc3RhY2sgb3JkZXIuKVxuICAgIHJldHVybiBzb3J0UGFyYW1zKG9yZGVyLCB7ZXhwcjogJ2RhdHVtJ30pO1xuICB9IGVsc2UgaWYgKGlzUGF0aE1hcmsobWFyaykpIHtcbiAgICAvLyBGb3IgYm90aCBsaW5lIGFuZCBhcmVhLCB3ZSBzb3J0IHZhbHVlcyBiYXNlZCBvbiBkaW1lbnNpb24gYnkgZGVmYXVsdFxuICAgIGNvbnN0IGRpbWVuc2lvbkNoYW5uZWxEZWYgPSBlbmNvZGluZ1ttYXJrRGVmLm9yaWVudCA9PT0gJ2hvcml6b250YWwnID8gJ3knIDogJ3gnXTtcbiAgICBpZiAoaXNGaWVsZERlZihkaW1lbnNpb25DaGFubmVsRGVmKSkge1xuICAgICAgY29uc3QgcyA9IGRpbWVuc2lvbkNoYW5uZWxEZWYuc29ydDtcbiAgICAgIGNvbnN0IHNvcnRGaWVsZCA9IGlzU29ydEZpZWxkKHMpID9cbiAgICAgICAgdmdGaWVsZCh7XG4gICAgICAgICAgLy8gRklYTUU6IHRoaXMgb3AgbWlnaHQgbm90IGFscmVhZHkgZXhpc3Q/XG4gICAgICAgICAgLy8gRklYTUU6IHdoYXQgaWYgZGltZW5zaW9uQ2hhbm5lbCAoeCBvciB5KSBjb250YWlucyBjdXN0b20gZG9tYWluP1xuICAgICAgICAgIGFnZ3JlZ2F0ZTogaXNBZ2dyZWdhdGUobW9kZWwuZW5jb2RpbmcpID8gcy5vcCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBmaWVsZDogcy5maWVsZFxuICAgICAgICB9LCB7ZXhwcjogJ2RhdHVtJ30pIDpcbiAgICAgICAgdmdGaWVsZChkaW1lbnNpb25DaGFubmVsRGVmLCB7XG4gICAgICAgICAgLy8gRm9yIHN0YWNrIHdpdGggaW1wdXRhdGlvbiwgd2Ugb25seSBoYXZlIGJpbl9taWRcbiAgICAgICAgICBiaW5TdWZmaXg6IG1vZGVsLnN0YWNrICYmIG1vZGVsLnN0YWNrLmltcHV0ZSA/ICdtaWQnIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGV4cHI6ICdkYXR1bSdcbiAgICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZpZWxkOiBzb3J0RmllbGQsXG4gICAgICAgIG9yZGVyOiAnZGVzY2VuZGluZydcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZ2V0TWFya0dyb3Vwcyhtb2RlbDogVW5pdE1vZGVsLCBvcHQ6IHtcbiAgZnJvbVByZWZpeDogc3RyaW5nXG59ID0ge2Zyb21QcmVmaXg6ICcnfSkge1xuICBjb25zdCBtYXJrID0gbW9kZWwubWFyaztcblxuICBjb25zdCBjbGlwID0gbW9kZWwubWFya0RlZi5jbGlwICE9PSB1bmRlZmluZWQgP1xuICAgICEhbW9kZWwubWFya0RlZi5jbGlwIDogc2NhbGVDbGlwKG1vZGVsKTtcbiAgY29uc3Qgc3R5bGUgPSBnZXRTdHlsZXMobW9kZWwubWFya0RlZik7XG4gIGNvbnN0IGtleSA9IG1vZGVsLmVuY29kaW5nLmtleTtcbiAgY29uc3Qgc29ydCA9IGdldFNvcnQobW9kZWwpO1xuXG4gIGNvbnN0IHBvc3RFbmNvZGluZ1RyYW5zZm9ybSA9IG1hcmtDb21waWxlclttYXJrXS5wb3N0RW5jb2RpbmdUcmFuc2Zvcm0gPyBtYXJrQ29tcGlsZXJbbWFya10ucG9zdEVuY29kaW5nVHJhbnNmb3JtKG1vZGVsKSA6IG51bGw7XG5cbiAgcmV0dXJuIFt7XG4gICAgbmFtZTogbW9kZWwuZ2V0TmFtZSgnbWFya3MnKSxcbiAgICB0eXBlOiBtYXJrQ29tcGlsZXJbbWFya10udmdNYXJrLFxuICAgIC4uLihjbGlwID8ge2NsaXA6IHRydWV9IDoge30pLFxuICAgIC4uLihzdHlsZSA/IHtzdHlsZX0gOiB7fSksXG4gICAgLi4uKGtleSA/IHtrZXk6IHtmaWVsZDoga2V5LmZpZWxkfX0gOiB7fSksXG4gICAgLi4uKHNvcnQgPyB7c29ydH0gOiB7fSksXG4gICAgZnJvbToge2RhdGE6IG9wdC5mcm9tUHJlZml4ICsgbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pfSxcbiAgICBlbmNvZGU6IHtcbiAgICAgIHVwZGF0ZTogbWFya0NvbXBpbGVyW21hcmtdLmVuY29kZUVudHJ5KG1vZGVsKVxuICAgIH0sXG4gICAgLi4uKHBvc3RFbmNvZGluZ1RyYW5zZm9ybSA/IHtcbiAgICAgIHRyYW5zZm9ybTogcG9zdEVuY29kaW5nVHJhbnNmb3JtXG4gICAgfSA6IHt9KVxuICB9XTtcblxufVxuXG4vKipcbiAqIFJldHVybnMgbGlzdCBvZiBwYXRoIGdyb3VwaW5nIGZpZWxkc1xuICogdGhhdCB0aGUgbW9kZWwncyBzcGVjIGNvbnRhaW5zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGF0aEdyb3VwaW5nRmllbGRzKG1hcms6IE1hcmssIGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+KTogc3RyaW5nW10ge1xuICByZXR1cm4ga2V5cyhlbmNvZGluZykucmVkdWNlKChkZXRhaWxzLCBjaGFubmVsKSA9PiB7XG4gICAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgICAvLyB4LCB5LCB4MiwgeTIsIGxhdCwgbG9uZywgbGF0MSwgbG9uZzIsIG9yZGVyLCB0b29sdGlwLCBocmVmLCBjdXJzb3Igc2hvdWxkIG5vdCBjYXVzZSBsaW5lcyB0byBncm91cFxuICAgICAgY2FzZSAneCc6XG4gICAgICBjYXNlICd5JzpcbiAgICAgIGNhc2UgJ29yZGVyJzpcbiAgICAgIGNhc2UgJ3Rvb2x0aXAnOlxuICAgICAgY2FzZSAnaHJlZic6XG4gICAgICBjYXNlICd4Mic6XG4gICAgICBjYXNlICd5Mic6XG5cbiAgICAgIGNhc2UgJ2xhdGl0dWRlJzpcbiAgICAgIGNhc2UgJ2xvbmdpdHVkZSc6XG4gICAgICBjYXNlICdsYXRpdHVkZTInOlxuICAgICAgY2FzZSAnbG9uZ2l0dWRlMic6XG4gICAgICAvLyBUT0RPOiBjYXNlICdjdXJzb3InOlxuXG4gICAgICAvLyB0ZXh0LCBzaGFwZSwgc2hvdWxkbid0IGJlIGEgcGFydCBvZiBsaW5lL3RyYWlsL2FyZWFcbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgY2FzZSAnc2hhcGUnOlxuICAgICAgICByZXR1cm4gZGV0YWlscztcblxuICAgICAgY2FzZSAnZGV0YWlsJzpcbiAgICAgIGNhc2UgJ2tleSc6XG4gICAgICAgIGNvbnN0IGNoYW5uZWxEZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcbiAgICAgICAgaWYgKGNoYW5uZWxEZWYpIHtcbiAgICAgICAgICAoaXNBcnJheShjaGFubmVsRGVmKSA/IGNoYW5uZWxEZWYgOiBbY2hhbm5lbERlZl0pLmZvckVhY2goKGZpZWxkRGVmKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICAgICAgICBkZXRhaWxzLnB1c2godmdGaWVsZChmaWVsZERlZiwge30pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGV0YWlscztcblxuICAgICAgY2FzZSAnc2l6ZSc6XG4gICAgICAgIGlmIChtYXJrID09PSAndHJhaWwnKSB7XG4gICAgICAgICAgLy8gRm9yIHRyYWlsLCBzaXplIHNob3VsZCBub3QgZ3JvdXAgdHJhaWwgbGluZXMuXG4gICAgICAgICAgcmV0dXJuIGRldGFpbHM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRm9yIGxpbmUsIGl0IHNob3VsZCBncm91cCBsaW5lcy5cblxuICAgICAgLyogdHNsaW50OmRpc2FibGUgKi9cbiAgICAgIC8vIGludGVudGlvbmFsIGZhbGwgdGhyb3VnaFxuXG4gICAgICBjYXNlICdjb2xvcic6XG4gICAgICBjYXNlICdmaWxsJzpcbiAgICAgIGNhc2UgJ3N0cm9rZSc6XG4gICAgICBjYXNlICdvcGFjaXR5JzpcbiAgICAgIC8vIFRPRE8gc3Ryb2tlRGFzaE9mZnNldDpcblxuICAgICAgLyogdHNsaW50OmVuYWJsZSAqL1xuICAgICAgICBjb25zdCBmaWVsZERlZiA9IGdldEZpZWxkRGVmPHN0cmluZz4oZW5jb2RpbmdbY2hhbm5lbF0pO1xuICAgICAgICBpZiAoZmllbGREZWYgJiYgIWZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICAgIGRldGFpbHMucHVzaCh2Z0ZpZWxkKGZpZWxkRGVmLCB7fSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXRhaWxzO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBCdWc6IENoYW5uZWwgJHtjaGFubmVsfSB1bmltcGxlbWVudGVkIGZvciBsaW5lIG1hcmtgKTtcbiAgICB9XG4gIH0sIFtdKTtcbn1cblxuLyoqXG4gKiBJZiBzY2FsZXMgYXJlIGJvdW5kIHRvIGludGVydmFsIHNlbGVjdGlvbnMsIHdlIHdhbnQgdG8gYXV0b21hdGljYWxseSBjbGlwXG4gKiBtYXJrcyB0byBhY2NvdW50IGZvciBwYW5uaW5nL3pvb21pbmcgaW50ZXJhY3Rpb25zLiBXZSBpZGVudGlmeSBib3VuZCBzY2FsZXNcbiAqIGJ5IHRoZSBkb21haW5SYXcgcHJvcGVydHksIHdoaWNoIGdldHMgYWRkZWQgZHVyaW5nIHNjYWxlIHBhcnNpbmcuXG4gKi9cbmZ1bmN0aW9uIHNjYWxlQ2xpcChtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHhTY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4Jyk7XG4gIGNvbnN0IHlTY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd5Jyk7XG4gIHJldHVybiAoeFNjYWxlICYmIHhTY2FsZS5nZXQoJ2RvbWFpblJhdycpKSB8fFxuICAgICh5U2NhbGUgJiYgeVNjYWxlLmdldCgnZG9tYWluUmF3JykpID8gdHJ1ZSA6IGZhbHNlO1xufVxuIl19