import {assert} from 'chai';
import {parseFacetModel} from '../util';

describe('Model', () => {
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
          layers: [{
            mark: 'point',
            encoding: {
              x: {field: 'x', type: 'quantitative'}
            }
          },{
            mark: 'point',
            encoding: {
              color: {field: 'x', type: 'quantitative'}
            }
          },]
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
          layers: [{
            mark: 'point',
            encoding: {
              color: {field: 'x', type: 'quantitative'}
            }
          },{
            mark: 'point',
            encoding: {
              color: {field: 'x', type: 'quantitative'}
            }
          },]
        }
      });
      assert(!model.hasDescendantWithFieldOnChannel('x'));
    });
  });
});
