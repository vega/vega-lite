import {
  OFFSETTED_RECT_END_SUFFIX,
  OFFSETTED_RECT_START_SUFFIX,
  TimeUnitNode,
} from '../../../src/compile/data/timeunit.js';
import {ModelWithField} from '../../../src/compile/model.js';
import {compile} from '../../../src/index.js';
import {TimeUnitTransform} from '../../../src/transform.js';
import {parseUnitModel} from '../../util.js';
import {PlaceholderDataFlowNode} from './util.js';
import {parse, View} from 'vega';

function assembleFromEncoding(model: ModelWithField) {
  return TimeUnitNode.makeFromEncoding(null, model)?.assemble();
}

function assembleFromTransform(t: TimeUnitTransform) {
  return TimeUnitNode.makeFromTransform(null, t).assemble();
}

async function timeUnitData(timeUnit: string) {
  const spec = {
    data: {
      values: [
        {date: '2012-01-01T00:00:00Z', value: 1},
        {date: '2022-01-02T00:00:00Z', value: 2},
        {date: '2024-06-10T00:00:00Z', value: 3},
      ],
    },
    mark: 'point',
    encoding: {
      x: {field: 'date', type: 'temporal', timeUnit},
      y: {field: 'value', type: 'quantitative'},
    },
  } as any;

  const view = new View(parse(compile(spec).spec), {renderer: 'none'}).initialize();
  await view.runAsync();
  return view.data('data_0');
}

