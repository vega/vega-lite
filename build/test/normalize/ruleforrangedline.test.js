import { normalize } from '../../src/normalize/index';
describe('RuleForRangedLineNormalizer', () => {
    it('correctly normalizes line with rule where there is x2 or y2.', () => {
        const spec = {
            data: { url: 'data/stocks.csv', format: { type: 'csv' } },
            mark: 'line',
            encoding: {
                x: { field: 'date', type: 'temporal' },
                y: { field: 'price', type: 'quantitative' },
                x2: { field: 'date2', type: 'temporal' }
            }
        };
        const normalizedSpec = normalize(spec);
        expect(normalizedSpec).toEqual(Object.assign({}, spec, { mark: 'rule' }));
    });
});
//# sourceMappingURL=ruleforrangedline.test.js.map