"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var repeater_1 = require("../../src/compile/repeater");
var log = tslib_1.__importStar(require("../../src/log"));
var util_1 = require("../../src/util");
var util_2 = require("../util");
describe('Repeat', function () {
    describe('resolveRepeat', function () {
        it('should resolve repeated fields', function () {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                x: { field: { repeat: 'row' }, type: 'quantitative' },
                y: { field: 'bar', type: 'quantitative' }
            }, { row: 'foo' });
            chai_1.assert.deepEqual(resolved, {
                x: { field: 'foo', type: 'quantitative' },
                y: { field: 'bar', type: 'quantitative' }
            });
        });
        it('should show warning if repeat in field def cannot be resolved', log.wrap(function (localLogger) {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                x: { field: { repeat: 'row' }, type: 'quantitative' },
                y: { field: 'bar', type: 'quantitative' }
            }, { column: 'foo' });
            chai_1.assert.equal(localLogger.warns[0], log.message.noSuchRepeatedValue('row'));
            chai_1.assert.deepEqual(resolved, {
                y: { field: 'bar', type: 'quantitative' }
            });
        }));
        it('should support arrays fo field defs', function () {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                detail: [
                    { field: { repeat: 'row' }, type: 'quantitative' },
                    { field: 'bar', type: 'quantitative' }
                ]
            }, { row: 'foo' });
            chai_1.assert.deepEqual(resolved, {
                detail: [{ field: 'foo', type: 'quantitative' }, { field: 'bar', type: 'quantitative' }]
            });
        });
        it('should replace fields in sort', function () {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                x: { field: 'bar', type: 'quantitative', sort: { field: { repeat: 'row' }, op: 'min' } }
            }, { row: 'foo' });
            chai_1.assert.deepEqual(resolved, {
                x: { field: 'bar', type: 'quantitative', sort: { field: 'foo', op: 'min' } }
            });
        });
        it('should replace fields in conditionals', function () {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                color: {
                    condition: { selection: 'test', field: { repeat: 'row' }, type: 'quantitative' },
                    value: 'red'
                }
            }, { row: 'foo' });
            chai_1.assert.deepEqual(resolved, {
                color: {
                    condition: { selection: 'test', field: 'foo', type: 'quantitative' },
                    value: 'red'
                }
            });
        });
        it('should replace fields in reveresed conditionals', function () {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                color: {
                    condition: { selection: 'test', value: 'red' },
                    field: { repeat: 'row' }, type: 'quantitative'
                }
            }, { row: 'foo' });
            chai_1.assert.deepEqual(resolved, {
                color: {
                    condition: { selection: 'test', value: 'red' },
                    field: 'foo', type: 'quantitative'
                }
            });
        });
        it('should show warning if repeat in conditional cannot be resolved', log.wrap(function (localLogger) {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                color: {
                    condition: { selection: 'test', field: { repeat: 'row' }, type: 'quantitative' },
                    value: 'red'
                }
            }, { column: 'foo' });
            chai_1.assert.equal(localLogger.warns[0], log.message.noSuchRepeatedValue('row'));
            chai_1.assert.deepEqual(resolved, {
                color: { value: 'red' }
            });
        }));
        it('should show warning if repeat in a condition field def cannot be resolved', log.wrap(function (localLogger) {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                color: {
                    condition: { selection: 'test', value: 'red' },
                    field: { repeat: 'row' }, type: 'quantitative'
                }
            }, { column: 'foo' });
            chai_1.assert.equal(localLogger.warns[0], log.message.noSuchRepeatedValue('row'));
            chai_1.assert.deepEqual(resolved, {
                color: {
                    condition: { selection: 'test', value: 'red' }
                }
            });
        }));
    });
    describe('initialize children', function () {
        it('should create a model per repeated value', function () {
            var model = util_2.parseRepeatModel({
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
            chai_1.assert.equal(model.children.length, 2);
        });
        it('should create n*m models if row and column are specified', function () {
            var model = util_2.parseRepeatModel({
                repeat: {
                    row: ['Acceleration', 'Horsepower', 'Displacement'],
                    column: ['Origin', 'NumCylinders']
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: { repeat: 'row' }, type: 'quantitative' },
                        y: { field: { repeat: 'column' }, type: 'ordinal' }
                    }
                }
            });
            chai_1.assert.equal(model.children.length, 6);
        });
        it('should union color scales and legends', function () {
            var model = util_2.parseRepeatModel({
                repeat: {
                    row: ['foo', 'bar'],
                    column: ['foo', 'bar']
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: { repeat: 'row' }, type: 'quantitative' },
                        y: { field: { repeat: 'column' }, type: 'ordinal' },
                        color: { field: 'baz', type: 'nominal' }
                    }
                }
            });
            model.parseScale();
            var colorScale = model.component.scales['color'];
            chai_1.assert.deepEqual(colorScale.domains.length, 4);
            model.parseLegend();
            chai_1.assert.equal(util_1.keys(model.component.legends).length, 1);
        });
    });
    describe('resolve', function () {
        it('cannot share axes', log.wrap(function (localLogger) {
            util_2.parseRepeatModel({
                repeat: {},
                spec: {
                    mark: 'point',
                    encoding: {}
                },
                resolve: {
                    axis: {
                        x: 'shared'
                    }
                }
            });
            chai_1.assert.equal(localLogger.warns[0], log.message.REPEAT_CANNOT_SHARE_AXIS);
        }));
    });
});
//# sourceMappingURL=repeat.test.js.map