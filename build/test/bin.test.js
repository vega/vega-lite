"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var bin_1 = require("../src/bin");
var channel_1 = require("../src/channel");
describe('autoMaxBins', function () {
    it('should assign generate correct defaults for different channels', function () {
        // Not testing case for 10 because it's already tested
        [channel_1.COLOR, channel_1.OPACITY, channel_1.SHAPE, channel_1.ROW, channel_1.COLUMN].forEach(function (a) { return chai_1.assert.deepEqual(bin_1.autoMaxBins(a), 6); });
    });
});
describe('binToString', function () {
    it('should generate the corrrect key for boolean', function () {
        chai_1.assert.deepEqual(bin_1.binToString(true), 'bin');
        chai_1.assert.deepEqual(bin_1.binToString(false), 'bin');
    });
});
describe('isBinParams', function () {
    it('should detect whether the input is BinParams or not', function () {
        chai_1.assert.deepEqual(bin_1.isBinParams(true), false);
        chai_1.assert.deepEqual(bin_1.isBinParams({}), true);
        chai_1.assert.deepEqual(bin_1.isBinParams({ extent: [0, 1] }), true);
    });
});
//# sourceMappingURL=bin.test.js.map