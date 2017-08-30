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
        it('should show warning if repeat cannot be resolved', function () {
            log.runLocalLogger(function (localLogger) {
                var _resolved = repeater_1.replaceRepeaterInEncoding({
                    x: { field: { repeat: 'row' }, type: 'quantitative' },
                    y: { field: 'bar', type: 'quantitative' }
                }, { column: 'foo' });
                chai_1.assert.equal(localLogger.warns[0], log.message.noSuchRepeatedValue('row'));
            });
        });
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L2NvbXBpbGUvcmVwZWF0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFFNUIsdURBQXFFO0FBRXJFLG1DQUFxQztBQUNyQyx1Q0FBb0M7QUFDcEMsZ0NBQXlDO0FBRXpDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsZ0NBQWdDLEVBQUU7WUFDbkMsSUFBTSxRQUFRLEdBQUcsb0NBQXlCLENBQUM7Z0JBQ3pDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUNqRCxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7YUFDeEMsRUFBRSxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBRWpCLGFBQU0sQ0FBQyxTQUFTLENBQW1CLFFBQVEsRUFBRTtnQkFDM0MsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUN2QyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7YUFDeEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsa0RBQWtELEVBQUU7WUFDckQsR0FBRyxDQUFDLGNBQWMsQ0FBQyxVQUFDLFdBQVc7Z0JBQzdCLElBQU0sU0FBUyxHQUFHLG9DQUF5QixDQUFDO29CQUMxQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztvQkFDakQsQ0FBQyxFQUFFLEVBQUMsS0FBSyxF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