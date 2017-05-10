import {assert} from 'chai';

import initScale from '../../../src/compile/scale/init';
import {NON_TYPE_RANGE_SCALE_PROPERTIES} from '../../../src/compile/scale/init';

import {defaultConfig} from '../../../src/config';
import {SCALE_PROPERTIES} from '../../../src/scale';
import {toSet, without} from '../../../src/util';

describe('compile/scale', () => {
  it('NON_TYPE_RANGE_SCALE_PROPERTIES should be SCALE_PROPERTIES wihtout type and range properties', () => {
    assert.deepEqual(
      toSet(NON_TYPE_RANGE_SCALE_PROPERTIES),
      toSet(without(SCALE_PROPERTIES, ['type', 'range', 'rangeStep', 'scheme']))
    );
  });

  describe('init', () => {
    it('should output only padding without default paddingInner and paddingOuter if padding is specified for a band scale', () => {
      const scale = initScale(
        'x', {field: 'a', type: 'ordinal', scale: {type: 'band', padding: 0.6}}, defaultConfig,
        'bar', 100, []
      );
      assert.equal(scale.padding, 0.6);
      assert.isUndefined(scale.paddingInner);
      assert.isUndefined(scale.paddingOuter);
    });

    it('should output default paddingInner and paddingOuter = paddingInner/2 if none of padding properties is specified for a band scale', () => {
      const scale = initScale(
        'x', {field: 'a', type: 'ordinal', scale: {type: 'band'}}, {scale: {bandPaddingInner: 0.3}},
        'bar', 100, []
      );
      assert.equal(scale.paddingInner, 0.3);
      assert.equal(scale.paddingOuter, 0.15);
      assert.isUndefined(scale.padding);
    });
  });
});
