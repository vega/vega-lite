import { assert } from 'chai';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('compile/layout', function () {
    describe('parseUnitLayoutSize', function () {
        it('should have width, height = provided top-level width, height', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                width: 123,
                height: 456,
                mark: 'text',
                encoding: {},
                config: { scale: { textXRangeStep: 91 } }
            });
            assert.deepEqual(model.component.layoutSize.explicit.width, 123);
            assert.deepEqual(model.component.layoutSize.explicit.height, 456);
        });
        it('should have width = default textXRangeStep for text mark without x', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                mark: 'text',
                encoding: {},
                config: { scale: { textXRangeStep: 91 } }
            });
            assert.deepEqual(model.component.layoutSize.implicit.width, 91);
        });
        it('should have width/height = config.scale.rangeStep  for non-text mark without x,y', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {},
                config: { scale: { rangeStep: 23 } }
            });
            assert.deepEqual(model.component.layoutSize.implicit.width, 23);
            assert.deepEqual(model.component.layoutSize.implicit.height, 23);
        });
        it('should have width/height = config.view.width/height for non-ordinal x,y', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    y: { field: 'b', type: 'quantitative' }
                },
                config: { view: { width: 123, height: 456 } }
            });
            assert.deepEqual(model.component.layoutSize.implicit.width, 123);
            assert.deepEqual(model.component.layoutSize.implicit.height, 456);
        });
        it('should have width/height = config.view.width/height for geoshape', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                mark: 'geoshape',
                encoding: {},
                config: { view: { width: 123, height: 456 } }
            });
            assert.deepEqual(model.component.layoutSize.implicit.width, 123);
            assert.deepEqual(model.component.layoutSize.implicit.height, 456);
        });
        it('should have width/height = config.view.width/height for non-ordinal x,y', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { rangeStep: null } },
                    y: { field: 'b', type: 'ordinal', scale: { rangeStep: null } }
                },
                config: { view: { width: 123, height: 456 } }
            });
            assert.deepEqual(model.component.layoutSize.implicit.width, 123);
            assert.deepEqual(model.component.layoutSize.implicit.height, 456);
        });
        it('should have width/height = undefined for non-ordinal x,y', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' },
                    y: { field: 'b', type: 'ordinal' }
                },
                config: { view: { width: 123, height: 456 } }
            });
            assert.deepEqual(model.component.layoutSize.get('width'), 'range-step');
            assert.deepEqual(model.component.layoutSize.get('height'), 'range-step');
        });
    });
});
//# sourceMappingURL=parse.test.js.map