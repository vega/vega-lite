import { getDependentFields } from '../../../src/compile/data/expressions';
describe('compile/data/expressions', () => {
    describe('getDependentFields', () => {
        it('calcuates right dependent fields for simple expression', () => {
            expect(getDependentFields('datum.x + datum.y')).toEqual(new Set(['x', 'y']));
        });
        it('calcuates right dependent fields for complex expression', () => {
            expect(getDependentFields('toString(datum.x) + 12')).toEqual(new Set(['x']));
        });
        it('calculates right dependent fields for nested field', () => {
            expect(getDependentFields('datum.x.y')).toEqual(new Set(['x', 'x.y']));
            expect(getDependentFields('datum["x.y"]')).toEqual(new Set(['x.y']));
        });
    });
});
//# sourceMappingURL=expressions.test.js.map