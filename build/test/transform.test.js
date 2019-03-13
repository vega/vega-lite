import * as log from '../src/log';
import { normalizeTransform } from '../src/transform';
describe('normalizeTransform()', () => {
    it('replaces filter with timeUnit=yearmonthday with yearmonthdate and throws the right warning', log.wrap(localLogger => {
        const filter = {
            and: [
                { not: { timeUnit: 'yearmonthday', field: 'd', equal: { year: 2008 } } },
                { or: [{ field: 'a', equal: 5 }] }
            ]
        };
        const transform = [{ filter }];
        expect(normalizeTransform(transform)).toEqual([
            {
                filter: {
                    and: [{ not: { timeUnit: 'yearmonthdate', field: 'd', equal: { year: 2008 } } }, { or: [{ field: 'a', equal: 5 }] }]
                }
            }
        ]);
        expect(localLogger.warns[0]).toBe(log.message.dayReplacedWithDate('yearmonthday'));
    }));
});
//# sourceMappingURL=transform.test.js.map