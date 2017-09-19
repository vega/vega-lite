"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mainAxisReducer = getAxisReducer('main');
var gridAxisReducer = getAxisReducer('grid');
function getAxisReducer(axisType) {
    return function (axes, axis) {
        if (axis[axisType]) {
            // Need to cast here so it's not longer partial type.
            axes.push(axis[axisType].combine());
        }
        return axes;
    };
}
function assembleAxes(axisComponents) {
    return [].concat(axisComponents.x ? [].concat(axisComponents.x.reduce(mainAxisReducer, []), axisComponents.x.reduce(gridAxisReducer, [])) : [], axisComponents.y ? [].concat(axisComponents.y.reduce(mainAxisReducer, []), axisComponents.y.reduce(gridAxisReducer, [])) : []);
}
exports.assembleAxes = assembleAxes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsSUFBTSxlQUFlLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9DLElBQU0sZUFBZSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUUvQyx3QkFBd0IsUUFBeUI7SUFDL0MsTUFBTSxDQUFDLFVBQUMsSUFBYyxFQUFFLElBQW1CO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIscURBQXFEO1lBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sRUFBWSxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsc0JBQTZCLGNBQWtDO0lBQzdELE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUNkLGNBQWMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FDMUIsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUM1QyxjQUFjLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQzdDLEdBQUcsRUFBRSxFQUNOLGNBQWMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FDMUIsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUM1QyxjQUFjLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQzdDLEdBQUcsRUFBRSxDQUNQLENBQUM7QUFDSixDQUFDO0FBWEQsb0NBV0MifQ==