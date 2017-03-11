import {assert} from 'chai';
import {varName} from '../src/util';

describe('util', () => {
  describe('varName', () => {
    it('replace all non-alphanumeric characters with _', () => {
      assert.equal(varName('bin-mpg$!@#%_+1'), 'bin_mpg_______1');
    });

    it('prepends _ if the string starts with number', () => {
      assert.equal(varName('1a'), '_1a');
    });
  });
});
