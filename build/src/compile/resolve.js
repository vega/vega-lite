"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../channel");
var log = require("../log");
var util_1 = require("../util");
var concat_1 = require("./concat");
var facet_1 = require("./facet");
var layer_1 = require("./layer");
var repeat_1 = require("./repeat");
function defaultScaleResolve(channel, model) {
    if (model instanceof layer_1.LayerModel || model instanceof facet_1.FacetModel) {
        return 'shared';
    }
    else if (model instanceof concat_1.ConcatModel || model instanceof repeat_1.RepeatModel) {
        return util_1.contains(channel_1.SPATIAL_SCALE_CHANNELS, channel) ? 'independent' : 'shared';
    }
    /* istanbul ignore next: should never reach here. */
    throw new Error('invalid model type for resolve');
}
exports.defaultScaleResolve = defaultScaleResolve;
function parseGuideResolve(resolve, channel) {
    var channelResolve = resolve[channel];
    var guide = util_1.contains(channel_1.SPATIAL_SCALE_CHANNELS, channel) ? 'axis' : 'legend';
    if (channelResolve.scale === 'independent') {
        if (channelResolve[guide] === 'shared') {
            log.warn(log.message.independentScaleMeansIndependentGuide(channel));
        }
        return 'independent';
    }
    return channelResolve[guide] || 'shared';
}
exports.parseGuideResolve = parseGuideResolve;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3Jlc29sdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBZ0U7QUFDaEUsNEJBQThCO0FBRTlCLGdDQUFpQztBQUNqQyxtQ0FBcUM7QUFDckMsaUNBQW1DO0FBQ25DLGlDQUFtQztBQUVuQyxtQ0FBcUM7QUFFckMsNkJBQW9DLE9BQXFCLEVBQUUsS0FBWTtJQUNyRSxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksa0JBQVUsSUFBSSxLQUFLLFlBQVksa0JBQVUsQ0FBQyxDQUFDLENBQUM7UUFDL0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxvQkFBVyxJQUFJLEtBQUssWUFBWSxvQkFBVyxDQUFDLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsZUFBUSxDQUFDLGdDQUFzQixFQUFFLE9BQU8sQ0FBQyxHQUFHLGFBQWEsR0FBRyxRQUFRLENBQUM7SUFDOUUsQ0FBQztJQUNELG9EQUFvRDtJQUNwRCxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQVJELGtEQVFDO0FBRUQsMkJBQWtDLE9BQXVCLEVBQUUsT0FBcUI7SUFDOUUsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLElBQU0sS0FBSyxHQUFHLGVBQVEsQ0FBQyxnQ0FBc0IsRUFBRSxPQUFPLENBQUMsR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDO0lBRTVFLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQztRQUMzQyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2QyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMscUNBQXFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN2RSxDQUFDO1FBQ0QsTUFBTSxDQUFDLGFBQWEsQ0FBQztJQUN2QixDQUFDO0lBRUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUM7QUFDM0MsQ0FBQztBQVpELDhDQVlDIn0=