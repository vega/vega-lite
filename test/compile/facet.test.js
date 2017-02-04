/* tslint:disable quotemark */
"use strict";
var chai_1 = require("chai");
var log = require("../../src/log");
var facet_1 = require("../../src/compile/facet");
var facet = require("../../src/compile/facet");
var channel_1 = require("../../src/channel");
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
                chai_1.assert.equal(model.facet()['shape'], undefined);
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
                chai_1.assert.equal(model.facet().row, undefined);
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
                chai_1.assert.deepEqual(model.facet().row, { field: 'a', type: 'quantitative' });
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
});
//# sourceMappingURL=facet.test.js.map