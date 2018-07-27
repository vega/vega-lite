import { assert } from 'chai';
import * as log from '../src/log';
import { normalizeTransform } from '../src/transform';
describe('normalizeTransform()', function () {
    it('replaces filter with timeUnit=yearmonthday with yearmonthdate and throws the right warning', log.wrap(function (localLogger) {
        var filter = {
            and: [
                { not: { timeUnit: 'yearmonthday', field: 'd', equal: { year: 2008 } } },
                { or: [{ field: 'a', equal: 5 }] }
            ]
        };
        var transform = [{ filter: filter }];
        assert.deepEqual(normalizeTransform(transform), [
            {
                filter: {
                    and: [{ not: { timeUnit: 'yearmonthdate', field: 'd', equal: { year: 2008 } } }, { or: [{ field: 'a', equal: 5 }] }]
                }
            }
        ]);
        assert.equal(localLogger.warns[0], log.message.dayReplacedWithDate('yearmonthday'));
    }));
});
//# sourceMappingURL=transform.test.js.map