import {SignalRef} from 'vega-typings/types';
import {COUNTING_OPS} from '../src/aggregate';
import {CHANNELS} from '../src/channel';
import {
  channelCompatibility,
  defaultTitle,
  defaultType,
  functionalTitleFormatter,
  initChannelDef,
  TypedFieldDef,
  vgField
} from '../src/channeldef';
import {defaultConfig} from '../src/config';
import * as log from '../src/log';
import {FacetFieldDef} from '../src/spec/facet';
import {QUANTITATIVE, TEMPORAL} from '../src/type';

describe('fieldDef', () => {
  describe('vgField()', () => {
    it('should access flattened fields', () => {
      expect(vgField({field: 'foo.bar\\.baz'})).toBe('foo\\.bar\\.baz');
    });

    it('should access flattened fields in expression', () => {
      expect(vgField({field: 'foo.bar\\.baz'}, {expr: 'datum'})).toBe('datum["foo.bar.baz"]');
    });

    it('should access argmin/argmax fields in expression', () => {
      expect(vgField({aggregate: {argmin: 'b'}, field: 'a'})).toBe('argmin_b["a"]');
      expect(vgField({aggregate: {argmax: 'b'}, field: 'a'})).toBe('argmax_b["a"]');
    });

    it('should support argmin/argmax field names with space', () => {
      expect(vgField({aggregate: {argmin: 'foo bar'}, field: 'bar baz'}, {expr: 'datum'})).toBe(
        'datum["argmin_foo bar"]["bar baz"]'
      );
      expect(vgField({aggregate: {argmax: 'foo bar'}, field: 'bar baz'}, {expr: 'datum'})).toBe(
        'datum["argmax_foo bar"]["bar baz"]'
      );
    });

    it('should support prefix and field names with space', () => {
      expect(vgField({field: 'foo bar'}, {prefix: 'prefix'})).toBe('prefix_foo bar');
    });

    it('should support suffix and field names with space', () => {
      expect(vgField({field: 'foo bar'}, {suffix: 'suffix'})).toBe('foo bar_suffix');
    });

    it('should support fields with space in datum', () => {
      expect(vgField({field: 'foo bar'}, {expr: 'datum'})).toBe('datum["foo bar"]');
    });
  });

  describe('defaultType()', () => {
    it('should return temporal if there is timeUnit', () => {
      expect(defaultType({timeUnit: 'month', field: 'a'}, 'x')).toBe('temporal');
    });
    it('should return ordinal if there is a custom sort order ', () => {
      expect(defaultType({field: 'a', sort: [1, 2, 3]}, 'x')).toBe('ordinal');
      expect(defaultType({timeUnit: 'month', field: 'a', sort: [1, 2, 3]}, 'x')).toBe('ordinal');
    });

    it('should return nominal if the field is sorted by another field ', () => {
      expect(defaultType({field: 'a', sort: '-x'}, 'x')).toBe('nominal');
      expect(defaultType({field: 'a', sort: {encoding: 'x'}}, 'x')).toBe('nominal');
      expect(defaultType({field: 'a', sort: {field: 'x'}}, 'x')).toBe('nominal');
    });

    it('should return quantitative if there is bin', () => {
      expect(defaultType({bin: true, field: 'a'}, 'x')).toBe('quantitative');
    });

    it('should return quantitative for latitude/longitude', () => {
      expect(defaultType({field: 'a'}, 'latitude')).toBe('quantitative');
      expect(defaultType({field: 'a'}, 'longitude')).toBe('quantitative');
    });

    it('should return nominal for row/column/facet even with bin or time unit', () => {
      for (const c of ['row', 'column', 'facet'] as const) {
        expect(defaultType({field: 'a'}, c)).toBe('nominal');
        expect(defaultType({bin: true, field: 'a'}, c)).toBe('nominal');
        expect(defaultType({timeUnit: 'month', field: 'a'}, c)).toBe('nominal');
      }
    });

    it('should return quantitative for quantitative or discretizing scale type', () => {
      expect(defaultType({field: 'a', scale: {type: 'log'}}, 'x')).toBe('quantitative');
      expect(defaultType({field: 'a', scale: {type: 'pow'}}, 'x')).toBe('quantitative');
      expect(defaultType({field: 'a', scale: {type: 'quantile'}}, 'x')).toBe('quantitative');
    });

    it('should return temporal for time scale type', () => {
      expect(defaultType({field: 'a', scale: {type: 'utc'}}, 'x')).toBe('temporal');
      expect(defaultType({field: 'a', scale: {type: 'time'}}, 'x')).toBe('temporal');
    });

    it('should return quantitative if there is aggregate', () => {
      expect(defaultType({aggregate: 'mean', field: 'a'}, 'x')).toBe('quantitative');
    });
    it('should return nominal if there is argmin', () => {
      expect(defaultType({aggregate: {argmax: 'b'}, field: 'a'}, 'x')).toBe('nominal');
    });

    it('should return ordinal for order channels', () => {
      expect(defaultType({field: 'foo'}, 'order')).toBe('ordinal');
    });

    it('should return nominal by default', () => {
      expect(defaultType({field: 'a'}, 'x')).toBe('nominal');
    });
  });

  describe('initChannelDef()', () => {
    it(
      'should convert primitive type to value def',
      log.wrap(localLogger => {
        expect(initChannelDef(5 as any, 'x', defaultConfig)).toEqual({value: 5});
        expect(localLogger.warns).toHaveLength(1);
      })
    );

    it('should return fieldDef with full type name.', () => {
      const fieldDef: TypedFieldDef<string> = {field: 'a', type: 'q' as any};
      expect(initChannelDef(fieldDef, 'x', defaultConfig)).toEqual({field: 'a', type: 'quantitative'});
    });

    it('should standardize non-string field to string', () => {
      const fieldDef: TypedFieldDef<string> = {field: 1 as any, type: 'q' as any};
      expect(initChannelDef(fieldDef, 'x', defaultConfig)).toEqual({field: '1', type: 'quantitative'});
    });

    it('converts header orient to labelOrient and titleOrient', () => {
      const fieldDef: FacetFieldDef<string, SignalRef> = {field: 1 as any, type: 'nominal', header: {orient: 'bottom'}};
      expect(initChannelDef(fieldDef, 'row', defaultConfig)).toEqual({
        field: '1',
        type: 'nominal',
        header: {labelOrient: 'bottom', titleOrient: 'bottom'}
      });
    });

    it(
      'should replace other type with quantitative for a field with counting aggregate.',
      log.wrap(localLogger => {
        for (const aggregate of COUNTING_OPS) {
          const fieldDef: TypedFieldDef<string> = {aggregate, field: 'a', type: 'nominal'};
          expect(initChannelDef(fieldDef, 'x', defaultConfig)).toEqual({aggregate, field: 'a', type: 'quantitative'});
        }
        expect(localLogger.warns).toHaveLength(4);
      })
    );

    it('should return fieldDef with default type', () => {
      const fieldDef = {field: 'a'};
      expect(initChannelDef(fieldDef, 'x', defaultConfig)).toEqual({field: 'a', type: 'nominal'});
    });

    it(
      'should drop invalid aggregate ops and throw warning.',
      log.wrap(localLogger => {
        const fieldDef: TypedFieldDef<string> = {aggregate: 'boxplot', field: 'a', type: 'quantitative'};
        expect(initChannelDef(fieldDef, 'x', defaultConfig)).toEqual({field: 'a', type: 'quantitative'});
        expect(localLogger.warns[0]).toEqual(log.message.invalidAggregate('boxplot'));
      })
    );

    it(
      'should drop invalid custom format type and throw warning.',
      log.wrap(localLogger => {
        const fieldDef = {field: 'a', type: 'quantitative', formatType: 'foo', format: '.2f'};
        expect(initChannelDef(fieldDef, 'text', defaultConfig)).toEqual({field: 'a', type: 'quantitative'});
        expect(localLogger.warns[0]).toEqual(log.message.customFormatTypeNotAllowed('text'));
      })
    );

    it(
      'should drop invalid custom format type for x encoding and throw warning.',
      log.wrap(localLogger => {
        const fieldDef = {field: 'a', type: 'quantitative', axis: {formatType: 'foo', format: '.2f'}};
        expect(initChannelDef(fieldDef, 'x', defaultConfig)).toEqual({field: 'a', type: 'quantitative', axis: {}});
        expect(localLogger.warns[0]).toEqual(log.message.customFormatTypeNotAllowed('x'));
      })
    );

    it(
      'should drop invalid custom format type for row encoding and throw warning.',
      log.wrap(localLogger => {
        const fieldDef = {field: 'a', type: 'quantitative', header: {formatType: 'foo', format: '.2f'}};
        expect(initChannelDef(fieldDef, 'row', defaultConfig)).toEqual({field: 'a', type: 'quantitative', header: {}});
        expect(localLogger.warns[0]).toEqual(log.message.customFormatTypeNotAllowed('row'));
      })
    );

    it(
      'should drop invalid custom format type for color encoding and throw warning.',
      log.wrap(localLogger => {
        const fieldDef = {field: 'a', type: 'quantitative', legend: {formatType: 'foo', format: '.2f'}};
        expect(initChannelDef(fieldDef, 'color', defaultConfig)).toEqual({
          field: 'a',
          type: 'quantitative',
          legend: {}
        });
        expect(localLogger.warns[0]).toEqual(log.message.customFormatTypeNotAllowed('color'));
      })
    );
  });

  describe('channelCompatability', () => {
    describe('row/column', () => {
      it('is incompatible with continuous field', () => {
        for (const channel of ['row', 'column'] as const) {
          expect(!channelCompatibility({field: 'a', type: 'quantitative'}, channel).compatible).toBeTruthy();
        }
      });
      it('is compatible with discrete field', () => {
        for (const channel of ['row', 'column'] as const) {
          expect(channelCompatibility({field: 'a', type: 'nominal'}, channel).compatible).toBeTruthy();
        }
      });
    });

    describe('x/y/color/text/detail', () => {
      it('is compatible with continuous field', () => {
        for (const channel of ['x', 'y', 'color', 'text', 'detail'] as const) {
          expect(channelCompatibility({field: 'a', type: 'quantitative'}, channel).compatible).toBeTruthy();
        }
      });
      it('is compatible with discrete field', () => {
        for (const channel of ['x', 'y', 'color', 'text', 'detail'] as const) {
          expect(channelCompatibility({field: 'a', type: 'nominal'}, channel).compatible).toBeTruthy();
        }
      });
    });

    describe('opacity/size/x2/y2', () => {
      it('is compatible with continuous field', () => {
        for (const channel of ['opacity', 'size', 'x2', 'y2'] as const) {
          expect(channelCompatibility({field: 'a', type: 'quantitative'}, channel).compatible).toBeTruthy();
        }
      });

      it('is compatible with binned field', () => {
        for (const channel of ['opacity', 'size', 'x2', 'y2'] as const) {
          expect(channelCompatibility({bin: true, field: 'a', type: 'quantitative'}, channel).compatible).toBeTruthy();
        }
      });

      it('is incompatible with nominal field', () => {
        for (const channel of ['opacity', 'size', 'x2', 'y2'] as const) {
          expect(!channelCompatibility({field: 'a', type: 'nominal'}, channel).compatible).toBeTruthy();
        }
      });
    });

    describe('shape', () => {
      it('is compatible with nominal field', () => {
        expect(channelCompatibility({field: 'a', type: 'nominal'}, 'shape').compatible).toBeTruthy();
      });
      it('is compatible with ordinal field', () => {
        expect(channelCompatibility({field: 'a', type: 'ordinal'}, 'shape').compatible).toBeTruthy();
      });
      it('is incompatible with quantitative field', () => {
        expect(!channelCompatibility({field: 'a', type: 'quantitative'}, 'shape').compatible).toBeTruthy();
      });

      it('is the only channel that is incompatible with geojson field', () => {
        for (const channel of CHANNELS) {
          expect(
            channelCompatibility({field: 'a', type: 'geojson'}, channel).compatible === (channel === 'shape')
          ).toBeTruthy();
        }
      });
    });

    describe('order', () => {
      it('is incompatible with nominal field', () => {
        expect(!channelCompatibility({field: 'a', type: 'nominal'}, 'order').compatible).toBeTruthy();
      });
      it('is compatible with ordinal field', () => {
        expect(channelCompatibility({field: 'a', type: 'ordinal'}, 'order').compatible).toBeTruthy();
      });
      it('is compatible with quantitative field', () => {
        expect(channelCompatibility({field: 'a', type: 'quantitative'}, 'order').compatible).toBeTruthy();
      });
    });
  });

  describe('functionalTitleFormatter', () => {
    it('should return correct title for argmin', () => {
      expect(functionalTitleFormatter({field: 'f', aggregate: {argmin: 'a'}})).toBe('f for argmin(a)');
    });
    it('should return correct title for aggregate', () => {
      expect(functionalTitleFormatter({field: 'f', aggregate: {argmax: 'a'}})).toBe('f for argmax(a)');
    });
  });

  describe('defaultTitle()', () => {
    it('should return correct title for aggregate', () => {
      expect(defaultTitle({field: 'f', aggregate: 'mean'}, {})).toBe('Mean of f');
    });

    it('should return correct title for argmin', () => {
      expect(defaultTitle({field: 'f', aggregate: {argmin: 'a'}}, {})).toBe('f for min a');
    });
    it('should return correct title for argmax', () => {
      expect(defaultTitle({field: 'f', aggregate: {argmax: 'a'}}, {})).toBe('f for max a');
    });

    it('should return correct title for count', () => {
      expect(defaultTitle({aggregate: 'count'}, {countTitle: 'baz!'})).toBe('baz!');
    });

    it('should return correct title for bin', () => {
      const fieldDef = {field: 'f', type: QUANTITATIVE, bin: true};
      expect(defaultTitle(fieldDef, {})).toBe('f (binned)');
    });

    it('should return correct functional title for bin', () => {
      const fieldDef = {field: 'f', type: QUANTITATIVE, bin: true};
      expect(defaultTitle(fieldDef, {fieldTitle: 'functional'})).toBe('BIN(f)');
    });

    it('should return correct title for timeUnit month', () => {
      const fieldDef = {field: 'f', type: TEMPORAL, timeUnit: 'month'} as const;
      expect(defaultTitle(fieldDef, {})).toBe('f (month)');
    });

    it('should return correct title for timeUnit yearmonthdate', () => {
      const fieldDef = {field: 'f', type: TEMPORAL, timeUnit: 'yearmonthdate'} as const;
      expect(defaultTitle(fieldDef, {})).toBe('f (year-month-date)');
    });

    it('should return correct title for timeUnit day', () => {
      const fieldDef = {field: 'f', type: TEMPORAL, timeUnit: 'day'} as const;
      expect(defaultTitle(fieldDef, {})).toBe('f (day)');
    });

    it('should return correct title for timeUnit yearquarter', () => {
      const fieldDef = {field: 'f', type: TEMPORAL, timeUnit: 'yearquarter'} as const;
      expect(defaultTitle(fieldDef, {})).toBe('f (year-quarter)');
    });

    it('should return correct title for raw field', () => {
      const fieldDef = {field: 'f', type: TEMPORAL};
      expect(defaultTitle(fieldDef, {})).toBe('f');
    });
  });
});
