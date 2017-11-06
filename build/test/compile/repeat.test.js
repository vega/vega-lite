"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var repeater_1 = require("../../src/compile/repeater");
var log = require("../../src/log");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L2NvbXBpbGUvcmVwZWF0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFFNUIsdURBQXFFO0FBRXJFLG1DQUFxQztBQUNyQyx1Q0FBb0M7QUFDcEMsZ0NBQXlDO0FBRXpDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsZ0NBQWdDLEVBQUU7WUFDbkMsSUFBTSxRQUFRLEdBQUcsb0NBQXlCLENBQUM7Z0JBQ3pDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUNqRCxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7YUFDeEMsRUFBRSxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBRWpCLGFBQU0sQ0FBQyxTQUFTLENBQW1CLFFBQVEsRUFBRTtnQkFDM0MsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUN2QyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7YUFDeEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsK0RBQStELEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDdkYsSUFBTSxRQUFRLEdBQUcsb0NBQXlCLENBQUM7Z0JBQ3pDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUNqRCxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FB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