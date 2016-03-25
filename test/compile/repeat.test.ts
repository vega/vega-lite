import {assert} from 'chai';

import {RepeatModel} from '../../src/compile/repeat';
import {RepeatSpec} from '../../src/spec';

describe('Repeat', function() {
  it('should say it is repeat', function() {
    const model = new RepeatModel({repeat: {}, spec: {}} as RepeatSpec, null, null, null);
    assert(!model.isUnit());
    assert(!model.isFacet());
    assert(!model.isLayer());
    assert(model.isRepeat());
  });
});
