import {OFFSETTED_RECT_END_SUFFIX, OFFSETTED_RECT_START_SUFFIX, TimeUnitNode} from '../../../src/compile/data/timeunit';
import {ModelWithField} from '../../../src/compile/model';
import {TimeUnitTransform} from '../../../src/transform';
import {parseUnitModel} from '../../util';
import {PlaceholderDataFlowNode} from './util';

function assembleFromEncoding(model: ModelWithField) {
  return TimeUnitNode.makeFromEncoding(null, model)?.assemble();
}

function assembleFromTransform(t: TimeUnitTransform) {
  return TimeUnitNode.makeFromTransform(null, t).assemble();
}

describe('compile/data/timeunit', () => {
  describe('parseUnit', () => {
    it('should return a timeunit transform for point', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'timeunit',
          field: 'a',
          as: ['month_a', 'month_a_end'],
          units: ['month']
        }
      ]);
    });

    it('should return a unit transforms for bar', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'timeunit',
          field: 'a',
          as: ['month_a', 'month_a_end'],
          units: ['month']
        }
      ]);
    });

    it('should return a unit transform for bar with bandPosition=0', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month', bandPosition: 0}
        }
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'timeunit',
          field: 'a',
          as: ['month_a', 'month_a_end'],
          units: ['month']
        },
        {
          type: 'formula',
          expr: "0.5 * timeOffset('month', datum['month_a'], -1) + 0.5 * datum['month_a']",
          as: `month_a_${OFFSETTED_RECT_START_SUFFIX}`
        },

        {
          type: 'formula',
          expr: "0.5 * datum['month_a'] + 0.5 * datum['month_a_end']",
          as: `month_a_${OFFSETTED_RECT_END_SUFFIX}`
        }
      ]);
    });

    it('should return a timeunit transform with step for bar with bandPosition=0', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: {unit: 'month', step: 2}, bandPosition: 0}
        }
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'timeunit',
          field: 'a',
          as: ['month_step_2_a', 'month_step_2_a_end'],
          units: ['month'],
          step: 2
        },
        {
          type: 'formula',
          expr: "0.5 * timeOffset('month', datum['month_step_2_a'], -2) + 0.5 * datum['month_step_2_a']",
          as: `month_step_2_a_${OFFSETTED_RECT_START_SUFFIX}`
        },

        {
          type: 'formula',
          expr: "0.5 * datum['month_step_2_a'] + 0.5 * datum['month_step_2_a_end']",
          as: `month_step_2_a_${OFFSETTED_RECT_END_SUFFIX}`
        }
      ]);
    });

    it('should return a unit offset transforms for bar', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'binnedyearmonth'}
        }
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'formula',
          expr: `timeOffset('month', datum['a'], 1)`,
          as: 'a_end'
        }
      ]);
    });

    it('should return a unit offset transforms for bar with bandPosition = 0', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'binnedyearmonth', bandPosition: 0}
        }
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'formula',
          expr: `timeOffset('month', datum['a'], 1)`,
          as: 'a_end'
        },
        {
          type: 'formula',
          expr: "0.5 * timeOffset('month', datum['a'], -1) + 0.5 * datum['a']",
          as: `a_${OFFSETTED_RECT_START_SUFFIX}`
        },
        {
          type: 'formula',
          expr: "0.5 * datum['a'] + 0.5 * datum['a_end']",
          as: `a_${OFFSETTED_RECT_END_SUFFIX}`
        }
      ]);
    });

    it('should return the proper field escaping with binnedyearmonth', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a\\.b', type: 'temporal', timeUnit: 'binnedyearmonth'}
        }
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'formula',
          expr: `timeOffset('month', datum['a.b'], 1)`,
          as: 'a.b_end'
        }
      ]);
    });

    it('should return a unit offset transforms for text with bandPosition', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'text',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'binnedyearmonth', bandPosition: 0.5}
        }
      });

      expect(assembleFromEncoding(model)).toEqual([
        {
          type: 'formula',
          expr: `timeOffset('month', datum['a'], 1)`,
          as: 'a_end'
        }
      ]);
    });

    it('should return no unit offset transforms for point', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'binnedyearmonth'}
        }
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
          units: ['month']
        }
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
          units: ['month']
        }
      ]);
    });
  });

  describe('hash', () => {
    it('should generate the correct hash for point', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const timeUnitNode = TimeUnitNode.makeFromEncoding(null, model);
      expect(timeUnitNode.hash()).toBe(
        "TimeUnit {'{'as':'month_a','field':'a','timeUnit':{'unit':'month'}}':{'as':'month_a','field':'a','timeUnit':{'unit':'month'}}}"
      );
    });
    it('should generate the correct hash for bar', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const timeUnitNode = TimeUnitNode.makeFromEncoding(null, model);
      expect(timeUnitNode.hash()).toBe(
        "TimeUnit {'{'as':'month_a','field':'a','timeUnit':{'unit':'month'}}':{'as':'month_a','field':'a','timeUnit':{'unit':'month'}}}"
      );
    });

    it('should generate the correct hash for TimeUnitParams', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: {unit: 'month', utc: true, step: 10}}
        }
      });
      const timeUnitNode = TimeUnitNode.makeFromEncoding(null, model);
      expect(timeUnitNode.hash()).toBe(
        "TimeUnit {'{'as':'utcmonth_step_10_a','field':'a','timeUnit':{'step':10,'unit':'month','utc':true}}':{'as':'utcmonth_step_10_a','field':'a','timeUnit':{'step':10,'unit':'month','utc':true}}}"
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
