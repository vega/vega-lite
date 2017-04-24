"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
exports.ERRORBAR = 'error-bar';
function normalizeErrorBar(spec) {
    var _m = spec.mark, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JiYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9zaXRlbWFyay9lcnJvcmJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJYSxRQUFBLFFBQVEsR0FBZ0IsV0FBVyxDQUFDO0FBR2pELDJCQUFrQyxJQUFnRDtJQUN6RSxJQUFBLGNBQVEsRUFBRSx3QkFBa0IsRUFBRSxzREFBWSxDQUFTO0lBQ25ELElBQUEsa0JBQVEsRUFBRSx3REFBc0IsQ0FBYTtJQUM3QyxJQUFBLGlCQUFPLEVBQUUsaUJBQU8sRUFBRSw0REFBc0IsQ0FBYTtJQUNyRCxJQUFBLDBCQUFLLEVBQUUsMEJBQUssRUFBRSwwRUFBMkIsQ0FBd0I7SUFFeEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxNQUFNLHNCQUNELFNBQVMsSUFDWixLQUFLLEVBQUU7WUFDTDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsbUJBQW1CO2FBQzlCLEVBQUM7Z0JBQ0EsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLG1CQUFtQjthQUM5QixFQUFFO2dCQUNELElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRSxzQkFDbkIsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQ2QsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQ1Ysd0JBQXdCLHVCQUUzQixDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFDYixDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsSUFDWCx3QkFBd0IsQ0FDNUI7YUFDRjtTQUNGLElBQ0Q7QUFDSixDQUFDO0FBakNELDhDQWlDQyJ9