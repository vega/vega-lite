/* tslint:disable:quotemark */

import {assert} from 'chai';
import {TimeUnitNode} from '../../../src/compile/data/timeunit';
import {Model, ModelWithField} from '../../../src/compile/model';
import {TimeUnitTransform} from '../../../src/transform';
import {parseUnitModel} from '../../util';

function assembleFromEncoding(model: ModelWithField) {
  return TimeUnitNode.makeFromEncoding(model).assemble();
}

function assembleFromTransform(model: Model, t: TimeUnitTransform) {
  return TimeUnitNode.makeFromTransfrom(model, t).assemble();
}

describe('compile/data/timeunit', () => {
  describe('parseUnit', () => {

    it('should return a dictionary of formula transform', () => {

      const model = parseUnitModel({
        "data": {"values": []},
        "mark": "point",
        "encoding": {
          "x": {field: 'a', type: 'temporal', timeUnit: 'month'}
        }
      });

      assert.deepEqual(assembleFromEncoding(model), [{
        type: 'formula',
        as: 'month_a',
        expr: 'datetime(0, month(datum["a"]), 1, 0, 0, 0, 0)'
      }]);
    });

    it('should return a dictionary of formula transform from transform array', () => {
      const t: TimeUnitTransform = {field: 'date', as: 'month_date', timeUnit: 'month'};
      const model = parseUnitModel({
        "data": {"values": []},
        "transform": [t],
        "mark": "point",
        "encoding": {
          "x": {field: 'date', type: 'temporal', timeUnit: 'month'}
        }
      });

      assert.deepEqual(assembleFromTransform(model, t), [{
        type: 'formula',
        as: 'month_date',
        expr: 'datetime(0, month(datum["date"]), 1, 0, 0, 0, 0)'
      }]);
    });
  });
});
