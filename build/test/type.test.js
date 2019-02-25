import * as type from '../src/type';
describe('type', () => {
    describe('getFullName()', () => {
        it('should return correct lowercase, full type names.', () => {
            for (const t of ['q', 'Q', 'quantitative', 'QUANTITATIVE']) {
                expect(type.getFullName(t)).toEqual('quantitative');
            }
            for (const t of ['t', 'T', 'temporal', 'TEMPORAL']) {
                expect(type.getFullName(t)).toEqual('temporal');
            }
            for (const t of ['o', 'O', 'ordinal', 'ORDINAL']) {
                expect(type.getFullName(t)).toEqual('ordinal');
            }
            for (const t of ['n', 'N', 'nominal', 'NOMINAL']) {
                expect(type.getFullName(t)).toEqual('nominal');
            }
            for (const t of ['geojson', 'GEOJSON']) {
                expect(type.getFullName(t)).toEqual('geojson');
            }
        });
        it('should return undefined for invalid type', () => {
            expect(type.getFullName('haha')).toEqual(undefined);
        });
    });
});
//# sourceMappingURL=type.test.js.map