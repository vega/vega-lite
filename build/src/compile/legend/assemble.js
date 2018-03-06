"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stringify = require("json-stable-stringify");
var util_1 = require("../../util");
var parse_1 = require("./parse");
function assembleLegends(model) {
    var legendComponentIndex = model.component.legends;
    var legendByDomain = {};
    for (var _i = 0, _a = util_1.keys(legendComponentIndex); _i < _a.length; _i++) {
        var channel = _a[_i];
        var scaleComponent = model.getScaleComponent(channel);
        var domainHash = stringify(scaleComponent.domains);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvYXNzZW1ibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBbUQ7QUFFbkQsbUNBQStDO0FBSS9DLGlDQUE2QztBQUU3Qyx5QkFBZ0MsS0FBWTtJQUMxQyxJQUFNLG9CQUFvQixHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0lBQ3JELElBQU0sY0FBYyxHQUE4QyxFQUFFLENBQUM7SUFFckUsR0FBRyxDQUFDLENBQWtCLFVBQTBCLEVBQTFCLEtBQUEsV0FBSSxDQUFDLG9CQUFvQixDQUFDLEVBQTFCLGNBQTBCLEVBQTFCLElBQTBCO1FBQTNDLElBQU0sT0FBTyxTQUFBO1FBQ2hCLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4RCxJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsR0FBRyxDQUFDLENBQWdDLFVBQTBCLEVBQTFCLEtBQUEsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUExQixjQUEwQixFQUExQixJQUEwQjtnQkFBekQsSUFBTSxxQkFBcUIsU0FBQTtnQkFDOUIsSUFBTSxNQUFNLEdBQUcsNEJBQW9CLENBQUMscUJBQXFCLEVBQUUsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDMUYsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNaLHNEQUFzRDtvQkFDdEQsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxDQUFDO2FBQ0Y7UUFFSCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixjQUFjLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBQyxjQUFPLENBQUMsV0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsVUFBMkIsSUFBSyxPQUFBLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO0FBQ2xHLENBQUM7QUF0QkQsMENBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc3RyaW5naWZ5IGZyb20gJ2pzb24tc3RhYmxlLXN0cmluZ2lmeSc7XG5cbmltcG9ydCB7ZmxhdHRlbiwga2V5cywgdmFsc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnTGVnZW5kfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge0xlZ2VuZENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHttZXJnZUxlZ2VuZENvbXBvbmVudH0gZnJvbSAnLi9wYXJzZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZUxlZ2VuZHMobW9kZWw6IE1vZGVsKTogVmdMZWdlbmRbXSB7XG4gIGNvbnN0IGxlZ2VuZENvbXBvbmVudEluZGV4ID0gbW9kZWwuY29tcG9uZW50LmxlZ2VuZHM7XG4gIGNvbnN0IGxlZ2VuZEJ5RG9tYWluOiB7W2RvbWFpbkhhc2g6IHN0cmluZ106IExlZ2VuZENvbXBvbmVudFtdfSA9IHt9O1xuXG4gIGZvciAoY29uc3QgY2hhbm5lbCBvZiBrZXlzKGxlZ2VuZENvbXBvbmVudEluZGV4KSkge1xuICAgIGNvbnN0IHNjYWxlQ29tcG9uZW50ID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCk7XG4gICAgY29uc3QgZG9tYWluSGFzaCA9IHN0cmluZ2lmeShzY2FsZUNvbXBvbmVudC5kb21haW5zKTtcbiAgICBpZiAobGVnZW5kQnlEb21haW5bZG9tYWluSGFzaF0pIHtcbiAgICAgIGZvciAoY29uc3QgbWVyZ2VkTGVnZW5kQ29tcG9uZW50IG9mIGxlZ2VuZEJ5RG9tYWluW2RvbWFpbkhhc2hdKSB7XG4gICAgICAgIGNvbnN0IG1lcmdlZCA9IG1lcmdlTGVnZW5kQ29tcG9uZW50KG1lcmdlZExlZ2VuZENvbXBvbmVudCwgbGVnZW5kQ29tcG9uZW50SW5kZXhbY2hhbm5lbF0pO1xuICAgICAgICBpZiAoIW1lcmdlZCkge1xuICAgICAgICAgIC8vIElmIGNhbm5vdCBtZXJnZSwgbmVlZCB0byBhZGQgdGhpcyBsZWdlbmQgc2VwYXJhdGVseVxuICAgICAgICAgIGxlZ2VuZEJ5RG9tYWluW2RvbWFpbkhhc2hdLnB1c2gobGVnZW5kQ29tcG9uZW50SW5kZXhbY2hhbm5lbF0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgbGVnZW5kQnlEb21haW5bZG9tYWluSGFzaF0gPSBbbGVnZW5kQ29tcG9uZW50SW5kZXhbY2hhbm5lbF0uY2xvbmUoKV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZsYXR0ZW4odmFscyhsZWdlbmRCeURvbWFpbikpLm1hcCgobGVnZW5kQ21wdDogTGVnZW5kQ29tcG9uZW50KSA9PiBsZWdlbmRDbXB0LmNvbWJpbmUoKSk7XG59XG4iXX0=