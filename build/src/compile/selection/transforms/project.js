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
                    var tuField = model.vgField(channel);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL3Byb2plY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxrQ0FBb0M7QUFFcEMsc0NBQW1DO0FBQ25DLGdEQUFvRTtBQUlwRSxJQUFNLE9BQU8sR0FBc0I7SUFDakMsR0FBRyxFQUFFLFVBQVMsTUFBeUM7UUFDckQsSUFBTSxHQUFHLEdBQUcsTUFBc0IsQ0FBQztRQUNuQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUM7SUFDakUsQ0FBQztJQUVELEtBQUssRUFBRSxVQUFTLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTztRQUNwQyxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBTSxTQUFTLEdBQXVDLEVBQUUsQ0FBQztRQUV6RCwwREFBMEQ7UUFDMUQsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssSUFBSyxPQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQXRCLENBQXNCLENBQUMsQ0FBQztRQUVqRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBeUI7WUFDekQsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN2QyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO29CQUU1Qiw2REFBNkQ7b0JBQzdELDJEQUEyRDtvQkFDM0QsNkRBQTZEO29CQUM3RCxpQ0FBaUM7b0JBQ2pDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRzt3QkFDbkIsRUFBRSxFQUFFLE9BQU87d0JBQ1gsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLO3dCQUNyQixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7cUJBQzVCLENBQUM7Z0JBQ0osQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQkFDckMsQ0FBQztZQUNILENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsa0NBQWtDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNwRSxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM3RCxHQUFHLENBQUMsQ0FBQyxJQUFNLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUM1RCxDQUFDO1FBQ0gsQ0FBQztRQUVELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsT0FBTyxFQUFULENBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO1FBRWhGLEVBQUUsQ0FBQyxDQUFDLFdBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSx1QkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELENBQUM7SUFDSCxDQUFDO0NBQ0YsQ0FBQztBQUVpQiwwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U2luZ2xlRGVmQ2hhbm5lbH0gZnJvbSAnLi4vLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vLi4vbG9nJztcbmltcG9ydCB7U2VsZWN0aW9uRGVmfSBmcm9tICcuLi8uLi8uLi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtrZXlzfSBmcm9tICcuLi8uLi8uLi91dGlsJztcbmltcG9ydCB7VGltZVVuaXRDb21wb25lbnQsIFRpbWVVbml0Tm9kZX0gZnJvbSAnLi4vLi4vZGF0YS90aW1ldW5pdCc7XG5pbXBvcnQge1NlbGVjdGlvbkNvbXBvbmVudH0gZnJvbSAnLi4vc2VsZWN0aW9uJztcbmltcG9ydCB7VHJhbnNmb3JtQ29tcGlsZXJ9IGZyb20gJy4vdHJhbnNmb3Jtcyc7XG5cbmNvbnN0IHByb2plY3Q6IFRyYW5zZm9ybUNvbXBpbGVyID0ge1xuICBoYXM6IGZ1bmN0aW9uKHNlbERlZjogU2VsZWN0aW9uQ29tcG9uZW50IHwgU2VsZWN0aW9uRGVmKSB7XG4gICAgY29uc3QgZGVmID0gc2VsRGVmIGFzIFNlbGVjdGlvbkRlZjtcbiAgICByZXR1cm4gZGVmLmZpZWxkcyAhPT0gdW5kZWZpbmVkIHx8IGRlZi5lbmNvZGluZ3MgIT09IHVuZGVmaW5lZDtcbiAgfSxcblxuICBwYXJzZTogZnVuY3Rpb24obW9kZWwsIHNlbERlZiwgc2VsQ21wdCkge1xuICAgIGNvbnN0IGNoYW5uZWxzID0ge307XG4gICAgY29uc3QgdGltZVVuaXRzOiB7W2tleTogc3RyaW5nXTogVGltZVVuaXRDb21wb25lbnR9ID0ge307XG5cbiAgICAvLyBUT0RPOiBmaW5kIGEgcG9zc2libGUgY2hhbm5lbCBtYXBwaW5nIGZvciB0aGVzZSBmaWVsZHMuXG4gICAgKHNlbERlZi5maWVsZHMgfHwgW10pLmZvckVhY2goKGZpZWxkKSA9PiBjaGFubmVsc1tmaWVsZF0gPSBudWxsKTtcblxuICAgIChzZWxEZWYuZW5jb2RpbmdzIHx8IFtdKS5mb3JFYWNoKChjaGFubmVsOiBTaW5nbGVEZWZDaGFubmVsKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgICAgaWYgKGZpZWxkRGVmKSB7XG4gICAgICAgIGlmIChmaWVsZERlZi50aW1lVW5pdCkge1xuICAgICAgICAgIGNvbnN0IHR1RmllbGQgPSBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwpO1xuICAgICAgICAgIGNoYW5uZWxzW3R1RmllbGRdID0gY2hhbm5lbDtcblxuICAgICAgICAgIC8vIENvbnN0cnVjdCBUaW1lVW5pdENvbXBvbmVudHMgd2hpY2ggd2lsbCBiZSBjb21iaW5lZCBpbnRvIGFcbiAgICAgICAgICAvLyBUaW1lVW5pdE5vZGUuIFRoaXMgbm9kZSBtYXkgbmVlZCB0byBiZSBpbnNlcnRlZCBpbnRvIHRoZVxuICAgICAgICAgIC8vIGRhdGFmbG93IGlmIHRoZSBzZWxlY3Rpb24gaXMgdXNlZCBhY3Jvc3Mgdmlld3MgdGhhdCBkbyBub3RcbiAgICAgICAgICAvLyBoYXZlIHRoZXNlIHRpbWUgdW5pdHMgZGVmaW5lZC5cbiAgICAgICAgICB0aW1lVW5pdHNbdHVGaWVsZF0gPSB7XG4gICAgICAgICAgICBhczogdHVGaWVsZCxcbiAgICAgICAgICAgIGZpZWxkOiBmaWVsZERlZi5maWVsZCxcbiAgICAgICAgICAgIHRpbWVVbml0OiBmaWVsZERlZi50aW1lVW5pdFxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hhbm5lbHNbZmllbGREZWYuZmllbGRdID0gY2hhbm5lbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuY2Fubm90UHJvamVjdE9uQ2hhbm5lbFdpdGhvdXRGaWVsZChjaGFubmVsKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9qZWN0aW9uID0gc2VsQ21wdC5wcm9qZWN0IHx8IChzZWxDbXB0LnByb2plY3QgPSBbXSk7XG4gICAgZm9yIChjb25zdCBmaWVsZCBpbiBjaGFubmVscykge1xuICAgICAgaWYgKGNoYW5uZWxzLmhhc093blByb3BlcnR5KGZpZWxkKSkge1xuICAgICAgICBwcm9qZWN0aW9uLnB1c2goe2ZpZWxkOiBmaWVsZCwgY2hhbm5lbDogY2hhbm5lbHNbZmllbGRdfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZmllbGRzID0gc2VsQ21wdC5maWVsZHMgfHwgKHNlbENtcHQuZmllbGRzID0ge30pO1xuICAgIHByb2plY3Rpb24uZmlsdGVyKChwKSA9PiBwLmNoYW5uZWwpLmZvckVhY2goKHApID0+IGZpZWxkc1twLmNoYW5uZWxdID0gcC5maWVsZCk7XG5cbiAgICBpZiAoa2V5cyh0aW1lVW5pdHMpLmxlbmd0aCkge1xuICAgICAgc2VsQ21wdC50aW1lVW5pdCA9IG5ldyBUaW1lVW5pdE5vZGUodGltZVVuaXRzKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCB7cHJvamVjdCBhcyBkZWZhdWx0fTtcbiJdfQ==