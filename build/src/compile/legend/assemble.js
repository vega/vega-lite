import { flatten, keys, stringify, vals } from '../../util';
import { mergeLegendComponent } from './parse';
export function assembleLegends(model) {
    var legendComponentIndex = model.component.legends;
    var legendByDomain = {};
    for (var _i = 0, _a = keys(legendComponentIndex); _i < _a.length; _i++) {
        var channel = _a[_i];
        var scaleComponent = model.getScaleComponent(channel);
        var domainHash = stringify(scaleComponent.domains);
        if (legendByDomain[domainHash]) {
            for (var _b = 0, _c = legendByDomain[domainHash]; _b < _c.length; _b++) {
                var mergedLegendComponent = _c[_b];
                var merged = mergeLegendComponent(mergedLegendComponent, legendComponentIndex[channel]);
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
    return flatten(vals(legendByDomain)).map(function (legendCmpt) { return legendCmpt.combine(); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvYXNzZW1ibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUkxRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFN0MsTUFBTSwwQkFBMEIsS0FBWTtJQUMxQyxJQUFNLG9CQUFvQixHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0lBQ3JELElBQU0sY0FBYyxHQUE4QyxFQUFFLENBQUM7SUFFckUsS0FBc0IsVUFBMEIsRUFBMUIsS0FBQSxJQUFJLENBQUMsb0JBQW9CLENBQUMsRUFBMUIsY0FBMEIsRUFBMUIsSUFBMEI7UUFBM0MsSUFBTSxPQUFPLFNBQUE7UUFDaEIsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckQsSUFBSSxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDOUIsS0FBb0MsVUFBMEIsRUFBMUIsS0FBQSxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQTFCLGNBQTBCLEVBQTFCLElBQTBCO2dCQUF6RCxJQUFNLHFCQUFxQixTQUFBO2dCQUM5QixJQUFNLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxxQkFBcUIsRUFBRSxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUMxRixJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNYLHNEQUFzRDtvQkFDdEQsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUNoRTthQUNGO1NBRUY7YUFBTTtZQUNMLGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDdEU7S0FDRjtJQUVELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLFVBQTJCLElBQUssT0FBQSxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQXBCLENBQW9CLENBQUMsQ0FBQztBQUNsRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmbGF0dGVuLCBrZXlzLCBzdHJpbmdpZnksIHZhbHN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0xlZ2VuZH0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtMZWdlbmRDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7bWVyZ2VMZWdlbmRDb21wb25lbnR9IGZyb20gJy4vcGFyc2UnO1xuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVMZWdlbmRzKG1vZGVsOiBNb2RlbCk6IFZnTGVnZW5kW10ge1xuICBjb25zdCBsZWdlbmRDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5sZWdlbmRzO1xuICBjb25zdCBsZWdlbmRCeURvbWFpbjoge1tkb21haW5IYXNoOiBzdHJpbmddOiBMZWdlbmRDb21wb25lbnRbXX0gPSB7fTtcblxuICBmb3IgKGNvbnN0IGNoYW5uZWwgb2Yga2V5cyhsZWdlbmRDb21wb25lbnRJbmRleCkpIHtcbiAgICBjb25zdCBzY2FsZUNvbXBvbmVudCA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpO1xuICAgIGNvbnN0IGRvbWFpbkhhc2ggPSBzdHJpbmdpZnkoc2NhbGVDb21wb25lbnQuZG9tYWlucyk7XG4gICAgaWYgKGxlZ2VuZEJ5RG9tYWluW2RvbWFpbkhhc2hdKSB7XG4gICAgICBmb3IgKGNvbnN0IG1lcmdlZExlZ2VuZENvbXBvbmVudCBvZiBsZWdlbmRCeURvbWFpbltkb21haW5IYXNoXSkge1xuICAgICAgICBjb25zdCBtZXJnZWQgPSBtZXJnZUxlZ2VuZENvbXBvbmVudChtZXJnZWRMZWdlbmRDb21wb25lbnQsIGxlZ2VuZENvbXBvbmVudEluZGV4W2NoYW5uZWxdKTtcbiAgICAgICAgaWYgKCFtZXJnZWQpIHtcbiAgICAgICAgICAvLyBJZiBjYW5ub3QgbWVyZ2UsIG5lZWQgdG8gYWRkIHRoaXMgbGVnZW5kIHNlcGFyYXRlbHlcbiAgICAgICAgICBsZWdlbmRCeURvbWFpbltkb21haW5IYXNoXS5wdXNoKGxlZ2VuZENvbXBvbmVudEluZGV4W2NoYW5uZWxdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGxlZ2VuZEJ5RG9tYWluW2RvbWFpbkhhc2hdID0gW2xlZ2VuZENvbXBvbmVudEluZGV4W2NoYW5uZWxdLmNsb25lKCldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmbGF0dGVuKHZhbHMobGVnZW5kQnlEb21haW4pKS5tYXAoKGxlZ2VuZENtcHQ6IExlZ2VuZENvbXBvbmVudCkgPT4gbGVnZW5kQ21wdC5jb21iaW5lKCkpO1xufVxuIl19