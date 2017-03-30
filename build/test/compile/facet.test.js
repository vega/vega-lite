/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var log = require("../../src/log");
var channel_1 = require("../../src/channel");
var facet_1 = require("../../src/compile/facet");
var facet = require("../../src/compile/facet");
var config_1 = require("../../src/config");
var mark_1 = require("../../src/mark");
var type_1 = require("../../src/type");
var util_1 = require("../util");
describe('FacetModel', function () {
    it('should say it is facet', function () {
        var model = new facet_1.FacetModel({ facet: {}, spec: {
                mark: mark_1.POINT,
                encoding: {}
            } }, null, null);
        chai_1.assert(!model.isUnit());
        chai_1.assert(model.isFacet());
        chai_1.assert(!model.isLayer());
    });
    describe('initFacet', function () {
        it('should drop unsupported channel and throws warning', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseFacetModel({
                    facet: ({
                        shape: { field: 'a', type: 'quantitative' }
                    }),
                    spec: {
                        mark: 'point',
                        encoding: {}
                    }
                });
                chai_1.assert.equal(model.facet['shape'], undefined);
                chai_1.assert.equal(localLogger.warns[0], log.message.incompatibleChannel(channel_1.SHAPE, 'facet'));
            });
        });
        it('should drop channel without field and value and throws warning', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseFacetModel({
                    facet: {
                        row: { type: 'ordinal' }
                    },
                    spec: {
                        mark: 'point',
                        encoding: {}
                    }
                });
                chai_1.assert.equal(model.facet.row, undefined);
                chai_1.assert.equal(localLogger.warns[0], log.message.emptyFieldDef({ type: type_1.ORDINAL }, channel_1.ROW));
            });
        });
        it('should drop channel without field and value and throws warning', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseFacetModel({
                    facet: {
                        row: { field: 'a', type: 'quantitative' }
                    },
                    spec: {
                        mark: 'point',
                        encoding: {}
                    }
                });
                chai_1.assert.deepEqual(model.facet.row, { field: 'a', type: 'quantitative' });
                chai_1.assert.equal(localLogger.warns[0], log.message.facetChannelShouldBeDiscrete(channel_1.ROW));
            });
        });
    });
    describe('spacing', function () {
        it('should return specified spacing if specified', function () {
            chai_1.assert.equal(facet.spacing({ spacing: 123 }, null, null), 123);
        });
        it('should return default facetSpacing if there is a subplot and no specified spacing', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                }
            });
            chai_1.assert.equal(facet.spacing({}, model, config_1.defaultConfig), config_1.defaultConfig.scale.facetSpacing);
        });
        it('should return 0 if it is a simple table without subplot with x/y and no specified spacing', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        "color": { "field": "site", "type": "nominal" }
                    }
                }
            });
            chai_1.assert.equal(facet.spacing({}, model, config_1.defaultConfig), 0);
        });
    });
    describe('dataTable', function () {
        it('should return stacked if there is a stacked data component', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                }
            });
            // Mock
            model.component.data = { stack: {} };
            chai_1.assert.equal(model.dataTable(), 'stacked');
        });
        it('should return summary if there is a summary data component and no stacked', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" }
                    }
                }
            });
            // Mock
            model.component.data = { summary: [{
                        measures: { a: 1 }
                    }] };
            chai_1.assert.equal(model.dataTable(), 'summary');
        });
        it('should return source if there is no stacked nor summary data component', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        "x": { "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" }
                    }
                }
            });
            // Mock
            model.component.data = { summary: [] };
            chai_1.assert.equal(model.dataTable(), 'source');
        });
    });
});
describe('compile/facet', function () {
    describe('assembleAxesGroupData', function () {
        it('should output row-source when there is row', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {}
                }
            });
            // HACK: mock that we have parsed its data and there is no stack and no summary
            // This way, we won't have surge in test coverage for the parse methods.
            model.component.data = {};
            model['hasSummary'] = function () { return false; };
            chai_1.assert.deepEqual(facet.assembleAxesGroupData(model, []), [{
                    name: facet.ROW_AXES_DATA_PREFIX + 'source',
                    source: 'source',
                    transform: [{
                            type: 'aggregate',
                            groupby: ['a']
                        }]
                }]);
        });
        it('should output column-source when there is column', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    column: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {}
                }
            });
            // HACK: mock that we have parsed its data and there is no stack and no summary
            // This way, we won't have surge in test coverage for the parse methods.
            model.component.data = {};
            model['hasSummary'] = function () { return false; };
            chai_1.assert.deepEqual(facet.assembleAxesGroupData(model, []), [{
                    name: facet.COLUMN_AXES_DATA_PREFIX + 'source',
                    source: 'source',
                    transform: [{
                            type: 'aggregate',
                            groupby: ['a']
                        }]
                }]);
        });
        it('should output row- and column-source when there are both row and column', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    column: { field: 'a', type: 'ordinal' },
                    row: { field: 'b', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {}
                }
            });
            // HACK: mock that we have parsed its data and there is no stack and no summary
            // This way, we won't have surge in test coverage for the parse methods.
            model.component.data = {};
            model['hasSummary'] = function () { return false; };
            chai_1.assert.deepEqual(facet.assembleAxesGroupData(model, []), [{
                    name: facet.COLUMN_AXES_DATA_PREFIX + 'source',
                    source: 'source',
                    transform: [{
                            type: 'aggregate',
                            groupby: ['a']
                        }]
                }, {
                    name: facet.ROW_AXES_DATA_PREFIX + 'source',
                    source: 'source',
                    transform: [{
                            type: 'aggregate',
                            groupby: ['b']
                        }]
                }]);
        });
    });
    describe('getSharedAxisGroup', function () {
        describe('column-only', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    column: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            // HACK: mock that we have parsed its data and there is no stack and no summary
            // This way, we won't have surge in test coverage for the parse methods.
            model.component.data = {};
            model['hasSummary'] = function () { return false; };
            describe('xAxisGroup', function () {
                var xSharedAxisGroup = facet.getSharedAxisGroup(model, 'x');
                it('should have correct type, name, and data source', function () {
                    chai_1.assert.equal(xSharedAxisGroup.name, 'x-axes');
                    chai_1.assert.equal(xSharedAxisGroup.type, 'group');
                    chai_1.assert.deepEqual(xSharedAxisGroup.from, { data: 'column-source' });
                });
                it('should have width = child width, height = group height, x = column field', function () {
                    chai_1.assert.deepEqual(xSharedAxisGroup.encode.update.width, { field: { parent: 'child_width' } });
                    chai_1.assert.deepEqual(xSharedAxisGroup.encode.update.height, { field: { group: 'height' } });
                    chai_1.assert.deepEqual(xSharedAxisGroup.encode.update.x, { scale: 'column', field: 'a', offset: 8 });
                });
            });
            describe('yAxisGroup', function () {
                var ySharedAxisGroup = facet.getSharedAxisGroup(model, 'y');
                it('should have correct type, name, and data source', function () {
                    chai_1.assert.equal(ySharedAxisGroup.name, 'y-axes');
                    chai_1.assert.equal(ySharedAxisGroup.type, 'group');
                    chai_1.assert.equal(ySharedAxisGroup.from, undefined);
                });
                it('should have height = child height, width = group width, y = defaultFacetSpacing / 2.', function () {
                    chai_1.assert.deepEqual(ySharedAxisGroup.encode.update.height, { field: { parent: 'child_height' } });
                    chai_1.assert.deepEqual(ySharedAxisGroup.encode.update.width, { field: { group: 'width' } });
                    chai_1.assert.deepEqual(ySharedAxisGroup.encode.update.y, { value: 8 });
                });
            });
        });
        describe('row-only', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            // HACK: mock that we have parsed its data and there is no stack and no summary
            // This way, we won't have surge in test coverage for the parse methods.
            model.component.data = {};
            model['hasSummary'] = function () { return false; };
            describe('yAxisGroup', function () {
                var ySharedAxisGroup = facet.getSharedAxisGroup(model, 'y');
                it('should have correct type, name, and data source', function () {
                    chai_1.assert.equal(ySharedAxisGroup.name, 'y-axes');
                    chai_1.assert.equal(ySharedAxisGroup.type, 'group');
                    chai_1.assert.deepEqual(ySharedAxisGroup.from, { data: 'row-source' });
                });
                it('should have height = child height, width = group width, y= row field', function () {
                    chai_1.assert.deepEqual(ySharedAxisGroup.encode.update.height, { field: { parent: 'child_height' } });
                    chai_1.assert.deepEqual(ySharedAxisGroup.encode.update.width, { field: { group: 'width' } });
                    chai_1.assert.deepEqual(ySharedAxisGroup.encode.update.y, { scale: 'row', field: 'a', offset: 8 });
                });
            });
            describe('xAxisGroup', function () {
                var xSharedAxisGroup = facet.getSharedAxisGroup(model, 'x');
                it('should have correct type, name, and data source', function () {
                    chai_1.assert.equal(xSharedAxisGroup.name, 'x-axes');
                    chai_1.assert.equal(xSharedAxisGroup.type, 'group');
                    chai_1.assert.equal(xSharedAxisGroup.from, undefined);
                });
                it('should have width = child width, height = group height, x, x = defaultFacetSpacing / 2.', function () {
                    chai_1.assert.deepEqual(xSharedAxisGroup.encode.update.width, { field: { parent: 'child_width' } });
                    chai_1.assert.deepEqual(xSharedAxisGroup.encode.update.height, { field: { group: 'height' } });
                    chai_1.assert.deepEqual(xSharedAxisGroup.encode.update.x, { value: 8 });
                });
            });
        });
    });
    describe('initAxis', function () {
        it('should not include properties of non-VlOnlyAxisConfig in config.facet.axis', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                    },
                },
                config: { "facet": { "axis": { "domainWidth": 123 } } }
            });
            chai_1.assert.deepEqual(model.axis(channel_1.ROW), { "orient": "right", "labelAngle": 90 });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvY29tcGlsZS9mYWNldC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUU1QixtQ0FBcUM7QUFFckMsNkNBQTZDO0FBQzdDLGlEQUFtRDtBQUNuRCwrQ0FBaUQ7QUFDakQsMkNBQStDO0FBRS9DLHVDQUFxQztBQUVyQyx1Q0FBdUM7QUFDdkMsZ0NBQXdDO0FBRXhDLFFBQVEsQ0FBQyxZQUFZLEVBQUU7SUFDckIsRUFBRSxDQUFDLHdCQUF3QixFQUFFO1FBQzNCLElBQU0sS0FBSyxHQUFHLElBQUksa0JBQVUsQ0FBQyxFQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFO2dCQUM3QyxJQUFJLEVBQUUsWUFBSztnQkFDWCxRQUFRLEVBQUUsRUFBRTthQUNiLEVBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0IsYUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDeEIsYUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3hCLGFBQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixFQUFFLENBQUMsb0RBQW9ELEVBQUU7WUFDdkQsR0FBRyxDQUFDLGNBQWMsQ0FBQyxVQUFDLFdBQVc7Z0JBQzdCLElBQU0sS0FBSyxHQUFHLHNCQUFlLENBQUM7b0JBQzVCLEtBQUssRUFBRSxDQUFDO3dCQUNOLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztxQkFDMUMsQ0FBVTtvQkFDWCxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFLE9BQU87d0JBQ2IsUUFBUSxFQUFFLEVBQUU7cUJBQ2I7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsZUFBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdEYsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTtZQUNuRSxHQUFHLENBQUMsY0FBYyxDQUFDLFVBQUMsV0FBVztnQkFDN0IsSUFBTSxLQUFLLEdBQUcsc0JBQWUsQ0FBQztvQkFDNUIsS0FBSyxFQUFFO3dCQUNMLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUM7cUJBQ3ZCO29CQUNELElBQUksRUFBRTt3QkFDSixJQUFJLEVBQUUsT0FBTzt3QkFDYixRQUFRLEVBQUUsRUFBRTtxQkFDYjtpQkFDRixDQUFDLENBQUM7Z0JBQ0gsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDekMsYUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUMsSUFBSSxFQUFFLGNBQU8sRUFBQyxFQUFFLGFBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdEYsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTtZQUNuRSxHQUFHLENBQUMsY0FBYyxDQUFDLFVBQUMsV0FBVztnQkFDN0IsSUFBTSxLQUFLLEdBQUcsc0JBQWUsQ0FBQztvQkFDNUIsS0FBSyxFQUFFO3dCQUNMLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztxQkFDeEM7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLElBQUksRUFBRSxPQUFPO3dCQUNiLFFBQVEsRUFBRSxFQUFFO3FCQUNiO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDLENBQUMsQ0FBQztnQkFDdEUsYUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsYUFBRyxDQUFDLENBQUMsQ0FBQztZQUNwRixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1GQUFtRixFQUFFO1lBQ3RGLElBQU0sS0FBSyxHQUFHLHNCQUFlLENBQUM7Z0JBQzVCLEtBQUssRUFBRTtvQkFDTCxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7aUJBQ25DO2dCQUNELElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUU7d0JBQ1IsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7d0JBQ25FLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQzt3QkFDNUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO3FCQUM5QztpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLHNCQUFhLENBQUMsRUFBRSxzQkFBYSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxRixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyRkFBMkYsRUFBRTtZQUM5RixJQUFNLEtBQUssR0FBRyxzQkFBZSxDQUFDO2dCQUM1QixLQUFLLEVBQUU7b0JBQ0wsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2lCQUNuQztnQkFDRCxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE9BQU87b0JBQ2IsUUFBUSxFQUFFO3dCQUNSLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztxQkFDOUM7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxzQkFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsRUFBRSxDQUFDLDREQUE0RCxFQUFFO1lBQy9ELElBQU0sS0FBSyxHQUFHLHNCQUFlLENBQUM7Z0JBQzVCLEtBQUssRUFBRTtvQkFDTCxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7aUJBQ25DO2dCQUNELElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUU7d0JBQ1IsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7d0JBQ25FLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQzt3QkFDNUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO3FCQUM5QztpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxFQUFDLEtBQUssRUFBRSxFQUFFLEVBQVEsQ0FBQztZQUUxQyxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyRUFBMkUsRUFBRTtZQUM5RSxJQUFNLEtBQUssR0FBRyxzQkFBZSxDQUFDO2dCQUM1QixLQUFLLEVBQUU7b0JBQ0wsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2lCQUNuQztnQkFDRCxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE9BQU87b0JBQ2IsUUFBUSxFQUFFO3dCQUNSLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO3dCQUNuRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7cUJBQzdDO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLEVBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ2hDLFFBQVEsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUM7cUJBQ2pCLENBQUMsRUFBUSxDQUFDO1lBRVgsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0VBQXdFLEVBQUU7WUFDM0UsSUFBTSxLQUFLLEdBQUcsc0JBQWUsQ0FBQztnQkFDNUIsS0FBSyxFQUFFO29CQUNMLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztpQkFDbkM7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxPQUFPO29CQUNiLFFBQVEsRUFBRTt3QkFDUixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7d0JBQy9DLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztxQkFDN0M7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxPQUFPO1lBQ1AsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFRLENBQUM7WUFFNUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLGVBQWUsRUFBRTtJQUN4QixRQUFRLENBQUMsdUJBQXVCLEVBQUU7UUFDaEMsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLElBQU0sS0FBSyxHQUFHLHNCQUFlLENBQUM7Z0JBQzVCLEtBQUssRUFBRTtvQkFDTCxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7aUJBQ25DO2dCQUNELElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUUsRUFBRTtpQkFDYjthQUNGLENBQUMsQ0FBQztZQUVILCtFQUErRTtZQUMvRSx3RUFBd0U7WUFDeEUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsRUFBUyxDQUFDO1lBQ2pDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxjQUFNLE9BQUEsS0FBSyxFQUFMLENBQUssQ0FBQztZQUVsQyxhQUFNLENBQUMsU0FBUyxDQUNkLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQ3RDLENBQUM7b0JBQ0MsSUFBSSxFQUFFLEtBQUssQ0FBQyxvQkFBb0IsR0FBRyxRQUFRO29CQUMzQyxNQUFNLEVBQUUsUUFBUTtvQkFDaEIsU0FBUyxFQUFFLENBQUM7NEJBQ1YsSUFBSSxFQUFFLFdBQVc7NEJBQ2pCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQzt5QkFDZixDQUFDO2lCQUNILENBQUMsQ0FDSCxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsa0RBQWtELEVBQUU7WUFDckQsSUFBTSxLQUFLLEdBQUcsc0JBQWUsQ0FBQztnQkFDNUIsS0FBSyxFQUFFO29CQUNMLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztpQkFDdEM7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxPQUFPO29CQUNiLFFBQVEsRUFBRSxFQUFFO2lCQUNiO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsK0VBQStFO1lBQy9FLHdFQUF3RTtZQUN4RSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxFQUFTLENBQUM7WUFDakMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLGNBQU0sT0FBQSxLQUFLLEVBQUwsQ0FBSyxDQUFDO1lBRWxDLGFBQU0sQ0FBQyxTQUFTLENBQ2QsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsRUFDdEMsQ0FBQztvQkFDQyxJQUFJLEVBQUUsS0FBSyxDQUFDLHVCQUF1QixHQUFHLFFBQVE7b0JBQzlDLE1BQU0sRUFBRSxRQUFRO29CQUNoQixTQUFTLEVBQUUsQ0FBQzs0QkFDVixJQUFJLEVBQUUsV0FBVzs0QkFDakIsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO3lCQUNmLENBQUM7aUJBQ0gsQ0FBQyxDQUNILENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5RUFBeUUsRUFBRTtZQUM1RSxJQUFNLEtBQUssR0FBRyxzQkFBZSxDQUFDO2dCQUM1QixLQUFLLEVBQUU7b0JBQ0wsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO29CQUNyQyxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7aUJBQ25DO2dCQUNELElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUUsRUFBRTtpQkFDYjthQUNGLENBQUMsQ0FBQztZQUVILCtFQUErRTtZQUMvRSx3RUFBd0U7WUFDeEUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsRUFBUyxDQUFDO1lBQ2pDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxjQUFNLE9BQUEsS0FBSyxFQUFMLENBQUssQ0FBQztZQUVsQyxhQUFNLENBQUMsU0FBUyxDQUNkLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQ3RDLENBQUM7b0JBQ0MsSUFBSSxFQUFFLEtBQUssQ0FBQyx1QkFBdUIsR0FBRyxRQUFRO29CQUM5QyxNQUFNLEVBQUUsUUFBUTtvQkFDaEIsU0FBUyxFQUFFLENBQUM7NEJBQ1YsSUFBSSxFQUFFLFdBQVc7NEJBQ2pCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQzt5QkFDZixDQUFDO2lCQUNILEVBQUM7b0JBQ0EsSUFBSSxFQUFFLEtBQUssQ0FBQyxvQkFBb0IsR0FBRyxRQUFRO29CQUMzQyxNQUFNLEVBQUUsUUFBUTtvQkFDaEIsU0FBUyxFQUFFLENBQUM7NEJBQ1YsSUFBSSxFQUFFLFdBQVc7NEJBQ2pCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQzt5QkFDZixDQUFDO2lCQUNILENBQUMsQ0FDSCxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtRQUM3QixRQUFRLENBQUMsYUFBYSxFQUFFO1lBQ3RCLElBQU0sS0FBSyxHQUFHLHNCQUFlLENBQUM7Z0JBQzVCLEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7aUJBQ3RDO2dCQUNELElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUU7d0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO3dCQUNyQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7cUJBQ3RDO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsK0VBQStFO1lBQy9FLHdFQUF3RTtZQUN4RSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxFQUFTLENBQUM7WUFDakMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLGNBQU0sT0FBQSxLQUFLLEVBQUwsQ0FBSyxDQUFDO1lBRWxDLFFBQVEsQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JCLElBQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDOUQsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO29CQUNwRCxhQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQzdDLGFBQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUM7Z0JBQ25FLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQywwRUFBMEUsRUFBRTtvQkFDN0UsYUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUMsRUFBQyxDQUFDLENBQUM7b0JBQ3pGLGFBQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUNwRixhQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUMvRixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtnQkFDckIsSUFBTSxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM5RCxFQUFFLENBQUMsaURBQWlELEVBQUU7b0JBQ3BELGFBQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUM5QyxhQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDN0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ2pELENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQyxzRkFBc0YsRUFBRTtvQkFDekYsYUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUMsRUFBQyxDQUFDLENBQUM7b0JBQzNGLGFBQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUNsRixhQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQ2pFLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBTSxLQUFLLEdBQUcsc0JBQWUsQ0FBQztnQkFDNUIsS0FBSyxFQUFFO29CQUNMLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztpQkFDbkM7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxPQUFPO29CQUNiLFFBQVEsRUFBRTt3QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7d0JBQ3JDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztxQkFDdEM7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFFSCwrRUFBK0U7WUFDL0Usd0VBQXdFO1lBQ3hFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLEVBQVMsQ0FBQztZQUNqQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsY0FBTSxPQUFBLEtBQUssRUFBTCxDQUFLLENBQUM7WUFFbEMsUUFBUSxDQUFDLFlBQVksRUFBRTtnQkFDckIsSUFBTSxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM5RCxFQUFFLENBQUMsaURBQWlELEVBQUU7b0JBQ3BELGFBQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUM5QyxhQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDN0MsYUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQztnQkFDaEUsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLHNFQUFzRSxFQUFFO29CQUN6RSxhQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQyxFQUFDLENBQUMsQ0FBQztvQkFDM0YsYUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBQyxDQUFDLENBQUM7b0JBQ2xGLGFBQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQzVGLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO2dCQUNyQixJQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzlELEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtvQkFDcEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQzlDLGFBQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUM3QyxhQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDakQsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLHlGQUF5RixFQUFFO29CQUM1RixhQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLGFBQWEsRUFBQyxFQUFDLENBQUMsQ0FBQztvQkFDekYsYUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsRUFBQyxDQUFDLENBQUM7b0JBQ3BGLGFBQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztnQkFDakUsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsVUFBVSxFQUFFO1FBQ25CLEVBQUUsQ0FBQyw0RUFBNEUsRUFBRTtZQUMvRSxJQUFNLEtBQUssR0FBRyxzQkFBZSxDQUFDO2dCQUM1QixLQUFLLEVBQUU7b0JBQ0wsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2lCQUNuQztnQkFDRCxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE9BQU87b0JBQ2IsUUFBUSxFQUFFO3dCQUNSLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO3dCQUNuRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7cUJBQzdDO2lCQUNGO2dCQUNELE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUMsRUFBQyxFQUFDO2FBQ2xELENBQUMsQ0FBQztZQUNILGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFHLENBQUMsRUFBRSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=