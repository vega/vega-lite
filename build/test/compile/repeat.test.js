"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var repeat_1 = require("../../src/compile/repeat");
var log = require("../../src/log");
var util_1 = require("../../src/util");
var vega_schema_1 = require("../../src/vega.schema");
var util_2 = require("../util");
describe('Repeat', function () {
    describe('resolveRepeat', function () {
        it('should resolve repeated fields', function () {
            var resolved = repeat_1.replaceRepeaterInEncoding({
                x: { field: { repeat: 'row' } },
                y: { field: 'bar' }
            }, { row: 'foo' });
            chai_1.assert.deepEqual(resolved, {
                x: { field: 'foo' },
                y: { field: 'bar' }
            });
        });
        it('should show warning if repeat cannot be resolved', function () {
            log.runLocalLogger(function (localLogger) {
                var resolved = repeat_1.replaceRepeaterInEncoding({
                    x: { field: { repeat: 'row' } },
                    y: { field: 'bar' }
                }, { column: 'foo' });
                chai_1.assert.equal(localLogger.warns[0], log.message.noSuchRepeatedValue('row'));
            });
        });
        it('should support arrays fo field defs', function () {
            var resolved = repeat_1.replaceRepeaterInEncoding({
                detail: [{ field: { repeat: 'row' } }, { field: 'bar' }]
            }, { row: 'foo' });
            chai_1.assert.deepEqual(resolved, {
                detail: [{ field: 'foo' }, { field: 'bar' }]
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
            chai_1.assert(vega_schema_1.isDataRefUnionedDomain(colorScale.domain));
            chai_1.assert.deepEqual(colorScale.domain.fields.length, 4);
            model.parseLegend();
            chai_1.assert.equal(util_1.keys(model.component.legends).length, 1);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L2NvbXBpbGUvcmVwZWF0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsbURBQW1FO0FBQ25FLG1DQUFxQztBQUNyQyx1Q0FBb0M7QUFDcEMscURBQWlGO0FBQ2pGLGdDQUF5QztBQUV6QyxRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2pCLFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsRUFBRSxDQUFDLGdDQUFnQyxFQUFFO1lBQ25DLElBQU0sUUFBUSxHQUFHLGtDQUF5QixDQUFDO2dCQUN6QyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLEVBQUM7Z0JBQzNCLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUM7YUFDbEIsRUFBRSxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBRWpCLGFBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO2dCQUN6QixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDO2dCQUNqQixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDO2FBQ2xCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtEQUFrRCxFQUFFO1lBQ3JELEdBQUcsQ0FBQyxjQUFjLENBQUMsVUFBQyxXQUFXO2dCQUM3QixJQUFNLFFBQVEsR0FBRyxrQ0FBeUIsQ0FBQztvQkFDekMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxFQUFDO29CQUMzQixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDO2lCQUNsQixFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7Z0JBRXBCLGFBQU0sQ0FBQyxLQUFLLENBQUMs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