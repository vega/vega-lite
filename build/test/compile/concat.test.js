"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var log = tslib_1.__importStar(require("../../src/log"));
var util_1 = require("../util");
describe('Concat', function () {
    describe('merge scale domains', function () {
        it('should instantiate all children in vconcat', function () {
            var model = util_1.parseConcatModel({
                vconcat: [{
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'ordinal' }
                        }
                    }, {
                        mark: 'bar',
                        encoding: {
                            x: { field: 'b', type: 'ordinal' },
                            y: { field: 'c', type: 'quantitative' }
                        }
                    }]
            });
            chai_1.assert.equal(model.children.length, 2);
            chai_1.assert(model.isVConcat);
        });
        it('should instantiate all children in hconcat', function () {
            var model = util_1.parseConcatModel({
                hconcat: [{
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'ordinal' }
                        }
                    }, {
                        mark: 'bar',
                        encoding: {
                            x: { field: 'b', type: 'ordinal' },
                            y: { field: 'c', type: 'quantitative' }
                        }
                    }]
            });
            chai_1.assert.equal(model.children.length, 2);
            chai_1.assert(!model.isVConcat);
        });
        it('should create correct layout for vconcat', function () {
            var model = util_1.parseConcatModel({
                vconcat: [{
                        mark: 'point',
                        encoding: {}
                    }, {
                        mark: 'bar',
                        encoding: {}
                    }]
            });
            chai_1.assert.deepEqual(model.assembleLayout(), {
                padding: { row: 10, column: 10 },
                columns: 1,
                bounds: 'full',
                align: 'each'
            });
        });
        it('should create correct layout for hconcat', function () {
            var model = util_1.parseConcatModel({
                hconcat: [{
                        mark: 'point',
                        encoding: {}
                    }, {
                        mark: 'bar',
                        encoding: {}
                    }]
            });
            chai_1.assert.deepEqual(model.assembleLayout(), {
                padding: { row: 10, column: 10 },
                bounds: 'full',
                align: 'each'
            });
        });
    });
    describe('resolve', function () {
        it('cannot share axes', log.wrap(function (localLogger) {
            util_1.parseConcatModel({
                hconcat: [],
                resolve: {
                    axis: {
                        x: 'shared'
                    }
                }
            });
            chai_1.assert.equal(localLogger.warns[0], log.message.CONCAT_CANNOT_SHARE_AXIS);
        }));
    });
});
//# sourceMappingURL=concat.test.js.map