describe('compile/data/timeunit', () => {
  describe('parseUnit', () => {
    it('should return a timeunit transform for point', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'},
        },
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'timeunit',
          field: 'a',
          as: ['month_a', 'month_a_end'],
          units: ['month'],
        },
      ]);
    });

    it('should return a unit transforms for bar', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'},
        },
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'timeunit',
          field: 'a',
          as: ['month_a', 'month_a_end'],
          units: ['month'],
        },
      ]);
    });

    it('should return a unit transform for bar with bandPosition=0', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month', bandPosition: 0},
        },
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'timeunit',
          field: 'a',
          as: ['month_a', 'month_a_end'],
          units: ['month'],
        },
        {
          type: 'formula',
          expr: "0.5 * timeOffset('month', datum['month_a'], -1) + 0.5 * datum['month_a']",
          as: `month_a_${OFFSETTED_RECT_START_SUFFIX}`,
        },

        {
          type: 'formula',
          expr: "0.5 * datum['month_a'] + 0.5 * datum['month_a_end']",
          as: `month_a_${OFFSETTED_RECT_END_SUFFIX}`,
        },
      ]);
    });

    it('should return a unit transform for bar with bandPosition=0 and escaped field name', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: "\\'a\\'", type: 'temporal', timeUnit: 'month', bandPosition: 0},
        },
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'timeunit',
          field: "\\'a\\'",
          as: ["month_'a'", "month_'a'_end"],
          units: ['month'],
        },
        {
          type: 'formula',
          expr: "0.5 * timeOffset('month', datum['month_\\'a\\''], -1) + 0.5 * datum['month_\\'a\\'']",
          as: `month_'a'_${OFFSETTED_RECT_START_SUFFIX}`,
        },

        {
          type: 'formula',
          expr: "0.5 * datum['month_\\'a\\''] + 0.5 * datum['month_\\'a\\'_end']",
          as: `month_'a'_${OFFSETTED_RECT_END_SUFFIX}`,
        },
      ]);
    });

    it('should return a timeunit transform with step for bar with bandPosition=0', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: {unit: 'month', step: 2}, bandPosition: 0},
        },
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'timeunit',
          field: 'a',
          as: ['month_step_2_a', 'month_step_2_a_end'],
          units: ['month'],
          step: 2,
        },
        {
          type: 'formula',
          expr: "0.5 * timeOffset('month', datum['month_step_2_a'], -2) + 0.5 * datum['month_step_2_a']",
          as: `month_step_2_a_${OFFSETTED_RECT_START_SUFFIX}`,
        },

        {
          type: 'formula',
          expr: "0.5 * datum['month_step_2_a'] + 0.5 * datum['month_step_2_a_end']",
          as: `month_step_2_a_${OFFSETTED_RECT_END_SUFFIX}`,
        },
      ]);
    });

    it('should return a unit offset transforms for bar', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'binnedyearmonth'},
        },
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'formula',
          expr: `timeOffset('month', datum['a'], 1)`,
          as: 'a_end',
        },
      ]);
    });

    it('should return a unit offset transforms for bar with bandPosition = 0', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'binnedyearmonth', bandPosition: 0},
        },
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'formula',
          expr: `timeOffset('month', datum['a'], 1)`,
          as: 'a_end',
        },
        {
          type: 'formula',
          expr: "0.5 * timeOffset('month', datum['a'], -1) + 0.5 * datum['a']",
          as: `a_${OFFSETTED_RECT_START_SUFFIX}`,
        },
        {
          type: 'formula',
          expr: "0.5 * datum['a'] + 0.5 * datum['a_end']",
          as: `a_${OFFSETTED_RECT_END_SUFFIX}`,
        },
      ]);
    });

    it('should return the proper field escaping with binnedyearmonth', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a\\.b', type: 'temporal', timeUnit: 'binnedyearmonth'},
        },
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'formula',
          expr: `timeOffset('month', datum['a.b'], 1)`,
          as: 'a.b_end',
        },
      ]);
    });

    it('should return the proper field escaping with binnedutcyearmonth', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: "monthly(DATE_TRUNC(\\'day\\',date))", type: 'temporal', timeUnit: 'binnedutcyearmonth'},
        },
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'formula',
          expr: `utcOffset('month', datum['monthly(DATE_TRUNC(\\'day\\',date))'], 1)`,
          as: `monthly(DATE_TRUNC('day',date))_end`,
        },
      ]);
    });

    it('should return a unit offset transforms for text with bandPosition', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'text',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'binnedyearmonth', bandPosition: 0.5},
        },
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'formula',
          expr: `timeOffset('month', datum['a'], 1)`,
          as: 'a_end',
        },
      ]);
    });

    it('should return no unit offset transforms for point', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'binnedyearmonth'},
        },
      });

      expect(assembleFromEncoding(model)).toBeUndefined();
    });

    it('should return a dictionary of formula transform from transform array with simple TimeUnit', () => {
      const t: TimeUnitTransform = {field: 'date', as: 'month_date', timeUnit: 'month'};

      expect(assembleFromTransform(t)).toEqual([
        {
          type: 'timeunit',
          field: 'date',
          as: ['month_date', 'month_date_end'],
          units: ['month'],
        },
      ]);
    });

    it('should return a dictionary of formula transform from transform array with TimeUnitParams', () => {
      const t: TimeUnitTransform = {field: 'date', as: 'month_date', timeUnit: {unit: 'month', utc: true, step: 10}};

      expect(assembleFromTransform(t)).toEqual([
        {
          type: 'timeunit',
          field: 'date',
          timezone: 'utc',
          step: 10,
          as: ['month_date', 'month_date_end'],
          units: ['month'],
        },
      ]);
    });

    it('should return formula transforms for ISO yearweek', () => {
      const t: TimeUnitTransform = {field: 'date', as: 'yearweek_date', timeUnit: 'yearweek'};
      const transforms = assembleFromTransform(t);

      expect(transforms).toHaveLength(2);
      expect(transforms[0]).toEqual({
        type: 'formula',
        expr: expect.stringContaining('"%G"'),
        as: 'yearweek_date',
      });
      expect((transforms[0] as any).expr).toContain("toDate(datum['date'])");
      expect((transforms[0] as any).expr).toContain('"%V"');
      expect(transforms[1]).toEqual({
        type: 'formula',
        expr: "timeOffset('day', datum['yearweek_date'], 7)",
        as: 'yearweek_date_end',
      });
    });

    it('should return UTC formula transforms for stepped ISO week', () => {
      const t: TimeUnitTransform = {field: 'date', as: 'utcweek_date', timeUnit: {unit: 'week', utc: true, step: 2}};
      const transforms = assembleFromTransform(t);

      expect(transforms).toHaveLength(2);
      expect(transforms[0]).toEqual({
        type: 'formula',
        expr: expect.stringContaining('utcFormat'),
        as: 'utcweek_date',
      });
      expect((transforms[0] as any).expr).toContain('1 + 2 * floor');
      expect(transforms[1]).toEqual({
        type: 'formula',
        expr: "utcOffset('day', datum['utcweek_date'], 14)",
        as: 'utcweek_date_end',
      });
    });
  });

  describe('runtime', () => {
    it('should floor utcyearweek to ISO Mondays', async () => {
      const data = await timeUnitData('utcyearweek');
      expect(data.map((d) => d.utcyearweek_date.toISOString().slice(0, 10))).toEqual([
        '2011-12-26',
        '2021-12-27',
        '2024-06-10',
      ]);
    });

    it('should floor utcweek to ISO weeks in the reference year', async () => {
      const data = await timeUnitData('utcweek');
      expect(data.map((d) => d.utcweek_date.toISOString().slice(0, 10))).toEqual([
        '2012-12-24',
        '2012-12-24',
        '2012-06-11',
      ]);
    });
  });

  describe('hash', () => {
    it('should generate the correct hash for point', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'},
        },
      });
      const timeUnitNode = TimeUnitNode.makeFromEncoding(null, model);
      expect(timeUnitNode.hash()).toBe(
        'TimeUnit {"{\\"as\\":\\"month_a\\",\\"field\\":\\"a\\",\\"timeUnit\\":{\\"unit\\":\\"month\\"}}":{"as":"month_a","field":"a","timeUnit":{"unit":"month"}}}',
      );
    });
    it('should generate the correct hash for bar', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'},
        },
      });
      const timeUnitNode = TimeUnitNode.makeFromEncoding(null, model);
      expect(timeUnitNode.hash()).toBe(
        'TimeUnit {"{\\"as\\":\\"month_a\\",\\"field\\":\\"a\\",\\"timeUnit\\":{\\"unit\\":\\"month\\"}}":{"as":"month_a","field":"a","timeUnit":{"unit":"month"}}}',
      );
    });

    it('should generate the correct hash for TimeUnitParams', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: {unit: 'month', utc: true, step: 10}},
        },
      });
      const timeUnitNode = TimeUnitNode.makeFromEncoding(null, model);
      expect(timeUnitNode.hash()).toBe(
        'TimeUnit {"{\\"as\\":\\"utcmonth_step_10_a\\",\\"field\\":\\"a\\",\\"timeUnit\\":{\\"step\\":10,\\"unit\\":\\"month\\",\\"utc\\":true}}":{"as":"utcmonth_step_10_a","field":"a","timeUnit":{"step":10,"unit":"month","utc":true}}}',
      );
    });
  });

  describe('clone', () => {
    it('should never clone parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const timeUnit = new TimeUnitNode(parent, {});
      expect(timeUnit.clone().parent).toBeNull();
    });
  });
});
