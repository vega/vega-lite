"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERRORBAR = 'error-bar';
function normalizeErrorBar(spec) {
    // TODO: use selection
    var _m = spec.mark, _sel = spec.selection, _p = spec.projection, encoding = spec.encoding, outerSpec = __rest(spec, ["mark", "selection", "projection", "encoding"]);
    var _s = encoding.size, encodingWithoutSize = __rest(encoding, ["size"]);
    var _x2 = encoding.x2, _y2 = encoding.y2, encodingWithoutX2Y2 = __rest(encoding, ["x2", "y2"]);
    var _x = encodingWithoutX2Y2.x, _y = encodingWithoutX2Y2.y, encodingWithoutX_X2_Y_Y2 = __rest(encodingWithoutX2Y2, ["x", "y"]);
    if (!encoding.x2 && !encoding.y2) {
        throw new Error('Neither x2 or y2 provided');
    }
    return __assign({}, outerSpec, { layer: [
            {
                mark: 'rule',
                encoding: encodingWithoutSize
            }, {
                mark: 'tick',
                encoding: encodingWithoutX2Y2
            }, {
                mark: 'tick',
                encoding: encoding.x2 ? __assign({ x: encoding.x2, y: encoding.y }, encodingWithoutX_X2_Y_Y2) : __assign({ x: encoding.x, y: encoding.y2 }, encodingWithoutX_X2_Y_Y2)
            }
        ] });
}
exports.normalizeErrorBar = normalizeErrorBar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JiYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9zaXRlbWFyay9lcnJvcmJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS2EsUUFBQSxRQUFRLEdBQWdCLFdBQVcsQ0FBQztBQUdqRCwyQkFBa0MsSUFBZ0Q7SUFDaEYsc0JBQXNCO0lBQ2YsSUFBQSxjQUFRLEVBQUUscUJBQWUsRUFBRSxvQkFBYyxFQUFFLHdCQUFRLEVBQUUseUVBQVksQ0FBUztJQUMxRSxJQUFBLGtCQUFRLEVBQUUsZ0RBQXNCLENBQWE7SUFDN0MsSUFBQSxpQkFBTyxFQUFFLGlCQUFPLEVBQUUsb0RBQXNCLENBQWE7SUFDckQsSUFBQSwwQkFBSyxFQUFFLDBCQUFLLEVBQUUsa0VBQTJCLENBQXdCO0lBRXhFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsTUFBTSxjQUNELFNBQVMsSUFDWixLQUFLLEVBQUU7WUFDTDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsbUJBQW1CO2FBQzlCLEVBQUM7Z0JBQ0EsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLG1CQUFtQjthQUM5QixFQUFFO2dCQUNELElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsWUFDckIsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQ2QsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQ1Ysd0JBQXdCLEVBQzNCLENBQUMsWUFDRCxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFDYixDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsSUFDWCx3QkFBd0IsQ0FDNUI7YUFDRjtTQUNGLElBQ0Q7QUFDSixDQUFDO0FBbENELDhDQWtDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RmllbGR9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7RW5jb2Rpbmd9IGZyb20gJy4vLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtHZW5lcmljVW5pdFNwZWMsIE5vcm1hbGl6ZWRMYXllclNwZWN9IGZyb20gJy4vLi4vc3BlYyc7XG5cblxuZXhwb3J0IGNvbnN0IEVSUk9SQkFSOiAnZXJyb3ItYmFyJyA9ICdlcnJvci1iYXInO1xuZXhwb3J0IHR5cGUgRVJST1JCQVIgPSB0eXBlb2YgRVJST1JCQVI7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVFcnJvckJhcihzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8RmllbGQ+LCBFUlJPUkJBUj4pOiBOb3JtYWxpemVkTGF5ZXJTcGVjIHtcbiAgLy8gVE9ETzogdXNlIHNlbGVjdGlvblxuICBjb25zdCB7bWFyazogX20sIHNlbGVjdGlvbjogX3NlbCwgcHJvamVjdGlvbjogX3AsIGVuY29kaW5nLCAuLi5vdXRlclNwZWN9ID0gc3BlYztcbiAgY29uc3Qge3NpemU6IF9zLCAuLi5lbmNvZGluZ1dpdGhvdXRTaXplfSA9IGVuY29kaW5nO1xuICBjb25zdCB7eDI6IF94MiwgeTI6IF95MiwgLi4uZW5jb2RpbmdXaXRob3V0WDJZMn0gPSBlbmNvZGluZztcbiAgY29uc3Qge3g6IF94LCB5OiBfeSwgLi4uZW5jb2RpbmdXaXRob3V0WF9YMl9ZX1kyfSA9IGVuY29kaW5nV2l0aG91dFgyWTI7XG5cbiAgaWYgKCFlbmNvZGluZy54MiAmJiAhZW5jb2RpbmcueTIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05laXRoZXIgeDIgb3IgeTIgcHJvdmlkZWQnKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ub3V0ZXJTcGVjLFxuICAgIGxheWVyOiBbXG4gICAgICB7XG4gICAgICAgIG1hcms6ICdydWxlJyxcbiAgICAgICAgZW5jb2Rpbmc6IGVuY29kaW5nV2l0aG91dFNpemVcbiAgICAgIH0seyAvLyBMb3dlciB0aWNrXG4gICAgICAgIG1hcms6ICd0aWNrJyxcbiAgICAgICAgZW5jb2Rpbmc6IGVuY29kaW5nV2l0aG91dFgyWTJcbiAgICAgIH0sIHsgLy8gVXBwZXIgdGlja1xuICAgICAgICBtYXJrOiAndGljaycsXG4gICAgICAgIGVuY29kaW5nOiBlbmNvZGluZy54MiA/IHtcbiAgICAgICAgICB4OiBlbmNvZGluZy54MixcbiAgICAgICAgICB5OiBlbmNvZGluZy55LFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFhfWDJfWV9ZMlxuICAgICAgICB9IDoge1xuICAgICAgICAgIHg6IGVuY29kaW5nLngsXG4gICAgICAgICAgeTogZW5jb2RpbmcueTIsXG4gICAgICAgICAgLi4uZW5jb2RpbmdXaXRob3V0WF9YMl9ZX1kyXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59XG4iXX0=