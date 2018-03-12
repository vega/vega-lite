"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var parse_1 = require("./parse");
function assembleLegends(model) {
    var legendComponentIndex = model.component.legends;
    var legendByDomain = {};
    for (var _i = 0, _a = util_1.keys(legendComponentIndex); _i < _a.length; _i++) {
        var channel = _a[_i];
        var scaleComponent = model.getScaleComponent(channel);
        var domainHash = util_1.stringify(scaleComponent.domains);
        if (legendByDomain[domainHash]) {
            for (var _b = 0, _c = legendByDomain[domainHash]; _b < _c.length; _b++) {
                var mergedLegendComponent = _c[_b];
                var merged = parse_1.mergeLegendComponent(mergedLegendComponent, legendComponentIndex[channel]);
                if (!merged) {
                    // If cannot merge, need to add this legend separately
                    legendByDomain[domainHash].push(legendComponentIndex[channel]);
                }
            }
        }
        else {
            legendByDomain[domainHash] = [legendComponentIndex[channel].clone()];
        }
    }
    return util_1.flatten(util_1.vals(legendByDomain)).map(function (legendCmpt) { return legendCmpt.combine(); });
}
exports.assembleLegends = assembleLegends;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvYXNzZW1ibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBMEQ7QUFJMUQsaUNBQTZDO0FBRTdDLHlCQUFnQyxLQUFZO0lBQzFDLElBQU0sb0JBQW9CLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7SUFDckQsSUFBTSxjQUFjLEdBQThDLEVBQUUsQ0FBQztJQUVyRSxHQUFHLENBQUMsQ0FBa0IsVUFBMEIsRUFBMUIsS0FBQSxXQUFJLENBQUMsb0JBQW9CLENBQUMsRUFBMUIsY0FBMEIsRUFBMUIsSUFBMEI7UUFBM0MsSUFBTSxPQUFPLFNBQUE7UUFDaEIsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELElBQU0sVUFBVSxHQUFHLGdCQUFTLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsR0FBRyxDQUFDLENBQWdDLFVBQTBCLEVBQTFCLEtBQUEsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUExQixjQUEwQixFQUExQixJQUEwQjtnQkFBekQsSUFBTSxxQkFBcUIsU0FBQTtnQkFDOUIsSUFBTSxNQUFNLEdBQUcsNEJBQW9CLENBQUMscUJBQXFCLEVBQUUsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDMUYsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNaLHNEQUFzRDtvQkFDdEQsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxDQUFDO2FBQ0Y7UUFFSCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixjQUFjLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBQyxjQUFPLENBQUMsV0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsVUFBMkIsSUFBSyxPQUFBLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO0FBQ2xHLENBQUM7QUF0QkQsMENBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmbGF0dGVuLCBrZXlzLCBzdHJpbmdpZnksIHZhbHN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0xlZ2VuZH0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtMZWdlbmRDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7bWVyZ2VMZWdlbmRDb21wb25lbnR9IGZyb20gJy4vcGFyc2UnO1xuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVMZWdlbmRzKG1vZGVsOiBNb2RlbCk6IFZnTGVnZW5kW10ge1xuICBjb25zdCBsZWdlbmRDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5sZWdlbmRzO1xuICBjb25zdCBsZWdlbmRCeURvbWFpbjoge1tkb21haW5IYXNoOiBzdHJpbmddOiBMZWdlbmRDb21wb25lbnRbXX0gPSB7fTtcblxuICBmb3IgKGNvbnN0IGNoYW5uZWwgb2Yga2V5cyhsZWdlbmRDb21wb25lbnRJbmRleCkpIHtcbiAgICBjb25zdCBzY2FsZUNvbXBvbmVudCA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpO1xuICAgIGNvbnN0IGRvbWFpbkhhc2ggPSBzdHJpbmdpZnkoc2NhbGVDb21wb25lbnQuZG9tYWlucyk7XG4gICAgaWYgKGxlZ2VuZEJ5RG9tYWluW2RvbWFpbkhhc2hdKSB7XG4gICAgICBmb3IgKGNvbnN0IG1lcmdlZExlZ2VuZENvbXBvbmVudCBvZiBsZWdlbmRCeURvbWFpbltkb21haW5IYXNoXSkge1xuICAgICAgICBjb25zdCBtZXJnZWQgPSBtZXJnZUxlZ2VuZENvbXBvbmVudChtZXJnZWRMZWdlbmRDb21wb25lbnQsIGxlZ2VuZENvbXBvbmVudEluZGV4W2NoYW5uZWxdKTtcbiAgICAgICAgaWYgKCFtZXJnZWQpIHtcbiAgICAgICAgICAvLyBJZiBjYW5ub3QgbWVyZ2UsIG5lZWQgdG8gYWRkIHRoaXMgbGVnZW5kIHNlcGFyYXRlbHlcbiAgICAgICAgICBsZWdlbmRCeURvbWFpbltkb21haW5IYXNoXS5wdXNoKGxlZ2VuZENvbXBvbmVudEluZGV4W2NoYW5uZWxdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGxlZ2VuZEJ5RG9tYWluW2RvbWFpbkhhc2hdID0gW2xlZ2VuZENvbXBvbmVudEluZGV4W2NoYW5uZWxdLmNsb25lKCldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmbGF0dGVuKHZhbHMobGVnZW5kQnlEb21haW4pKS5tYXAoKGxlZ2VuZENtcHQ6IExlZ2VuZENvbXBvbmVudCkgPT4gbGVnZW5kQ21wdC5jb21iaW5lKCkpO1xufVxuIl19