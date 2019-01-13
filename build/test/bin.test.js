import { autoMaxBins, binToString, isBinParams } from '../src/bin';
import { COLOR, COLUMN, FILL, FILLOPACITY, OPACITY, ROW, SHAPE, SIZE, STROKE, STROKEOPACITY, STROKEWIDTH } from '../src/channel';
describe('autoMaxBins', () => {
    it('should assign generate correct defaults for different channels', () => {
        // Not testing case for 10 because it's already tested
        [COLOR, FILL, STROKE, STROKEWIDTH, SIZE, OPACITY, FILLOPACITY, STROKEOPACITY, SHAPE, ROW, COLUMN].forEach(a => expect(autoMaxBins(a)).toEqual(6));
    });
});
describe('binToString', () => {
    it('should generate the corrrect key for boolean', () => {
        expect(binToString(true)).toEqual('bin');
        expect(binToString(false)).toEqual('bin');
    });
});
describe('isBinParams', () => {
    it('should detect whether the input is BinParams or not', () => {
        expect(isBinParams(true)).toEqual(false);
        expect(isBinParams({})).toEqual(true);
        expect(isBinParams({ extent: [0, 1] })).toEqual(true);
    });
});
//# sourceMappingURL=bin.test.js.map