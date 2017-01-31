import {assert} from 'chai';

import {Channel} from '../src/channel';
import {defaultType, normalize, title} from '../src/fielddef';
import * as log from '../src/log';
import {TimeUnit} from '../src/timeunit';
import {QUANTITATIVE, TEMPORAL} from '../src/type';

describe('fieldDef', () => {
  describe('defaultType()', () => {
    it('should return temporal if there is timeUnit', () => {
      assert.equal(defaultType({timeUnit: 'month', field: 'a'}, 'x'), 'temporal');
    });

    it('should return quantitative if there is bin', () => {
      assert.equal(defaultType({bin: 'true', field: 'a'}, 'x'), 'quantitative');
    });

    it('should return quantitative for a channel that supports measure', () => {
      for (let c of ['x', 'y', 'color', 'size', 'opacity', 'order'] as Channel[]) {
        assert.equal(defaultType({field: 'a'}, c), 'quantitative');
      }
    });

    it('should return nominal for a channel that does not support measure', () => {
      for (let c of ['shape', 'row', 'column'] as Channel[]) {
        assert.equal(defaultType({field: 'a'}, c), 'nominal');
      }
    });
  });

  describe('normalize()', () => {
    it('should return fieldDef with full type name.', () => {
      const fieldDef = {field: 'a', type: 'q' as any};
      assert.deepEqual(normalize(fieldDef, 'x'), {field: 'a', type: 'quantitative'});
    });

    it('should return fieldDef with default type and throw warning if type is missing.', log.wrap((localLogger) => {
      const fieldDef = {field: 'a'};
      assert.deepEqual(normalize(fieldDef, 'x'), {field: 'a', type: 'quantitative'});
      assert.equal(localLogger.warns[0], log.message.emptyOrInvalidFieldType(undefined, 'x', 'quantitative'));
    }));
  });

  describe('title()', () => {
    it('should return title if the fieldDef has title', () => {
      const fieldDef = {field: '2', type: QUANTITATIVE, title: 'baz'};
      assert.equal(title(fieldDef,{}), 'baz');
    });

    it('should return correct title for aggregate', () => {
      // if "aggregate: 'mean' as 'mean'" is changed to "aggregate: 'mean'", it won't pass the test because
      // it will show that type of 'mean' is string instead of 'mean'
      const fieldDef = {field: 'f', type: QUANTITATIVE, aggregate: 'mean' as 'mean'};
      assert.equal(title(fieldDef, {}), 'MEAN(f)');
    });

    it('should return correct title for count', () => {
      // The same test error shows up here if 'count' as 'count' is changed to only 'count'
      const fieldDef = {field: '*', type: QUANTITATIVE, aggregate: 'count' as 'count'};
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
