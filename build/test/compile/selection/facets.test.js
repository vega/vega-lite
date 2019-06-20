"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
var util_1 = require("../../util");
describe('Faceted Selections', function () {
    var model = util_1.parseModel({
        "data": { "url": "data/anscombe.json" },
        "facet": {
            "column": { "field": "Series", "type": "nominal" },
            "row": { "field": "X", "type": "nominal", "bin": true },
        },
        "spec": {
            "layer": [{
                    "mark": "rule",
                    "encoding": { "y": { "value": 10 } }
                }, {
                    "selection": {
                        "one": { "type": "single" },
                        "twp": { "type": "multi" },
                        "three": { "type": "interval" }
                    },
                    "mark": "rule",
                    "encoding": {
                        "x": { "value": 10 }
                    }
                }]
        }
    });
    model.parse();
    var unit = model.children[0].children[1];
    it('should assemble a facet signal', function () {
        chai_1.assert.includeDeepMembers(selection.assembleUnitSelectionSignals(unit, []), [
            {
                "name": "facet",
                "value": {},
                "on": [
                    {
                        "events": [{ "source": "scope", "type": "mousemove" }],
                        "update": "isTuple(facet) ? facet : group(\"cell\").datum"
                    }
                ]
            }
        ]);
    });
    it('should name the unit with the facet keys', function () {
        chai_1.assert.equal(selection.unitName(unit), "\"child_layer_1\" + '_' + (facet[\"bin_maxbins_6_X\"]) + '_' + (facet[\"Series\"])");
    });
});
//# sourceMappingURL=facets.test.js.map