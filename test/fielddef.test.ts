import {assert} from 'chai';

import {AggregateOp} from '../src/aggregate';
import {title} from '../src/fielddef';
import {TimeUnit} from '../src/timeunit';
import {QUANTITATIVE, TEMPORAL} from '../src/type';

describe('fieldDef', () => {
  describe('title()', () => {
    it('should return title if the fieldDef has title', () => {
      const fieldDef = {field: '2', type: QUANTITATIVE, title: 'baz'};
      assert.equal(title(fieldDef,{}), 'baz');
    });

    it('should return correct title for aggregate', () => {
      const fieldDef = {field: 'f', type: QUANTITATIVE, aggregate: AggregateOp.MEAN};
      assert.equal(title(fieldDef, {}), 'MEAN(f)');
    });

    it('should return correct title for count', () => {
      const fieldDef = {field: '*', type: QUANTITATIVE, aggregate: AggregateOp.COUNT};
      assert.equal(title(fieldDef, {countTitle: 'baz!'}), 'baz!');
    });

    it('should return correct title for bin', () => {
      const fieldDef = {field: 'f', type: QUANTITATIVE, bin: true};
      assert.equal(title(fieldDef,{}), 'BIN(f)');
    });

    it('should return correct title for timeUnit', () => {
      const fieldDef = {field: 'f', type: TEMPORAL, timeUnit: TimeUnit.MONTH};
      assert.equal(title(fieldDef,{}), 'MONTH(f)');
    });

    it('should return correct title for raw field', () => {
      const fieldDef = {field: 'f', type: TEMPORAL};
      assert.equal(title(fieldDef,{}), 'f');
    });
  });
});

