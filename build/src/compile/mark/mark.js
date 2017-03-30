"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var mark_1 = require("../../mark");
var util_1 = require("../../util");
var area_1 = require("./area");
var bar_1 = require("./bar");
var line_1 = require("./line");
var point_1 = require("./point");
var rect_1 = require("./rect");
var rule_1 = require("./rule");
var text_1 = require("./text");
var tick_1 = require("./tick");
var markCompiler = {
    area: area_1.area,
    bar: bar_1.bar,
    line: line_1.line,
    point: point_1.point,
    text: text_1.text,
    tick: tick_1.tick,
    rect: rect_1.rect,
    rule: rule_1.rule,
    circle: point_1.circle,
    square: point_1.square
};
function parseMark(model) {
    if (util_1.contains([mark_1.LINE, mark_1.AREA], model.mark())) {
        return parsePathMark(model);
    }
    else {
        return parseNonPathMark(model);
    }
}
exports.parseMark = parseMark;
// FIXME: maybe this should not be here.  Need re-think and refactor, esp. after having all composition in.
function dataFrom(model) {
    var parent = model.parent;
    if (parent && parent.isFacet()) {
        return parent.facetedTable();
    }
    if (model.stack) {
        return model.dataName('stacked');
    }
    return model.dataTable();
}
var FACETED_PATH_PREFIX = 'faceted-path-';
function parsePathMark(model) {
    var mark = model.mark();
    // FIXME: replace this with more general case for composition
    var details = detailFields(model);
    var pathMarks = [
        {
            name: model.getName('marks'),
            type: markCompiler[mark].vgMark,
            // If has subfacet for line/area group, need to use faceted data from below.
            // FIXME: support sorting path order (in connected scatterplot)
            from: { data: (details.length > 0 ? FACETED_PATH_PREFIX : '') + dataFrom(model) },
            encode: { update: markCompiler[mark].encodeEntry(model) }
        }
    ];
    if (details.length > 0) {
        // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)
        return [{
                name: model.getName('pathgroup'),
                type: 'group',
                from: {
                    facet: {
                        name: FACETED_PATH_PREFIX + dataFrom(model),
                        data: dataFrom(model),
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
function parseNonPathMark(model) {
    var mark = model.mark();
    var role = model.markDef.role || markCompiler[mark].defaultRole;
    var marks = []; // TODO: vgMarks
    // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)
    marks.push(tslib_1.__assign({ name: model.getName('marks'), type: markCompiler[mark].vgMark }, (role ? { role: role } : {}), { from: { data: dataFrom(model) }, encode: { update: markCompiler[mark].encodeEntry(model) } }));
    return marks;
}
/**
 * Returns list of detail (group-by) fields
 * that the model's spec contains.
 */
function detailFields(model) {
    return channel_1.LEVEL_OF_DETAIL_CHANNELS.reduce(function (details, channel) {
        if (model.channelHasField(channel) && !model.fieldDef(channel).aggregate) {
            details.push(model.field(channel));
        }
        return details;
    }, []);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5Q0FBdUQ7QUFDdkQsbUNBQXNDO0FBQ3RDLG1DQUFvQztBQUVwQywrQkFBNEI7QUFDNUIsNkJBQTBCO0FBRTFCLCtCQUE0QjtBQUM1QixpQ0FBOEM7QUFDOUMsK0JBQTRCO0FBQzVCLCtCQUE0QjtBQUM1QiwrQkFBNEI7QUFDNUIsK0JBQTRCO0FBSzVCLElBQU0sWUFBWSxHQUFtQztJQUNuRCxJQUFJLEVBQUUsV0FBSTtJQUNWLEdBQUcsRUFBRSxTQUFHO0lBQ1IsSUFBSSxFQUFFLFdBQUk7SUFDVixLQUFLLEVBQUUsYUFBSztJQUNaLElBQUksRUFBRSxXQUFJO0lBQ1YsSUFBSSxFQUFFLFdBQUk7SUFDVixJQUFJLEVBQUUsV0FBSTtJQUNWLElBQUksRUFBRSxXQUFJO0lBQ1YsTUFBTSxFQUFFLGNBQU07SUFDZCxNQUFNLEVBQUUsY0FBTTtDQUNmLENBQUM7QUFFRixtQkFBMEIsS0FBZ0I7SUFDeEMsRUFBRSxDQUFDLENBQUMsZUFBUSxDQUFDLENBQUMsV0FBSSxFQUFFLFdBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0FBQ0gsQ0FBQztBQU5ELDhCQU1DO0FBRUQsMkdBQTJHO0FBQzNHLGtCQUFrQixLQUFnQjtJQUNoQyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQzVCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE1BQU0sQ0FBRSxNQUFxQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNoQixNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUMzQixDQUFDO0FBRUQsSUFBTSxtQkFBbUIsR0FBRyxlQUFlLENBQUM7QUFFNUMsdUJBQXVCLEtBQWdCO0lBQ3JDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxQiw2REFBNkQ7SUFDN0QsSUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXBDLElBQUksU0FBUyxHQUFRO1FBQ25CO1lBQ0UsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQzVCLElBQUksRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTTtZQUMvQiw0RUFBNEU7WUFDNUUsK0RBQStEO1lBQy9ELElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLG1CQUFtQixHQUFHLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBQztZQUMvRSxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBQztTQUN4RDtLQUNGLENBQUM7SUFFRixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsNkZBQTZGO1FBRTdGLE1BQU0sQ0FBQyxDQUFDO2dCQUNOLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztnQkFDaEMsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsSUFBSSxFQUFFO29CQUNKLEtBQUssRUFBRTt3QkFDTCxJQUFJLEVBQUUsbUJBQW1CLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQzt3QkFDM0MsSUFBSSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUM7d0JBQ3JCLE9BQU8sRUFBRSxPQUFPO3FCQUNqQjtpQkFDRjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sTUFBTSxFQUFFO3dCQUNOLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBQzt3QkFDaEMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxFQUFDO3FCQUNuQztpQkFDRjtnQkFDRCxLQUFLLEVBQUUsU0FBUzthQUNqQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7QUFDSCxDQUFDO0FBRUQsMEJBQTBCLEtBQWdCO0lBQ3hDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUUxQixJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDO0lBRWxFLElBQUksS0FBSyxHQUFVLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQjtJQUV2Qyw2RkFBNkY7SUFFN0YsS0FBSyxDQUFDLElBQUksb0JBQ1IsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQzVCLElBQUksRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUM1QixDQUFDLElBQUksR0FBRSxFQUFDLElBQUksTUFBQSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQ3RCLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUMsRUFDN0IsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUMsSUFDdkQsQ0FBQztJQUVILE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBSUQ7OztHQUdHO0FBQ0gsc0JBQXNCLEtBQWdCO0lBQ3BDLE1BQU0sQ0FBQyxrQ0FBd0IsQ0FBQyxNQUFNLENBQUMsVUFBUyxPQUFPLEVBQUUsT0FBTztRQUM5RCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNULENBQUMifQ==