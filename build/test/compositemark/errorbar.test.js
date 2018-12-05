import * as tslib_1 from "tslib";
/* tslint:disable:quotemark */
import { assert } from 'chai';
import { isFieldDef } from '../../src/fielddef';
import * as log from '../../src/log';
import { isMarkDef } from '../../src/mark';
import { isLayerSpec, isUnitSpec, normalize } from '../../src/spec';
import { isAggregate, isCalculate } from '../../src/transform';
import { some } from '../../src/util';
import { defaultConfig } from '.././../src/config';
describe('normalizeErrorBar with raw data input', function () {
    it('should produce correct layered specs for mean point and vertical error bar', function () {
        assert.deepEqual(normalize({
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
        }, defaultConfig), {
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
                        x: { field: 'age', type: 'ordinal' }
                    }
                }
            ]
        });
    });
    it('should produce an error if both axes have aggregate errorbar', function () {
        assert.throws(function () {
            normalize({
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
            }, defaultConfig);
        }, Error, 'Both x and y cannot have aggregate');
    });
    it('should produce a warning if continuous axis has aggregate property', log.wrap(function (localLogger) {
        var aggregate = 'min';
        var mark = 'errorbar';
        normalize({
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
        }, defaultConfig);
        assert.equal(localLogger.warns[0], log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, mark));
    }));
    it('should produce an error if build 1D errorbar with a discrete axis', function () {
        assert.throws(function () {
            normalize({
                data: { url: 'data/population.json' },
                mark: 'errorbar',
                encoding: {
                    x: { field: 'age', type: 'ordinal' }
                }
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for errorbars');
    });
    it('should produce an error if both axes are discrete', function () {
        assert.throws(function () {
            normalize({
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
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for errorbars');
    });
    it('should produce an error if in 2D errobar both axes are not valid field definitions', function () {
        assert.throws(function () {
            normalize({
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
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for errorbars');
    });
    it('should produce an error if 1D errorbar only axis is discrete', function () {
        assert.throws(function () {
            normalize({
                data: { url: 'data/population.json' },
                mark: 'errorbar',
                encoding: {
                    x: { field: 'age', type: 'ordinal' },
                    color: { value: 'skyblue' }
                }
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for errorbars');
    });
    it('should aggregate y field for vertical errorbar with two quantitative axes and explicit orient', function () {
        var outputSpec = normalize({
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
        }, defaultConfig);
        var aggregateTransform = outputSpec.transform[0];
        if (isAggregate(aggregateTransform)) {
            assert.isTrue(some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                return (aggregateFieldDef.field === 'people' &&
                    (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median'));
            }));
        }
        else {
            assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
        }
    });
    it('should aggregate x field for horizontal errorbar with two quantitative axes and explicit orient', function () {
        var outputSpec = normalize({
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
        }, defaultConfig);
        var aggregateTransform = outputSpec.transform[0];
        if (isAggregate(aggregateTransform)) {
            assert.isTrue(some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                return (aggregateFieldDef.field === 'age' && (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median'));
            }));
        }
        else {
            assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
        }
    });
    it('should aggregate y field for vertical errorbar with two quantitative axes and specify orientation with aggregate', function () {
        var outputSpec = normalize({
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
        }, defaultConfig);
        var aggregateTransform = outputSpec.transform[0];
        if (isAggregate(aggregateTransform)) {
            assert.isTrue(some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                return (aggregateFieldDef.field === 'people' &&
                    (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median'));
            }));
        }
        else {
            assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
        }
    });
    it('should aggregate x field for horizontal errorbar with two quantitative axes and specify orientation with aggregate', function () {
        var outputSpec = normalize({
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
        }, defaultConfig);
        var aggregateTransform = outputSpec.transform[0];
        if (isAggregate(aggregateTransform)) {
            assert.isTrue(some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                return (aggregateFieldDef.field === 'age' && (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median'));
            }));
        }
        else {
            assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
        }
    });
    it('should aggregate x field for horizontal errorbar with x as quantitative axis', function () {
        var outputSpec = normalize({
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
        }, defaultConfig);
        var aggregateTransform = outputSpec.transform[0];
        if (isAggregate(aggregateTransform)) {
            assert.isTrue(some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                return (aggregateFieldDef.field === 'age' && (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median'));
            }));
        }
        else {
            assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
        }
    });
    it('should produce correct layered specs for veritcal errorbar with ticks', function () {
        var color = 'red';
        var opacity = 0.5;
        var size = 10;
        var outputSpec = normalize({
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
        }, defaultConfig);
        var layer = isLayerSpec(outputSpec) && outputSpec.layer;
        if (layer) {
            assert.isTrue(some(layer, function (unitSpec) {
                return (isUnitSpec(unitSpec) &&
                    isMarkDef(unitSpec.mark) &&
                    unitSpec.mark.type === 'tick' &&
                    unitSpec.mark.size === size &&
                    unitSpec.mark.color === color &&
                    unitSpec.mark.opacity === opacity);
            }));
        }
        else {
            assert.fail(!layer, false, 'layer should be a part of the spec');
        }
    });
    it('should produce correct layered specs with customized title', function () {
        var outputSpec = normalize({
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
        }, defaultConfig);
        var layer = isLayerSpec(outputSpec) && outputSpec.layer;
        if (layer) {
            assert.isTrue(some(layer, function (unitSpec) {
                return isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.y) && unitSpec.encoding.y.title === 'population';
            }));
        }
        else {
            assert.fail(!layer, false, 'layer should be a part of the spec');
        }
    });
    it("should not overwrite transform with errorbar's transfroms", function () {
        var outputSpec = normalize({
            data: { url: 'data/population.json' },
            mark: 'errorbar',
            transform: [{ calculate: 'age * 2', as: 'age2' }],
            encoding: { x: { field: 'age', type: 'ordinal' }, y: { field: 'people', type: 'quantitative', title: 'population' } }
        }, defaultConfig);
        var transforms = outputSpec.transform;
        expect(transforms).toBeDefined();
        expect(transforms).not.toHaveLength(0);
        expect(transforms[0]).toEqual({ calculate: 'age * 2', as: 'age2' });
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
                    normalize(spec, defaultConfig);
                    assert.equal(warningOutput[k], some(localLogger.warns, function (message) {
                        return message === warningMessage[k](center, extent, type);
                    }));
                }));
            };
            for (var k = 0; k < warningOutput.length; k++) {
                _loop_3(k);
            }
            var outputSpec = normalize(spec, defaultConfig);
            var aggregateTransform = outputSpec.transform[0];
            var testMsg = 'should produce a correct layer spec if center is ' +
                (center ? center : 'not specified') +
                ' and extent is ' +
                (extent ? extent : 'not specified') +
                '.';
            it(testMsg, function () {
                if (isAggregate(aggregateTransform)) {
                    if (extent === 'ci' || extent === 'iqr' || (center === 'median' && !extent)) {
                        assert.isFalse(some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                            return aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median';
                        }));
                    }
                    else {
                        if (center) {
                            assert.isTrue(some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                                return aggregateFieldDef.op === center;
                            }));
                        }
                        else {
                            assert.isTrue(some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                                return aggregateFieldDef.op === 'mean';
                            }));
                        }
                        if (extent) {
                            assert.isTrue(some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                                return isPartOfExtent(extent, aggregateFieldDef.op);
                            }));
                        }
                        else if (center === 'median') {
                            assert.isTrue(some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                                return isPartOfExtent('iqr', aggregateFieldDef.op);
                            }));
                            assert.isFalse(some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                                return aggregateFieldDef.op === 'median';
                            }));
                        }
                        else {
                            assert.isTrue(some(aggregateTransform.aggregate, function (aggregateFieldDef) {
                                return isPartOfExtent('stderr', aggregateFieldDef.op);
                            }));
                        }
                    }
                }
                else {
                    assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
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
describe('normalizeErrorBar with aggregated upper and lower bound input', function () {
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
    it('should produce correct layered specs for vertical errorbar with aggregated upper and lower bound input', function () {
        expect(normalize({
            data: data,
            mark: 'errorbar',
            encoding: {
                x: { field: 'age', type: 'ordinal' },
                y: { field: 'people', type: 'quantitative' },
                y2: { field: 'people2', type: 'quantitative' }
            }
        }, defaultConfig)).toEqual({
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
                        x: { field: 'age', type: 'ordinal' }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs for horizontal errorbar with aggregated upper and lower bound input', function () {
        var outputSpec = normalize({
            data: data,
            mark: 'errorbar',
            encoding: {
                y: { field: 'age', type: 'ordinal' },
                x: { field: 'people', type: 'quantitative' },
                x2: { field: 'people2', type: 'quantitative' }
            }
        }, defaultConfig);
        for (var i = 0; i < 2; i++) {
            var calculate = outputSpec.transform[i];
            if (isCalculate(calculate)) {
                assert.isTrue((calculate.calculate === 'datum.people' && calculate.as === 'lower_people') ||
                    (calculate.calculate === 'datum.people2' && calculate.as === 'upper_people'));
            }
            else {
                assert.fail(isCalculate(calculate), true, 'transform[' + i + '] should be an aggregate transform');
            }
        }
        var layer = isLayerSpec(outputSpec) && outputSpec.layer;
        if (layer) {
            assert.isTrue(some(layer, function (unitSpec) {
                return (isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.x) && unitSpec.encoding.x.field === 'lower_people');
            }));
            assert.isTrue(some(layer, function (unitSpec) {
                return (isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.x2) && unitSpec.encoding.x2.field === 'upper_people');
            }));
        }
        else {
            assert.fail(!layer, false, 'layer should be a part of the spec');
        }
    });
    it('should produce a warning if upper and lower bound are aggregated but center and/or extent is specified', log.wrap(function (localLogger) {
        var extent = 'stdev';
        var center = 'mean';
        normalize({
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
        }, defaultConfig);
        assert.equal(localLogger.warns[0], log.message.errorBarCenterAndExtentAreNotNeeded(center, extent));
    }));
    it('should produce an error if upper and lower bound are aggregated and have both x2 and y2 quantiative', function () {
        assert.throws(function () {
            normalize({
                data: data,
                mark: { type: 'errorbar', extent: 'stdev', center: 'mean' },
                encoding: {
                    x: { field: 'age', type: 'quantitative' },
                    x2: { field: 'age2', type: 'quantitative' },
                    y: { field: 'people', type: 'quantitative' },
                    y2: { field: 'people2', type: 'quantitative' }
                }
            }, defaultConfig);
        }, Error, 'errorbar cannot have both x2 and y2');
    });
    it('should produce a warning if the second continuous axis has aggregate property', log.wrap(function (localLogger) {
        var aggregate = 'min';
        normalize({
            data: data,
            mark: mark,
            encoding: {
                x: { field: 'age', type: 'ordinal' },
                y: { field: 'people', type: 'quantitative' },
                y2: { field: 'people2', type: 'quantitative', aggregate: aggregate }
            }
        }, defaultConfig);
        assert.equal(localLogger.warns[0], log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, mark));
    }));
    it('should produce a warning if there is an unsupported channel in encoding', log.wrap(function (localLogger) {
        var size = 'size';
        normalize({
            data: data,
            mark: mark,
            encoding: {
                x: { field: 'age', type: 'ordinal' },
                y: { field: 'people', type: 'quantitative' },
                y2: { field: 'people2', type: 'quantitative', aggregate: 'min' },
                size: { value: 10 }
            }
        }, defaultConfig);
        assert.equal(localLogger.warns[0], log.message.incompatibleChannel(size, mark));
    }));
    it('should produce an error if upper and lower bound are aggregated for horizontal errorbar and one of x, x2 is not quantitative', function () {
        assert.throws(function () {
            normalize({
                data: data,
                mark: { type: 'errorbar', extent: 'stdev', center: 'mean' },
                encoding: {
                    x: { field: 'age', type: 'quantitative' },
                    x2: { field: 'age2', type: 'ordinal' },
                    y: { field: 'people', type: 'quantitative' }
                }
            }, defaultConfig);
        }, Error, 'Both x and x2 have to be quantitative in errorbar');
    });
    it('should produce an error if upper and lower bound are aggregated for vertical errorbar and one of y, y2 is not quantitative', function () {
        assert.throws(function () {
            normalize({
                data: data,
                mark: { type: 'errorbar', extent: 'stdev', center: 'mean' },
                encoding: {
                    y: { field: 'age', type: 'quantitative' },
                    y2: { field: 'age2', type: 'ordinal' },
                    x: { field: 'people', type: 'quantitative' }
                }
            }, defaultConfig);
        }, Error, 'Both y and y2 have to be quantitative in errorbar');
    });
});
describe('normalizeErrorBar with aggregated error input', function () {
    var data = {
        values: [
            { age: 1, people: 1, people_err: 2, people_err2: -3 },
            { age: 2, people: 4, people_err: 8, people_err2: -3 },
            { age: 3, people: 13, people_err: 18, people_err2: -3 },
            { age: 4, people: 2, people_err: 28, people_err2: -3 }
        ]
    };
    var mark = 'errorbar';
    it('should produce correct layered specs for vertical errorbar with aggregated error input', function () {
        expect(normalize({
            data: data,
            mark: mark,
            encoding: {
                x: { field: 'age', type: 'ordinal' },
                y: { field: 'people', type: 'quantitative' },
                yError: { field: 'people_error', type: 'quantitative' }
            }
        }, defaultConfig)).toEqual({
            data: data,
            transform: [
                { calculate: 'datum.people + datum.people_error', as: 'upper_people' },
                { calculate: 'datum.people - datum.people_error', as: 'lower_people' }
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
                        x: { field: 'age', type: 'ordinal' }
                    }
                }
            ]
        });
    });
    it('should produce correct layered specs for horizontal errorbar with aggregated error input', function () {
        var outputSpec = normalize({
            data: data,
            mark: mark,
            encoding: {
                y: { field: 'age', type: 'ordinal' },
                x: { field: 'people', type: 'quantitative' },
                xError: { field: 'people_error', type: 'quantitative' }
            }
        }, defaultConfig);
        for (var i = 0; i < 2; i++) {
            var calculate = outputSpec.transform[i];
            if (isCalculate(calculate)) {
                assert.isTrue((calculate.calculate === 'datum.people - datum.people_error' && calculate.as === 'lower_people') ||
                    (calculate.calculate === 'datum.people + datum.people_error' && calculate.as === 'upper_people'));
            }
            else {
                assert.fail(isCalculate(calculate), true, 'transform[' + i + '] should be an aggregate transform');
            }
        }
        var layer = isLayerSpec(outputSpec) && outputSpec.layer;
        if (layer) {
            assert.isTrue(some(layer, function (unitSpec) {
                return (isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.x) && unitSpec.encoding.x.field === 'lower_people');
            }));
            assert.isTrue(some(layer, function (unitSpec) {
                return (isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.x2) && unitSpec.encoding.x2.field === 'upper_people');
            }));
        }
        else {
            assert.fail(!layer, false, 'layer should be a part of the spec');
        }
    });
    it('should produce correct layered specs for horizontal errorbar with 2 aggregated error input', function () {
        var outputSpec = normalize({
            data: data,
            mark: mark,
            encoding: {
                y: { field: 'age', type: 'ordinal' },
                x: { field: 'people', type: 'quantitative' },
                xError: { field: 'people_error', type: 'quantitative' },
                xError2: { field: 'people_error2', type: 'quantitative' }
            }
        }, defaultConfig);
        for (var i = 0; i < 2; i++) {
            var calculate = outputSpec.transform[i];
            if (isCalculate(calculate)) {
                assert.isTrue((calculate.calculate === 'datum.people + datum.people_error' && calculate.as === 'upper_people') ||
                    (calculate.calculate === 'datum.people + datum.people_error2' && calculate.as === 'lower_people'));
            }
            else {
                assert.fail(isCalculate(calculate), true, 'transform[' + i + '] should be an aggregate transform');
            }
        }
    });
    it('should produce a warning if error are aggregated but center and/or extent is specified', log.wrap(function (localLogger) {
        var extent = 'stdev';
        var center = 'mean';
        normalize({
            data: data,
            mark: {
                type: 'errorbar',
                extent: extent,
                center: center
            },
            encoding: {
                x: { field: 'age', type: 'ordinal' },
                y: { field: 'people', type: 'quantitative' },
                yError: { field: 'people_error', type: 'quantitative' }
            }
        }, defaultConfig);
        assert.equal(localLogger.warns[0], log.message.errorBarCenterAndExtentAreNotNeeded(center, extent));
    }));
    it('should produce an error if error are aggregated and have both xError and yError quantiative', function () {
        assert.throws(function () {
            normalize({
                data: data,
                mark: mark,
                encoding: {
                    x: { field: 'age', type: 'quantitative' },
                    xError: { field: 'age', type: 'quantitative' },
                    y: { field: 'people', type: 'quantitative' },
                    yError: { field: 'people_errpr', type: 'quantitative' }
                }
            }, defaultConfig);
        }, Error, 'errorbar cannot have both xError and yError with both are quantiative');
    });
    it('should produce an error if error are aggregated for horizontal errorbar and xError2 exist without xError', function () {
        assert.throws(function () {
            normalize({
                data: data,
                mark: mark,
                encoding: {
                    x: { field: 'age', type: 'quantitative' },
                    xError2: { field: 'age', type: 'quantitative' },
                    y: { field: 'people', type: 'quantitative' }
                }
            }, defaultConfig);
        }, Error, 'errorbar cannot have xError2 without xError');
    });
    it('should produce an error if error are aggregated for vertical errorbar and yError2 exist without yError', function () {
        assert.throws(function () {
            normalize({
                data: data,
                mark: mark,
                encoding: {
                    x: { field: 'age', type: 'quantitative' },
                    yError2: { field: 'people_error2', type: 'quantitative' },
                    y: { field: 'people', type: 'quantitative' }
                }
            }, defaultConfig);
        }, Error, 'errorbar cannot have yError2 without yError');
    });
    it('should produce an error if error are aggregated for horizontal errorbar and one of x, xError, or xError2 is not quantitative', function () {
        assert.throws(function () {
            normalize({
                data: data,
                mark: mark,
                encoding: {
                    x: { field: 'age', type: 'quantitative' },
                    xError: { field: 'people_error', type: 'ordinal' },
                    xError2: { field: 'people_error2', type: 'quantitative' },
                    y: { field: 'people', type: 'quantitative' }
                }
            }, defaultConfig);
        }, Error, 'All x, xError, and xError2 (if exist) have to be quantitative');
    });
    it('should produce an error if error are aggregated for vertical errorbar and one of y, yError, or yError2 is not quantitative', function () {
        assert.throws(function () {
            normalize({
                data: data,
                mark: mark,
                encoding: {
                    y: { field: 'age', type: 'quantitative' },
                    yError: { field: 'people_error', type: 'ordinal' },
                    yError2: { field: 'people_error2', type: 'quantitative' },
                    x: { field: 'people', type: 'quantitative' }
                }
            }, defaultConfig);
        }, Error, 'All y, yError, and yError2 (if exist) have to be quantitative');
    });
    it('should produce a warning if the second continuous axis has aggregate property', log.wrap(function (localLogger) {
        var aggregate = 'min';
        normalize({
            data: data,
            mark: mark,
            encoding: {
                x: { field: 'age', type: 'ordinal' },
                y: { field: 'people', type: 'quantitative' },
                yError: { field: 'people_error', type: 'quantitative', aggregate: aggregate }
            }
        }, defaultConfig);
        assert.equal(localLogger.warns[0], log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, mark));
    }));
    it('should produce an error if both error and upper-lower bound are aggregated', function () {
        assert.throws(function () {
            normalize({
                data: data,
                mark: mark,
                encoding: {
                    x: { field: 'age', type: 'quantitative' },
                    xError: { field: 'people_error', type: 'ordinal' },
                    x2: { field: 'people_error2', type: 'quantitative' },
                    y: { field: 'people', type: 'quantitative' }
                }
            }, defaultConfig);
        }, Error, 'errorbar cannot be both type aggregated-upper-lower and aggregated-error');
    });
});
//# sourceMappingURL=errorbar.test.js.map