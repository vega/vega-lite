"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var channel_1 = require("../../../channel");
var log = require("../../../log");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvc2NhbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQXNDO0FBQ3RDLDRDQUErQztBQUMvQyxrQ0FBb0M7QUFDcEMsd0NBQStEO0FBRS9ELDBDQUErQztBQUkvQyxJQUFNLGFBQWEsR0FBcUI7SUFDdEMsR0FBRyxFQUFFLFVBQVMsT0FBTztRQUNuQixPQUFPLE9BQU8sQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssUUFBUTtZQUNoRSxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDO0lBQzlDLENBQUM7SUFFRCxLQUFLLEVBQUUsVUFBUyxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU87UUFDcEMsSUFBTSxLQUFLLEdBQWMsT0FBTyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBUyxDQUFDO1lBQ2hDLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDMUIsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBRXhELElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQywyQkFBbUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUN0RSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztnQkFDaEQsT0FBTzthQUNSO1lBRUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBQyxNQUFNLEVBQUUsNkJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BGLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFcEIsaURBQWlEO1lBQ2pELElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDbEUsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sS0FBSyxXQUFDLENBQUMsQ0FBQyxDQUFDLFdBQUMsQ0FBQyxDQUFDLENBQUMsV0FBQyxDQUFDLENBQUM7Z0JBQzlELE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUMsTUFBTSxFQUFFLDZCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUN0RjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGVBQWUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTztRQUMvQyxzRUFBc0U7UUFDdEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsT0FBTyxPQUFPLENBQUM7U0FDaEI7UUFFRCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE9BQU87WUFDN0MsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssNkJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBdEQsQ0FBc0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9GLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQyxPQUFPO1lBQ3pDLE9BQU8sRUFBQyxJQUFJLEVBQUUsNkJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBQyxDQUFDO1FBQzdELENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPO1FBQ3ZDLGlGQUFpRjtRQUNqRixJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDaEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO2dCQUM1QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyw2QkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUF0RCxDQUFzRCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTlGLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO2dCQUN0QixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ3BCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUNGLENBQUM7QUFFRixrQkFBZSxhQUFhLENBQUM7QUFFN0IsZ0JBQXVCLEtBQWdCLEVBQUUsT0FBZ0I7SUFDdkQsSUFBTSxLQUFLLEdBQUcsdUJBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDcEQsT0FBTyxZQUFVLEtBQUssTUFBRyxDQUFDO0FBQzVCLENBQUM7QUFIRCx3QkFHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7c3RyaW5nVmFsdWV9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0NoYW5uZWwsIFgsIFl9IGZyb20gJy4uLy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uLy4uL2xvZyc7XG5pbXBvcnQge2hhc0NvbnRpbnVvdXNEb21haW4sIGlzQmluU2NhbGV9IGZyb20gJy4uLy4uLy4uL3NjYWxlJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi8uLi91bml0JztcbmltcG9ydCB7Y2hhbm5lbFNpZ25hbE5hbWV9IGZyb20gJy4uL3NlbGVjdGlvbic7XG5pbXBvcnQge1RyYW5zZm9ybUNvbXBpbGVyfSBmcm9tICcuL3RyYW5zZm9ybXMnO1xuXG5cbmNvbnN0IHNjYWxlQmluZGluZ3M6VHJhbnNmb3JtQ29tcGlsZXIgPSB7XG4gIGhhczogZnVuY3Rpb24oc2VsQ21wdCkge1xuICAgIHJldHVybiBzZWxDbXB0LnR5cGUgPT09ICdpbnRlcnZhbCcgJiYgc2VsQ21wdC5yZXNvbHZlID09PSAnZ2xvYmFsJyAmJlxuICAgICAgc2VsQ21wdC5iaW5kICYmIHNlbENtcHQuYmluZCA9PT0gJ3NjYWxlcyc7XG4gIH0sXG5cbiAgcGFyc2U6IGZ1bmN0aW9uKG1vZGVsLCBzZWxEZWYsIHNlbENtcHQpIHtcbiAgICBjb25zdCBib3VuZDogQ2hhbm5lbFtdID0gc2VsQ21wdC5zY2FsZXMgPSBbXTtcblxuICAgIHNlbENtcHQucHJvamVjdC5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBwLmNoYW5uZWw7XG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpO1xuICAgICAgY29uc3Qgc2NhbGVUeXBlID0gc2NhbGUgPyBzY2FsZS5nZXQoJ3R5cGUnKSA6IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKCFzY2FsZSB8fCAhaGFzQ29udGludW91c0RvbWFpbihzY2FsZVR5cGUpIHx8IGlzQmluU2NhbGUoc2NhbGVUeXBlKSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5TQ0FMRV9CSU5ESU5HU19DT05USU5VT1VTKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzY2FsZS5zZXQoJ2RvbWFpblJhdycsIHtzaWduYWw6IGNoYW5uZWxTaWduYWxOYW1lKHNlbENtcHQsIGNoYW5uZWwsICdkYXRhJyl9LCB0cnVlKTtcbiAgICAgIGJvdW5kLnB1c2goY2hhbm5lbCk7XG5cbiAgICAgIC8vIEJpbmQgYm90aCB4L3kgZm9yIGRpYWcgcGxvdCBvZiByZXBlYXRlZCB2aWV3cy5cbiAgICAgIGlmIChtb2RlbC5yZXBlYXRlciAmJiBtb2RlbC5yZXBlYXRlci5yb3cgPT09IG1vZGVsLnJlcGVhdGVyLmNvbHVtbikge1xuICAgICAgICBjb25zdCBzY2FsZTIgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsID09PSBYID8gWSA6IFgpO1xuICAgICAgICBzY2FsZTIuc2V0KCdkb21haW5SYXcnLCB7c2lnbmFsOiBjaGFubmVsU2lnbmFsTmFtZShzZWxDbXB0LCBjaGFubmVsLCAnZGF0YScpfSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgdG9wTGV2ZWxTaWduYWxzOiBmdW5jdGlvbihtb2RlbCwgc2VsQ21wdCwgc2lnbmFscykge1xuICAgIC8vIFRvcC1sZXZlbCBzaWduYWxzIGFyZSBvbmx5IG5lZWRlZCB3aGVuIGNvb3JkaW5hdGluZyBjb21wb3NlZCB2aWV3cy5cbiAgICBpZiAoIW1vZGVsLnBhcmVudCkge1xuICAgICAgcmV0dXJuIHNpZ25hbHM7XG4gICAgfVxuXG4gICAgY29uc3QgY2hhbm5lbHMgPSBzZWxDbXB0LnNjYWxlcy5maWx0ZXIoKGNoYW5uZWwpID0+IHtcbiAgICAgIHJldHVybiAhKHNpZ25hbHMuZmlsdGVyKHMgPT4gcy5uYW1lID09PSBjaGFubmVsU2lnbmFsTmFtZShzZWxDbXB0LCBjaGFubmVsLCAnZGF0YScpKS5sZW5ndGgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNpZ25hbHMuY29uY2F0KGNoYW5uZWxzLm1hcCgoY2hhbm5lbCkgPT4ge1xuICAgICAgcmV0dXJuIHtuYW1lOiBjaGFubmVsU2lnbmFsTmFtZShzZWxDbXB0LCBjaGFubmVsLCAnZGF0YScpfTtcbiAgICB9KSk7XG4gIH0sXG5cbiAgc2lnbmFsczogZnVuY3Rpb24obW9kZWwsIHNlbENtcHQsIHNpZ25hbHMpIHtcbiAgICAvLyBOZXN0ZWQgc2lnbmFscyBuZWVkIG9ubHkgcHVzaCB0byB0b3AtbGV2ZWwgc2lnbmFscyB3aGVuIHdpdGhpbiBjb21wb3NlZCB2aWV3cy5cbiAgICBpZiAobW9kZWwucGFyZW50KSB7XG4gICAgICBzZWxDbXB0LnNjYWxlcy5mb3JFYWNoKGNoYW5uZWwgPT4ge1xuICAgICAgICBjb25zdCBzaWduYWwgPSBzaWduYWxzLmZpbHRlcihzID0+IHMubmFtZSA9PT0gY2hhbm5lbFNpZ25hbE5hbWUoc2VsQ21wdCwgY2hhbm5lbCwgJ2RhdGEnKSlbMF07XG5cbiAgICAgICAgc2lnbmFsLnB1c2ggPSAnb3V0ZXInO1xuICAgICAgICBkZWxldGUgc2lnbmFsLnZhbHVlO1xuICAgICAgICBkZWxldGUgc2lnbmFsLnVwZGF0ZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBzaWduYWxzO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzY2FsZUJpbmRpbmdzO1xuXG5leHBvcnQgZnVuY3Rpb24gZG9tYWluKG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgY29uc3Qgc2NhbGUgPSBzdHJpbmdWYWx1ZShtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCkpO1xuICByZXR1cm4gYGRvbWFpbigke3NjYWxlfSlgO1xufVxuIl19