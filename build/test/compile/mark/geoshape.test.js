"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var geoshape_1 = require("../../../src/compile/mark/geoshape");
var util_1 = require("../../util");
describe('Mark: Geoshape', function () {
    describe('encode', function () {
        it('should create no properties', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "geoshape",
                "projection": {
                    "type": "albersUsa"
                },
                "data": {
                    "url": "data/us-10m.json",
                    "format": {
                        "type": "topojson",
                        "feature": "states"
                    }
                },
                "encoding": {
                    "color": {
                        "value": "black"
                    },
                    "opacity": {
                        "value": 0.8
                    }
                }
            });
            var props = geoshape_1.geoshape.encodeEntry(model);
            chai_1.assert.deepEqual({
                "fill": {
                    "value": "black"
                },
                "opacity": {
                    "value": 0.8
                }
            }, props);
        });
    });
});
//# sourceMappingURL=geoshape.test.js.map