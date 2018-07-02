import { assert } from 'chai';
import { VG_AXIS_PROPERTIES } from '../src/axis';
describe('axis', function () {
    describe('VG_AXIS_PROPERTIES', function () {
        it('should have scale and orient as the first two items', function () {
            assert.equal(VG_AXIS_PROPERTIES[0], 'scale');
            assert.equal(VG_AXIS_PROPERTIES[1], 'orient');
        });
    });
});
//# sourceMappingURL=axis.test.js.map