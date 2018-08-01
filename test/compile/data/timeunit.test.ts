/* tslint:disable:quotemark */

import {assert} from 'chai';
import {TimeUnitNode} from '../../../src/compile/data/timeunit';
import {ModelWithField} from '../../../src/compile/model';
import {TimeUnitTransform} from '../../../src/transform';
import {parseUnitModel} from '../../util';

function assembleFromEncoding(model: ModelWithField) {
  return TimeUnitNode.makeFromEncoding(null, model).assemble();
}

function assembleFromTransform(t: TimeUnitTransform) {
  return TimeUnitNode.makeFromTransform(null, t).assemble();
}

describe('compile/data/timeunit', () => {
  describe('parseUnit', () => {
    it('should return a dictionary of formula transform', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });

      assert.deepEqual(assembleFromEncoding(model), [
        {
          type: 'formula',
          as: 'month_a',
          expr: 'datetime(0, month(datum["a"]), 1, 0, 0, 0, 0)'
        }
      ]);
    });

    it('should return a dictionary of formula transform from transform array', () => {
      const t: TimeUnitTransform = {field: 'date', as: 'month_date', timeUnit: 'month'};

      assert.deepEqual(assembleFromTransform(t), [
        {
          type: 'formula',
          as: 'month_date',
          expr: 'datetime(0, month(datum["date"]), 1, 0, 0, 0, 0)'
        }
      ]);
    });
  });

  describe('hash', () => {
    it('should generate the correct hash', () => {
      const model = parseUnitModel({
        data: {values: []},
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });
      const timeUnitNode = TimeUnitNode.makeFromEncoding(null, model);
      assert.deepEqual(timeUnitNode.hash(), 'TimeUnitNode {"month_a":{"as":"month_a","field":"a","timeUnit":"month"}}');
    });
  });
});
