"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var log = tslib_1.__importStar(require("../../src/log"));
var mark_1 = require("../../src/mark");
var spec_1 = require("../../src/spec");
var util_1 = require("../../src/util");
var config_1 = require(".././../src/config");
describe('normalizeErrorBand', function () {
    it('should produce correct layered specs for mean point and vertical error band', function () {
        chai_1.assert.deepEqual(spec_1.normalize({
            data: {
                url: 'data/population.json'
            },
            mark: 'errorband',
            encoding: {
                x: {
                    field: 'age',
                    type: 'ordinal'
                },
                y: {
                    field: 'people',
                    type: 'quantitative'
                }
            }
        }, config_1.defaultConfig), {
            data: {
                url: 'data/population.json'
            },
            transform: [
                {
                    aggregate: [
                        {
                            op: 'stderr',
                            field: 'people',
                            as: 'extent_people'
                        },
                        {
                            op: 'mean',
                            field: 'people',
                            as: 'center_people'
                        }
                    ],
                    groupby: ['age']
                },
                {
                    calculate: 'datum.center_people + datum.extent_people',
                    as: 'upper_people'
                },
                {
                    calculate: 'datum.center_people - datum.extent_people',
                    as: 'lower_people'
                }
            ],
            layer: [
                {
                    mark: {
                        opacity: 0.3,
                        type: 'area',
                        style: 'errorband-band'
                    },
                    encoding: {
                        y: {
                            field: 'lower_people',
                            type: 'quantitative',
                            title: 'people'
                        },
                        y2: {
                            field: 'upper_people',
                            type: 'quantitative'
                        },
                        x: {
                            field: 'age',
                            type: 'ordinal',
                            title: 'age'
                        }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs with rect + rule, instead of area + line, in 1D error band', function () {
        var outputSpec = spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: { type: 'errorband', borders: true },
            encoding: { y: { field: 'people', type: 'quantitative' } }
        }, config_1.defaultConfig);
        var layer = spec_1.isLayerSpec(outputSpec) && outputSpec.layer;
        if (layer) {
            chai_1.assert.isTrue(util_1.some(layer, function (unitSpec) {
                return spec_1.isUnitSpec(unitSpec) && mark_1.isMarkDef(unitSpec.mark) && unitSpec.mark.type === 'rect';
            }));
            chai_1.assert.isTrue(util_1.some(layer, function (unitSpec) {
                return spec_1.isUnitSpec(unitSpec) && mark_1.isMarkDef(unitSpec.mark) && unitSpec.mark.type === 'rule';
            }));
        }
        else {
            chai_1.assert.fail(!layer, false, 'layer should be a part of the spec');
        }
    });
    it('should produce correct layered specs with area + line, in 2D error band', function () {
        var outputSpec = spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: { type: 'errorband', borders: true },
            encoding: {
                y: { field: 'people', type: 'quantitative' },
                x: { field: 'age', type: 'ordinal' }
            }
        }, config_1.defaultConfig);
        var layer = spec_1.isLayerSpec(outputSpec) && outputSpec.layer;
        if (layer) {
            chai_1.assert.isTrue(util_1.some(layer, function (unitSpec) {
                return spec_1.isUnitSpec(unitSpec) && mark_1.isMarkDef(unitSpec.mark) && unitSpec.mark.type === 'area';
            }));
            chai_1.assert.isTrue(util_1.some(layer, function (unitSpec) {
                return spec_1.isUnitSpec(unitSpec) && mark_1.isMarkDef(unitSpec.mark) && unitSpec.mark.type === 'line';
            }));
        }
        else {
            chai_1.assert.fail(!layer, false, 'layer should be a part of the spec');
        }
    });
    it('should produce correct layered specs with interpolation in 2D error band', function () {
        var outputSpec = spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: { type: 'errorband', interpolate: 'monotone' },
            encoding: {
                y: { field: 'people', type: 'quantitative' },
                x: { field: 'age', type: 'ordinal' }
            }
        }, config_1.defaultConfig);
        var layer = spec_1.isLayerSpec(outputSpec) && outputSpec.layer;
        if (layer) {
            chai_1.assert.isTrue(util_1.every(layer, function (unitSpec) {
                return spec_1.isUnitSpec(unitSpec) && mark_1.isMarkDef(unitSpec.mark) && unitSpec.mark.interpolate === 'monotone';
            }));
        }
        else {
            chai_1.assert.fail(!layer, false, 'layer should be a part of the spec');
        }
    });
    it('should produce correct layered specs with out interpolation in 1D error band', function () {
        var outputSpec = spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: { type: 'errorband', interpolate: 'bundle', tension: 1 },
            encoding: {
                y: { field: 'people', type: 'quantitative' }
            }
        }, config_1.defaultConfig);
        var layer = spec_1.isLayerSpec(outputSpec) && outputSpec.layer;
        if (layer) {
            chai_1.assert.isTrue(util_1.every(layer, function (unitSpec) {
                return spec_1.isUnitSpec(unitSpec) && mark_1.isMarkDef(unitSpec.mark) && !unitSpec.mark.interpolate;
            }));
        }
        else {
            chai_1.assert.fail(!layer, false, 'layer should be a part of the spec');
        }
    });
    it('should produce a warning 1D error band has interpolate property', log.wrap(function (localLogger) {
        spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: { type: 'errorband', interpolate: 'monotone' },
            encoding: {
                y: { field: 'people', type: 'quantitative' }
            }
        }, config_1.defaultConfig);
        chai_1.assert.equal(localLogger.warns[0], log.message.errorBand1DNotSupport('interpolate'));
    }));
    it('should produce a warning 1D error band has tension property', log.wrap(function (localLogger) {
        spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: { type: 'errorband', tension: 1 },
            encoding: {
                y: { field: 'people', type: 'quantitative' }
            }
        }, config_1.defaultConfig);
        chai_1.assert.equal(localLogger.warns[0], log.message.errorBand1DNotSupport('tension'));
    }));
});
//# sourceMappingURL=errorband.test.js.map