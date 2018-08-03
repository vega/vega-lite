"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* tslint:disable quotemark */
var chai_1 = require("chai");
var multi_1 = tslib_1.__importDefault(require("../../../src/compile/selection/multi"));
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
var util_1 = require("../../util");
describe('Multi Selection', function () {
    var model = util_1.parseUnitModelWithScale({
        mark: 'circle',
        encoding: {
            x: { field: 'Horsepower', type: 'quantitative' },
            y: { field: 'Miles_per_Gallon', type: 'quantitative', bin: true },
            color: { field: 'Origin', type: 'nominal' }
        }
    });
    var selCmpts = (model.component.selection = selection.parseUnitSelection(model, {
        one: { type: 'multi' },
        two: {
            type: 'multi',
            nearest: true,
            on: 'mouseover',
            toggle: 'event.ctrlKey',
            encodings: ['y', 'color']
        }
    }));
    it('builds tuple signals', function () {
        var oneSg = multi_1.default.signals(model, selCmpts['one']);
        chai_1.assert.sameDeepMembers(oneSg, [
            {
                name: 'one_tuple',
                value: {},
                on: [
                    {
                        events: selCmpts['one'].events,
                        update: 'datum && item().mark.marktype !== \'group\' ? {unit: "", encodings: [], fields: ["_vgsid_"], values: [datum["_vgsid_"]]} : null',
                        force: true
                    }
                ]
            }
        ]);
        var twoSg = multi_1.default.signals(model, selCmpts['two']);
        chai_1.assert.sameDeepMembers(twoSg, [
            {
                name: 'two_tuple',
                value: {},
                on: [
                    {
                        events: selCmpts['two'].events,
                        update: 'datum && item().mark.marktype !== \'group\' ? {unit: "", encodings: ["y", "color"], fields: ["Miles_per_Gallon", "Origin"], values: [[(item().isVoronoi ? datum.datum : datum)["bin_maxbins_10_Miles_per_Gallon"], (item().isVoronoi ? datum.datum : datum)["bin_maxbins_10_Miles_per_Gallon_end"]], (item().isVoronoi ? datum.datum : datum)["Origin"]], "bin_Miles_per_Gallon": 1} : null',
                        force: true
                    }
                ]
            }
        ]);
        var signals = selection.assembleUnitSelectionSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, oneSg.concat(twoSg));
    });
    it('builds unit datasets', function () {
        var data = [];
        chai_1.assert.sameDeepMembers(selection.assembleUnitSelectionData(model, data), [
            { name: 'one_store' },
            { name: 'two_store' }
        ]);
    });
    it('leaves marks alone', function () {
        var marks = [];
        model.component.selection = { one: selCmpts['one'] };
        chai_1.assert.equal(selection.assembleUnitSelectionMarks(model, marks), marks);
    });
});
//# sourceMappingURL=multi.test.js.map