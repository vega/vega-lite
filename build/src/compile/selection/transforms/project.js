"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../../log");
var util_1 = require("../../../util");
var timeunit_1 = require("../../data/timeunit");
var project = {
    has: function (selDef) {
        var def = selDef;
        return def.fields !== undefined || def.encodings !== undefined;
    },
    parse: function (model, selDef, selCmpt) {
        var channels = {};
        var timeUnits = {};
        // TODO: find a possible channel mapping for these fields.
        (selDef.fields || []).forEach(function (field) { return channels[field] = null; });
        (selDef.encodings || []).forEach(function (channel) {
            var fieldDef = model.fieldDef(channel);
            if (fieldDef) {
                if (fieldDef.timeUnit) {
                    var tuField = model.field(channel);
                    channels[tuField] = channel;
                    // Construct TimeUnitComponents which will be combined into a
                    // TimeUnitNode. This node may need to be inserted into the
                    // dataflow if the selection is used across views that do not
                    // have these time units defined.
                    timeUnits[tuField] = {
                        as: tuField,
                        field: fieldDef.field,
                        timeUnit: fieldDef.timeUnit
                    };
                }
                else {
                    channels[fieldDef.field] = channel;
                }
            }
            else {
                log.warn(log.message.cannotProjectOnChannelWithoutField(channel));
            }
        });
        var projection = selCmpt.project || (selCmpt.project = []);
        for (var field in channels) {
            if (channels.hasOwnProperty(field)) {
                projection.push({ field: field, channel: channels[field] });
            }
        }
        var fields = selCmpt.fields || (selCmpt.fields = {});
        projection.filter(function (p) { return p.channel; }).forEach(function (p) { return fields[p.channel] = p.field; });
        if (util_1.keys(timeUnits).length) {
            selCmpt.timeUnit = new timeunit_1.TimeUnitNode(timeUnits);
        }
    }
};
exports.default = project;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL3Byb2plY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxrQ0FBb0M7QUFFcEMsc0NBQW1DO0FBQ25DLGdEQUFvRTtBQUlwRSxJQUFNLE9BQU8sR0FBc0I7SUFDakMsR0FBRyxFQUFFLFVBQVMsTUFBeUM7UUFDckQsSUFBTSxHQUFHLEdBQUcsTUFBc0IsQ0FBQztRQUNuQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUM7SUFDakUsQ0FBQztJQUVELEtBQUssRUFBRSxVQUFTLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTztRQUNwQyxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBTSxTQUFTLEdBQXVDLEVBQUUsQ0FBQztRQUV6RCwwREFBMEQ7UUFDMUQsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssSUFBSyxPQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQXRCLENBQXNCLENBQUMsQ0FBQztRQUVqRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBeUI7WUFDekQsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNyQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO29CQUU1Qiw2REFBNkQ7b0JBQzdELDJEQUEyRDtvQkFDM0QsNkRBQTZEO29CQUM3RCxpQ0FBaUM7b0JBQ2pDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRzt3QkFDbkIsRUFBRSxFQUFFLE9BQU87d0JBQ1gsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLO3dCQUNyQixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7cUJBQzVCLENBQUM7Z0JBQ0osQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQkFDckMsQ0FBQztZQUNILENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsa0NBQWtDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNwRSxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM3RCxHQUFHLENBQUMsQ0FBQyxJQUFNLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUM1RCxDQUFDO1FBQ0gsQ0FBQztRQUVELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsT0FBTyxFQUFULENBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO1FBRWhGLEVBQUUsQ0FBQyxDQUFDLFdBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSx1QkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELENBQUM7SUFDSCxDQUFDO0NBQ0YsQ0FBQztBQUVpQiwwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U2luZ2xlRGVmQ2hhbm5lbH0gZnJvbSAnLi4vLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vLi4vbG9nJztcbmltcG9ydCB7U2VsZWN0aW9uRGVmfSBmcm9tICcuLi8uLi8uLi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtrZXlzfSBmcm9tICcuLi8uLi8uLi91dGlsJztcbmltcG9ydCB7VGltZVVuaXRDb21wb25lbnQsIFRpbWVVbml0Tm9kZX0gZnJvbSAnLi4vLi4vZGF0YS90aW1ldW5pdCc7XG5pbXBvcnQge1NlbGVjdGlvbkNvbXBvbmVudH0gZnJvbSAnLi4vc2VsZWN0aW9uJztcbmltcG9ydCB7VHJhbnNmb3JtQ29tcGlsZXJ9IGZyb20gJy4vdHJhbnNmb3Jtcyc7XG5cbmNvbnN0IHByb2plY3Q6IFRyYW5zZm9ybUNvbXBpbGVyID0ge1xuICBoYXM6IGZ1bmN0aW9uKHNlbERlZjogU2VsZWN0aW9uQ29tcG9uZW50IHwgU2VsZWN0aW9uRGVmKSB7XG4gICAgY29uc3QgZGVmID0gc2VsRGVmIGFzIFNlbGVjdGlvbkRlZjtcbiAgICByZXR1cm4gZGVmLmZpZWxkcyAhPT0gdW5kZWZpbmVkIHx8IGRlZi5lbmNvZGluZ3MgIT09IHVuZGVmaW5lZDtcbiAgfSxcblxuICBwYXJzZTogZnVuY3Rpb24obW9kZWwsIHNlbERlZiwgc2VsQ21wdCkge1xuICAgIGNvbnN0IGNoYW5uZWxzID0ge307XG4gICAgY29uc3QgdGltZVVuaXRzOiB7W2tleTogc3RyaW5nXTogVGltZVVuaXRDb21wb25lbnR9ID0ge307XG5cbiAgICAvLyBUT0RPOiBmaW5kIGEgcG9zc2libGUgY2hhbm5lbCBtYXBwaW5nIGZvciB0aGVzZSBmaWVsZHMuXG4gICAgKHNlbERlZi5maWVsZHMgfHwgW10pLmZvckVhY2goKGZpZWxkKSA9PiBjaGFubmVsc1tmaWVsZF0gPSBudWxsKTtcblxuICAgIChzZWxEZWYuZW5jb2RpbmdzIHx8IFtdKS5mb3JFYWNoKChjaGFubmVsOiBTaW5nbGVEZWZDaGFubmVsKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgICAgaWYgKGZpZWxkRGVmKSB7XG4gICAgICAgIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgICAgICAgIGNvbnN0IHR1RmllbGQgPSBtb2RlbC5maWVsZChjaGFubmVsKTtcbiAgICAgICAgICBjaGFubmVsc1t0dUZpZWxkXSA9IGNoYW5uZWw7XG5cbiAgICAgICAgICAvLyBDb25zdHJ1Y3QgVGltZVVuaXRDb21wb25lbnRzIHdoaWNoIHdpbGwgYmUgY29tYmluZWQgaW50byBhXG4gICAgICAgICAgLy8gVGltZVVuaXROb2RlLiBUaGlzIG5vZGUgbWF5IG5lZWQgdG8gYmUgaW5zZXJ0ZWQgaW50byB0aGVcbiAgICAgICAgICAvLyBkYXRhZmxvdyBpZiB0aGUgc2VsZWN0aW9uIGlzIHVzZWQgYWNyb3NzIHZpZXdzIHRoYXQgZG8gbm90XG4gICAgICAgICAgLy8gaGF2ZSB0aGVzZSB0aW1lIHVuaXRzIGRlZmluZWQuXG4gICAgICAgICAgdGltZVVuaXRzW3R1RmllbGRdID0ge1xuICAgICAgICAgICAgYXM6IHR1RmllbGQsXG4gICAgICAgICAgICBmaWVsZDogZmllbGREZWYuZmllbGQsXG4gICAgICAgICAgICB0aW1lVW5pdDogZmllbGREZWYudGltZVVuaXRcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoYW5uZWxzW2ZpZWxkRGVmLmZpZWxkXSA9IGNoYW5uZWw7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmNhbm5vdFByb2plY3RPbkNoYW5uZWxXaXRob3V0RmllbGQoY2hhbm5lbCkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvamVjdGlvbiA9IHNlbENtcHQucHJvamVjdCB8fCAoc2VsQ21wdC5wcm9qZWN0ID0gW10pO1xuICAgIGZvciAoY29uc3QgZmllbGQgaW4gY2hhbm5lbHMpIHtcbiAgICAgIGlmIChjaGFubmVscy5oYXNPd25Qcm9wZXJ0eShmaWVsZCkpIHtcbiAgICAgICAgcHJvamVjdGlvbi5wdXNoKHtmaWVsZDogZmllbGQsIGNoYW5uZWw6IGNoYW5uZWxzW2ZpZWxkXX0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZpZWxkcyA9IHNlbENtcHQuZmllbGRzIHx8IChzZWxDbXB0LmZpZWxkcyA9IHt9KTtcbiAgICBwcm9qZWN0aW9uLmZpbHRlcigocCkgPT4gcC5jaGFubmVsKS5mb3JFYWNoKChwKSA9PiBmaWVsZHNbcC5jaGFubmVsXSA9IHAuZmllbGQpO1xuXG4gICAgaWYgKGtleXModGltZVVuaXRzKS5sZW5ndGgpIHtcbiAgICAgIHNlbENtcHQudGltZVVuaXQgPSBuZXcgVGltZVVuaXROb2RlKHRpbWVVbml0cyk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQge3Byb2plY3QgYXMgZGVmYXVsdH07XG4iXX0=