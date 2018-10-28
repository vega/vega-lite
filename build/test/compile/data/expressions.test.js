import { getDependentFields } from '../../../src/compile/data/expressions';
describe('compile/data/expressions', function () {
    describe('getDependentFields', function () {
        it('calcuates right dependent fields for simple expression', function () {
            expect(getDependentFields('datum.x + datum.y')).toEqual({ x: true, y: true });
        });
        it('calcuates right dependent fields for compres expression', function () {
            expect(getDependentFields('toString(datum.x) + 12')).toEqual({ x: true });
        });
        it('calculates right dependent fields for nested field', function () {
            expect(getDependentFields('datum.x.y')).toEqual({ x: true, 'x.y': true });
            expect(getDependentFields('datum["x.y"]')).toEqual({ 'x.y': true });
        });
    });
});
//# sourceMappingURL=expressions.test.js.map