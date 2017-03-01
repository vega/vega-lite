"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var layer_1 = require("../../src/compile/layer");
var util_1 = require("../util");
describe('Layer', function () {
    it('should say it is layer', function () {
        var model = new layer_1.LayerModel({ layer: [] }, null, null);
        chai_1.assert(!model.isUnit());
        chai_1.assert(!model.isFacet());
        chai_1.assert(model.isLayer());
    });
    describe('merge scale domains', function () {
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
            chai_1.assert.deepEqual(model.component.scales['x'].main.domain, {
                fields: [{
                        data: 'layer_0_source',
                        field: 'a'
                    }, {
                        data: 'layer_1_source',
                        field: 'b'
                    }],
                sort: true
            });
        });
        it('should merge unioned domains', function () {
            var model = util_1.parseLayerModel({
                layer: [{
                        mark: 'point',
                        encoding: {
                            x: { bin: true, field: 'a', type: 'quantitative' }
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
            chai_1.assert.deepEqual(model.component.scales['x'].main.domain, {
                fields: [{
                        data: 'layer_0_source',
                        field: 'bin_a_start'
                    }, {
                        data: 'layer_0_source',
                        field: 'bin_a_end'
                    }, {
                        data: 'layer_1_source',
                        field: 'b'
                    }],
                sort: true
            });
        });
        it('should unioned explicit and referenced domains', function () {
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
            chai_1.assert.deepEqual(model.component.scales['x'].main.domain, {
                fields: [
                    [1, 2, 3],
                    {
                        data: 'layer_1_source',
                        field: 'b'
                    }
                ],
                sort: true
            });
        });
    });
});
//# sourceMappingURL=layer.test.js.map