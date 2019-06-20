"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../util");
describe('Layer', function () {
    describe('parseScale', function () {
        it('should merge domains', function () {
            var model = util_1.parseLayerModel({
                layer: [{
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'ordinal' }
                        }
                    }, {
                        mark: 'point',
                        encoding: {
                            x: { field: 'b', type: 'ordinal' }
                        }
                    }]
            });
            chai_1.assert.equal(model.children.length, 2);
            model.parseScale();
            chai_1.assert.deepEqual(model.component.scales['x'].domains, [{
                    data: 'layer_0_main',
                    field: 'a',
                    sort: true
                }, {
                    data: 'layer_1_main',
                    field: 'b',
                    sort: true
                }]);
        });
        it('should union explicit and referenced domains', function () {
            var model = util_1.parseLayerModel({
                layer: [{
                        mark: 'point',
                        encoding: {
                            x: { scale: { domain: [1, 2, 3] }, field: 'b', type: 'ordinal' }
                        }
                    }, {
                        mark: 'point',
                        encoding: {
                            x: { field: 'b', type: 'ordinal' }
                        }
                    }]
            });
            model.parseScale();
            chai_1.assert.deepEqual(model.component.scales['x'].domains, [
                [1, 2, 3],
                {
                    data: 'layer_1_main',
                    field: 'b',
                    sort: true
                }
            ]);
        });
    });
    describe('dual axis chart', function () {
        var model = util_1.parseLayerModel({
            layer: [{
                    mark: 'point',
                    encoding: {
                        x: { field: 'a', type: 'quantitative' }
                    }
                }, {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' }
                    }
                }],
            resolve: {
                scale: {
                    x: 'independent'
                }
            }
        });
        chai_1.assert.equal(model.children.length, 2);
        it('should leave scales in children when set to be independent', function () {
            model.parseScale();
            chai_1.assert.equal(model.component.scales['x'], undefined);
            chai_1.assert.deepEqual(model.children[0].component.scales['x'].domains, [{
                    data: 'layer_0_main',
                    field: 'a'
                }]);
            chai_1.assert.deepEqual(model.children[1].component.scales['x'].domains, [{
                    data: 'layer_1_main',
                    field: 'b'
                }]);
        });
        it('should create second axis on top', function () {
            model.parseAxisAndHeader();
            chai_1.assert.equal(model.component.axes['x'].length, 2);
            chai_1.assert.equal(model.component.axes['x'][1].implicit.orient, 'top');
        });
    });
});
//# sourceMappingURL=layer.test.js.map