import {NameMap} from '../../src/compile/model';
import {parseFacetModel, parseFacetModelWithScale, parseModel} from '../util';

describe('Model', () => {
  describe('NameMap', () => {
    it('should rename correctly', () => {
      const map = new NameMap();
      expect(map.get('a')).toBe('a');

      map.rename('a', 'b');
      expect(map.get('a')).toBe('b');
      expect(map.get('b')).toBe('b');

      map.rename('b', 'c');
      expect(map.get('a')).toBe('c');
      expect(map.get('b')).toBe('c');
      expect(map.get('c')).toBe('c');

      map.rename('z', 'a');
      expect(map.get('a')).toBe('c');
      expect(map.get('b')).toBe('c');
      expect(map.get('c')).toBe('c');
      expect(map.get('z')).toBe('c');
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

  describe('assembleGroupStyle', () => {
    it('returns cell by default', () => {
      const model = parseModel({
        data: {values: []},
        mark: 'point'
      });

      expect(model.assembleGroupStyle()).toEqual('cell');
    });

    it('returns the specified style', () => {
      const model = parseModel({
        data: {values: []},
        mark: 'point',
        view: {style: 'notcell'}
      });

      expect(model.assembleGroupStyle()).toEqual('notcell');
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

  describe('assembleGroupEncodeEntry', () => {
    it('returns view background if specified', () => {
      const model = parseModel({
        data: {values: []},
        mark: 'point',
        view: {fill: 'red', stroke: 'blue'}
      });

      expect(model.assembleGroupEncodeEntry(true)).toEqual({
        fill: {value: 'red'},
        stroke: {value: 'blue'}
      });
    });
  });
});
