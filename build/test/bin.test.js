import { assert } from 'chai';
import { autoMaxBins, binToString, isBinParams } from '../src/bin';
import { COLOR, COLUMN, OPACITY, ROW, SHAPE } from '../src/channel';
describe('autoMaxBins', function () {
    it('should assign generate correct defaults for different channels', function () {
        // Not testing case for 10 because it's already tested
        [COLOR, OPACITY, SHAPE, ROW, COLUMN].forEach(function (a) { return assert.deepEqual(autoMaxBins(a), 6); });
    });
});
describe('binToString', function () {
    it('should generate the corrrect key for boolean', function () {
        assert.deepEqual(binToString(true), 'bin');
        assert.deepEqual(binToString(false), 'bin');
    });
});
describe('isBinParams', function () {
    it('should detect whether the input is BinParams or not', function () {
        assert.deepEqual(isBinParams(true), false);
        assert.deepEqual(isBinParams({}), true);
        assert.deepEqual(isBinParams({ extent: [0, 1] }), true);
    });
});
//# sourceMappingURL=bin.test.js.map