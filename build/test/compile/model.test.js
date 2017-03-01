"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../util");
var model_1 = require("../../src/compile/model");
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
                    layer: [{
                            mark: 'point',
                            encoding: {
                                x: { field: 'x', type: 'quantitative' }
                            }
                        }, {
                            mark: 'point',
                            encoding: {
                                color: { field: 'x', type: 'quantitative' }
                            }
                        },]
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
                    layer: [{
                            mark: 'point',
                            encoding: {
                                color: { field: 'x', type: 'quantitative' }
                            }
                        }, {
                            mark: 'point',
                            encoding: {
                                color: { field: 'x', type: 'quantitative' }
                            }
                        },]
                }
            });
            chai_1.assert(!model.hasDescendantWithFieldOnChannel('x'));
        });
    });
});
//# sourceMappingURL=model.test.js.map