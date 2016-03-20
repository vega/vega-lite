import {assert} from 'chai';

import {LayerModel} from '../../src/compile/layer';
import {LayerSpec} from '../../src/spec';

describe('Layer', function() {
  it('should say it is layer', function() {
    const model = new LayerModel({layers: []} as LayerSpec, null, null);
    assert(!model.isUnit());
    assert(!model.isFacet());
    assert(model.isLayer());
  });
});
