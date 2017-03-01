/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var bin_1 = require("../../../src/compile/data/bin");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
describe('compile/data/bin', function () {
    describe('parseUnit', function () {
        describe('binned field with custom extent', function () {
            it('should add bin transform and correctly apply bin', function () {
                var model = util_2.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            bin: { extent: [0, 100] },
                            'field': 'Acceleration',
                            'type': "quantitative"
                        }
                    }
                });
                var transform = util_1.vals(bin_1.bin.parseUnit(model))[0];
                chai_1.assert.deepEqual(transform[0], {
                    type: 'bin',
                    field: 'Acceleration',
                    as: ['bin_Acceleration_start', 'bin_Acceleration_end'],
                    maxbins: 10,
                    extent: [0, 100]
                });
            });
        });
        describe('binned field without custom extent', function () {
            var model = util_2.parseUnitModel({
                mark: "point",
                encoding: {
                    y: {
                        bin: true,
                        'field': 'Acceleration',
                        'type': "quantitative"
                    }
                }
            });
            var transform = util_1.vals(bin_1.bin.parseUnit(model))[0];
            it('should add bin transform and correctly apply bin', function () {
                chai_1.assert.deepEqual(transform[0], {
                    type: 'extent',
                    field: 'Acceleration',
                    signal: 'Acceleration_extent'
                });
                chai_1.assert.deepEqual(transform[1], {
                    type: 'bin',
                    field: 'Acceleration',
                    as: ['bin_Acceleration_start', 'bin_Acceleration_end'],
                    maxbins: 10,
                    extent: { signal: 'Acceleration_extent' }
                });
            });
        });
    });
    describe('parseLayer', function () {
        // TODO: write test
    });
    describe('parseFacet', function () {
        // TODO: write test
    });
    describe('assemble', function () {
        // TODO: write test
    });
});
//# sourceMappingURL=bin.test.js.map