import {assert} from 'chai';

import initScale from '../../../src/compile/scale/init';

describe('compile/scale', () => {
  describe('init', () => {
    it('should output only padding without default paddingInner and paddingOuter if padding is specified for a band scale', () => {
      const scale = initScale(100, 'bar', 'x',
        {field: 'a', type: 'ordinal', scale: {type: 'band', padding: 0.6}},
        {}
      );
      assert.equal(scale.padding, 0.6);
      assert.isUndefined(scale.paddingInner);
      assert.isUndefined(scale.paddingOuter);
    });

    it('should output default paddingInner and paddingOuter = paddingInner/2 if none of padding properties is specified for a band scale', () => {
      const scale = initScale(100, 'bar', 'x',
        {field: 'a', type: 'ordinal', scale: {type: 'band'}},
        {bandPaddingInner: 0.3}
      );
      assert.equal(scale.paddingInner, 0.3);
      assert.equal(scale.paddingOuter, 0.15);
      assert.isUndefined(scale.padding);
    });
  });
});
