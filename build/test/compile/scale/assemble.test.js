"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var assemble_1 = require("../../../src/compile/scale/assemble");
var util_1 = require("../../util");
describe('compile/scale/assemble', function () {
    describe('assembleScales', function () {
        it('includes all scales for concat', function () {
            var model = util_1.parseConcatModel({
                vconcat: [
                    {
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'ordinal' }
                        }
                    },
                    {
                        mark: 'bar',
                        encoding: {
                            x: { field: 'b', type: 'ordinal' },
                            y: { field: 'c', type: 'quantitative' }
                        }
                    }
                ]
            });
            model.parseScale();
            var scales = assemble_1.assembleScales(model);
            chai_1.assert.equal(scales.length, 3);
        });
        it('includes all scales from children for layer, both shared and independent', function () {
            var model = util_1.parseLayerModel({
                layer: [
                    {
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'quantitative' },
                            y: { field: 'c', type: 'quantitative' }
                        }
                    },
                    {
                        mark: 'point',
                        encoding: {
                            x: { field: 'b', type: 'quantitative' },
                            y: { field: 'c', type: 'quantitative' }
                        }
                    }
                ],
                resolve: {
                    scale: {
                        x: 'independent'
                    }
                }
            });
            model.parseScale();
            var scales = assemble_1.assembleScales(model);
            chai_1.assert.equal(scales.length, 3); // 2 x, 1 y
        });
        it('includes all scales for repeat', function () {
            var model = util_1.parseRepeatModel({
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
            var scales = assemble_1.assembleScales(model);
            chai_1.assert.equal(scales.length, 2);
        });
        it('includes shared scales, but not independent scales (as they are nested) for facet.', function () {
            var model = util_1.parseFacetModelWithScale({
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
            var scales = assemble_1.assembleScales(model);
            chai_1.assert.equal(scales.length, 1);
            chai_1.assert.equal(scales[0].name, 'y');
        });
    });
    describe('assembleScaleRange', function () {
        it('replaces a range step constant with a signal', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'x', type: 'nominal' }
                }
            });
            chai_1.assert.deepEqual(assemble_1.assembleScaleRange({ step: 21 }, 'x', model, 'x'), { step: { signal: 'x_step' } });
        });
        it('updates width signal when renamed.', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'x', type: 'quantitative' }
                }
            });
            // mock renaming
            model.renameLayoutSize('width', 'new_width');
            chai_1.assert.deepEqual(assemble_1.assembleScaleRange([0, { signal: 'width' }], 'x', model, 'x'), [0, { signal: 'new_width' }]);
        });
        it('updates height signal when renamed.', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'y', type: 'quantitative' }
                }
            });
            // mock renaming
            model.renameLayoutSize('height', 'new_height');
            chai_1.assert.deepEqual(assemble_1.assembleScaleRange([0, { signal: 'height' }], 'x', model, 'x'), [0, { signal: 'new_height' }]);
        });
    });
});
//# sourceMappingURL=assemble.test.js.map