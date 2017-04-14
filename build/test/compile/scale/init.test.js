"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var init_1 = require("../../../src/compile/scale/init");
var init_2 = require("../../../src/compile/scale/init");
var config_1 = require("../../../src/config");
var scale_1 = require("../../../src/scale");
var util_1 = require("../../../src/util");
describe('compile/scale', function () {
    it('NON_TYPE_RANGE_SCALE_PROPERTIES should be SCALE_PROPERTIES wihtout type and range properties', function () {
        chai_1.assert.deepEqual(util_1.toSet(init_2.NON_TYPE_RANGE_SCALE_PROPERTIES), util_1.toSet(util_1.without(scale_1.SCALE_PROPERTIES, ['type', 'range', 'rangeStep', 'scheme'])));
    });
    describe('init', function () {
        it('should output only padding without default paddingInner and paddingOuter if padding is specified for a band scale', function () {
            var scale = init_1.default('x', { field: 'a', type: 'ordinal', scale: { type: 'band', padding: 0.6 } }, config_1.defaultConfig, 'bar', 100, []);
            chai_1.assert.equal(scale.padding, 0.6);
            chai_1.assert.isUndefined(scale.paddingInner);
            chai_1.assert.isUndefined(scale.paddingOuter);
        });
        it('should output default paddingInner and paddingOuter = paddingInner/2 if none of padding properties is specified for a band scale', function () {
            var scale = init_1.default('x', { field: 'a', type: 'ordinal', scale: { type: 'band' } }, { scale: { bandPaddingInner: 0.3 } }, 'bar', 100, []);
            chai_1.assert.equal(scale.paddingInner, 0.3);
            chai_1.assert.equal(scale.paddingOuter, 0.15);
            chai_1.assert.isUndefined(scale.padding);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NjYWxlL2luaXQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1Qix3REFBd0Q7QUFDeEQsd0RBQWdGO0FBRWhGLDhDQUFrRDtBQUNsRCw0Q0FBb0Q7QUFDcEQsMENBQWlEO0FBRWpELFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDeEIsRUFBRSxDQUFDLDhGQUE4RixFQUFFO1FBQ2pHLGFBQU0sQ0FBQyxTQUFTLENBQ2QsWUFBSyxDQUFDLHNDQUErQixDQUFDLEVBQ3RDLFlBQUssQ0FBQyxjQUFPLENBQUMsd0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQzNFLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDZixFQUFFLENBQUMsbUhBQW1ILEVBQUU7WUFDdEgsSUFBTSxLQUFLLEdBQUcsY0FBUyxDQUNyQixHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFDLEVBQUMsRUFBRSxzQkFBYSxFQUN0RixLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FDZixDQUFDO1lBQ0YsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLGFBQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3ZDLGFBQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtJQUFrSSxFQUFFO1lBQ3JJLElBQU0sS0FBSyxHQUFHLGNBQVMsQ0FDckIsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFDLEVBQUMsRUFDM0YsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQ2YsQ0FBQztZQUNGLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0QyxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdkMsYUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=