"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
exports.ERRORBAR = 'error-bar';
function normalizeErrorBar(spec) {
    // TODO: use selection
    var _m = spec.mark, _sel = spec.selection, _p = spec.projection, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "selection", "projection", "encoding"]);
    var _s = encoding.size, encodingWithoutSize = tslib_1.__rest(encoding, ["size"]);
    var _x2 = encoding.x2, _y2 = encoding.y2, encodingWithoutX2Y2 = tslib_1.__rest(encoding, ["x2", "y2"]);
    var _x = encodingWithoutX2Y2.x, _y = encodingWithoutX2Y2.y, encodingWithoutX_X2_Y_Y2 = tslib_1.__rest(encodingWithoutX2Y2, ["x", "y"]);
    if (!encoding.x2 && !encoding.y2) {
        throw new Error('Neither x2 or y2 provided');
    }
    return tslib_1.__assign({}, outerSpec, { layer: [
            {
                mark: 'rule',
                encoding: encodingWithoutSize
            }, {
                mark: 'tick',
                encoding: encodingWithoutX2Y2
            }, {
                mark: 'tick',
                encoding: encoding.x2 ? tslib_1.__assign({ x: encoding.x2, y: encoding.y }, encodingWithoutX_X2_Y_Y2) : tslib_1.__assign({ x: encoding.x, y: encoding.y2 }, encodingWithoutX_X2_Y_Y2)
            }
        ] });
}
exports.normalizeErrorBar = normalizeErrorBar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JiYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9zaXRlbWFyay9lcnJvcmJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFLYSxRQUFBLFFBQVEsR0FBZ0IsV0FBVyxDQUFDO0FBR2pELDJCQUFrQyxJQUFnRDtJQUNoRixzQkFBc0I7SUFDZixJQUFBLGNBQVEsRUFBRSxxQkFBZSxFQUFFLG9CQUFjLEVBQUUsd0JBQVEsRUFBRSxpRkFBWSxDQUFTO0lBQzFFLElBQUEsa0JBQVEsRUFBRSx3REFBc0IsQ0FBYTtJQUM3QyxJQUFBLGlCQUFPLEVBQUUsaUJBQU8sRUFBRSw0REFBc0IsQ0FBYTtJQUNyRCxJQUFBLDBCQUFLLEVBQUUsMEJBQUssRUFBRSwwRUFBMkIsQ0FBd0I7SUFFeEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO1FBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztLQUM5QztJQUVELDRCQUNLLFNBQVMsSUFDWixLQUFLLEVBQUU7WUFDTDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsbUJBQW1CO2FBQzlCLEVBQUM7Z0JBQ0EsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLG1CQUFtQjthQUM5QixFQUFFO2dCQUNELElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsb0JBQ3JCLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxFQUNkLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUNWLHdCQUF3QixFQUMzQixDQUFDLG9CQUNELENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUNiLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxJQUNYLHdCQUF3QixDQUM1QjthQUNGO1NBQ0YsSUFDRDtBQUNKLENBQUM7QUFsQ0QsOENBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtGaWVsZH0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtFbmNvZGluZ30gZnJvbSAnLi8uLi9lbmNvZGluZyc7XG5pbXBvcnQge0dlbmVyaWNVbml0U3BlYywgTm9ybWFsaXplZExheWVyU3BlY30gZnJvbSAnLi8uLi9zcGVjJztcblxuXG5leHBvcnQgY29uc3QgRVJST1JCQVI6ICdlcnJvci1iYXInID0gJ2Vycm9yLWJhcic7XG5leHBvcnQgdHlwZSBFUlJPUkJBUiA9IHR5cGVvZiBFUlJPUkJBUjtcblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUVycm9yQmFyKHNwZWM6IEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxGaWVsZD4sIEVSUk9SQkFSPik6IE5vcm1hbGl6ZWRMYXllclNwZWMge1xuICAvLyBUT0RPOiB1c2Ugc2VsZWN0aW9uXG4gIGNvbnN0IHttYXJrOiBfbSwgc2VsZWN0aW9uOiBfc2VsLCBwcm9qZWN0aW9uOiBfcCwgZW5jb2RpbmcsIC4uLm91dGVyU3BlY30gPSBzcGVjO1xuICBjb25zdCB7c2l6ZTogX3MsIC4uLmVuY29kaW5nV2l0aG91dFNpemV9ID0gZW5jb2Rpbmc7XG4gIGNvbnN0IHt4MjogX3gyLCB5MjogX3kyLCAuLi5lbmNvZGluZ1dpdGhvdXRYMlkyfSA9IGVuY29kaW5nO1xuICBjb25zdCB7eDogX3gsIHk6IF95LCAuLi5lbmNvZGluZ1dpdGhvdXRYX1gyX1lfWTJ9ID0gZW5jb2RpbmdXaXRob3V0WDJZMjtcblxuICBpZiAoIWVuY29kaW5nLngyICYmICFlbmNvZGluZy55Mikge1xuICAgIHRocm93IG5ldyBFcnJvcignTmVpdGhlciB4MiBvciB5MiBwcm92aWRlZCcpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5vdXRlclNwZWMsXG4gICAgbGF5ZXI6IFtcbiAgICAgIHtcbiAgICAgICAgbWFyazogJ3J1bGUnLFxuICAgICAgICBlbmNvZGluZzogZW5jb2RpbmdXaXRob3V0U2l6ZVxuICAgICAgfSx7IC8vIExvd2VyIHRpY2tcbiAgICAgICAgbWFyazogJ3RpY2snLFxuICAgICAgICBlbmNvZGluZzogZW5jb2RpbmdXaXRob3V0WDJZMlxuICAgICAgfSwgeyAvLyBVcHBlciB0aWNrXG4gICAgICAgIG1hcms6ICd0aWNrJyxcbiAgICAgICAgZW5jb2Rpbmc6IGVuY29kaW5nLngyID8ge1xuICAgICAgICAgIHg6IGVuY29kaW5nLngyLFxuICAgICAgICAgIHk6IGVuY29kaW5nLnksXG4gICAgICAgICAgLi4uZW5jb2RpbmdXaXRob3V0WF9YMl9ZX1kyXG4gICAgICAgIH0gOiB7XG4gICAgICAgICAgeDogZW5jb2RpbmcueCxcbiAgICAgICAgICB5OiBlbmNvZGluZy55MixcbiAgICAgICAgICAuLi5lbmNvZGluZ1dpdGhvdXRYX1gyX1lfWTJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn1cbiJdfQ==