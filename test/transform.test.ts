import {assert} from 'chai';
import {Filter} from '../src/filter';
import * as log from '../src/log';
import {LogicalOperand} from '../src/logical';
import {TimeUnit} from '../src/timeunit';
import {normalizeTransform, Transform} from '../src/transform';

describe('normalizeTransform()', () => {
  it('replaces filter with timeUnit=yearmonthday with yearmonthdate and throws the right warning', log.wrap((localLogger) => {
    const filter: LogicalOperand<Filter> = {
      and: [
        {not: {timeUnit: 'yearmonthday' as TimeUnit, field: 'd', equal: {year: 2008}}},
        {or: [{field: 'a', equal: 5}]}
      ]
    };
    const transform: Transform[] = [
      {filter}
    ];
    assert.deepEqual(normalizeTransform(transform), [{
      filter: {
        and: [
          {not: {timeUnit: 'yearmonthdate', field: 'd', equal: {year: 2008}}},
          {or: [{field: 'a', equal: 5}]}
        ]
      }
    }]);
    assert.equal(localLogger.warns[0], log.message.dayReplacedWithDate('yearmonthday'));
  }));
});
