import { assert } from 'chai';
import * as log from '../../src/log';
import { parseConcatModel } from '../util';
describe('Concat', function () {
    describe('merge scale domains', function () {
        it('should instantiate all children in vconcat', function () {
            var model = parseConcatModel({
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
            assert.equal(model.children.length, 2);
            assert(model.isVConcat);
        });
        it('should instantiate all children in hconcat', function () {
            var model = parseConcatModel({
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
            assert.equal(model.children.length, 2);
            assert(!model.isVConcat);
        });
        it('should create correct layout for vconcat', function () {
            var model = parseConcatModel({
                vconcat: [{
                        mark: 'point',
                        encoding: {}
                    }, {
                        mark: 'bar',
                        encoding: {}
                    }]
            });
            assert.deepEqual(model.assembleLayout(), {
                padding: { row: 10, column: 10 },
                columns: 1,
                bounds: 'full',
                align: 'each'
            });
        });
        it('should create correct layout for hconcat', function () {
            var model = parseConcatModel({
                hconcat: [{
                        mark: 'point',
                        encoding: {}
                    }, {
                        mark: 'bar',
                        encoding: {}
                    }]
            });
            assert.deepEqual(model.assembleLayout(), {
                padding: { row: 10, column: 10 },
                bounds: 'full',
                align: 'each'
            });
        });
    });
    describe('resolve', function () {
        it('cannot share axes', log.wrap(function (localLogger) {
            parseConcatModel({
                hconcat: [],
                resolve: {
                    axis: {
                        x: 'shared'
                    }
                }
            });
            assert.equal(localLogger.warns[0], log.message.CONCAT_CANNOT_SHARE_AXIS);
        }));
    });
});
//# sourceMappingURL=concat.test.js.map