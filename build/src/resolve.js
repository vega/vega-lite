"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("./channel");
var log = require("./log");
var util_1 = require("./util");
function initResolve(resolve, defaultScaleResolve) {
    var out = {};
    channel_1.SCALE_CHANNELS.forEach(function (channel) {
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
function initConcatResolve(resolve) {
    return initResolve(resolve, function (channel) { return 'independent'; });
}
exports.initConcatResolve = initConcatResolve;
function initRepeatResolve(resolve) {
    return initResolve(resolve, function (channel) { return (util_1.contains(channel_1.NONSPATIAL_SCALE_CHANNELS, channel) ? 'shared' : 'independent'); });
}
exports.initRepeatResolve = initRepeatResolve;
function initFacetResolve(resolve) {
    return initResolve(resolve, function (channel) { return 'shared'; });
}
exports.initFacetResolve = initFacetResolve;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFHO0FBQ3JHLDJCQUE2QjtBQUM3QiwrQkFBZ0M7QUE2QmhDLHFCQUFxQixPQUF1QixFQUFFLG1CQUFrRTtJQUM5RyxJQUFNLEdBQUcsR0FBbUIsRUFBRSxDQUFDO0lBQy9CLHdCQUFjLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztRQUM1QixJQUFNLEdBQUcsR0FBWSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBQyxLQUFLLEVBQUUsbUJBQW1CLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQztRQUMvRSxJQUFNLEtBQUssR0FBRyxlQUFRLENBQUMsZ0NBQXNCLEVBQUUsT0FBTyxDQUFDLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQztRQUU1RSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLGFBQWEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxRQUFRLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMscUNBQXFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN2RSxDQUFDO1FBRUQsR0FBRyxDQUFDLE9BQU8sQ0FBQztnQkFDVixLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssSUFBSSxRQUFROztZQUM1QixHQUFDLEtBQUssSUFBRyxHQUFHLENBQUMsS0FBSyxLQUFLLGFBQWEsR0FBRyxhQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksUUFBUSxDQUFDO2VBQ2hGLENBQUM7O0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELDBCQUFpQyxPQUF1QjtJQUN0RCxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxVQUFBLE9BQU8sSUFBSSxPQUFBLFFBQVEsRUFBUixDQUFRLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBRkQsNENBRUM7QUFFRCwyQkFBa0MsT0FBdUI7SUFDdkQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsVUFBQSxPQUFPLElBQUksT0FBQSxhQUFhLEVBQWIsQ0FBYSxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQUZELDhDQUVDO0FBRUQsMkJBQWtDLE9BQXVCO0lBQ3ZELE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFVBQUEsT0FBTyxJQUFJLE9BQUEsQ0FBQyxlQUFRLENBQUMsbUNBQXlCLEVBQUUsT0FBTyxDQUFDLEdBQUcsUUFBUSxHQUFHLGFBQWEsQ0FBQyxFQUF6RSxDQUF5RSxDQUFDLENBQUM7QUFDcEgsQ0FBQztBQUZELDhDQUVDO0FBRUQsMEJBQWlDLE9BQXVCO0lBQ3RELE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFVBQUEsT0FBTyxJQUFJLE9BQUEsUUFBUSxFQUFSLENBQVEsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFGRCw0Q0FFQyJ9