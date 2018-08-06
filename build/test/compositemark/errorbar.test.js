"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var fielddef_1 = require("../../src/fielddef");
var log = tslib_1.__importStar(require("../../src/log"));
var mark_1 = require("../../src/mark");
var spec_1 = require("../../src/spec");
var transform_1 = require("../../src/transform");
var util_1 = require("../../src/util");
var config_1 = require(".././../src/config");
describe('normalizeErrorBar with raw data input', function () {
    it('should produce correct layered specs for mean point and vertical error bar', function () {
        chai_1.assert.deepEqual(spec_1.normalize({
            data: {
                url: 'data/population.json'
            },
            mark: 'errorbar',
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
            data: { url: 'data/population.json' },
            transform: [
                {
                    aggregate: [
                        { op: 'stderr', field: 'people', as: 'extent_people' },
                        { op: 'mean', field: 'people', as: 'center_people' }
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
                    mark: { type: 'rule', style: 'errorbar-rule' },
                    encoding: {
                        y: {
                            field: 'lower_people',
                            type: 'quantitative',
                            title: 'people'
                        },
                        y2: { field: 'upper_people', type: 'quantitative' },
                        x: { field: 'age', type: 'ordinal', title: 'age' }
                    }
                }
            ]
        });
    });
    it('should produce an error if both axes have aggregate errorbar', function () {
        chai_1.assert.throws(function () {
            spec_1.normalize({
                data: { url: 'data/population.json' },
                mark: {
                    type: 'errorbar'
                },
                encoding: {
                    x: { aggregate: 'errorbar', field: 'people', type: 'quantitative' },
                    y: {
                        aggregate: 'errorbar',
                        field: 'people',
                        type: 'quantitative'
                    },
                    color: { value: 'skyblue' }
                }
            }, config_1.defaultConfig);
        }, Error, 'Both x and y cannot have aggregate');
    });
    it('should produce a warning if continuous axis has aggregate property', log.wrap(function (localLogger) {
        var aggregate = 'min';
        var mark = 'errorbar';
        spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: mark,
            encoding: {
                x: { field: 'age', type: 'ordinal' },
                y: {
                    aggregate: aggregate,
                    field: 'people',
                    type: 'quantitative'
                },
                color: { value: 'skyblue' }
            }
        }, config_1.defaultConfig);
        chai_1.assert.equal(localLogger.warns[0], log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, mark));
    }));
    it('should produce an error if build 1D errorbar with a discrete axis', function () {
        chai_1.assert.throws(function () {
            spec_1.normalize({
                data: { url: 'data/population.json' },
                mark: 'errorbar',
                encoding: {
                    x: { field: 'age', type: 'ordinal' }
                }
            }, config_1.defaultConfig);
        }, Error, 'Need a valid continuous axis for errorbars');
    });
    it('should produce an error if both axes are discrete', function () {
        chai_1.assert.throws(function () {
            spec_1.normalize({
                data: { url: 'data/population.json' },
                mark: {
                    type: 'errorbar'
                },
                encoding: {
                    x: { field: 'age', type: 'ordinal' },
                    y: {
                        field: 'age',
                        type: 'ordinal'
                    },
                    color: { value: 'skyblue' }
                }
            }, config_1.defaultConfig);
        }, Error, 'Need a valid continuous axis for errorbars');
    });
    it('should produce an error if in 2D errobar both axes are not valid field definitions', function () {
        chai_1.assert.throws(function () {
            spec_1.normalize({
                data: { url: 'data/population.json' },
                mark: {
                    type: 'errorbar'
                },
                encoding: {
                    x: { field: 'age', type: 'ordinal' },
                    y: {
                        type: 'ordinal'
                    },
                    color: { value: 'skyblue' }
                }
            }, config_1.defaultConfig);
        }, Error, 'Need a valid continuous axis for errorbars');
    });
    it('should produce an error if 1D errorbar only axis is discrete', function () {
        chai_1.assert.throws(function () {
            spec_1.normalize({
                data: { url: 'data/population.json' },
                mark: 'errorbar',
                encoding: {
                    x: { field: 'age', type: 'ordinal' },
                    color: { value: 'skyblue' }
                }
            }, config_1.defaultConfig);
        }, Error, 'Need a valid continuous axis for errorbars');
    });
    it('should aggregate y field for vertical errorbar with two quantitative axes and explicit orient', function () {
        var outputSpec = spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: {
                type: 'errorbar',
                orient: 'vertical'
            },
            encoding: {
                x: {
                    field: 'age',
                    type: 'quantitative'
                },
                y: {
                    field: 'people',
                    type: 'quantitative'
                }
            }
        }, config_1.defaultConfig);
        var aggregateTransform = outputSpec.transform[0];
        if (transform_1.isAggregate(aggregateTransform)) {
            chai_1.assert.isTrue(util_1.some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                return (aggregateFieldDef.field === 'people' &&
                    (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median'));
            }));
        }
        else {
            chai_1.assert.fail(transform_1.isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
        }
    });
    it('should aggregate x field for horizontal errorbar with two quantitative axes and explicit orient', function () {
        var outputSpec = spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: {
                type: 'errorbar',
                orient: 'horizontal'
            },
            encoding: {
                x: {
                    field: 'age',
                    type: 'quantitative'
                },
                y: {
                    field: 'people',
                    type: 'quantitative'
                }
            }
        }, config_1.defaultConfig);
        var aggregateTransform = outputSpec.transform[0];
        if (transform_1.isAggregate(aggregateTransform)) {
            chai_1.assert.isTrue(util_1.some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                return (aggregateFieldDef.field === 'age' && (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median'));
            }));
        }
        else {
            chai_1.assert.fail(transform_1.isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
        }
    });
    it('should aggregate y field for vertical errorbar with two quantitative axes and specify orientation with aggregate', function () {
        var outputSpec = spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: 'errorbar',
            encoding: {
                x: {
                    field: 'age',
                    type: 'quantitative'
                },
                y: {
                    aggregate: 'errorbar',
                    field: 'people',
                    type: 'quantitative'
                }
            }
        }, config_1.defaultConfig);
        var aggregateTransform = outputSpec.transform[0];
        if (transform_1.isAggregate(aggregateTransform)) {
            chai_1.assert.isTrue(util_1.some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                return (aggregateFieldDef.field === 'people' &&
                    (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median'));
            }));
        }
        else {
            chai_1.assert.fail(transform_1.isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
        }
    });
    it('should aggregate x field for horizontal errorbar with two quantitative axes and specify orientation with aggregate', function () {
        var outputSpec = spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: 'errorbar',
            encoding: {
                x: {
                    aggregate: 'errorbar',
                    field: 'age',
                    type: 'quantitative'
                },
                y: {
                    field: 'people',
                    type: 'quantitative'
                }
            }
        }, config_1.defaultConfig);
        var aggregateTransform = outputSpec.transform[0];
        if (transform_1.isAggregate(aggregateTransform)) {
            chai_1.assert.isTrue(util_1.some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                return (aggregateFieldDef.field === 'age' && (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median'));
            }));
        }
        else {
            chai_1.assert.fail(transform_1.isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
        }
    });
    it('should aggregate x field for horizontal errorbar with x as quantitative axis', function () {
        var outputSpec = spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: 'errorbar',
            encoding: {
                x: {
                    field: 'age',
                    type: 'quantitative'
                },
                y: {
                    field: 'people',
                    type: 'ordinal'
                }
            }
        }, config_1.defaultConfig);
        var aggregateTransform = outputSpec.transform[0];
        if (transform_1.isAggregate(aggregateTransform)) {
            chai_1.assert.isTrue(util_1.some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                return (aggregateFieldDef.field === 'age' && (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median'));
            }));
        }
        else {
            chai_1.assert.fail(transform_1.isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
        }
    });
    it('should produce correct layered specs for veritcal errorbar with ticks', function () {
        var color = 'red';
        var opacity = 0.5;
        var size = 10;
        var outputSpec = spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: {
                type: 'errorbar',
                ticks: {
                    size: size,
                    color: color,
                    opacity: opacity
                }
            },
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
        }, config_1.defaultConfig);
        var layer = spec_1.isLayerSpec(outputSpec) && outputSpec.layer;
        if (layer) {
            chai_1.assert.isTrue(util_1.some(layer, function (unitSpec) {
                return (spec_1.isUnitSpec(unitSpec) &&
                    mark_1.isMarkDef(unitSpec.mark) &&
                    unitSpec.mark.type === 'tick' &&
                    unitSpec.mark.size === size &&
                    unitSpec.mark.color === color &&
                    unitSpec.mark.opacity === opacity);
            }));
        }
        else {
            chai_1.assert.fail(!layer, false, 'layer should be a part of the spec');
        }
    });
    it('should produce correct layered specs with customized title', function () {
        var outputSpec = spec_1.normalize({
            data: { url: 'data/population.json' },
            mark: {
                type: 'errorbar',
                point: false
            },
            encoding: {
                x: {
                    field: 'age',
                    type: 'ordinal'
                },
                y: {
                    field: 'people',
                    type: 'quantitative',
                    title: 'population'
                }
            }
        }, config_1.defaultConfig);
        var layer = spec_1.isLayerSpec(outputSpec) && outputSpec.layer;
        if (layer) {
            chai_1.assert.isTrue(util_1.some(layer, function (unitSpec) {
                return spec_1.isUnitSpec(unitSpec) && fielddef_1.isFieldDef(unitSpec.encoding.y) && unitSpec.encoding.y.title === 'population';
            }));
        }
        else {
            chai_1.assert.fail(!layer, false, 'layer should be a part of the spec');
        }
    });
});
describe('normalizeErrorBar for all possible extents and centers with raw data input', function () {
    var centers = ['mean', 'median', undefined];
    var extents = ['stderr', 'stdev', 'ci', 'iqr', undefined];
    var warningOutputMap = {
        mean: {
            stderr: [false, false],
            stdev: [false, false],
            ci: [false, true],
            iqr: [true, true],
            '': [false, false]
        },
        median: {
            stderr: [true, false],
            stdev: [true, false],
            ci: [true, true],
            iqr: [false, true],
            '': [false, false]
        },
        '': {
            stderr: [false, false],
            stdev: [false, false],
            ci: [false, false],
            iqr: [false, false],
            '': [false, false]
        }
    };
    var warningMessage = [
        function (center, extent, type) {
            return log.message.errorBarCenterIsUsedWithWrongExtent(center, extent, type); // msg1
        },
        function (_center, extent, type) {
            return log.message.errorBarCenterIsNotNeeded(extent, type); // msg2
        }
    ];
    var type = 'errorbar';
    var _loop_1 = function (center) {
        var _loop_2 = function (extent) {
            var spec = {
                data: { url: 'data/population.json' },
                mark: tslib_1.__assign({ type: type }, (center ? { center: center } : {}), (extent ? { extent: extent } : {})),
                encoding: {
                    x: { field: 'people', type: 'quantitative' },
                    y: { field: 'people', type: 'quantitative' }
                }
            };
            var warningOutput = warningOutputMap[center ? center : ''][extent ? extent : ''];
            var _loop_3 = function (k) {
                var testMsg_1 = 'should ' +
                    (warningOutput[k] ? '' : 'not ') +
                    'produce a warning if center is ' +
                    (center ? center : 'not specified') +
                    ' and extent is ' +
                    (extent ? extent : 'not specified') +
                    ' that ' +
                    warningMessage[k](center, extent, type);
                it(testMsg_1, log.wrap(function (localLogger) {
                    spec_1.normalize(spec, config_1.defaultConfig);
                    chai_1.assert.equal(warningOutput[k], util_1.some(localLogger.warns, function (message) {
                        return message === warningMessage[k](center, extent, type);
                    }));
                }));
            };
            for (var k = 0; k < warningOutput.length; k++) {
                _loop_3(k);
            }
            var outputSpec = spec_1.normalize(spec, config_1.defaultConfig);
            var aggregateTransform = outputSpec.transform[0];
            var testMsg = 'should produce a correct layer spec if center is ' +
                (center ? center : 'not specified') +
                ' and extent is ' +
                (extent ? extent : 'not specified') +
                '.';
            it(testMsg, function () {
                if (transform_1.isAggregate(aggregateTransform)) {
                    if (extent === 'ci' || extent === 'iqr' || (center === 'median' && !extent)) {
                        chai_1.assert.isFalse(util_1.some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                            return aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median';
                        }));
                    }
                    else {
                        if (center) {
                            chai_1.assert.isTrue(util_1.some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                                return aggregateFieldDef.op === center;
                            }));
                        }
                        else {
                            chai_1.assert.isTrue(util_1.some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                                return aggregateFieldDef.op === 'mean';
                            }));
                        }
                        if (extent) {
                            chai_1.assert.isTrue(util_1.some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                                return isPartOfExtent(extent, aggregateFieldDef.op);
                            }));
                        }
                        else if (center === 'median') {
                            chai_1.assert.isTrue(util_1.some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                                return isPartOfExtent('iqr', aggregateFieldDef.op);
                            }));
                            chai_1.assert.isFalse(util_1.some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                                return aggregateFieldDef.op === 'median';
                            }));
                        }
                        else {
                            chai_1.assert.isTrue(util_1.some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                                return isPartOfExtent('stderr', aggregateFieldDef.op);
                            }));
                        }
                    }
                }
                else {
                    chai_1.assert.fail(transform_1.isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
                }
            });
        };
        for (var _i = 0, extents_1 = extents; _i < extents_1.length; _i++) {
            var extent = extents_1[_i];
            _loop_2(extent);
        }
    };
    for (var _i = 0, centers_1 = centers; _i < centers_1.length; _i++) {
        var center = centers_1[_i];
        _loop_1(center);
    }
});
function isPartOfExtent(extent, op) {
    if (extent === 'ci') {
        return op === 'ci0' || op === 'ci1';
    }
    else if (extent === 'iqr') {
        return op === 'q1' || op === 'q3';
    }
    return extent === op;
}
describe('normalizeErrorBar with aggregated data input', function () {
    var data = {
        values: [
            { age: 1, people: 1, people2: 2 },
            { age: 2, people: 4, people2: 8 },
            { age: 3, people: 13, people2: 18 },
            { age: 4, people: 2, people2: 28 },
            { age: 5, people: 19, people2: 23 },
            { age: 6, people: 10, people2: 20 },
            { age: 7, people: 2, people2: 5 }
        ]
    };
    var mark = 'errorbar';
    it('should produce correct layered specs for vertical errorbar with aggregated data input', function () {
        chai_1.assert.deepEqual(spec_1.normalize({
            data: data,
            mark: 'errorbar',
            encoding: {
                x: { field: 'age', type: 'ordinal' },
                y: { field: 'people', type: 'quantitative' },
                y2: { field: 'people2', type: 'quantitative' }
            }
        }, config_1.defaultConfig), {
            data: data,
            transform: [{ calculate: 'datum.people', as: 'lower_people' }, { calculate: 'datum.people2', as: 'upper_people' }],
            layer: [
                {
                    mark: { type: 'rule', style: 'errorbar-rule' },
                    encoding: {
                        y: {
                            field: 'lower_people',
                            type: 'quantitative',
                            title: 'people'
                        },
                        y2: { field: 'upper_people', type: 'quantitative' },
                        x: { field: 'age', type: 'ordinal', title: 'age' }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs for horizontal errorbar with aggregated data input', function () {
        var outputSpec = spec_1.normalize({
            data: data,
            mark: 'errorbar',
            encoding: {
                y: { field: 'age', type: 'ordinal' },
                x: { field: 'people', type: 'quantitative' },
                x2: { field: 'people2', type: 'quantitative' }
            }
        }, config_1.defaultConfig);
        for (var i = 0; i < 2; i++) {
            var calculate = outputSpec.transform[i];
            if (transform_1.isCalculate(calculate)) {
                chai_1.assert.isTrue((calculate.calculate === 'datum.people' && calculate.as === 'lower_people') ||
                    (calculate.calculate === 'datum.people2' && calculate.as === 'upper_people'));
            }
            else {
                chai_1.assert.fail(transform_1.isCalculate(calculate), true, 'transform[' + i + '] should be an aggregate transform');
            }
        }
        var layer = spec_1.isLayerSpec(outputSpec) && outputSpec.layer;
        if (layer) {
            chai_1.assert.isTrue(util_1.some(layer, function (unitSpec) {
                return (spec_1.isUnitSpec(unitSpec) && fielddef_1.isFieldDef(unitSpec.encoding.x) && unitSpec.encoding.x.field === 'lower_people');
            }));
            chai_1.assert.isTrue(util_1.some(layer, function (unitSpec) {
                return (spec_1.isUnitSpec(unitSpec) && fielddef_1.isFieldDef(unitSpec.encoding.x2) && unitSpec.encoding.x2.field === 'upper_people');
            }));
        }
        else {
            chai_1.assert.fail(!layer, false, 'layer should be a part of the spec');
        }
    });
    it('should produce a warning if data are aggregated but center and/or extent is specified', log.wrap(function (localLogger) {
        var extent = 'stdev';
        var center = 'mean';
        spec_1.normalize({
            data: data,
            mark: {
                type: 'errorbar',
                extent: extent,
                center: center
            },
            encoding: {
                x: { field: 'age', type: 'ordinal' },
                y: { field: 'people', type: 'quantitative' },
                y2: { field: 'people2', type: 'quantitative' }
            }
        }, config_1.defaultConfig);
        chai_1.assert.equal(localLogger.warns[0], log.message.errorBarCenterAndExtentAreNotNeeded(center, extent));
    }));
    it('should produce an error if data are aggregated and have both x2 and y2 quantiative', function () {
        chai_1.assert.throws(function () {
            spec_1.normalize({
                data: data,
                mark: {
                    type: 'errorbar',
                    extent: 'stdev',
                    center: 'mean'
                },
                encoding: {
                    x: { field: 'age', type: 'quantitative' },
                    x2: { field: 'age2', type: 'quantitative' },
                    y: { field: 'people', type: 'quantitative' },
                    y2: { field: 'people2', type: 'quantitative' }
                }
            }, config_1.defaultConfig);
        }, Error, 'Cannot have both x2 and y2 with both are quantiative');
    });
    it('should produce a warning if the second continuous axis has aggregate property', log.wrap(function (localLogger) {
        var aggregate = 'min';
        spec_1.normalize({
            data: data,
            mark: mark,
            encoding: {
                x: { field: 'age', type: 'ordinal' },
                y: { field: 'people', type: 'quantitative' },
                y2: { field: 'people2', type: 'quantitative', aggregate: aggregate }
            }
        }, config_1.defaultConfig);
        chai_1.assert.equal(localLogger.warns[0], log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, mark));
    }));
    it('should produce a warning if there is an unsupported channel in encoding', log.wrap(function (localLogger) {
        var size = 'size';
        spec_1.normalize({
            data: data,
            mark: mark,
            encoding: {
                x: { field: 'age', type: 'ordinal' },
                y: { field: 'people', type: 'quantitative' },
                y2: { field: 'people2', type: 'quantitative', aggregate: 'min' },
                size: { value: 10 }
            }
        }, config_1.defaultConfig);
        chai_1.assert.equal(localLogger.warns[0], log.message.incompatibleChannel(size, mark));
    }));
});
//# sourceMappingURL=errorbar.test.js.map