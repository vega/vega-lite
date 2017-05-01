"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("./channel");
var log = require("./log");
var util_1 = require("./util");
function initLayerResolve(resolve) {
    var out = {};
    channel_1.UNIT_SCALE_CHANNELS.forEach(function (channel) {
        var res = resolve[channel] || { scale: 'shared' };
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
exports.initLayerResolve = initLayerResolve;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQW1JO0FBQ25JLDJCQUE2QjtBQUM3QiwrQkFBZ0M7QUE0QmhDLDBCQUFpQyxPQUF1QjtJQUN0RCxJQUFNLEdBQUcsR0FBbUIsRUFBRSxDQUFDO0lBQy9CLDZCQUFtQixDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87UUFDakMsSUFBTSxHQUFHLEdBQVksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDO1FBQzNELElBQU0sS0FBSyxHQUFHLGVBQVEsQ0FBQyxnQ0FBc0IsRUFBRSxPQUFPLENBQUMsR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBRTVFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssYUFBYSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVGLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7UUFFRCxHQUFHLENBQUMsT0FBTyxDQUFDO2dCQUNWLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxJQUFJLFFBQVE7O1lBQzVCLEdBQUMsS0FBSyxJQUFHLEdBQUcsQ0FBQyxLQUFLLEtBQUssYUFBYSxHQUFHLGFBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUM7ZUFDaEYsQ0FBQzs7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDYixDQUFDO0FBakJELDRDQWlCQyJ9