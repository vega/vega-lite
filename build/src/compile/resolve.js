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
        return util_1.contains(channel_1.POSITION_SCALE_CHANNELS, channel) ? 'independent' : 'shared';
    }
    /* istanbul ignore next: should never reach here. */
    throw new Error('invalid model type for resolve');
}
exports.defaultScaleResolve = defaultScaleResolve;
function parseGuideResolve(resolve, channel) {
    var channelScaleResolve = resolve.scale[channel];
    var guide = util_1.contains(channel_1.POSITION_SCALE_CHANNELS, channel) ? 'axis' : 'legend';
    if (channelScaleResolve === 'independent') {
        if (resolve[guide][channel] === 'shared') {
            log.warn(log.message.independentScaleMeansIndependentGuide(channel));
        }
        return 'independent';
    }
    return resolve[guide][channel] || 'shared';
}
exports.parseGuideResolve = parseGuideResolve;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL3Jlc29sdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBaUU7QUFDakUsNEJBQThCO0FBRTlCLGdDQUFpQztBQUNqQyxpQ0FBd0Y7QUFFeEYsNkJBQW9DLE9BQXFCLEVBQUUsS0FBWTtJQUNyRSxFQUFFLENBQUMsQ0FBQyxvQkFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLG9CQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxxQkFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLHFCQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sQ0FBQyxlQUFRLENBQUMsaUNBQXVCLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQy9FLENBQUM7SUFDRCxvREFBb0Q7SUFDcEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFSRCxrREFRQztBQUVELDJCQUFrQyxPQUFnQixFQUFFLE9BQXFCO0lBQ3ZFLElBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuRCxJQUFNLEtBQUssR0FBRyxlQUFRLENBQUMsaUNBQXVCLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBRTdFLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDMUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDekMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDdkUsQ0FBQztRQUNELE1BQU0sQ0FBQyxhQUFhLENBQUM7SUFDdkIsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksUUFBUSxDQUFDO0FBQzdDLENBQUM7QUFaRCw4Q0FZQyJ9