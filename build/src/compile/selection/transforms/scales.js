"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("../../../log");
var scale_1 = require("../../../scale");
var util_1 = require("../../../util");
var selection_1 = require("../selection");
var scaleBindings = {
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.resolve === 'global' &&
            selCmpt.bind && selCmpt.bind === 'scales';
    },
    parse: function (model, selDef, selCmpt) {
        var bound = selCmpt.scales = [];
        selCmpt.project.forEach(function (p) {
            var channel = p.channel;
            var scale = model.getScaleComponent(channel);
            var scaleType = scale ? scale.get('type') : undefined;
            if (!scale || !scale_1.hasContinuousDomain(scaleType) || scale_1.isBinScale(scaleType)) {
                log_1.warn('Scale bindings are currently only supported for scales with unbinned, continuous domains.');
                return;
            }
            scale.set('domainRaw', { signal: selection_1.channelSignalName(selCmpt, channel, 'data') }, true);
            bound.push(channel);
        });
    },
    topLevelSignals: function (model, selCmpt, signals) {
        // Top-level signals are only needed when coordinating composed views.
        if (!model.parent) {
            return signals;
        }
        var channels = selCmpt.scales.filter(function (channel) {
            return !(signals.filter(function (s) { return s.name === selection_1.channelSignalName(selCmpt, channel, 'data'); }).length);
        });
        return signals.concat(channels.map(function (channel) {
            return { name: selection_1.channelSignalName(selCmpt, channel, 'data') };
        }));
    },
    signals: function (model, selCmpt, signals) {
        // Nested signals need only push to top-level signals when within composed views.
        if (model.parent) {
            selCmpt.scales.forEach(function (channel) {
                var signal = signals.filter(function (s) { return s.name === selection_1.channelSignalName(selCmpt, channel, 'data'); })[0];
                signal.push = 'outer';
                delete signal.value;
                delete signal.update;
            });
        }
        return signals;
    }
};
exports.default = scaleBindings;
function domain(model, channel) {
    var scale = util_1.stringValue(model.scaleName(channel));
    return "domain(" + scale + ")";
}
exports.domain = domain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvc2NhbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esb0NBQWtDO0FBQ2xDLHdDQUErRDtBQUMvRCxzQ0FBMEM7QUFFMUMsMENBQStDO0FBSS9DLElBQU0sYUFBYSxHQUFxQjtJQUN0QyxHQUFHLEVBQUUsVUFBUyxPQUFPO1FBQ25CLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVE7WUFDaEUsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQztJQUM5QyxDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPO1FBQ3BDLElBQU0sS0FBSyxHQUFjLE9BQU8sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRTdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVMsQ0FBQztZQUNoQyxJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzFCLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQyxJQUFNLFNBQVMsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUM7WUFFeEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQywyQkFBbUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkUsVUFBSSxDQUFDLDJGQUEyRixDQUFDLENBQUM7Z0JBQ2xHLE1BQU0sQ0FBQztZQUNULENBQUM7WUFFRCxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFDLE1BQU0sRUFBRSw2QkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEYsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxlQUFlLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDL0Msc0VBQXNFO1FBQ3RFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDbEIsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBRUQsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQyxPQUFPO1lBQzdDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssNkJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBdEQsQ0FBc0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pHLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE9BQU87WUFDekMsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLDZCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUN2QyxpRkFBaUY7UUFDakYsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBUyxPQUFPO2dCQUNyQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyw2QkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUF0RCxDQUFzRCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO2dCQUN0QixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ3BCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7Q0FDRixDQUFDO0FBRXVCLGdDQUFPO0FBRWhDLGdCQUF1QixLQUFnQixFQUFFLE9BQWdCO0lBQ3ZELElBQU0sS0FBSyxHQUFHLGtCQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3BELE1BQU0sQ0FBQyxZQUFVLEtBQUssTUFBRyxDQUFDO0FBQzVCLENBQUM7QUFIRCx3QkFHQyJ9