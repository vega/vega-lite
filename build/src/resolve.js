"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("./channel");
var log = require("./log");
var util_1 = require("./util");
function initResolve(resolve, defaultScaleResolve) {
    var out = {};
    channel_1.UNIT_SCALE_CHANNELS.forEach(function (channel) {
        var res = resolve[channel] || { scale: defaultScaleResolve(channel) };
        var guide = util_1.contains(channel_1.SPATIAL_SCALE_CHANNELS, channel) ? 'axis' : 'legend';
        if (res.scale === 'independent' && (res['axis'] === 'shared' || res['legend'] === 'shared')) {
            log.warn(log.message.independentScaleMeansIndependentGuide(channel));
        }
        out[channel] = (_a = {
                scale: res.scale || 'shared'
            },
            _a[guide] = res.scale === 'independent' ? 'independent' : (res[guide] || 'shared'),
            _a);
        var _a;
    });
    return out;
}
function initLayerResolve(resolve) {
    return initResolve(resolve, function (channel) { return 'shared'; });
}
exports.initLayerResolve = initLayerResolve;
function initRepeatResolve(resolve) {
    return initResolve(resolve, function (channel) { return (util_1.contains(channel_1.NONSPATIAL_SCALE_CHANNELS, channel) ? 'shared' : 'independent'); });
}
exports.initRepeatResolve = initRepeatResolve;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQTBHO0FBQzFHLDJCQUE2QjtBQUM3QiwrQkFBZ0M7QUE0QmhDLHFCQUFxQixPQUF1QixFQUFFLG1CQUFrRTtJQUM5RyxJQUFNLEdBQUcsR0FBbUIsRUFBRSxDQUFDO0lBQy9CLDZCQUFtQixDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87UUFDakMsSUFBTSxHQUFHLEdBQVksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUMsS0FBSyxFQUFFLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUM7UUFDL0UsSUFBTSxLQUFLLEdBQUcsZUFBUSxDQUFDLGdDQUFzQixFQUFFLE9BQU8sQ0FBQyxHQUFHLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFFNUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxhQUFhLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssUUFBUSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUYsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDdkUsQ0FBQztRQUVELEdBQUcsQ0FBQyxPQUFPLENBQUM7Z0JBQ1YsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLElBQUksUUFBUTs7WUFDNUIsR0FBQyxLQUFLLElBQUcsR0FBRyxDQUFDLEtBQUssS0FBSyxhQUFhLEdBQUcsYUFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQztlQUNoRixDQUFDOztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCwwQkFBaUMsT0FBdUI7SUFDdEQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSxRQUFRLEVBQVIsQ0FBUSxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUZELDRDQUVDO0FBRUQsMkJBQWtDLE9BQXVCO0lBQ3ZELE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFVBQUEsT0FBTyxJQUFJLE9BQUEsQ0FBQyxlQUFRLENBQUMsbUNBQXlCLEVBQUUsT0FBTyxDQUFDLEdBQUcsUUFBUSxHQUFHLGFBQWEsQ0FBQyxFQUF6RSxDQUF5RSxDQUFDLENBQUM7QUFDcEgsQ0FBQztBQUZELDhDQUVDIn0=