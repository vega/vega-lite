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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JiYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9zaXRlbWFyay9lcnJvcmJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS2EsUUFBQSxRQUFRLEdBQWdCLFdBQVcsQ0FBQztBQUdqRCwyQkFBa0MsSUFBZ0Q7SUFDaEYsc0JBQXNCO0lBQ2YsSUFBQSxjQUFRLEVBQUUscUJBQWUsRUFBRSxvQkFBYyxFQUFFLHdCQUFRLEVBQUUseUVBQVksQ0FBUztJQUMxRSxJQUFBLGtCQUFRLEVBQUUsZ0RBQXNCLENBQWE7SUFDN0MsSUFBQSxpQkFBTyxFQUFFLGlCQUFPLEVBQUUsb0RBQXNCLENBQWE7SUFDckQsSUFBQSwwQkFBSyxFQUFFLDBCQUFLLEVBQUUsa0VBQTJCLENBQXdCO0lBRXhFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsTUFBTSxjQUNELFNBQVMsSUFDWixLQUFLLEVBQUU7WUFDTDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsbUJBQW1CO2FBQzlCLEVBQUM7Z0JBQ0EsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLG1CQUFtQjthQUM5QixFQUFFO2dCQUNELElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsWUFDckIsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQ2QsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQ1Ysd0JBQXdCLEVBQzNCLENBQUMsWUFDRCxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFDYixDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsSUFDWCx3QkFBd0IsQ0FDNUI7YUFDRjtTQUNGLElBQ0Q7QUFDSixDQUFDO0FBbENELDhDQWtDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RmllbGR9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7RW5jb2Rpbmd9IGZyb20gJy4vLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtHZW5lcmljVW5pdFNwZWMsIExheWVyU3BlY30gZnJvbSAnLi8uLi9zcGVjJztcblxuXG5leHBvcnQgY29uc3QgRVJST1JCQVI6ICdlcnJvci1iYXInID0gJ2Vycm9yLWJhcic7XG5leHBvcnQgdHlwZSBFUlJPUkJBUiA9IHR5cGVvZiBFUlJPUkJBUjtcblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUVycm9yQmFyKHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxGaWVsZD4sIEVSUk9SQkFSPik6IExheWVyU3BlYyB7XG4gIC8vIFRPRE86IHVzZSBzZWxlY3Rpb25cbiAgY29uc3Qge21hcms6IF9tLCBzZWxlY3Rpb246IF9zZWwsIHByb2plY3Rpb246IF9wLCBlbmNvZGluZywgLi4ub3V0ZXJTcGVjfSA9IHNwZWM7XG4gIGNvbnN0IHtzaXplOiBfcywgLi4uZW5jb2RpbmdXaXRob3V0U2l6ZX0gPSBlbmNvZGluZztcbiAgY29uc3Qge3gyOiBfeDIsIHkyOiBfeTIsIC4uLmVuY29kaW5nV2l0aG91dFgyWTJ9ID0gZW5jb2Rpbmc7XG4gIGNvbnN0IHt4OiBfeCwgeTogX3ksIC4uLmVuY29kaW5nV2l0aG91dFhfWDJfWV9ZMn0gPSBlbmNvZGluZ1dpdGhvdXRYMlkyO1xuXG4gIGlmICghZW5jb2RpbmcueDIgJiYgIWVuY29kaW5nLnkyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZWl0aGVyIHgyIG9yIHkyIHByb3ZpZGVkJyk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLm91dGVyU3BlYyxcbiAgICBsYXllcjogW1xuICAgICAge1xuICAgICAgICBtYXJrOiAncnVsZScsXG4gICAgICAgIGVuY29kaW5nOiBlbmNvZGluZ1dpdGhvdXRTaXplXG4gICAgICB9LHsgLy8gTG93ZXIgdGlja1xuICAgICAgICBtYXJrOiAndGljaycsXG4gICAgICAgIGVuY29kaW5nOiBlbmNvZGluZ1dpdGhvdXRYMlkyXG4gICAgICB9LCB7IC8vIFVwcGVyIHRpY2tcbiAgICAgICAgbWFyazogJ3RpY2snLFxuICAgICAgICBlbmNvZGluZzogZW5jb2RpbmcueDIgPyB7XG4gICAgICAgICAgeDogZW5jb2RpbmcueDIsXG4gICAgICAgICAgeTogZW5jb2RpbmcueSxcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRYX1gyX1lfWTJcbiAgICAgICAgfSA6IHtcbiAgICAgICAgICB4OiBlbmNvZGluZy54LFxuICAgICAgICAgIHk6IGVuY29kaW5nLnkyLFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFhfWDJfWV9ZMlxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuIl19