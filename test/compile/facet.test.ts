import {assert} from 'chai';

import {FacetModel} from '../../src/compile/facet';
import {FacetSpec} from '../../src/spec';

describe('Layer', function() {
  it('should say it is facet', function() {
    const model = new FacetModel({facet: {}, spec: {}} as FacetSpec, null, null);
    assert(!model.isUnit());
    assert(model.isFacet());
    assert(!model.isLayer());
  });
});
