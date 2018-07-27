import {assert} from 'chai';
import {NameMap} from '../../src/compile/model';
import {parseFacetModel, parseFacetModelWithScale} from '../util';

describe('Model', () => {
  describe('NameMap', () => {
    it('should rename correctly', () => {
      const map = new NameMap();
      assert.equal(map.get('a'), 'a');

      map.rename('a', 'b');
      assert.equal(map.get('a'), 'b');
      assert.equal(map.get('b'), 'b');

      map.rename('b', 'c');
      assert.equal(map.get('a'), 'c');
      assert.equal(map.get('b'), 'c');
      assert.equal(map.get('c'), 'c');

      map.rename('z', 'a');
      assert.equal(map.get('a'), 'c');
      assert.equal(map.get('b'), 'c');
      assert.equal(map.get('c'), 'c');
      assert.equal(map.get('z'), 'c');
    });
  });

  describe('hasDescendantWithFieldOnChannel', () => {
    it('should return true if a child plot has a field on x', () => {
      const model = parseFacetModel({
        facet: {row: {field: 'a', type: 'nominal'}},
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'x', type: 'quantitative'}
          }
        }
      });
      assert(model.hasDescendantWithFieldOnChannel('x'));
    });

    it('should return true if a descendant plot has x', () => {
      const model = parseFacetModel({
        facet: {row: {field: 'a', type: 'nominal'}},
        spec: {
          layer: [
            {
              mark: 'point',
              encoding: {
                x: {field: 'x', type: 'quantitative'}
              }
            },
            {
              mark: 'point',
              encoding: {
                color: {field: 'x', type: 'quantitative'}
              }
            }
          ]
        }
      });
      assert(model.hasDescendantWithFieldOnChannel('x'));
    });

    it('should return false if no descendant plot has a field on x', () => {
      const model = parseFacetModel({
        facet: {row: {field: 'a', type: 'nominal'}},
        spec: {
          mark: 'point',
          encoding: {
            color: {field: 'x', type: 'quantitative'}
          }
        }
      });
      assert(!model.hasDescendantWithFieldOnChannel('x'));
    });

    it('should return false if no descendant plot has a field on x', () => {
      const model = parseFacetModel({
        facet: {row: {field: 'a', type: 'nominal'}},
        spec: {
          layer: [
            {
              mark: 'point',
              encoding: {
                color: {field: 'x', type: 'quantitative'}
              }
            },
            {
              mark: 'point',
              encoding: {
                color: {field: 'x', type: 'quantitative'}
              }
            }
          ]
        }
      });
      assert(!model.hasDescendantWithFieldOnChannel('x'));
    });
  });

  describe('getSizeSignalRef', () => {
    it('returns formula for step if parent is facet', () => {
      const model = parseFacetModelWithScale({
        facet: {
          row: {field: 'a', type: 'ordinal'}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {
              field: 'b',
              type: 'nominal',
              scale: {
                padding: 0.345
              }
            }
          }
        },
        resolve: {
          scale: {x: 'independent'}
        }
      });

      assert.deepEqual(model.child.getSizeSignalRef('width'), {
        signal: `bandspace(datum[\"distinct_b\"], 1, 0.345) * child_x_step`
      });
    });
  });
});
