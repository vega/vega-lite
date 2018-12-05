import {NameMap} from '../../src/compile/model';
import {parseFacetModel, parseFacetModelWithScale} from '../util';

describe('Model', () => {
  describe('NameMap', () => {
    it('should rename correctly', () => {
      const map = new NameMap();
      expect(map.get('a')).toEqual('a');

      map.rename('a', 'b');
      expect(map.get('a')).toEqual('b');
      expect(map.get('b')).toEqual('b');

      map.rename('b', 'c');
      expect(map.get('a')).toEqual('c');
      expect(map.get('b')).toEqual('c');
      expect(map.get('c')).toEqual('c');

      map.rename('z', 'a');
      expect(map.get('a')).toEqual('c');
      expect(map.get('b')).toEqual('c');
      expect(map.get('c')).toEqual('c');
      expect(map.get('z')).toEqual('c');
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
      expect(model.hasDescendantWithFieldOnChannel('x')).toBeTruthy();
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
      expect(model.hasDescendantWithFieldOnChannel('x')).toBeTruthy();
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
      expect(!model.hasDescendantWithFieldOnChannel('x')).toBeTruthy();
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
      expect(!model.hasDescendantWithFieldOnChannel('x')).toBeTruthy();
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

      expect(model.child.getSizeSignalRef('width')).toEqual({
        signal: `bandspace(datum[\"distinct_b\"], 1, 0.345) * child_x_step`
      });
    });
  });
});
