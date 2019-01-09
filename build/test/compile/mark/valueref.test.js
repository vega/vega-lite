/* tslint:disable:quotemark */
import { getOffset, midPoint } from '../../../src/compile/mark/valueref';
describe('compile/mark/valueref', () => {
    describe('getOffset', () => {
        const markDef = {
            type: 'point',
            x2Offset: 100
        };
        it('should correctly get the offset value for the given channel', () => {
            expect(getOffset('x2', markDef)).toEqual(100);
        });
        it('should return undefined when the offset value for the given channel is not defined', () => {
            expect(getOffset('x', markDef)).toEqual(undefined);
        });
    });
    describe('midPoint()', () => {
        it('should return correct value for width', () => {
            const ref = midPoint('x', { value: 'width' }, undefined, undefined, undefined, undefined, undefined);
            expect(ref).toEqual({ field: { group: 'width' } });
        });
        it('should return correct value for height', () => {
            const ref = midPoint('y', { value: 'height' }, undefined, undefined, undefined, undefined, undefined);
            expect(ref).toEqual({ field: { group: 'height' } });
        });
        it('should return correct value for binned data', () => {
            const fieldDef = { field: 'bin_start', bin: 'binned', type: 'quantitative' };
            const fieldDef2 = { field: 'bin_end', type: 'quantitative' };
            const ref = midPoint('x', fieldDef, fieldDef2, 'x', undefined, undefined, undefined);
            expect(ref).toEqual({ signal: 'scale("x", (datum["bin_start"] + datum["bin_end"]) / 2)' });
        });
    });
});
//# sourceMappingURL=valueref.test.js.map