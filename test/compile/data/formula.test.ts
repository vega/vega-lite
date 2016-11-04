/* tslint:disable:quotemark */
import {assert} from 'chai';
import {formula} from '../../../src/compile/data/formula';
import {UnitModel} from '../../../src/compile/unit';
import {hash, Dict} from '../../../src/util';
import {Formula} from '../../../src/transform';

describe('compile/data/formula', () => {
  describe('parseUnit', () => {
    it('should return a dictionary of formula', () => {
      const f: Formula = {
        "as": "a",
        "expr": "5"
      };
      const model = new UnitModel({
        "data": {"url": "a.json"},
        "transform": {
          "calculate": [f]
        },
        "mark": "point",
        "encoding": {}
      }, null, '');

      const formulaComponent = formula.parseUnit(model);
      const hashed = hash(f);
      let expected = {};
      expected[hashed] = f;
      assert.deepEqual(formulaComponent, expected);
    });
  });

  describe('parseLayer', function() {
    // TODO: write test
  });

  describe('parseFacet', function() {
    // TODO: write test
  });

  describe('assemble', function() {
    it('should return correct vega formula transform', () => {
      assert.deepEqual(formula.assemble({
        aaa: {as: 'a', expr: '5'}
      } as Dict<Formula>), [{
        type: 'formula',
        field: 'a',
        expr: '5'
      }]);
    });
  });
});
