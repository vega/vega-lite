"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
exports.ERRORBAR = 'error-bar';
function normalizeErrorBar(spec) {
    // TODO: use selection
    var _m = spec.mark, _sel = spec.selection, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "selection", "encoding"]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JiYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9zaXRlbWFyay9lcnJvcmJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFLYSxRQUFBLFFBQVEsR0FBZ0IsV0FBVyxDQUFDO0FBR2pELDJCQUFrQyxJQUFnRDtJQUNoRixzQkFBc0I7SUFDZixJQUFBLGNBQVEsRUFBRSxxQkFBZSxFQUFFLHdCQUFRLEVBQUUsbUVBQVksQ0FBUztJQUMxRCxJQUFBLGtCQUFRLEVBQUUsd0RBQXNCLENBQWE7SUFDN0MsSUFBQSxpQkFBTyxFQUFFLGlCQUFPLEVBQUUsNERBQXNCLENBQWE7SUFDckQsSUFBQSwwQkFBSyxFQUFFLDBCQUFLLEVBQUUsMEVBQTJCLENBQXdCO0lBRXhFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsTUFBTSxzQkFDRCxTQUFTLElBQ1osS0FBSyxFQUFFO1lBQ0w7Z0JBQ0UsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLG1CQUFtQjthQUM5QixFQUFDO2dCQUNBLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxtQkFBbUI7YUFDOUIsRUFBRTtnQkFDRCxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsUUFBUSxDQUFDLEVBQUUsc0JBQ25CLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxFQUNkLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUNWLHdCQUF3Qix1QkFFM0IsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQ2IsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLElBQ1gsd0JBQXdCLENBQzVCO2FBQ0Y7U0FDRixJQUNEO0FBQ0osQ0FBQztBQWxDRCw4Q0FrQ0MifQ==