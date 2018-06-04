"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var channel_1 = require("../../../channel");
var log = tslib_1.__importStar(require("../../../log"));
var scale_1 = require("../../../scale");
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
                log.warn(log.message.SCALE_BINDINGS_CONTINUOUS);
                return;
            }
            scale.set('domainRaw', { signal: selection_1.channelSignalName(selCmpt, channel, 'data') }, true);
            bound.push(channel);
            // Bind both x/y for diag plot of repeated views.
            if (model.repeater && model.repeater.row === model.repeater.column) {
                var scale2 = model.getScaleComponent(channel === channel_1.X ? channel_1.Y : channel_1.X);
                scale2.set('domainRaw', { signal: selection_1.channelSignalName(selCmpt, channel, 'data') }, true);
            }
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
    var scale = vega_util_1.stringValue(model.scaleName(channel));
    return "domain(" + scale + ")";
}
exports.domain = domain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvc2NhbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFzQztBQUN0Qyw0Q0FBK0M7QUFDL0Msd0RBQW9DO0FBQ3BDLHdDQUErRDtBQUUvRCwwQ0FBK0M7QUFJL0MsSUFBTSxhQUFhLEdBQXFCO0lBQ3RDLEdBQUcsRUFBRSxVQUFTLE9BQU87UUFDbkIsT0FBTyxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVE7WUFDaEUsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQztJQUM5QyxDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPO1FBQ3BDLElBQU0sS0FBSyxHQUFjLE9BQU8sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRTdDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVMsQ0FBQztZQUNoQyxJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzFCLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQyxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUV4RCxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsMkJBQW1CLENBQUMsU0FBUyxDQUFDLElBQUksa0JBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDdEUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7Z0JBQ2hELE9BQU87YUFDUjtZQUVELEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUMsTUFBTSxFQUFFLDZCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwRixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXBCLGlEQUFpRDtZQUNqRCxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2xFLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEtBQUssV0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFDLENBQUMsQ0FBQyxDQUFDLFdBQUMsQ0FBQyxDQUFDO2dCQUM5RCxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFDLE1BQU0sRUFBRSw2QkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDdEY7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxlQUFlLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDL0Msc0VBQXNFO1FBQ3RFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pCLE9BQU8sT0FBTyxDQUFDO1NBQ2hCO1FBRUQsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQyxPQUFPO1lBQzdDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLDZCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQXRELENBQXNELENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBTztZQUN6QyxPQUFPLEVBQUMsSUFBSSxFQUFFLDZCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUN2QyxpRkFBaUY7UUFDakYsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztnQkFDNUIsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssNkJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBdEQsQ0FBc0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU5RixNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztnQkFDdEIsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUNwQixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDdkIsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7Q0FDRixDQUFDO0FBRUYsa0JBQWUsYUFBYSxDQUFDO0FBRTdCLGdCQUF1QixLQUFnQixFQUFFLE9BQWdCO0lBQ3ZELElBQU0sS0FBSyxHQUFHLHVCQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3BELE9BQU8sWUFBVSxLQUFLLE1BQUcsQ0FBQztBQUM1QixDQUFDO0FBSEQsd0JBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3N0cmluZ1ZhbHVlfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtDaGFubmVsLCBYLCBZfSBmcm9tICcuLi8uLi8uLi9jaGFubmVsJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi8uLi9sb2cnO1xuaW1wb3J0IHtoYXNDb250aW51b3VzRG9tYWluLCBpc0JpblNjYWxlfSBmcm9tICcuLi8uLi8uLi9zY2FsZSc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdW5pdCc7XG5pbXBvcnQge2NoYW5uZWxTaWduYWxOYW1lfSBmcm9tICcuLi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtUcmFuc2Zvcm1Db21waWxlcn0gZnJvbSAnLi90cmFuc2Zvcm1zJztcblxuXG5jb25zdCBzY2FsZUJpbmRpbmdzOlRyYW5zZm9ybUNvbXBpbGVyID0ge1xuICBoYXM6IGZ1bmN0aW9uKHNlbENtcHQpIHtcbiAgICByZXR1cm4gc2VsQ21wdC50eXBlID09PSAnaW50ZXJ2YWwnICYmIHNlbENtcHQucmVzb2x2ZSA9PT0gJ2dsb2JhbCcgJiZcbiAgICAgIHNlbENtcHQuYmluZCAmJiBzZWxDbXB0LmJpbmQgPT09ICdzY2FsZXMnO1xuICB9LFxuXG4gIHBhcnNlOiBmdW5jdGlvbihtb2RlbCwgc2VsRGVmLCBzZWxDbXB0KSB7XG4gICAgY29uc3QgYm91bmQ6IENoYW5uZWxbXSA9IHNlbENtcHQuc2NhbGVzID0gW107XG5cbiAgICBzZWxDbXB0LnByb2plY3QuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgICBjb25zdCBjaGFubmVsID0gcC5jaGFubmVsO1xuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKTtcbiAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IHNjYWxlID8gc2NhbGUuZ2V0KCd0eXBlJykgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICghc2NhbGUgfHwgIWhhc0NvbnRpbnVvdXNEb21haW4oc2NhbGVUeXBlKSB8fCBpc0JpblNjYWxlKHNjYWxlVHlwZSkpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuU0NBTEVfQklORElOR1NfQ09OVElOVU9VUyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2NhbGUuc2V0KCdkb21haW5SYXcnLCB7c2lnbmFsOiBjaGFubmVsU2lnbmFsTmFtZShzZWxDbXB0LCBjaGFubmVsLCAnZGF0YScpfSwgdHJ1ZSk7XG4gICAgICBib3VuZC5wdXNoKGNoYW5uZWwpO1xuXG4gICAgICAvLyBCaW5kIGJvdGggeC95IGZvciBkaWFnIHBsb3Qgb2YgcmVwZWF0ZWQgdmlld3MuXG4gICAgICBpZiAobW9kZWwucmVwZWF0ZXIgJiYgbW9kZWwucmVwZWF0ZXIucm93ID09PSBtb2RlbC5yZXBlYXRlci5jb2x1bW4pIHtcbiAgICAgICAgY29uc3Qgc2NhbGUyID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCA9PT0gWCA/IFkgOiBYKTtcbiAgICAgICAgc2NhbGUyLnNldCgnZG9tYWluUmF3Jywge3NpZ25hbDogY2hhbm5lbFNpZ25hbE5hbWUoc2VsQ21wdCwgY2hhbm5lbCwgJ2RhdGEnKX0sIHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIHRvcExldmVsU2lnbmFsczogZnVuY3Rpb24obW9kZWwsIHNlbENtcHQsIHNpZ25hbHMpIHtcbiAgICAvLyBUb3AtbGV2ZWwgc2lnbmFscyBhcmUgb25seSBuZWVkZWQgd2hlbiBjb29yZGluYXRpbmcgY29tcG9zZWQgdmlld3MuXG4gICAgaWYgKCFtb2RlbC5wYXJlbnQpIHtcbiAgICAgIHJldHVybiBzaWduYWxzO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYW5uZWxzID0gc2VsQ21wdC5zY2FsZXMuZmlsdGVyKChjaGFubmVsKSA9PiB7XG4gICAgICByZXR1cm4gIShzaWduYWxzLmZpbHRlcihzID0+IHMubmFtZSA9PT0gY2hhbm5lbFNpZ25hbE5hbWUoc2VsQ21wdCwgY2hhbm5lbCwgJ2RhdGEnKSkubGVuZ3RoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzaWduYWxzLmNvbmNhdChjaGFubmVscy5tYXAoKGNoYW5uZWwpID0+IHtcbiAgICAgIHJldHVybiB7bmFtZTogY2hhbm5lbFNpZ25hbE5hbWUoc2VsQ21wdCwgY2hhbm5lbCwgJ2RhdGEnKX07XG4gICAgfSkpO1xuICB9LFxuXG4gIHNpZ25hbHM6IGZ1bmN0aW9uKG1vZGVsLCBzZWxDbXB0LCBzaWduYWxzKSB7XG4gICAgLy8gTmVzdGVkIHNpZ25hbHMgbmVlZCBvbmx5IHB1c2ggdG8gdG9wLWxldmVsIHNpZ25hbHMgd2hlbiB3aXRoaW4gY29tcG9zZWQgdmlld3MuXG4gICAgaWYgKG1vZGVsLnBhcmVudCkge1xuICAgICAgc2VsQ21wdC5zY2FsZXMuZm9yRWFjaChjaGFubmVsID0+IHtcbiAgICAgICAgY29uc3Qgc2lnbmFsID0gc2lnbmFscy5maWx0ZXIocyA9PiBzLm5hbWUgPT09IGNoYW5uZWxTaWduYWxOYW1lKHNlbENtcHQsIGNoYW5uZWwsICdkYXRhJykpWzBdO1xuXG4gICAgICAgIHNpZ25hbC5wdXNoID0gJ291dGVyJztcbiAgICAgICAgZGVsZXRlIHNpZ25hbC52YWx1ZTtcbiAgICAgICAgZGVsZXRlIHNpZ25hbC51cGRhdGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2lnbmFscztcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2NhbGVCaW5kaW5ncztcblxuZXhwb3J0IGZ1bmN0aW9uIGRvbWFpbihtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGNvbnN0IHNjYWxlID0gc3RyaW5nVmFsdWUobW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpKTtcbiAgcmV0dXJuIGBkb21haW4oJHtzY2FsZX0pYDtcbn1cbiJdfQ==