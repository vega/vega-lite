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
            selCmpt.timeUnit = new timeunit_1.TimeUnitNode(null, timeUnits);
        }
    }
};
exports.default = project;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL3Byb2plY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxrQ0FBb0M7QUFFcEMsc0NBQW1DO0FBQ25DLGdEQUFvRTtBQUlwRSxJQUFNLE9BQU8sR0FBc0I7SUFDakMsR0FBRyxFQUFFLFVBQVMsTUFBeUM7UUFDckQsSUFBTSxHQUFHLEdBQUcsTUFBc0IsQ0FBQztRQUNuQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUM7SUFDakUsQ0FBQztJQUVELEtBQUssRUFBRSxVQUFTLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTztRQUNwQyxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBTSxTQUFTLEdBQXVDLEVBQUUsQ0FBQztRQUV6RCwwREFBMEQ7UUFDMUQsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssSUFBSyxPQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQXRCLENBQXNCLENBQUMsQ0FBQztRQUVqRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBeUI7WUFDekQsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN2QyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO29CQUU1Qiw2REFBNkQ7b0JBQzdELDJEQUEyRDtvQkFDM0QsNkRBQTZEO29CQUM3RCxpQ0FBaUM7b0JBQ2pDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRzt3QkFDbkIsRUFBRSxFQUFFLE9BQU87d0JBQ1gsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLO3dCQUNyQixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7cUJBQzVCLENBQUM7Z0JBQ0osQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQkFDckMsQ0FBQztZQUNILENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsa0NBQWtDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNwRSxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM3RCxHQUFHLENBQUMsQ0FBQyxJQUFNLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUM1RCxDQUFDO1FBQ0gsQ0FBQztRQUVELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsT0FBTyxFQUFULENBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO1FBRWhGLEVBQUUsQ0FBQyxDQUFDLFdBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSx1QkFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN2RCxDQUFDO0lBQ0gsQ0FBQztDQUNGLENBQUM7QUFFaUIsMEJBQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NpbmdsZURlZkNoYW5uZWx9IGZyb20gJy4uLy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uLy4uL2xvZyc7XG5pbXBvcnQge1NlbGVjdGlvbkRlZn0gZnJvbSAnLi4vLi4vLi4vc2VsZWN0aW9uJztcbmltcG9ydCB7a2V5c30gZnJvbSAnLi4vLi4vLi4vdXRpbCc7XG5pbXBvcnQge1RpbWVVbml0Q29tcG9uZW50LCBUaW1lVW5pdE5vZGV9IGZyb20gJy4uLy4uL2RhdGEvdGltZXVuaXQnO1xuaW1wb3J0IHtTZWxlY3Rpb25Db21wb25lbnR9IGZyb20gJy4uL3NlbGVjdGlvbic7XG5pbXBvcnQge1RyYW5zZm9ybUNvbXBpbGVyfSBmcm9tICcuL3RyYW5zZm9ybXMnO1xuXG5jb25zdCBwcm9qZWN0OiBUcmFuc2Zvcm1Db21waWxlciA9IHtcbiAgaGFzOiBmdW5jdGlvbihzZWxEZWY6IFNlbGVjdGlvbkNvbXBvbmVudCB8IFNlbGVjdGlvbkRlZikge1xuICAgIGNvbnN0IGRlZiA9IHNlbERlZiBhcyBTZWxlY3Rpb25EZWY7XG4gICAgcmV0dXJuIGRlZi5maWVsZHMgIT09IHVuZGVmaW5lZCB8fCBkZWYuZW5jb2RpbmdzICE9PSB1bmRlZmluZWQ7XG4gIH0sXG5cbiAgcGFyc2U6IGZ1bmN0aW9uKG1vZGVsLCBzZWxEZWYsIHNlbENtcHQpIHtcbiAgICBjb25zdCBjaGFubmVscyA9IHt9O1xuICAgIGNvbnN0IHRpbWVVbml0czoge1trZXk6IHN0cmluZ106IFRpbWVVbml0Q29tcG9uZW50fSA9IHt9O1xuXG4gICAgLy8gVE9ETzogZmluZCBhIHBvc3NpYmxlIGNoYW5uZWwgbWFwcGluZyBmb3IgdGhlc2UgZmllbGRzLlxuICAgIChzZWxEZWYuZmllbGRzIHx8IFtdKS5mb3JFYWNoKChmaWVsZCkgPT4gY2hhbm5lbHNbZmllbGRdID0gbnVsbCk7XG5cbiAgICAoc2VsRGVmLmVuY29kaW5ncyB8fCBbXSkuZm9yRWFjaCgoY2hhbm5lbDogU2luZ2xlRGVmQ2hhbm5lbCkgPT4ge1xuICAgICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcbiAgICAgIGlmIChmaWVsZERlZikge1xuICAgICAgICBpZiAoZmllbGREZWYudGltZVVuaXQpIHtcbiAgICAgICAgICBjb25zdCB0dUZpZWxkID0gbW9kZWwudmdGaWVsZChjaGFubmVsKTtcbiAgICAgICAgICBjaGFubmVsc1t0dUZpZWxkXSA9IGNoYW5uZWw7XG5cbiAgICAgICAgICAvLyBDb25zdHJ1Y3QgVGltZVVuaXRDb21wb25lbnRzIHdoaWNoIHdpbGwgYmUgY29tYmluZWQgaW50byBhXG4gICAgICAgICAgLy8gVGltZVVuaXROb2RlLiBUaGlzIG5vZGUgbWF5IG5lZWQgdG8gYmUgaW5zZXJ0ZWQgaW50byB0aGVcbiAgICAgICAgICAvLyBkYXRhZmxvdyBpZiB0aGUgc2VsZWN0aW9uIGlzIHVzZWQgYWNyb3NzIHZpZXdzIHRoYXQgZG8gbm90XG4gICAgICAgICAgLy8gaGF2ZSB0aGVzZSB0aW1lIHVuaXRzIGRlZmluZWQuXG4gICAgICAgICAgdGltZVVuaXRzW3R1RmllbGRdID0ge1xuICAgICAgICAgICAgYXM6IHR1RmllbGQsXG4gICAgICAgICAgICBmaWVsZDogZmllbGREZWYuZmllbGQsXG4gICAgICAgICAgICB0aW1lVW5pdDogZmllbGREZWYudGltZVVuaXRcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoYW5uZWxzW2ZpZWxkRGVmLmZpZWxkXSA9IGNoYW5uZWw7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmNhbm5vdFByb2plY3RPbkNoYW5uZWxXaXRob3V0RmllbGQoY2hhbm5lbCkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvamVjdGlvbiA9IHNlbENtcHQucHJvamVjdCB8fCAoc2VsQ21wdC5wcm9qZWN0ID0gW10pO1xuICAgIGZvciAoY29uc3QgZmllbGQgaW4gY2hhbm5lbHMpIHtcbiAgICAgIGlmIChjaGFubmVscy5oYXNPd25Qcm9wZXJ0eShmaWVsZCkpIHtcbiAgICAgICAgcHJvamVjdGlvbi5wdXNoKHtmaWVsZDogZmllbGQsIGNoYW5uZWw6IGNoYW5uZWxzW2ZpZWxkXX0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZpZWxkcyA9IHNlbENtcHQuZmllbGRzIHx8IChzZWxDbXB0LmZpZWxkcyA9IHt9KTtcbiAgICBwcm9qZWN0aW9uLmZpbHRlcigocCkgPT4gcC5jaGFubmVsKS5mb3JFYWNoKChwKSA9PiBmaWVsZHNbcC5jaGFubmVsXSA9IHAuZmllbGQpO1xuXG4gICAgaWYgKGtleXModGltZVVuaXRzKS5sZW5ndGgpIHtcbiAgICAgIHNlbENtcHQudGltZVVuaXQgPSBuZXcgVGltZVVuaXROb2RlKG51bGwsIHRpbWVVbml0cyk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQge3Byb2plY3QgYXMgZGVmYXVsdH07XG4iXX0=