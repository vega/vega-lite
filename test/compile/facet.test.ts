import {assert} from 'chai';

import {FacetModel} from '../../src/compile/facet';
import {FacetSpec} from '../../src/spec';
import {parseFacetModel} from '../util';

describe('FacetModel', function() {
  it('should say it is facet', function() {
    const model = new FacetModel({facet: {}, spec: {}} as FacetSpec, null, null);
    assert(!model.isUnit());
    assert(model.isFacet());
    assert(!model.isLayer());
  });

  describe('initFacet', () => {
    it('should drop unsupported channel and throws warning', () => {
      const model = parseFacetModel({
        facet: {
          shape: {field: 'a', type: 'quantitative'}
        },
        spec: {
          mark: 'point'
        }
      });
      assert.equal(model.facet()['shape'], undefined);
      // TODO: test that it throws warning
    });

    it('should drop channel without field and value and throws warning', () => {
      const model = parseFacetModel({
        facet: {
          row: {type: 'quantitative'}
        },
        spec: {
          mark: 'point'
        }
      });
      assert.equal(model.facet().row, undefined);
      // TODO: test that it throws warning
    });
  });
});
