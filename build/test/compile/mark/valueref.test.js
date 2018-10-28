/* tslint:disable:quotemark */
import { assert } from 'chai';
import { getOffset, midPoint } from '../../../src/compile/mark/valueref';
describe('compile/mark/valueref', function () {
    describe('getOffset', function () {
        var markDef = {
            type: 'point',
            x2Offset: 100
        };
        it('should correctly get the offset value for the given channel', function () {
            assert.equal(getOffset('x2', markDef), 100);
        });
        it('should return undefined when the offset value for the given channel is not defined', function () {
            assert.equal(getOffset('x', markDef), undefined);
        });
    });
    describe('midPoint()', function () {
        it('should return correct value for width', function () {
            var ref = midPoint('x', { value: 'width' }, undefined, undefined, undefined, undefined, undefined);
            assert.deepEqual(ref, { field: { group: 'width' } });
        });
        it('should return correct value for height', function () {
            var ref = midPoint('y', { value: 'height' }, undefined, undefined, undefined, undefined, undefined);
            assert.deepEqual(ref, { field: { group: 'height' } });
        });
        it('should return correct value for binned data', function () {
            var fieldDef = { field: 'bin_start', bin: 'binned', type: 'quantitative' };
            var fieldDef2 = { field: 'bin_end', type: 'quantitative' };
            var ref = midPoint('x', fieldDef, fieldDef2, 'x', undefined, undefined, undefined);
            assert.deepEqual(ref, { signal: 'scale("x", (datum["bin_start"] + datum["bin_end"]) / 2)' });
        });
    });
});
//# sourceMappingURL=valueref.test.js.map