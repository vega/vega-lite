"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var model_1 = require("../../src/compile/model");
var util_1 = require("../util");
describe('Model', function () {
    describe('NameMap', function () {
        it('should rename correctly', function () {
            var map = new model_1.NameMap();
            chai_1.assert.equal(map.get('a'), 'a');
            map.rename('a', 'b');
            chai_1.assert.equal(map.get('a'), 'b');
            chai_1.assert.equal(map.get('b'), 'b');
            map.rename('b', 'c');
            chai_1.assert.equal(map.get('a'), 'c');
            chai_1.assert.equal(map.get('b'), 'c');
            chai_1.assert.equal(map.get('c'), 'c');
            map.rename('z', 'a');
            chai_1.assert.equal(map.get('a'), 'c');
            chai_1.assert.equal(map.get('b'), 'c');
            chai_1.assert.equal(map.get('c'), 'c');
            chai_1.assert.equal(map.get('z'), 'c');
        });
    });
    describe('hasDescendantWithFieldOnChannel', function () {
        it('should return true if a child plot has a field on x', function () {
            var model = util_1.parseFacetModel({
                facet: { row: { field: 'a', type: 'nominal' } },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'x', type: 'quantitative' }
                    }
                }
            });
            chai_1.assert(model.hasDescendantWithFieldOnChannel('x'));
        });
        it('should return true if a descendant plot has x', function () {
            var model = util_1.parseFacetModel({
                facet: { row: { field: 'a', type: 'nominal' } },
                spec: {
                    layer: [
                        {
                            mark: 'point',
                            encoding: {
                                x: { field: 'x', type: 'quantitative' }
                            }
                        },
                        {
                            mark: 'point',
                            encoding: {
                                color: { field: 'x', type: 'quantitative' }
                            }
                        }
                    ]
                }
            });
            chai_1.assert(model.hasDescendantWithFieldOnChannel('x'));
        });
        it('should return false if no descendant plot has a field on x', function () {
            var model = util_1.parseFacetModel({
                facet: { row: { field: 'a', type: 'nominal' } },
                spec: {
                    mark: 'point',
                    encoding: {
                        color: { field: 'x', type: 'quantitative' }
                    }
                }
            });
            chai_1.assert(!model.hasDescendantWithFieldOnChannel('x'));
        });
        it('should return false if no descendant plot has a field on x', function () {
            var model = util_1.parseFacetModel({
                facet: { row: { field: 'a', type: 'nominal' } },
                spec: {
                    layer: [
                        {
                            mark: 'point',
                            encoding: {
                                color: { field: 'x', type: 'quantitative' }
                            }
                        },
                        {
                            mark: 'point',
                            encoding: {
                                color: { field: 'x', type: 'quantitative' }
                            }
                        }
                    ]
                }
            });
            chai_1.assert(!model.hasDescendantWithFieldOnChannel('x'));
        });
    });
    describe('getSizeSignalRef', function () {
        it('returns formula for step if parent is facet', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: {
                            field: 'b',
                            type: 'nominal',
                            scale: {
                                padding: 0.345
                            }
                        }
                    }
                },
                resolve: {
                    scale: { x: 'independent' }
                }
            });
            chai_1.assert.deepEqual(model.child.getSizeSignalRef('width'), {
                signal: "bandspace(datum[\"distinct_b\"], 1, 0.345) * child_x_step"
            });
        });
    });
});
//# sourceMappingURL=model.test.js.map