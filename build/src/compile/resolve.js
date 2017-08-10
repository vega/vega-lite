"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../channel");
var log = require("../log");
var util_1 = require("../util");
var model_1 = require("./model");
function defaultScaleResolve(channel, model) {
    if (model_1.isLayerModel(model) || model_1.isFacetModel(model)) {
        return 'shared';
    }
    else if (model_1.isConcatModel(model) || model_1.isRepeatModel(model)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3Jlc29sdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBZ0U7QUFDaEUsNEJBQThCO0FBRTlCLGdDQUFpQztBQUlqQyxpQ0FBd0Y7QUFHeEYsNkJBQW9DLE9BQXFCLEVBQUUsS0FBWTtJQUNyRSxFQUFFLENBQUMsQ0FBQyxvQkFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLG9CQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxxQkFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLHFCQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sQ0FBQyxlQUFRLENBQUMsZ0NBQXNCLEVBQUUsT0FBTyxDQUFDLEdBQUcsYUFBYSxHQUFHLFFBQVEsQ0FBQztJQUM5RSxDQUFDO0lBQ0Qsb0RBQW9EO0lBQ3BELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBUkQsa0RBUUM7QUFFRCwyQkFBa0MsT0FBdUIsRUFBRSxPQUFxQjtJQUM5RSxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEMsSUFBTSxLQUFLLEdBQUcsZUFBUSxDQUFDLGdDQUFzQixFQUFFLE9BQU8sQ0FBQyxHQUFHLE1BQU0sR0FBRyxRQUFRLENBQUM7SUFFNUUsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLEtBQUssS0FBSyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7UUFDRCxNQUFNLENBQUMsYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQztBQUMzQyxDQUFDO0FBWkQsOENBWUMifQ==