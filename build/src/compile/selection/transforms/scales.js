"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("../../../log");
var scale_1 = require("../../../scale");
var selection_1 = require("../selection");
var interval_1 = require("../interval");
var util_1 = require("../../../util");
var scaleBindings = {
    clippedGroup: true,
    has: function (selCmpt) {
        return selCmpt.type === 'interval' && selCmpt.bind && selCmpt.bind === 'scales';
    },
    parse: function (model, selDef, selCmpt) {
        var scales = model.component.scales;
        var bound = selCmpt.scales = [];
        selCmpt.project.forEach(function (p) {
            var channel = p.encoding;
            var scale = scales[channel];
            if (!scale || !scale_1.hasContinuousDomain(scale.type)) {
                log_1.warn('Scale bindings are currently only supported for scales with continuous domains.');
                return;
            }
            scale.domainRaw = { signal: selection_1.channelSignalName(selCmpt, channel) };
            bound.push(channel);
        });
    },
    topLevelSignals: function (model, selCmpt, signals) {
        return signals.concat(selCmpt.scales.map(function (channel) {
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
            var signal = signals.filter(function (s) { return s.name === name + '_' + channel; })[0];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvc2NhbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esb0NBQWtDO0FBQ2xDLHdDQUFtRDtBQUVuRCwwQ0FBOEQ7QUFFOUQsd0NBQWtEO0FBQ2xELHNDQUEwQztBQUUxQyxJQUFNLGFBQWEsR0FBcUI7SUFDdEMsWUFBWSxFQUFFLElBQUk7SUFFbEIsR0FBRyxFQUFFLFVBQVMsT0FBTztRQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQztJQUNsRixDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPO1FBQ3BDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQ3RDLElBQU0sS0FBSyxHQUFhLE9BQU8sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRTVDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVMsQ0FBQztZQUNoQyxJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQzNCLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUU5QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLDJCQUFtQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLFVBQUksQ0FBQyxpRkFBaUYsQ0FBQyxDQUFDO2dCQUN4RixNQUFNLENBQUM7WUFDVCxDQUFDO1lBRUQsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFDLE1BQU0sRUFBRSw2QkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUMsQ0FBQztZQUNoRSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGVBQWUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUMvQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE9BQU87WUFDL0MsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLDZCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQ3ZDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDeEIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBUyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxlQUFhO2dCQUNwQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxpQkFBSyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssa0JBQU0sQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVMsT0FBTztZQUNyQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEdBQUcsR0FBRyxHQUFHLE9BQU8sRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1lBQ3RCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNwQixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7Q0FDRixDQUFDO0FBRXVCLGdDQUFPO0FBRWhDLGdCQUF1QixLQUFnQixFQUFFLE9BQWdCO0lBQ3ZELElBQUksS0FBSyxHQUFHLGtCQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2xELE1BQU0sQ0FBQyxZQUFVLEtBQUssTUFBRyxDQUFDO0FBQzVCLENBQUM7QUFIRCx3QkFHQyJ9