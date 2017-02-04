"use strict";
var chai_1 = require("chai");
var util_1 = require("../util");
describe('Model', function () {
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