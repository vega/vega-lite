import {assert} from 'chai';

import {UnitModel} from '../../src/compile/unit';
import {ExtendedUnitSpec} from '../../src/spec';

describe('Unit', function() {
  it('should say it is unit', function() {
    const model = new UnitModel({} as ExtendedUnitSpec, null, null);
    assert(model.isUnit());
    assert(!model.isFacet());
    assert(!model.isLayer());
  });
});
