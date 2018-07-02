import { assert } from 'chai';
import { assembleScaleRange, assembleScales } from '../../../src/compile/scale/assemble';
import { parseConcatModel, parseFacetModelWithScale, parseLayerModel, parseRepeatModel, parseUnitModel, parseUnitModelWithScale } from '../../util';
describe('compile/scale/assemble', function () {
    describe('assembleScales', function () {
        it('includes all scales for concat', function () {
            var model = parseConcatModel({
                vconcat: [{
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'ordinal' }
                        }
                    }, {
                        mark: 'bar',
                        encoding: {
                            x: { field: 'b', type: 'ordinal' },
                            y: { field: 'c', type: 'quantitative' }
                        }
                    }]
            });
            model.parseScale();
            var scales = assembleScales(model);
            assert.equal(scales.length, 3);
        });
        it('includes all scales from children for layer, both shared and independent', function () {
            var model = parseLayerModel({
                layer: [{
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'quantitative' },
                            y: { field: 'c', type: 'quantitative' }
                        }
                    }, {
                        mark: 'point',
                        encoding: {
                            x: { field: 'b', type: 'quantitative' },
                            y: { field: 'c', type: 'quantitative' }
                        }
                    }],
                resolve: {
                    scale: {
                        x: 'independent'
                    }
                }
            });
            model.parseScale();
            var scales = assembleScales(model);
            assert.equal(scales.length, 3); // 2 x, 1 y
        });
        it('includes all scales for repeat', function () {
            var model = parseRepeatModel({
                repeat: {
                    row: ['Acceleration', 'Horsepower']
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: { repeat: 'row' }, type: 'quantitative' }
                    }
                }
            });
            model.parseScale();
            var scales = assembleScales(model);
            assert.equal(scales.length, 2);
        });
        it('includes shared scales, but not independent scales (as they are nested) for facet.', function () {
            var model = parseFacetModelWithScale({
                facet: {
                    column: { field: 'a', type: 'quantitative', format: 'd' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                },
                resolve: {
                    scale: { x: 'independent' }
                }
            });
            var scales = assembleScales(model);
            assert.equal(scales.length, 1);
            assert.equal(scales[0].name, 'y');
        });
    });
    describe('assembleScaleRange', function () {
        it('replaces a range step constant with a signal', function () {
            var model = parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'x', type: 'nominal' }
                }
            });
            assert.deepEqual(assembleScaleRange({ step: 21 }, 'x', model, 'x'), { step: { signal: 'x_step' } });
        });
        it('updates width signal when renamed.', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'x', type: 'quantitative' }
                }
            });
            // mock renaming
            model.renameLayoutSize('width', 'new_width');
            assert.deepEqual(assembleScaleRange([0, { signal: 'width' }], 'x', model, 'x'), [0, { signal: 'new_width' }]);
        });
        it('updates height signal when renamed.', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'y', type: 'quantitative' }
                }
            });
            // mock renaming
            model.renameLayoutSize('height', 'new_height');
            assert.deepEqual(assembleScaleRange([0, { signal: 'height' }], 'x', model, 'x'), [0, { signal: 'new_height' }]);
        });
    });
});
//# sourceMappingURL=assemble.test.js.map