import {assert} from 'chai';

import {COUNTING_OPS} from '../src/aggregate';
import {Channel} from '../src/channel';
import {channelCompatibility, ChannelDef, defaultType, FieldDef, normalize, title, vgField} from '../src/fielddef';
import * as log from '../src/log';
import {TimeUnit} from '../src/timeunit';
import {QUANTITATIVE, TEMPORAL} from '../src/type';

describe('fieldDef', () => {
  describe('vgField()', () => {
    it ('should access flattened fields', () => {
      assert.deepEqual(vgField({field: 'foo.bar\\.baz'}), 'foo\\.bar\\.baz');
    });

    it ('should access flattened fields in expression', () => {
      assert.deepEqual(vgField({field: 'foo.bar\\.baz'}, {expr: 'datum'}), 'datum["foo.bar.baz"]');
    });
  });

  describe('defaultType()', () => {
    it('should return temporal if there is timeUnit', () => {
      assert.equal(defaultType({timeUnit: 'month', field: 'a'} as FieldDef<string>, 'x'), 'temporal');
    });

    it('should return quantitative if there is bin', () => {
      assert.equal(defaultType({bin: true, field: 'a'} as FieldDef<string>, 'x'), 'quantitative');
    });

    it('should return quantitative for a channel that supports measure', () => {
      for (const c of ['x', 'y', 'size', 'opacity', 'order'] as Channel[]) {
        assert.equal(defaultType({field: 'a'} as FieldDef<string>, c), 'quantitative', c);
      }
    });

    it('should return nominal for a channel that does not support measure', () => {
      for (const c of ['color', 'shape', 'row', 'column'] as Channel[]) {
        assert.equal(defaultType({field: 'a'} as FieldDef<string>, c), 'nominal', c);
      }
    });
  });

  describe('normalize()', () => {
    it('should convert primitive type to value def', log.wrap((localLogger) => {
      assert.deepEqual<ChannelDef<string>>(normalize(5 as any, 'x'), {value: 5});
      assert.equal(localLogger.warns.length, 1);
    }));

    it('should return fieldDef with full type name.', () => {
      const fieldDef: FieldDef<string> = {field: 'a', type: 'q' as any};
      assert.deepEqual<ChannelDef<string>>(normalize(fieldDef, 'x'), {field: 'a', type: 'quantitative'});
    });

    it('normalizes yearmonthday to become yearmonthdate.', log.wrap((localLogger) => {
      const fieldDef: FieldDef<string> = {
        timeUnit: 'yearmonthday' as TimeUnit,  // Need to cast here as this is intentionally wrong
        field: 'a',
        type: 'temporal'
      };
      assert.deepEqual<ChannelDef<string>>(normalize(fieldDef, 'x'), {timeUnit: 'yearmonthdate', field: 'a', type: 'temporal'});
      assert.equal(localLogger.warns[0], log.message.dayReplacedWithDate('yearmonthday'));
    }));

    it('should replace other type with quantitative for a field with counting aggregate.', log.wrap((localLogger) => {
      for (const aggregate of COUNTING_OPS) {
        const fieldDef: FieldDef<string> = {aggregate, field: 'a', type: 'nominal'};
        assert.deepEqual<ChannelDef<string>>(normalize(fieldDef, 'x'), {aggregate, field: 'a', type: 'quantitative'});
      }
      assert.equal(localLogger.warns.length, 4);
    }));

    it('should return fieldDef with default type and throw warning if type is missing.', log.wrap((localLogger) => {
      const fieldDef = {field: 'a'} as FieldDef<string>;
      assert.deepEqual<ChannelDef<string>>(normalize(fieldDef, 'x'), {field: 'a', type: 'quantitative'});
      assert.equal(localLogger.warns[0], log.message.emptyOrInvalidFieldType(undefined, 'x', 'quantitative'));
    }));

    it('should drop invalid aggregate ops and throw warning.', log.wrap((localLogger) => {
      const fieldDef: FieldDef<string> = {aggregate: 'boxplot', field: 'a', type: 'quantitative'};
      assert.deepEqual<ChannelDef<string>>(normalize(fieldDef, 'x'), {field: 'a', type: 'quantitative'});
      assert.equal(localLogger.warns[0], log.message.invalidAggregate('boxplot'));
    }));
  });

  describe('channelCompatability', () => {
    describe('row/column', () => {
      it('is incompatible with continuous field', () => {
        for (const channel of ['row', 'column'] as Channel[]) {
          assert(!channelCompatibility({field: 'a', type: 'quantitative'}, channel).compatible);
        }
      });
      it('is compatible with discrete field', () => {
        for (const channel of ['row', 'column'] as Channel[]) {
          assert(channelCompatibility({field: 'a', type: 'nominal'}, channel).compatible);
        }
      });
    });

    describe('x/y/color/text/detail', () => {
      it('is compatible with continuous field', () => {
        for (const channel of ['x', 'y', 'color', 'text', 'detail'] as Channel[]) {
          assert(channelCompatibility({field: 'a', type: 'quantitative'}, channel).compatible);
        }
      });
      it('is compatible with discrete field', () => {
        for (const channel of ['x', 'y', 'color', 'text', 'detail'] as Channel[]) {
          assert(channelCompatibility({field: 'a', type: 'nominal'}, channel).compatible);
        }
      });
    });

    describe('opacity/size/x2/y2', () => {
      it('is compatible with continuous field', () => {
        for (const channel of ['opacity', 'size', 'x2', 'y2'] as Channel[]) {
          assert(channelCompatibility({field: 'a', type: 'quantitative'}, channel).compatible);
        }
      });

      it('is compatible with binned field', () => {
        for (const channel of ['opacity', 'size', 'x2', 'y2'] as Channel[]) {
          assert(channelCompatibility({bin: true, field: 'a', type: 'quantitative'}, channel).compatible);
        }
      });

      it('is incompatible with nominal field', () => {
        for (const channel of ['opacity', 'size', 'x2', 'y2'] as Channel[]) {
          assert(!channelCompatibility({field: 'a', type: 'nominal'}, channel).compatible);
        }
      });
    });

    describe('shape', () => {
      it('is compatible with nominal field', () => {
        assert(channelCompatibility({field: 'a', type: 'nominal'}, 'shape').compatible);
      });
      it('is incompatible with ordinal field', () => {
        assert(!channelCompatibility({field: 'a', type: 'ordinal'}, 'shape').compatible);
      });
      it('is incompatible with quantitative field', () => {
        assert(!channelCompatibility({field: 'a', type: 'quantitative'}, 'shape').compatible);
      });
    });

    describe('order', () => {
      it('is incompatible with nominal field', () => {
        assert(!channelCompatibility({field: 'a', type: 'nominal'}, 'order').compatible);
      });
      it('is compatible with ordinal field', () => {
        assert(channelCompatibility({field: 'a', type: 'ordinal'}, 'order').compatible);
      });
      it('is compatible with quantitative field', () => {
        assert(channelCompatibility({field: 'a', type: 'quantitative'}, 'order').compatible);
      });
    });
  });

  describe('title()', () => {
    it('should return correct title for aggregate', () => {
      assert.equal(title({field: 'f', aggregate: 'mean'}, {}), 'Mean of f');
    });

    it('should return correct title for count', () => {
      assert.equal(title({aggregate: 'count'}, {countTitle: 'baz!'}), 'baz!');
    });

    it('should return correct title for bin', () => {
      const fieldDef = {field: 'f', type: QUANTITATIVE, bin: true};
      assert.equal(title(fieldDef,{}), 'f (binned)');
    });

    it('should return correct title for bin', () => {
      const fieldDef = {field: 'f', type: QUANTITATIVE, bin: true};
      assert.equal(title(fieldDef,{fieldTitle: 'functional'}), 'BIN(f)');
    });

    it('should return correct title for timeUnit', () => {
      const fieldDef = {field: 'f', type: TEMPORAL, timeUnit: TimeUnit.MONTH};
      assert.equal(title(fieldDef,{}), 'f (month)');
    });

    it('should return correct title for timeUnit', () => {
      const fieldDef = {field: 'f', type: TEMPORAL, timeUnit: TimeUnit.YEARMONTHDATE};
      assert.equal(title(fieldDef,{}), 'f (year-month-date)');
    });

    it('should return correct title for timeUnit', () => {
      const fieldDef = {field: 'f', type: TEMPORAL, timeUnit: TimeUnit.DAY};
      assert.equal(title(fieldDef,{}), 'f (day)');
    });

    it('should return correct title for timeUnit', () => {
      const fieldDef = {field: 'f', type: TEMPORAL, timeUnit: TimeUnit.YEARQUARTER};
      assert.equal(title(fieldDef,{}), 'f (year-quarter)');
    });

    it('should return correct title for raw field', () => {
      const fieldDef = {field: 'f', type: TEMPORAL};
      assert.equal(title(fieldDef,{}), 'f');
    });
  });
});
