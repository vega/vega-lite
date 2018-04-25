import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { MAIN } from '../../data';
import { isAggregate } from '../../encoding';
import { getFieldDef, vgField } from '../../fielddef';
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
    if (model.channelHasField('order') && !model.stack) {
        // Sort by the order field if it is specified and the field is not stacked. (For stacked field, order specify stack order.)
        return sortParams(model.encoding.order, { expr: 'datum' });
    }
    else if (isPathMark(model.mark)) {
        // For both line and area, we sort values based on dimension by default
        var dimensionChannel = model.markDef.orient === 'horizontal' ? 'y' : 'x';
        var s = model.sort(dimensionChannel);
        var sortField = isSortField(s) ?
            vgField({
                // FIXME: this op might not already exist?
                // FIXME: what if dimensionChannel (x or y) contains custom domain?
                aggregate: isAggregate(model.encoding) ? s.op : undefined,
                field: s.field
            }, { expr: 'datum' }) :
            model.vgField(dimensionChannel, {
                // For stack with imputation, we only have bin_mid
                binSuffix: model.stack && model.stack.impute ? 'mid' : undefined,
                expr: 'datum'
            });
        return sortField ?
            {
                field: sortField,
                order: 'descending'
            } :
            undefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNsQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ2hDLE9BQU8sRUFBVyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsV0FBVyxFQUFFLE9BQU8sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBUSxLQUFLLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0QsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN2QyxPQUFPLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUMxQyxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVoRCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxPQUFPLENBQUM7QUFFMUIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNwQyxPQUFPLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUNuQyxPQUFPLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDOUMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUc1QixJQUFNLFlBQVksR0FBZ0M7SUFDaEQsSUFBSSxNQUFBO0lBQ0osR0FBRyxLQUFBO0lBQ0gsTUFBTSxRQUFBO0lBQ04sUUFBUSxVQUFBO0lBQ1IsSUFBSSxNQUFBO0lBQ0osS0FBSyxPQUFBO0lBQ0wsSUFBSSxNQUFBO0lBQ0osSUFBSSxNQUFBO0lBQ0osTUFBTSxRQUFBO0lBQ04sSUFBSSxNQUFBO0lBQ0osSUFBSSxNQUFBO0lBQ0osS0FBSyxPQUFBO0NBQ04sQ0FBQztBQUVGLE1BQU0seUJBQXlCLEtBQWdCO0lBQzdDLElBQUksUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDN0MsT0FBTyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0I7U0FBTTtRQUNMLE9BQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzdCO0FBQ0gsQ0FBQztBQUVELElBQU0sbUJBQW1CLEdBQUcsZUFBZSxDQUFDO0FBRTVDLHVCQUF1QixLQUFnQjtJQUNyQyxJQUFNLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUUvRCxJQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFO1FBQ3JDLDRFQUE0RTtRQUM1RSxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztLQUM1RCxDQUFDLENBQUM7SUFFSCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUUsNERBQTREO1FBQ3BGLDZGQUE2RjtRQUU3RixPQUFPLENBQUM7Z0JBQ04sSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO2dCQUNoQyxJQUFJLEVBQUUsT0FBTztnQkFDYixJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFO3dCQUNMLElBQUksRUFBRSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQzt3QkFDdkQsSUFBSSxFQUFFLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO3dCQUNqQyxPQUFPLEVBQUUsT0FBTztxQkFDakI7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLE1BQU0sRUFBRTt3QkFDTixLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLEVBQUM7d0JBQ2hDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsRUFBQztxQkFDbkM7aUJBQ0Y7Z0JBQ0QsS0FBSyxFQUFFLFNBQVM7YUFDakIsQ0FBQyxDQUFDO0tBQ0o7U0FBTTtRQUNMLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0FBQ0gsQ0FBQztBQUVELE1BQU0sa0JBQWtCLEtBQWdCO0lBQ3RDLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7UUFDbEQsMkhBQTJIO1FBQzNILE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7S0FDMUQ7U0FBTSxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDakMsdUVBQXVFO1FBQ3ZFLElBQU0sZ0JBQWdCLEdBQWMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUN0RixJQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdkMsSUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsT0FBTyxDQUFDO2dCQUNOLDBDQUEwQztnQkFDMUMsbUVBQW1FO2dCQUNuRSxTQUFTLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDekQsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLO2FBQ2YsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDOUIsa0RBQWtEO2dCQUNsRCxTQUFTLEVBQUUsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUNoRSxJQUFJLEVBQUUsT0FBTzthQUNkLENBQUMsQ0FBQztRQUVMLE9BQU8sU0FBUyxDQUFDLENBQUM7WUFDaEI7Z0JBQ0UsS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLEtBQUssRUFBRSxZQUFZO2FBQ3BCLENBQUMsQ0FBQztZQUNILFNBQVMsQ0FBQztLQUNiO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUVELHVCQUF1QixLQUFnQixFQUFFLEdBRXJCO0lBRnFCLG9CQUFBLEVBQUEsUUFFcEMsVUFBVSxFQUFFLEVBQUUsRUFBQztJQUNsQixJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBRXhCLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFDLElBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7SUFDL0IsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTVCLElBQU0scUJBQXFCLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUVoSSxPQUFPLG9CQUNMLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUM1QixJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFDNUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDMUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsS0FBSyxPQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ3RCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ3RDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksTUFBQSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUN2QixJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFDLEVBQzFELE1BQU0sRUFBRTtnQkFDTixNQUFNLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7YUFDOUMsSUFDRSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztZQUMxQixTQUFTLEVBQUUscUJBQXFCO1NBQ2pDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUNQLENBQUM7QUFFTCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSw2QkFBNkIsSUFBVSxFQUFFLFFBQTBCO0lBQ3ZFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLE9BQU8sRUFBRSxPQUFPO1FBQzVDLFFBQVEsT0FBTyxFQUFFO1lBQ2YscUdBQXFHO1lBQ3JHLEtBQUssR0FBRyxDQUFDO1lBQ1QsS0FBSyxHQUFHLENBQUM7WUFDVCxLQUFLLE9BQU8sQ0FBQztZQUNiLEtBQUssU0FBUyxDQUFDO1lBQ2YsS0FBSyxNQUFNLENBQUM7WUFDWixLQUFLLElBQUksQ0FBQztZQUNWLEtBQUssSUFBSSxDQUFDO1lBRVYsS0FBSyxVQUFVLENBQUM7WUFDaEIsS0FBSyxXQUFXLENBQUM7WUFDakIsS0FBSyxXQUFXLENBQUM7WUFDakIsS0FBSyxZQUFZLENBQUM7WUFDbEIsdUJBQXVCO1lBRXZCLHNEQUFzRDtZQUN0RCxLQUFLLE1BQU0sQ0FBQztZQUNaLEtBQUssT0FBTztnQkFDVixPQUFPLE9BQU8sQ0FBQztZQUVqQixLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssS0FBSztnQkFDUixJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3JDLElBQUksVUFBVSxFQUFFO29CQUNkLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRO3dCQUNqRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTs0QkFDdkIsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQ3JDO29CQUNILENBQUMsQ0FBQyxDQUFDO2lCQUNKO2dCQUNELE9BQU8sT0FBTyxDQUFDO1lBRWpCLEtBQUssTUFBTTtnQkFDVCxJQUFJLElBQUksS0FBSyxPQUFPLEVBQUU7b0JBQ3BCLGdEQUFnRDtvQkFDaEQsT0FBTyxPQUFPLENBQUM7aUJBQ2hCO1lBQ0QsbUNBQW1DO1lBRXJDLG9CQUFvQjtZQUNwQiwyQkFBMkI7WUFFM0IsS0FBSyxPQUFPLENBQUM7WUFDYixLQUFLLE1BQU0sQ0FBQztZQUNaLEtBQUssUUFBUSxDQUFDO1lBQ2QsS0FBSyxTQUFTO2dCQUNkLHlCQUF5QjtnQkFFekIsbUJBQW1CO2dCQUNqQixJQUFNLFFBQVEsR0FBRyxXQUFXLENBQVMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELElBQUksUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtvQkFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3JDO2dCQUNELE9BQU8sT0FBTyxDQUFDO1lBQ2pCO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWdCLE9BQU8saUNBQThCLENBQUMsQ0FBQztTQUMxRTtJQUNILENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNULENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsbUJBQW1CLEtBQWdCO0lBQ2pDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNBcnJheX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7TUFJTn0gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge0VuY29kaW5nLCBpc0FnZ3JlZ2F0ZX0gZnJvbSAnLi4vLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtnZXRGaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtBUkVBLCBpc1BhdGhNYXJrLCBMSU5FLCBNYXJrLCBUUkFJTH0gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge2lzU29ydEZpZWxkfSBmcm9tICcuLi8uLi9zb3J0JztcbmltcG9ydCB7Y29udGFpbnMsIGtleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtnZXRTdHlsZXMsIHNvcnRQYXJhbXN9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge2FyZWF9IGZyb20gJy4vYXJlYSc7XG5pbXBvcnQge2Jhcn0gZnJvbSAnLi9iYXInO1xuaW1wb3J0IHtNYXJrQ29tcGlsZXJ9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge2dlb3NoYXBlfSBmcm9tICcuL2dlb3NoYXBlJztcbmltcG9ydCB7bGluZSwgdHJhaWx9IGZyb20gJy4vbGluZSc7XG5pbXBvcnQge2NpcmNsZSwgcG9pbnQsIHNxdWFyZX0gZnJvbSAnLi9wb2ludCc7XG5pbXBvcnQge3JlY3R9IGZyb20gJy4vcmVjdCc7XG5pbXBvcnQge3J1bGV9IGZyb20gJy4vcnVsZSc7XG5pbXBvcnQge3RleHR9IGZyb20gJy4vdGV4dCc7XG5pbXBvcnQge3RpY2t9IGZyb20gJy4vdGljayc7XG5cblxuY29uc3QgbWFya0NvbXBpbGVyOiB7W20gaW4gTWFya106IE1hcmtDb21waWxlcn0gPSB7XG4gIGFyZWEsXG4gIGJhcixcbiAgY2lyY2xlLFxuICBnZW9zaGFwZSxcbiAgbGluZSxcbiAgcG9pbnQsXG4gIHJlY3QsXG4gIHJ1bGUsXG4gIHNxdWFyZSxcbiAgdGV4dCxcbiAgdGljayxcbiAgdHJhaWxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1hcmtHcm91cChtb2RlbDogVW5pdE1vZGVsKTogYW55W10ge1xuICBpZiAoY29udGFpbnMoW0xJTkUsIEFSRUEsIFRSQUlMXSwgbW9kZWwubWFyaykpIHtcbiAgICByZXR1cm4gcGFyc2VQYXRoTWFyayhtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGdldE1hcmtHcm91cHMobW9kZWwpO1xuICB9XG59XG5cbmNvbnN0IEZBQ0VURURfUEFUSF9QUkVGSVggPSAnZmFjZXRlZF9wYXRoXyc7XG5cbmZ1bmN0aW9uIHBhcnNlUGF0aE1hcmsobW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCBkZXRhaWxzID0gcGF0aEdyb3VwaW5nRmllbGRzKG1vZGVsLm1hcmssIG1vZGVsLmVuY29kaW5nKTtcblxuICBjb25zdCBwYXRoTWFya3MgPSBnZXRNYXJrR3JvdXBzKG1vZGVsLCB7XG4gICAgLy8gSWYgaGFzIHN1YmZhY2V0IGZvciBsaW5lL2FyZWEgZ3JvdXAsIG5lZWQgdG8gdXNlIGZhY2V0ZWQgZGF0YSBmcm9tIGJlbG93LlxuICAgIGZyb21QcmVmaXg6IChkZXRhaWxzLmxlbmd0aCA+IDAgPyBGQUNFVEVEX1BBVEhfUFJFRklYIDogJycpXG4gIH0pO1xuXG4gIGlmIChkZXRhaWxzLmxlbmd0aCA+IDApIHsgLy8gaGF2ZSBsZXZlbCBvZiBkZXRhaWxzIC0gbmVlZCB0byBmYWNldCBsaW5lIGludG8gc3ViZ3JvdXBzXG4gICAgLy8gVE9ETzogZm9yIG5vbi1zdGFja2VkIHBsb3QsIG1hcCBvcmRlciB0byB6aW5kZXguIChNYXliZSByZW5hbWUgb3JkZXIgZm9yIGxheWVyIHRvIHppbmRleD8pXG5cbiAgICByZXR1cm4gW3tcbiAgICAgIG5hbWU6IG1vZGVsLmdldE5hbWUoJ3BhdGhncm91cCcpLFxuICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgIGZyb206IHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBuYW1lOiBGQUNFVEVEX1BBVEhfUFJFRklYICsgbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pLFxuICAgICAgICAgIGRhdGE6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgICAgICBncm91cGJ5OiBkZXRhaWxzLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZW5jb2RlOiB7XG4gICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgIHdpZHRoOiB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ319LFxuICAgICAgICAgIGhlaWdodDoge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1hcmtzOiBwYXRoTWFya3NcbiAgICB9XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcGF0aE1hcmtzO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTb3J0KG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgaWYgKG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgnb3JkZXInKSAmJiAhbW9kZWwuc3RhY2spIHtcbiAgICAvLyBTb3J0IGJ5IHRoZSBvcmRlciBmaWVsZCBpZiBpdCBpcyBzcGVjaWZpZWQgYW5kIHRoZSBmaWVsZCBpcyBub3Qgc3RhY2tlZC4gKEZvciBzdGFja2VkIGZpZWxkLCBvcmRlciBzcGVjaWZ5IHN0YWNrIG9yZGVyLilcbiAgICByZXR1cm4gc29ydFBhcmFtcyhtb2RlbC5lbmNvZGluZy5vcmRlciwge2V4cHI6ICdkYXR1bSd9KTtcbiAgfSBlbHNlIGlmIChpc1BhdGhNYXJrKG1vZGVsLm1hcmspKSB7XG4gICAgLy8gRm9yIGJvdGggbGluZSBhbmQgYXJlYSwgd2Ugc29ydCB2YWx1ZXMgYmFzZWQgb24gZGltZW5zaW9uIGJ5IGRlZmF1bHRcbiAgICBjb25zdCBkaW1lbnNpb25DaGFubmVsOiAneCcgfCAneScgPSBtb2RlbC5tYXJrRGVmLm9yaWVudCA9PT0gJ2hvcml6b250YWwnID8gJ3knIDogJ3gnO1xuICAgIGNvbnN0IHMgPSBtb2RlbC5zb3J0KGRpbWVuc2lvbkNoYW5uZWwpO1xuICAgIGNvbnN0IHNvcnRGaWVsZCA9IGlzU29ydEZpZWxkKHMpID9cbiAgICAgIHZnRmllbGQoe1xuICAgICAgICAvLyBGSVhNRTogdGhpcyBvcCBtaWdodCBub3QgYWxyZWFkeSBleGlzdD9cbiAgICAgICAgLy8gRklYTUU6IHdoYXQgaWYgZGltZW5zaW9uQ2hhbm5lbCAoeCBvciB5KSBjb250YWlucyBjdXN0b20gZG9tYWluP1xuICAgICAgICBhZ2dyZWdhdGU6IGlzQWdncmVnYXRlKG1vZGVsLmVuY29kaW5nKSA/IHMub3AgOiB1bmRlZmluZWQsXG4gICAgICAgIGZpZWxkOiBzLmZpZWxkXG4gICAgICB9LCB7ZXhwcjogJ2RhdHVtJ30pIDpcbiAgICAgIG1vZGVsLnZnRmllbGQoZGltZW5zaW9uQ2hhbm5lbCwge1xuICAgICAgICAvLyBGb3Igc3RhY2sgd2l0aCBpbXB1dGF0aW9uLCB3ZSBvbmx5IGhhdmUgYmluX21pZFxuICAgICAgICBiaW5TdWZmaXg6IG1vZGVsLnN0YWNrICYmIG1vZGVsLnN0YWNrLmltcHV0ZSA/ICdtaWQnIDogdW5kZWZpbmVkLFxuICAgICAgICBleHByOiAnZGF0dW0nXG4gICAgICB9KTtcblxuICAgIHJldHVybiBzb3J0RmllbGQgP1xuICAgICAge1xuICAgICAgICBmaWVsZDogc29ydEZpZWxkLFxuICAgICAgICBvcmRlcjogJ2Rlc2NlbmRpbmcnXG4gICAgICB9IDpcbiAgICAgIHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBnZXRNYXJrR3JvdXBzKG1vZGVsOiBVbml0TW9kZWwsIG9wdDoge1xuICBmcm9tUHJlZml4OiBzdHJpbmdcbn0gPSB7ZnJvbVByZWZpeDogJyd9KSB7XG4gIGNvbnN0IG1hcmsgPSBtb2RlbC5tYXJrO1xuXG4gIGNvbnN0IGNsaXAgPSBtb2RlbC5tYXJrRGVmLmNsaXAgIT09IHVuZGVmaW5lZCA/XG4gICAgISFtb2RlbC5tYXJrRGVmLmNsaXAgOiBzY2FsZUNsaXAobW9kZWwpO1xuICBjb25zdCBzdHlsZSA9IGdldFN0eWxlcyhtb2RlbC5tYXJrRGVmKTtcbiAgY29uc3Qga2V5ID0gbW9kZWwuZW5jb2Rpbmcua2V5O1xuICBjb25zdCBzb3J0ID0gZ2V0U29ydChtb2RlbCk7XG5cbiAgY29uc3QgcG9zdEVuY29kaW5nVHJhbnNmb3JtID0gbWFya0NvbXBpbGVyW21hcmtdLnBvc3RFbmNvZGluZ1RyYW5zZm9ybSA/IG1hcmtDb21waWxlclttYXJrXS5wb3N0RW5jb2RpbmdUcmFuc2Zvcm0obW9kZWwpIDogbnVsbDtcblxuICByZXR1cm4gW3tcbiAgICBuYW1lOiBtb2RlbC5nZXROYW1lKCdtYXJrcycpLFxuICAgIHR5cGU6IG1hcmtDb21waWxlclttYXJrXS52Z01hcmssXG4gICAgLi4uKGNsaXAgPyB7Y2xpcDogdHJ1ZX0gOiB7fSksXG4gICAgLi4uKHN0eWxlID8ge3N0eWxlfSA6IHt9KSxcbiAgICAuLi4oa2V5ID8ge2tleToge2ZpZWxkOiBrZXkuZmllbGR9fSA6IHt9KSxcbiAgICAuLi4oc29ydCA/IHtzb3J0fSA6IHt9KSxcbiAgICBmcm9tOiB7ZGF0YTogb3B0LmZyb21QcmVmaXggKyBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTil9LFxuICAgIGVuY29kZToge1xuICAgICAgdXBkYXRlOiBtYXJrQ29tcGlsZXJbbWFya10uZW5jb2RlRW50cnkobW9kZWwpXG4gICAgfSxcbiAgICAuLi4ocG9zdEVuY29kaW5nVHJhbnNmb3JtID8ge1xuICAgICAgdHJhbnNmb3JtOiBwb3N0RW5jb2RpbmdUcmFuc2Zvcm1cbiAgICB9IDoge30pXG4gIH1dO1xuXG59XG5cbi8qKlxuICogUmV0dXJucyBsaXN0IG9mIHBhdGggZ3JvdXBpbmcgZmllbGRzXG4gKiB0aGF0IHRoZSBtb2RlbCdzIHNwZWMgY29udGFpbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXRoR3JvdXBpbmdGaWVsZHMobWFyazogTWFyaywgZW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBrZXlzKGVuY29kaW5nKS5yZWR1Y2UoKGRldGFpbHMsIGNoYW5uZWwpID0+IHtcbiAgICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICAgIC8vIHgsIHksIHgyLCB5MiwgbGF0LCBsb25nLCBsYXQxLCBsb25nMiwgb3JkZXIsIHRvb2x0aXAsIGhyZWYsIGN1cnNvciBzaG91bGQgbm90IGNhdXNlIGxpbmVzIHRvIGdyb3VwXG4gICAgICBjYXNlICd4JzpcbiAgICAgIGNhc2UgJ3knOlxuICAgICAgY2FzZSAnb3JkZXInOlxuICAgICAgY2FzZSAndG9vbHRpcCc6XG4gICAgICBjYXNlICdocmVmJzpcbiAgICAgIGNhc2UgJ3gyJzpcbiAgICAgIGNhc2UgJ3kyJzpcblxuICAgICAgY2FzZSAnbGF0aXR1ZGUnOlxuICAgICAgY2FzZSAnbG9uZ2l0dWRlJzpcbiAgICAgIGNhc2UgJ2xhdGl0dWRlMic6XG4gICAgICBjYXNlICdsb25naXR1ZGUyJzpcbiAgICAgIC8vIFRPRE86IGNhc2UgJ2N1cnNvcic6XG5cbiAgICAgIC8vIHRleHQsIHNoYXBlLCBzaG91bGRuJ3QgYmUgYSBwYXJ0IG9mIGxpbmUvdHJhaWwvYXJlYVxuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICBjYXNlICdzaGFwZSc6XG4gICAgICAgIHJldHVybiBkZXRhaWxzO1xuXG4gICAgICBjYXNlICdkZXRhaWwnOlxuICAgICAgY2FzZSAna2V5JzpcbiAgICAgICAgY29uc3QgY2hhbm5lbERlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgICAgICBpZiAoY2hhbm5lbERlZikge1xuICAgICAgICAgIChpc0FycmF5KGNoYW5uZWxEZWYpID8gY2hhbm5lbERlZiA6IFtjaGFubmVsRGVmXSkuZm9yRWFjaCgoZmllbGREZWYpID0+IHtcbiAgICAgICAgICAgIGlmICghZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgICAgIGRldGFpbHMucHVzaCh2Z0ZpZWxkKGZpZWxkRGVmLCB7fSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXRhaWxzO1xuXG4gICAgICBjYXNlICdzaXplJzpcbiAgICAgICAgaWYgKG1hcmsgPT09ICd0cmFpbCcpIHtcbiAgICAgICAgICAvLyBGb3IgdHJhaWwsIHNpemUgc2hvdWxkIG5vdCBncm91cCB0cmFpbCBsaW5lcy5cbiAgICAgICAgICByZXR1cm4gZGV0YWlscztcbiAgICAgICAgfVxuICAgICAgICAvLyBGb3IgbGluZSwgaXQgc2hvdWxkIGdyb3VwIGxpbmVzLlxuXG4gICAgICAvKiB0c2xpbnQ6ZGlzYWJsZSAqL1xuICAgICAgLy8gaW50ZW50aW9uYWwgZmFsbCB0aHJvdWdoXG5cbiAgICAgIGNhc2UgJ2NvbG9yJzpcbiAgICAgIGNhc2UgJ2ZpbGwnOlxuICAgICAgY2FzZSAnc3Ryb2tlJzpcbiAgICAgIGNhc2UgJ29wYWNpdHknOlxuICAgICAgLy8gVE9ETyBzdHJva2VEYXNoT2Zmc2V0OlxuXG4gICAgICAvKiB0c2xpbnQ6ZW5hYmxlICovXG4gICAgICAgIGNvbnN0IGZpZWxkRGVmID0gZ2V0RmllbGREZWY8c3RyaW5nPihlbmNvZGluZ1tjaGFubmVsXSk7XG4gICAgICAgIGlmIChmaWVsZERlZiAmJiAhZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgICAgZGV0YWlscy5wdXNoKHZnRmllbGQoZmllbGREZWYsIHt9KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRldGFpbHM7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEJ1ZzogQ2hhbm5lbCAke2NoYW5uZWx9IHVuaW1wbGVtZW50ZWQgZm9yIGxpbmUgbWFya2ApO1xuICAgIH1cbiAgfSwgW10pO1xufVxuXG4vKipcbiAqIElmIHNjYWxlcyBhcmUgYm91bmQgdG8gaW50ZXJ2YWwgc2VsZWN0aW9ucywgd2Ugd2FudCB0byBhdXRvbWF0aWNhbGx5IGNsaXBcbiAqIG1hcmtzIHRvIGFjY291bnQgZm9yIHBhbm5pbmcvem9vbWluZyBpbnRlcmFjdGlvbnMuIFdlIGlkZW50aWZ5IGJvdW5kIHNjYWxlc1xuICogYnkgdGhlIGRvbWFpblJhdyBwcm9wZXJ0eSwgd2hpY2ggZ2V0cyBhZGRlZCBkdXJpbmcgc2NhbGUgcGFyc2luZy5cbiAqL1xuZnVuY3Rpb24gc2NhbGVDbGlwKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3QgeFNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3gnKTtcbiAgY29uc3QgeVNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3knKTtcbiAgcmV0dXJuICh4U2NhbGUgJiYgeFNjYWxlLmdldCgnZG9tYWluUmF3JykpIHx8XG4gICAgKHlTY2FsZSAmJiB5U2NhbGUuZ2V0KCdkb21haW5SYXcnKSkgPyB0cnVlIDogZmFsc2U7XG59XG4iXX0=