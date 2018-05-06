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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvYXNzZW1ibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBMEQ7QUFJMUQsaUNBQTZDO0FBRTdDLHlCQUFnQyxLQUFZO0lBQzFDLElBQU0sb0JBQW9CLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7SUFDckQsSUFBTSxjQUFjLEdBQThDLEVBQUUsQ0FBQztJQUVyRSxLQUFzQixVQUEwQixFQUExQixLQUFBLFdBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUExQixjQUEwQixFQUExQixJQUEwQjtRQUEzQyxJQUFNLE9BQU8sU0FBQTtRQUNoQixJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEQsSUFBTSxVQUFVLEdBQUcsZ0JBQVMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckQsSUFBSSxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDOUIsS0FBb0MsVUFBMEIsRUFBMUIsS0FBQSxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQTFCLGNBQTBCLEVBQTFCLElBQTBCO2dCQUF6RCxJQUFNLHFCQUFxQixTQUFBO2dCQUM5QixJQUFNLE1BQU0sR0FBRyw0QkFBb0IsQ0FBQyxxQkFBcUIsRUFBRSxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUMxRixJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNYLHNEQUFzRDtvQkFDdEQsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUNoRTthQUNGO1NBRUY7YUFBTTtZQUNMLGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDdEU7S0FDRjtJQUVELE9BQU8sY0FBTyxDQUFDLFdBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLFVBQTJCLElBQUssT0FBQSxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQXBCLENBQW9CLENBQUMsQ0FBQztBQUNsRyxDQUFDO0FBdEJELDBDQXNCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZmxhdHRlbiwga2V5cywgc3RyaW5naWZ5LCB2YWxzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdMZWdlbmR9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7TGVnZW5kQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQge21lcmdlTGVnZW5kQ29tcG9uZW50fSBmcm9tICcuL3BhcnNlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlTGVnZW5kcyhtb2RlbDogTW9kZWwpOiBWZ0xlZ2VuZFtdIHtcbiAgY29uc3QgbGVnZW5kQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQubGVnZW5kcztcbiAgY29uc3QgbGVnZW5kQnlEb21haW46IHtbZG9tYWluSGFzaDogc3RyaW5nXTogTGVnZW5kQ29tcG9uZW50W119ID0ge307XG5cbiAgZm9yIChjb25zdCBjaGFubmVsIG9mIGtleXMobGVnZW5kQ29tcG9uZW50SW5kZXgpKSB7XG4gICAgY29uc3Qgc2NhbGVDb21wb25lbnQgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKTtcbiAgICBjb25zdCBkb21haW5IYXNoID0gc3RyaW5naWZ5KHNjYWxlQ29tcG9uZW50LmRvbWFpbnMpO1xuICAgIGlmIChsZWdlbmRCeURvbWFpbltkb21haW5IYXNoXSkge1xuICAgICAgZm9yIChjb25zdCBtZXJnZWRMZWdlbmRDb21wb25lbnQgb2YgbGVnZW5kQnlEb21haW5bZG9tYWluSGFzaF0pIHtcbiAgICAgICAgY29uc3QgbWVyZ2VkID0gbWVyZ2VMZWdlbmRDb21wb25lbnQobWVyZ2VkTGVnZW5kQ29tcG9uZW50LCBsZWdlbmRDb21wb25lbnRJbmRleFtjaGFubmVsXSk7XG4gICAgICAgIGlmICghbWVyZ2VkKSB7XG4gICAgICAgICAgLy8gSWYgY2Fubm90IG1lcmdlLCBuZWVkIHRvIGFkZCB0aGlzIGxlZ2VuZCBzZXBhcmF0ZWx5XG4gICAgICAgICAgbGVnZW5kQnlEb21haW5bZG9tYWluSGFzaF0ucHVzaChsZWdlbmRDb21wb25lbnRJbmRleFtjaGFubmVsXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICBsZWdlbmRCeURvbWFpbltkb21haW5IYXNoXSA9IFtsZWdlbmRDb21wb25lbnRJbmRleFtjaGFubmVsXS5jbG9uZSgpXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmxhdHRlbih2YWxzKGxlZ2VuZEJ5RG9tYWluKSkubWFwKChsZWdlbmRDbXB0OiBMZWdlbmRDb21wb25lbnQpID0+IGxlZ2VuZENtcHQuY29tYmluZSgpKTtcbn1cbiJdfQ==