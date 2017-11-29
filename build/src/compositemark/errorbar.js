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
    var _m = spec.mark, _sel = spec.selection, encoding = spec.encoding, outerSpec = __rest(spec, ["mark", "selection", "encoding"]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JiYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9zaXRlbWFyay9lcnJvcmJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS2EsUUFBQSxRQUFRLEdBQWdCLFdBQVcsQ0FBQztBQUdqRCwyQkFBa0MsSUFBZ0Q7SUFDaEYsc0JBQXNCO0lBQ2YsSUFBQSxjQUFRLEVBQUUscUJBQWUsRUFBRSx3QkFBUSxFQUFFLDJEQUFZLENBQVM7SUFDMUQsSUFBQSxrQkFBUSxFQUFFLGdEQUFzQixDQUFhO0lBQzdDLElBQUEsaUJBQU8sRUFBRSxpQkFBTyxFQUFFLG9EQUFzQixDQUFhO0lBQ3JELElBQUEsMEJBQUssRUFBRSwwQkFBSyxFQUFFLGtFQUEyQixDQUF3QjtJQUV4RSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELE1BQU0sY0FDRCxTQUFTLElBQ1osS0FBSyxFQUFFO1lBQ0w7Z0JBQ0UsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLG1CQUFtQjthQUM5QixFQUFDO2dCQUNBLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxtQkFBbUI7YUFDOUIsRUFBRTtnQkFDRCxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQ3JCLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxFQUNkLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUNWLHdCQUF3QixFQUMzQixDQUFDLFlBQ0QsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQ2IsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLElBQ1gsd0JBQXdCLENBQzVCO2FBQ0Y7U0FDRixJQUNEO0FBQ0osQ0FBQztBQWxDRCw4Q0FrQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0ZpZWxkfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge0VuY29kaW5nfSBmcm9tICcuLy4uL2VuY29kaW5nJztcbmltcG9ydCB7R2VuZXJpY1VuaXRTcGVjLCBMYXllclNwZWN9IGZyb20gJy4vLi4vc3BlYyc7XG5cblxuZXhwb3J0IGNvbnN0IEVSUk9SQkFSOiAnZXJyb3ItYmFyJyA9ICdlcnJvci1iYXInO1xuZXhwb3J0IHR5cGUgRVJST1JCQVIgPSB0eXBlb2YgRVJST1JCQVI7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVFcnJvckJhcihzcGVjOiBHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8RmllbGQ+LCBFUlJPUkJBUj4pOiBMYXllclNwZWMge1xuICAvLyBUT0RPOiB1c2Ugc2VsZWN0aW9uXG4gIGNvbnN0IHttYXJrOiBfbSwgc2VsZWN0aW9uOiBfc2VsLCBlbmNvZGluZywgLi4ub3V0ZXJTcGVjfSA9IHNwZWM7XG4gIGNvbnN0IHtzaXplOiBfcywgLi4uZW5jb2RpbmdXaXRob3V0U2l6ZX0gPSBlbmNvZGluZztcbiAgY29uc3Qge3gyOiBfeDIsIHkyOiBfeTIsIC4uLmVuY29kaW5nV2l0aG91dFgyWTJ9ID0gZW5jb2Rpbmc7XG4gIGNvbnN0IHt4OiBfeCwgeTogX3ksIC4uLmVuY29kaW5nV2l0aG91dFhfWDJfWV9ZMn0gPSBlbmNvZGluZ1dpdGhvdXRYMlkyO1xuXG4gIGlmICghZW5jb2RpbmcueDIgJiYgIWVuY29kaW5nLnkyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZWl0aGVyIHgyIG9yIHkyIHByb3ZpZGVkJyk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLm91dGVyU3BlYyxcbiAgICBsYXllcjogW1xuICAgICAge1xuICAgICAgICBtYXJrOiAncnVsZScsXG4gICAgICAgIGVuY29kaW5nOiBlbmNvZGluZ1dpdGhvdXRTaXplXG4gICAgICB9LHsgLy8gTG93ZXIgdGlja1xuICAgICAgICBtYXJrOiAndGljaycsXG4gICAgICAgIGVuY29kaW5nOiBlbmNvZGluZ1dpdGhvdXRYMlkyXG4gICAgICB9LCB7IC8vIFVwcGVyIHRpY2tcbiAgICAgICAgbWFyazogJ3RpY2snLFxuICAgICAgICBlbmNvZGluZzogZW5jb2RpbmcueDIgPyB7XG4gICAgICAgICAgeDogZW5jb2RpbmcueDIsXG4gICAgICAgICAgeTogZW5jb2RpbmcueSxcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRYX1gyX1lfWTJcbiAgICAgICAgfSA6IHtcbiAgICAgICAgICB4OiBlbmNvZGluZy54LFxuICAgICAgICAgIHk6IGVuY29kaW5nLnkyLFxuICAgICAgICAgIC4uLmVuY29kaW5nV2l0aG91dFhfWDJfWV9ZMlxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9O1xufVxuIl19