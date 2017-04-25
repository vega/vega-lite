"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("../../../log");
var scale_1 = require("../../../scale");
var util_1 = require("../../../util");
var interval_1 = require("../interval");
var selection_1 = require("../selection");
var scaleBindings = {
    clipGroup: true,
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.resolve === 'global' &&
            selCmpt.bind && selCmpt.bind === 'scales';
    },
    parse: function (model, selDef, selCmpt) {
        var bound = selCmpt.scales = [];
        selCmpt.project.forEach(function (p) {
            var channel = p.encoding;
            var scale = model.getComponent('scales', channel);
            if (!scale || !scale_1.hasContinuousDomain(scale.type)) {
                log_1.warn('Scale bindings are currently only supported for scales with continuous domains.');
                return;
            }
            scale.domainRaw = { signal: selection_1.channelSignalName(selCmpt, channel) };
            bound.push(channel);
        });
    },
    topLevelSignals: function (model, selCmpt, signals) {
        var channels = selCmpt.scales.filter(function (channel) {
            return !(signals.filter(function (s) { return s.name === selection_1.channelSignalName(selCmpt, channel); }).length);
        });
        return signals.concat(channels.map(function (channel) {
            return { name: selection_1.channelSignalName(selCmpt, channel) };
        }));
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name;
        signals = signals.filter(function (s) {
            return s.name !== name + interval_1.SIZE &&
                s.name !== name + selection_1.TUPLE && s.name !== selection_1.MODIFY;
        });
        selCmpt.scales.forEach(function (channel) {
            var signal = signals.filter(function (s) { return s.name === selection_1.channelSignalName(selCmpt, channel); })[0];
            signal.push = 'outer';
            delete signal.value;
            delete signal.update;
        });
        return signals;
    }
};
exports.default = scaleBindings;
function domain(model, channel) {
    var scale = util_1.stringValue(model.scaleName(channel));
    return "domain(" + scale + ")";
}
exports.domain = domain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvc2NhbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esb0NBQWtDO0FBQ2xDLHdDQUFtRDtBQUNuRCxzQ0FBMEM7QUFFMUMsd0NBQWtEO0FBQ2xELDBDQUE4RDtBQUc5RCxJQUFNLGFBQWEsR0FBcUI7SUFDdEMsU0FBUyxFQUFFLElBQUk7SUFFZixHQUFHLEVBQUUsVUFBUyxPQUFPO1FBQ25CLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVE7WUFDaEUsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQztJQUM5QyxDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPO1FBQ3BDLElBQU0sS0FBSyxHQUFhLE9BQU8sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRTVDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVMsQ0FBQztZQUNoQyxJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQzNCLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXBELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsMkJBQW1CLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0MsVUFBSSxDQUFDLGlGQUFpRixDQUFDLENBQUM7Z0JBQ3hGLE1BQU0sQ0FBQztZQUNULENBQUM7WUFFRCxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUMsTUFBTSxFQUFFLDZCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBQyxDQUFDO1lBQ2hFLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZUFBZSxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQy9DLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBTztZQUM3QyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLDZCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBOUMsQ0FBOEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pGLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE9BQU87WUFDekMsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLDZCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQ3ZDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBUyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxlQUFhO2dCQUNwQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxpQkFBSyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssa0JBQU0sQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVMsT0FBTztZQUNyQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyw2QkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQTlDLENBQThDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RixNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztZQUN0QixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDcEIsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqQixDQUFDO0NBQ0YsQ0FBQztBQUV1QixnQ0FBTztBQUVoQyxnQkFBdUIsS0FBZ0IsRUFBRSxPQUFnQjtJQUN2RCxJQUFNLEtBQUssR0FBRyxrQkFBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNwRCxNQUFNLENBQUMsWUFBVSxLQUFLLE1BQUcsQ0FBQztBQUM1QixDQUFDO0FBSEQsd0JBR0MifQ==