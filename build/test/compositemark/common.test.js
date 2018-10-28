/* tslint:disable:quotemark */
import { isMarkDef } from '../../src/mark';
import { isLayerSpec, isUnitSpec, normalize } from '../../src/spec';
import { defaultConfig } from '.././../src/config';
describe('common feature of composite marks', function () {
    it('should clip all the part when clip property in composite mark def is true', function () {
        var outputSpec = normalize({
            data: { url: 'data/barley.json' },
            mark: { type: 'errorbar', tick: true, clip: true },
            encoding: { x: { field: 'yield', type: 'quantitative' } }
        }, defaultConfig);
        var layer = isLayerSpec(outputSpec) && outputSpec.layer;
        expect(layer).toBeTruthy();
        for (var _i = 0, layer_1 = layer; _i < layer_1.length; _i++) {
            var unitSpec = layer_1[_i];
            var markDef = isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && unitSpec.mark;
            expect(markDef).toBeTruthy();
            expect(markDef.clip).toBe(true);
        }
    });
});
//# sourceMappingURL=common.test.js.map